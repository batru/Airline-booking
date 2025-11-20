import { Booking, Passenger, Payment } from '../models/index.js';
import { Op } from 'sequelize';

const AdminController = {
  // Get all bookings with filters
  async getAllBookings(req, res, next) {
    try {
      const { status, dateFrom, dateTo, search, page = 1, limit = 20 } = req.query;

      // Build where clause
      const where = {};
      if (status) {
        where.bookingStatus = status;
      }

      // Add search functionality for booking reference
      if (search) {
        where.bookingReference = {
          [Op.iLike]: `%${search}%` // Case-insensitive search
        };
      }

      // Calculate pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Get bookings
      const { count, rows } = await Booking.findAndCountAll({
        where,
        include: [
          {
            model: Passenger,
            as: 'passengers',
            through: { attributes: [] }
          },
          {
            model: Payment,
            as: 'payment'
          }
        ],
        limit: parseInt(limit),
        offset,
        order: [['id', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          bookings: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get booking by ID
  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          {
            model: Passenger,
            as: 'passengers',
            through: { attributes: [] }
          },
          {
            model: Payment,
            as: 'payment'
          }
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
  async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Status must be one of: ${validStatuses.join(', ')}`
          }
        });
      }

      const booking = await Booking.findByPk(id);

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

  // Get analytics
  async getAnalytics(req, res, next) {
    try {
      const { period = 'monthly' } = req.query;

      // Get all bookings
      const bookings = await Booking.findAll({
        include: [{ model: Payment, as: 'payment' }]
      });

      // Calculate stats
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
      const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending').length;
      const cancelledBookings = bookings.filter(b => b.bookingStatus === 'cancelled').length;

      // Calculate revenue
      const totalRevenue = bookings
        .filter(b => b.bookingStatus === 'confirmed')
        .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);

      const averageBookingValue = confirmedBookings > 0 
        ? totalRevenue / confirmedBookings 
        : 0;

      res.json({
        success: true,
        data: {
          overview: {
            totalBookings,
            totalRevenue,
            period,
            currency: 'USD'
          },
          bookings: {
            confirmed: confirmedBookings,
            pending: pendingBookings,
            cancelled: cancelledBookings
          },
          revenue: {
            total: totalRevenue,
            averageBookingValue,
            currency: 'USD'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get dashboard stats
  async getDashboardStats(req, res, next) {
    try {
      // Get all bookings with passengers count
      const bookings = await Booking.findAll();

      // Calculate stats
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
      const cancelledBookings = bookings.filter(b => b.bookingStatus === 'cancelled').length;
      const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending').length;

      // Calculate total revenue from confirmed bookings (assuming amounts are in cents, convert to dollars)
      const totalRevenue = bookings
        .filter(b => b.bookingStatus === 'confirmed')
        .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);

      // Get total passengers count
      const bookingsWithPassengers = await Booking.findAll({
        include: [{ model: Passenger, as: 'passengers', through: { attributes: [] } }]
      });

      const totalPassengers = bookingsWithPassengers.reduce((sum, booking) => {
        return sum + (booking.passengers?.length || 0);
      }, 0);

      // Calculate cancel rate
      const cancelRate = totalBookings > 0 
        ? ((cancelledBookings / totalBookings) * 100).toFixed(1)
        : 0;

      res.json({
        success: true,
        data: {
          totalBookings,
          confirmedBookings,
          totalRevenue,
          totalPassengers,
          cancellations: cancelledBookings,
          cancelRate: parseFloat(cancelRate)
        }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      next(error);
    }
  }
};

export default AdminController;

