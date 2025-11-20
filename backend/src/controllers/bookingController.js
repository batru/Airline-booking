import { Booking, Passenger, Payment, BookingPassenger } from '../models/index.js';
import { generateBookingReference } from '../utils/helpers.js';
import emailService from '../services/emailService.js';

// In-memory store for draft bookings (in production, use Redis or database)
const draftBookings = new Map();

const BookingController = {
  // Create booking draft (no database records yet)
  async create(req, res, next) {
    try {
      console.log('📋 Booking draft creation request:', JSON.stringify(req.body, null, 2));
      const { passengers, flightDetails, contactInfo } = req.body;

      // Validate required fields
      if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'At least one passenger is required'
          }
        });
      }

      if (!flightDetails) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Flight details are required'
          }
        });
      }

      // Generate temporary reference for the booking draft
      const temporaryReference = `DRAFT-${generateBookingReference()}`;
      
      // Store booking data temporarily (until payment confirmation)
      const draftData = {
        reference: temporaryReference,
        passengers,
        flightDetails,
        contactInfo,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Expires in 30 minutes
      };

      // Store in memory (in production, use Redis with TTL)
      draftBookings.set(temporaryReference, draftData);

      res.status(201).json({
        success: true,
        data: {
          temporaryReference,
          bookingData: {
            passengers: passengers.length,
            amount: flightDetails.totalAmount,
            currency: flightDetails.currency || 'KES'
          },
          message: 'Booking draft created. Proceed to payment.'
        }
      });
    } catch (error) {
      console.error('❌ Booking draft creation error:', error.message);
      next(error);
    }
  },

  // Get draft booking by reference
  async getDraft(req, res, next) {
    try {
      const { reference } = req.params;

      const draft = draftBookings.get(reference);

      if (!draft) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DRAFT_NOT_FOUND',
            message: 'Draft booking not found or expired'
          }
        });
      }

      // Check if expired
      if (new Date() > draft.expiresAt) {
        draftBookings.delete(reference);
        return res.status(410).json({
          success: false,
          error: {
            code: 'DRAFT_EXPIRED',
            message: 'Draft booking has expired'
          }
        });
      }

      res.json({
        success: true,
        data: { draft }
      });
    } catch (error) {
      next(error);
    }
  },

  // Create actual booking from confirmed payment (called by webhook)
  async createFromPayment(paymentReference, paymentMetadata) {
    try {
      const { draftReference } = paymentMetadata;

      // Get draft booking data
      const draft = draftBookings.get(draftReference);

      if (!draft) {
        console.error('❌ Draft booking not found:', draftReference);
        throw new Error('Draft booking not found');
      }

      const { passengers, flightDetails } = draft;

      // Get payment record
      const payment = await Payment.findOne({ where: { paymentReference } });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Create passengers
      const createdPassengers = await Passenger.bulkCreate(
        passengers.map(p => ({
          title: p.title,
          firstName: p.firstName,
          lastName: p.lastName,
          country: p.country,
          dateOfBirth: p.dateOfBirth,
          documentType: p.documentType,
          documentNumber: p.documentNumber,
          documentExpiry: p.documentExpiry,
          email: p.email,
          phoneCode: p.phoneCode,
          phoneNumber: p.phoneNumber
        })),
        { returning: true, validate: false }
      );

      // Generate final booking reference
      const bookingReference = generateBookingReference();

      // Create booking (linked to payment)
      const booking = await Booking.create({
        bookingReference,
        bookingStatus: 'confirmed',
        totalAmount: flightDetails.totalAmount,
        currency: flightDetails.currency || 'KES',
        paymentId: payment.id,
        flightSnapShot: flightDetails
      });

      // Link passengers to booking
      await BookingPassenger.bulkCreate(
        createdPassengers.map(passenger => ({
          bookingId: booking.id,
          passengerId: passenger.id
        }))
      );

      // Get booking with passengers
      const bookingWithPassengers = await Booking.findOne({
        where: { id: booking.id },
        include: [
          { model: Passenger, as: 'passengers', through: { attributes: [] } }
        ]
      });

      // Remove draft from memory
      draftBookings.delete(draftReference);

      // Send booking confirmation email
      if (createdPassengers && createdPassengers.length > 0) {
        emailService.sendBookingConfirmation(bookingWithPassengers, createdPassengers)
          .then(result => {
            console.log('✅ Booking confirmation email sent:', result.emailId);
          })
          .catch(err => {
            console.error('❌ Failed to send booking confirmation email:', err.message);
          });
      }

      console.log('✅ Booking created from confirmed payment:', bookingReference);
      return bookingWithPassengers;
    } catch (error) {
      console.error('❌ Error creating booking from payment:', error.message);
      throw error;
    }
  },

  // Get booking by reference
  async getByReference(req, res, next) {
    try {
      const { reference } = req.params;

      const booking = await Booking.findOne({
        where: { bookingReference: reference },
        include: [
          { model: Passenger, as: 'passengers', through: { attributes: [] } },
          { model: Payment, as: 'payment' }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BOOKING_NOT_FOUND',
            message: 'Booking not found'
          }
        });
      }

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update booking status
  async updateStatus(req, res, next) {
    try {
      const { reference } = req.params;
      const { status } = req.body;

      const booking = await Booking.findOne({ where: { bookingReference: reference } });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BOOKING_NOT_FOUND',
            message: 'Booking not found'
          }
        });
      }

      await booking.update({ bookingStatus: status });

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      next(error);
    }
  },

  // Cancel booking
  async cancel(req, res, next) {
    try {
      const { reference } = req.params;

      const booking = await Booking.findOne({ where: { bookingReference: reference } });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BOOKING_NOT_FOUND',
            message: 'Booking not found'
          }
        });
      }

      await booking.update({ bookingStatus: 'cancelled' });

      res.json({
        success: true,
        data: {
          bookingReference: reference,
          status: 'cancelled',
          message: 'Booking cancelled successfully'
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

export default BookingController;

