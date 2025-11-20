import Booking from '../../models/Booking.js';
import Passenger from '../../models/Passenger.js';
import Payment from '../../models/Payment.js';
import BookingPassenger from '../../models/BookingPassenger.js';

// Sample flight data with Somali routes
const sampleFlights = [
  {
    airline_code: '6P',
    airline_name: 'Jubba Airways',
    flight_number: '6P201',
    origin_code: 'MGQ',
    origin_name: 'Aden Adde International Airport',
    destination_code: 'HGA',
    destination_name: 'Egal International Airport',
    departure_time: new Date('2024-12-20T08:00:00Z'),
    arrival_time: new Date('2024-12-20T09:30:00Z'),
    duration_minutes: 90,
    aircraft_type: 'Boeing 737-700',
    price: 450.00
  },
  {
    airline_code: '5R',
    airline_name: 'Daallo Airlines',
    flight_number: '5R232',
    origin_code: 'MGQ',
    origin_name: 'Aden Adde International Airport',
    destination_code: 'HGA',
    destination_name: 'Egal International Airport',
    departure_time: new Date('2024-12-20T14:00:00Z'),
    arrival_time: new Date('2024-12-20T15:30:00Z'),
    duration_minutes: 90,
    aircraft_type: 'Airbus A310',
    price: 480.00
  },
  {
    airline_code: 'FQ',
    airline_name: 'Somali Airways',
    flight_number: 'FQ501',
    origin_code: 'MGQ',
    origin_name: 'Aden Adde International Airport',
    destination_code: 'BOS',
    destination_name: 'Bosaaso Airport',
    departure_time: new Date('2024-12-20T10:00:00Z'),
    arrival_time: new Date('2024-12-20T11:00:00Z'),
    duration_minutes: 60,
    aircraft_type: 'ATR 72',
    price: 320.00
  },
  {
    airline_code: 'HZ',
    airline_name: 'Hayo Airlines',
    flight_number: 'HZ101',
    origin_code: 'MGQ',
    origin_name: 'Aden Adde International Airport',
    destination_code: 'KDO',
    destination_name: 'Kardof Airport',
    departure_time: new Date('2024-12-20T11:00:00Z'),
    arrival_time: new Date('2024-12-20T12:15:00Z'),
    duration_minutes: 75,
    aircraft_type: 'ATR 42',
    price: 280.00
  }
];

export const seedSampleData = async () => {
  try {
    // Create Somali passengers
    const passengers = await Passenger.bulkCreate([
      {
        title: 'Mr',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        country: 'Somalia',
        dateOfBirth: new Date('1985-03-15'),
        documentType: 'Passport',
        documentNumber: 'SO12345678',
        email: 'ahmed.hassan@email.com',
        phoneCode: '+252',
        phoneNumber: '612345678'
      },
      {
        title: 'Mrs',
        firstName: 'Fatima',
        lastName: 'Hassan',
        country: 'Somalia',
        dateOfBirth: new Date('1987-07-22'),
        documentType: 'Passport',
        documentNumber: 'SO87654321',
        email: 'fatima.hassan@email.com',
        phoneCode: '+252',
        phoneNumber: '612345679'
      },
      {
        title: 'Miss',
        firstName: 'Aisha',
        lastName: 'Mohamed',
        country: 'Somalia',
        dateOfBirth: new Date('2000-11-08'),
        documentType: 'Passport',
        documentNumber: 'SO11223344',
        email: 'aisha.mohamed@email.com',
        phoneCode: '+252',
        phoneNumber: '612345680'
      }
    ], { ignoreDuplicates: true });

    // Create payments in USD
    const payments = await Payment.bulkCreate([
      {
        paymentReference: 'PAY001',
        amount: 900.00,
        currency: 'USD',
        status: 'success'
      },
      {
        paymentReference: 'PAY002',
        amount: 960.00,
        currency: 'USD',
        status: 'pending'
      },
      {
        paymentReference: 'PAY003',
        amount: 640.00,
        currency: 'USD',
        status: 'success'
      }
    ], { ignoreDuplicates: true });

    // Create bookings with Somali flight snapshots
    const bookingsToCreate = [
      {
        bookingReference: 'BK001',
        bookingStatus: 'confirmed',
        totalAmount: 900.00,
        currency: 'USD',
        paymentId: payments[0]?.id,
        flightSnapShot: {
          outbound: sampleFlights[0],
          return: sampleFlights[1]
        }
      },
      {
        bookingReference: 'BK002',
        bookingStatus: 'pending',
        totalAmount: 960.00,
        currency: 'USD',
        paymentId: payments[1]?.id,
        flightSnapShot: {
          outbound: sampleFlights[1]
        }
      },
      {
        bookingReference: 'BK003',
        bookingStatus: 'confirmed',
        totalAmount: 640.00,
        currency: 'USD',
        paymentId: payments[2]?.id,
        flightSnapShot: {
          outbound: sampleFlights[2]
        }
      }
    ];

    // Try to create bookings (will return existing ones or new ones)
    const bookings = await Booking.bulkCreate(bookingsToCreate, { ignoreDuplicates: true });
    
    // Fetch existing bookings by reference to ensure we have IDs
    const allBookings = await Promise.all(
      bookingsToCreate.map(b => Booking.findOne({ where: { bookingReference: b.bookingReference } }))
    );

    // Link passengers to bookings (use fetched bookings to ensure we have IDs)
    const validBookings = allBookings.filter(b => b !== null);
    const validPassengers = passengers.filter(p => p !== null);
    
    if (validBookings.length >= 3 && validPassengers.length >= 3) {
      const bookingPassengerLinks = [];
      
      // BK001 (Ahmed and Fatima)
      bookingPassengerLinks.push({ bookingId: validBookings[0].id, passengerId: validPassengers[0].id });
      bookingPassengerLinks.push({ bookingId: validBookings[0].id, passengerId: validPassengers[1].id });
      
      // BK002 (Ahmed)
      bookingPassengerLinks.push({ bookingId: validBookings[1].id, passengerId: validPassengers[0].id });
      
      // BK003 (Aisha)
      bookingPassengerLinks.push({ bookingId: validBookings[2].id, passengerId: validPassengers[2].id });
      
      await BookingPassenger.bulkCreate(bookingPassengerLinks, { ignoreDuplicates: true });
    }

    console.log('✅ Sample data seeded successfully with Somali routes and USD currency');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error.message);
  }
};

export default seedSampleData;
