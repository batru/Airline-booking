import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email (you can set this in .env or use verified domain in Resend)
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

class EmailService {
  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(bookingData, passengers) {
    try {
      const flightDetails = bookingData.flightSnapShot || {};
      const outbound = flightDetails.outbound || {};
      const returnFlight = flightDetails.return || {};

      const passengerList = passengers
        .map(p => `${p.title} ${p.firstName} ${p.lastName}`)
        .join('<br/>');

      const flightInfo = `
        <h3>Outbound Flight</h3>
        <p><strong>Flight:</strong> ${outbound.flight_number || 'N/A'}</p>
        <p><strong>Airline:</strong> ${outbound.airline_name || 'N/A'}</p>
        <p><strong>From:</strong> ${outbound.origin_name || 'N/A'} (${outbound.origin_code || 'N/A'})</p>
        <p><strong>To:</strong> ${outbound.destination_name || 'N/A'} (${outbound.destination_code || 'N/A'})</p>
        <p><strong>Departure:</strong> ${this.formatDate(outbound.departure_time)}</p>
        <p><strong>Arrival:</strong> ${this.formatDate(outbound.arrival_time)}</p>
        
        ${returnFlight ? `
        <h3>Return Flight</h3>
        <p><strong>Flight:</strong> ${returnFlight.flight_number || 'N/A'}</p>
        <p><strong>Airline:</strong> ${returnFlight.airline_name || 'N/A'}</p>
        <p><strong>From:</strong> ${returnFlight.origin_name || 'N/A'} (${returnFlight.origin_code || 'N/A'})</p>
        <p><strong>To:</strong> ${returnFlight.destination_name || 'N/A'} (${returnFlight.destination_code || 'N/A'})</p>
        <p><strong>Departure:</strong> ${this.formatDate(returnFlight.departure_time)}</p>
        <p><strong>Arrival:</strong> ${this.formatDate(returnFlight.arrival_time)}</p>
        ` : ''}
      `;

      const htmlContent = this.getBookingConfirmationTemplate({
        bookingReference: bookingData.bookingReference,
        totalAmount: bookingData.totalAmount,
        currency: bookingData.currency,
        passengers: passengerList,
        flightInfo,
        bookingStatus: bookingData.bookingStatus
      });

      const recipientEmail = passengers[0]?.email;

      if (!recipientEmail) {
        console.warn('⚠️ No email address provided, skipping email');
        return { success: false, message: 'No email address' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: recipientEmail,
        subject: `Booking Confirmation - ${bookingData.bookingReference}`,
        html: htmlContent
      });

      if (error) {
        throw new Error(`Resend API Error: ${error.message}`);
      }

      console.log('✅ Email sent successfully to:', recipientEmail);
      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error('❌ Error sending booking confirmation email:', error.message);
      throw error;
    }
  }

  getBookingConfirmationTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
            .info-box h3 { margin-top: 0; color: #667eea; }
            .reference { font-size: 24px; font-weight: bold; color: #764ba2; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Booking Confirmation</h1>
              <p>Your flight booking is confirmed!</p>
            </div>
            <div class="content">
              <div class="info-box">
                <h3>Booking Reference</h3>
                <div class="reference">${data.bookingReference}</div>
                <p><strong>Status:</strong> ${data.bookingStatus}</p>
              </div>

              <div class="info-box">
                <h3>Passengers</h3>
                <p>${data.passengers}</p>
              </div>

              <div class="info-box">
                <h3>Flight Details</h3>
                ${data.flightInfo}
              </div>

              <div class="info-box">
                <h3>Amount</h3>
                <p><strong>Total:</strong> ${this.formatCurrency(data.totalAmount, data.currency)}</p>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for choosing Airline Booking System</p>
              <p>&copy; ${new Date().getFullYear()} Airline Booking System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default new EmailService();

