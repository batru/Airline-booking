# Airline Booking Backend API

Express.js backend for the Airline Booking System.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create database:
```bash
createdb airline_booking
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials

5. Seed the database:
```bash
npm run db:seed
```

6. Start development server:
```bash
npm run dev
```

## Database Schema

- `users` - User accounts (admin/regular users)
- `passengers` - Passenger profiles
- `bookings` - Booking records with flight snapshots
- `payments` - Payment transactions
- `booking_passengers` - Join table for bookings and passengers

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1` - API info

More endpoints to be implemented in Phase 2...

## Development

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Seed database
npm run db:seed
```

## Project Structure

```
src/
├── config/
│   ├── database.js      # Sequelize config
│   ├── seed.js         # Seeder entry
│   └── seeders/
│       └── sampleData.js
├── models/
│   ├── User.js
│   ├── Passenger.js
│   ├── Booking.js
│   ├── Payment.js
│   └── BookingPassenger.js
└── server.js            # Express server
```

## License

ISC

