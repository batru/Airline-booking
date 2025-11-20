# Paystack Payment Integration

## Overview

The airline booking system now includes full Paystack payment processing with initialization, verification, and webhook support.

## Setup

### 1. Environment Variables

Add these to your `.env` file in `src/backend/`:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# Optional: Frontend URL for payment callbacks
FRONTEND_URL=http://localhost:5173
```

### 2. Get Paystack Keys

1. Sign up at https://paystack.com
2. Go to Settings > API Keys & Webhooks
3. Copy your **Test Secret Key** (starts with `sk_test_`)
4. Copy your **Test Public Key** (starts with `pk_test_`)
5. Add them to `.env`

### 3. Configure Webhook

For webhook testing in development:
- Use https://webhook.site or ngrok for local testing
- Webhook URL: `https://your-domain.com/api/v1/payments/webhooks/paystack`

For production:
- Configure in Paystack dashboard
- Point to your production webhook endpoint

## API Endpoints

### 1. Initialize Payment

**Endpoint:** `POST /api/v1/payments/initialize`

**Request:**
```json
{
  "bookingId": 1,
  "amount": 450.00,
  "currency": "NGN",
  "customer": {
    "email": "customer@example.com"
  },
  "callback_url": "http://localhost:5173/booking/confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentReference": "PAY123456",
    "amount": 450.00,
    "currency": "NGN",
    "status": "pending",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "abc123xyz"
  }
}
```

### 2. Verify Payment

**Endpoint:** `GET /api/v1/payments/verify/:paymentReference`

**Example:** `GET /api/v1/payments/verify/PAY123456`

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentReference": "PAY123456",
    "status": "success",
    "amount": 450.00,
    "currency": "NGN",
    "gatewayResponse": { ... }
  }
}
```

### 3. Get Public Key

**Endpoint:** `GET /api/v1/payments/public-key`

**Response:**
```json
{
  "success": true,
  "data": {
    "publicKey": "pk_test_..."
  }
}
```

### 4. Webhook Endpoint

**Endpoint:** `POST /api/v1/payments/webhooks/paystack`

Paystack sends webhooks for:
- `charge.success` - Payment successful
- `charge.failed` - Payment failed

## Integration Flow

### Frontend Integration

1. **Create booking** via `/api/v1/bookings`
2. **Initialize payment** via `/api/v1/payments/initialize`
3. **Redirect user** to `authorizationUrl` for payment
4. **User completes payment** on Paystack
5. **Handle callback** - Verify payment via `/api/v1/payments/verify/:paymentReference`
6. **Webhook confirms** payment (backend)

### Testing

#### Test Card Numbers (Paystack Test Mode)

**Success:**
- Card: `4084 0840 8408 4081`
- CVV: Any 3 digits
- Expiry: Any future date

**Declined:**
- Card: `5060 6666 6666 6666`
- CVV: Any 3 digits
- Expiry: Any future date

**OTP/Authorization:**
- Card: `4084 0840 8408 4085`
- Requires OTP: `123456`

#### Example Test Flow

```bash
# 1. Create booking
POST /api/v1/bookings

# 2. Initialize payment
POST /api/v1/payments/initialize
{
  "bookingId": 1,
  "amount": 450.00,
  "currency": "NGN",
  "customer": {
    "email": "batrudin10@gmail.com"
  }
}

# 3. User pays on Paystack checkout
# (Redirect to authorizationUrl)

# 4. Verify payment after redirect
GET /api/v1/payments/verify/PAY123456
```

## Environment Variables Reference

```env
# Required
PAYSTACK_SECRET_KEY=sk_test_...  # Your Paystack secret key
PAYSTACK_PUBLIC_KEY=pk_test_...  # Your Paystack public key

# Optional
FRONTEND_URL=http://localhost:5173  # For payment callbacks
NODE_ENV=development  # Set to 'production' in production
```

## Security Notes

1. **Never expose secret key** to frontend
2. **Always verify webhook signatures** in production
3. **Use HTTPS** for webhook endpoints in production
4. **Test webhook signature verification** before going live

## Troubleshooting

### Payment Not Initializing
- Check PAYSTACK_SECRET_KEY is set correctly
- Verify amount is in kobo/cent (multiplied by 100)
- Check currency code is valid (NGN, USD, etc.)

### Webhook Not Working
- Verify webhook URL is accessible
- Check signature verification
- Test with ngrok for local development
- Review Paystack dashboard webhook logs

### Payment Verification Fails
- Ensure payment reference is correct
- Check transaction exists in Paystack dashboard
- Verify API key has proper permissions

## Production Checklist

- [ ] Replace test keys with production keys
- [ ] Configure production webhook URL in Paystack
- [ ] Enable signature verification (already implemented)
- [ ] Set FRONTEND_URL to production domain
- [ ] Test with real card (small amount)
- [ ] Monitor webhook logs in Paystack dashboard

