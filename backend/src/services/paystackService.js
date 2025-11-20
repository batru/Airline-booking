import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

class PaystackService {
  /**
   * Initialize payment with Paystack
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Paystack transaction response
   */
  async initializePayment(paymentData) {
    const { email, amount, currency = 'KES', reference, callback_url, metadata } = paymentData;

    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key not configured');
    }

    // Amount is already in smallest currency unit (cents for KES)
    // So we use it directly
    const requestData = JSON.stringify({
      email,
      amount,
      currency,
      reference,
      callback_url,
      metadata
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status) {
              resolve(response.data);
            } else {
              const errorMsg = response.message || 'Paystack initialization failed';
              console.error('❌ Paystack Error:', errorMsg, response);
              reject(new Error(errorMsg));
            }
          } catch (error) {
            console.error('❌ Parse Error:', error.message);
            reject(new Error(`Failed to parse Paystack response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Paystack request failed: ${error.message}`));
      });

      req.write(requestData);
      req.end();
    });
  }

  /**
   * Verify payment with Paystack
   * @param {string} reference - Payment reference
   * @returns {Promise<Object>} Verified payment details
   */
  async verifyPayment(reference) {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key not configured');
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status && response.data.status === 'success') {
              resolve(response.data);
            } else {
              reject(new Error(response.message || 'Payment verification failed'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse Paystack response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Paystack request failed: ${error.message}`));
      });

      req.end();
    });
  }

  /**
   * Verify webhook signature
   * @param {string} hash - Paystack hash header
   * @param {Object} body - Request body (parsed)
   * @returns {boolean} True if signature is valid
   */
  verifyWebhookSignature(hash, body) {
    if (!PAYSTACK_SECRET_KEY || !hash) {
      return false;
    }

    try {
      const crypto = require('crypto');
      const hashFromPaystack = hash;
      const bodyString = JSON.stringify(body);
      const calculatedHash = crypto
        .createHash('sha512')
        .update(PAYSTACK_SECRET_KEY + bodyString)
        .digest('hex');

      return calculatedHash === hashFromPaystack;
    } catch (error) {
      console.error('❌ Signature verification error:', error.message);
      return false;
    }
  }

  /**
   * Get public key for frontend
   * @returns {string} Paystack public key
   */
  getPublicKey() {
    return PAYSTACK_PUBLIC_KEY || '';
  }
}

export default new PaystackService();

