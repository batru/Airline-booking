import { Payment, Booking, Passenger } from '../models/index.js';
import { generatePaymentReference } from '../utils/helpers.js';
import paystackService from '../services/paystackService.js';
import BookingController from './bookingController.js';

const PaymentController = {
  // Get Paystack public key
  async getPublicKey(req, res, next) {
    try {
      const publicKey = paystackService.getPublicKey();

      res.json({
        success: true,
        data: {
          publicKey
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Initialize payment
  async initialize(req, res, next) {
    try {
      console.log('💳 Payment initialization request:', JSON.stringify(req.body, null, 2));
      const { draftReference, amount, currency, customer } = req.body;

      if (!draftReference || !amount) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Draft reference and amount are required'
          }
        });
      }

      if (!customer || !customer.email) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Customer email is required'
          }
        });
      }

      // Generate payment reference
      const paymentReference = generatePaymentReference();

      // DO NOT create payment record yet - only after Paystack confirms
      // Payment record will be created in verify() after Paystack confirms payment

      // Initialize Paystack transaction
      const callbackUrl = req.body.callback_url || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking`;
      const metadata = {
        draft_reference: draftReference,
        payment_reference: paymentReference
      };

      const paystackResponse = await paystackService.initializePayment({
        email: customer.email,
        amount,
        currency: currency || 'KES',
        reference: paymentReference,
        callback_url: callbackUrl,
        metadata
      });

      res.status(201).json({
        success: true,
        data: {
          paymentReference: paymentReference,
          amount: amount,
          currency: currency || 'KES',
          status: 'pending',
          authorizationUrl: paystackResponse.authorization_url,
          accessCode: paystackResponse.access_code
        }
      });
    } catch (error) {
      console.error('❌ Payment initialization error:', error.message);
      next(error);
    }
  },

  // Verify payment
  async verify(req, res, next) {
    try {
      const { paymentReference } = req.params;
      console.log('🔍 Verifying payment with Paystack:', paymentReference);

      // First, check if payment record exists (created by webhook or previous verify)
      let payment = await Payment.findOne({ where: { paymentReference } });

      if (!payment) {
        // No payment record yet - verify with Paystack
        console.log('📡 No payment record found, verifying with Paystack...');
        
        try {
          const paystackVerification = await paystackService.verifyPayment(paymentReference);
          
          console.log('📋 Paystack verification response:', paystackVerification.status);
          
          if (paystackVerification.status === 'success') {
            console.log('✅ Paystack confirms payment successful');
            
            // Create payment record NOW (only after Paystack confirms)
            payment = await Payment.create({
              paymentReference,
              amount: paystackVerification.amount / 100, // Paystack returns amount in kobo/cents
              currency: paystackVerification.currency,
              status: 'success'
            });
            
            console.log('✅ Payment record created in database');
            
            // Get metadata from Paystack response
            const metadata = paystackVerification.metadata || {};
            const draftReference = metadata.draft_reference;
            
            if (draftReference) {
              try {
                console.log('📋 Creating booking from draft:', draftReference);
                const booking = await BookingController.createFromPayment(paymentReference, { draftReference });
                console.log('✅ Booking created:', booking.bookingReference);
                
                // Return the booking
                return res.json({
                  success: true,
                  data: {
                    paymentReference: payment.paymentReference,
                    status: 'success',
                    amount: payment.amount,
                    currency: payment.currency,
                    booking: booking
                  }
                });
              } catch (bookingError) {
                console.error('❌ Error creating booking:', bookingError);
                // Return payment success but booking failed
                return res.status(202).json({
                  success: true,
                  data: {
                    paymentReference: payment.paymentReference,
                    status: 'success',
                    amount: payment.amount,
                    currency: payment.currency,
                    message: 'Payment successful. Booking creation failed. Please contact support.'
                  }
                });
              }
            } else {
              console.error('❌ Draft reference missing in Paystack metadata');
              return res.status(400).json({
                success: false,
                error: {
                  code: 'MISSING_METADATA',
                  message: 'Draft reference missing in payment metadata'
                }
              });
            }
          } else {
            console.log('⏳ Payment status:', paystackVerification.status);
            return res.status(202).json({
              success: true,
              data: {
                paymentReference,
                status: paystackVerification.status,
                message: 'Payment verification in progress...'
              }
            });
          }
        } catch (verifyError) {
          console.error('❌ Paystack verification error:', verifyError);
          return res.status(500).json({
            success: false,
            error: {
              code: 'VERIFICATION_ERROR',
              message: 'Failed to verify payment with Paystack'
            }
          });
        }
      }

      // Payment record exists - check if booking exists
      const booking = await Booking.findOne({
        where: { paymentId: payment.id },
        include: [{ model: Passenger, as: 'passengers', through: { attributes: [] } }]
      });

      if (!booking) {
        // Payment exists but booking doesn't - create it
        console.log('⚠️ Payment exists but no booking found, creating...');
        // This shouldn't happen in normal flow, but handle it gracefully
        return res.status(202).json({
          success: true,
          data: {
            paymentReference: payment.paymentReference,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            message: 'Payment verified. Booking creation in progress...'
          }
        });
      }

      console.log('✅ Found booking:', booking.bookingReference);

      res.json({
        success: true,
        data: {
          paymentReference: payment.paymentReference,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          booking: booking
        }
      });
    } catch (error) {
      console.error('❌ Payment verification error:', error.message);
      next(error);
    }
  },

  // Paystack webhook handler
  async webhook(req, res, next) {
    try {
      // Parse raw body
      const body = JSON.parse(req.body.toString());
      
      // Verify webhook signature
      const hash = req.headers['x-paystack-signature'];
      const isValid = paystackService.verifyWebhookSignature(hash, body);

      if (!isValid && process.env.NODE_ENV === 'production') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid webhook signature'
          }
        });
      }

      const { event, data } = body;
      console.log('📨 Paystack webhook received:', event);

      if (event === 'charge.success') {
        const { reference, metadata, amount, currency } = data;
        
        // Check if payment record exists, create if not
        let payment = await Payment.findOne({ where: { paymentReference: reference } });

        if (!payment) {
          console.log('📝 Creating payment record from webhook:', reference);
          // Create payment record (only now, after Paystack confirms)
          payment = await Payment.create({
            paymentReference: reference,
            amount: amount / 100, // Paystack sends amount in kobo/cents
            currency: currency,
            status: 'success'
          });
          console.log('✅ Payment record created from webhook');
        } else {
          // Update existing payment status
          await payment.update({ status: 'success' });
          console.log('✅ Payment status updated to success');
        }

        // Create booking from confirmed payment
        try {
          console.log('📋 Webhook metadata:', metadata);
          
          // Paystack metadata can be an object with key-value pairs
          const draftReference = metadata?.draft_reference || metadata?.['draft_reference'];
          
          if (!draftReference) {
            console.error('❌ Draft reference not found in metadata:', JSON.stringify(metadata));
            // Don't fail webhook - log and continue
            console.log('⚠️ Proceeding without booking creation - manual intervention may be required');
            return res.json({ success: true, message: 'Payment processed but booking creation skipped' });
          }

          // Create booking (this creates all database records)
          const booking = await BookingController.createFromPayment(reference, { draftReference });
          console.log('✅ Booking created from confirmed payment:', booking.bookingReference);

        } catch (bookingError) {
          console.error('❌ Error creating booking from payment:', bookingError);
          // Don't fail the webhook - payment was successful
          // Log error for manual intervention
          console.log('⚠️ Payment successful but booking creation failed - manual intervention required');
        }

      } else if (event === 'charge.failed') {
        const { reference } = data;
        const payment = await Payment.findOne({ where: { paymentReference: reference } });

        if (payment) {
          await payment.update({ status: 'failed' });
          console.log('❌ Payment marked as failed:', reference);
        }
      }

      res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      console.error('❌ Webhook processing error:', error.message);
      next(error);
    }
  }
};

export default PaymentController;

