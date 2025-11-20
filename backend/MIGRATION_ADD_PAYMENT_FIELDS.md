# Database Migration: Add Payment Fields

## Changes

Added new fields to the `payments` table to support the webhook-based payment flow.

### New Fields

1. **gatewayReference** (STRING, nullable)
   - Stores the Paystack transaction reference
   - Used to link payment to Paystack records

2. **gatewayResponse** (TEXT, nullable)
   - Stores the full Paystack webhook response as JSON
   - For audit and debugging purposes

3. **bookingId** (INTEGER, nullable)
   - Foreign key to the `bookings` table
   - Links payment to its associated booking

---

## Database Migration

### Option 1: If using Sequelize sync (development)

The models will automatically sync when you start the server. No manual migration needed.

**Note:** If the `payments` table already exists, you'll need to add the columns manually or drop and recreate the table.

### Option 2: Manual SQL Migration

If you need to add these fields to an existing database:

```sql
-- Add new columns to payments table
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS gateway_reference VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gateway_response TEXT,
  ADD COLUMN IF NOT EXISTS booking_id INTEGER REFERENCES bookings(id);
```

---

## Updated Payment Model

**File:** `src/backend/src/models/Payment.js`

```javascript
const Payment = sequelize.define('Payment', {
  id: {...},
  paymentReference: {...},
  amount: {...},
  currency: {...},
  status: {...},
  gatewayReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gatewayResponse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'bookings',
      key: 'id'
    }
  }
});
```

---

## Updated Webhook Handler

**File:** `src/backend/src/controllers/paymentController.js`

```javascript
// Create payment with bookingId link
const payment = await Payment.create({
  paymentReference: paymentReference || reference,
  amount: data.amount / 100,
  currency: 'KES',
  status: 'success',
  gatewayReference: reference,
  gatewayResponse: JSON.stringify(data),
  bookingId: result.booking.id
});
```

---

## Updated Verify Handler

**File:** `src/backend/src/controllers/paymentController.js`

```javascript
// Find booking via payment's bookingId
const booking = await Booking.findOne({
  where: { id: payment.bookingId },
  include: [{ model: Passenger, as: 'passengers', through: { attributes: [] } }]
});
```

---

## Testing

After migration:

1. **Check table structure:**
   ```sql
   \d payments
   ```

2. **Test webhook:**
   - Complete a payment
   - Check webhook creates payment with all fields
   - Verify `bookingId` is set correctly

3. **Test verify endpoint:**
   - Return from Paystack
   - Check booking is fetched via `payment.bookingId`

---

## Rollback (if needed)

If you need to remove these fields:

```sql
ALTER TABLE payments
  DROP COLUMN IF EXISTS gateway_reference,
  DROP COLUMN IF EXISTS gateway_response,
  DROP COLUMN IF EXISTS booking_id;
```

---

## Summary

✅ Added `gatewayReference` to store Paystack reference  
✅ Added `gatewayResponse` for audit trail  
✅ Added `bookingId` to link payment to booking  
✅ Updated webhook to set `bookingId` on payment  
✅ Updated verify to find booking via `bookingId`  

**Run migration and restart server!** 🚀





