import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Passenger, Flight } from '../../types';

interface PassengerFormProps {
  flight: Flight;
  onNext: (passenger: Passenger) => void;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({ flight, onNext }) => {
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState<Passenger>({
    firstName: 'Abdirahman',
    lastName: 'Mohamed',
    email: 'abdirahman.mohamed@email.com',
    phone: '+254 712 345 678',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    documentType: 'passport',
    documentNumber: 'KE123456789'
  });

  const [errors, setErrors] = useState<Partial<Passenger>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Passenger> = {};

    if (!passenger.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!passenger.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!passenger.email.trim()) newErrors.email = 'Email is required';
    if (!passenger.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!passenger.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!passenger.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(passenger);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-blue-600 opacity-10"></div>
        
        <div className="relative z-10">
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-2">Passenger Information</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-responsive-sm">
            {flight.airline} {flight.flightNumber} • {flight.departure.city} → {flight.arrival.city}
          </p>

          {/* Passenger Section */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <User className="text-primary-900" size={18} />
            <h3 className="text-responsive-base font-semibold text-gray-900">Passenger 1</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* First Name */}
              <Input
                label="First Name *"
                value={passenger.firstName}
                onChange={(e) => setPassenger({...passenger, firstName: e.target.value})}
                error={errors.firstName}
              />

              {/* Last Name */}
              <Input
                label="Last Name *"
                value={passenger.lastName}
                onChange={(e) => setPassenger({...passenger, lastName: e.target.value})}
                error={errors.lastName}
              />

              {/* Email */}
              <Input
                label="Email *"
                type="email"
                value={passenger.email}
                onChange={(e) => setPassenger({...passenger, email: e.target.value})}
                error={errors.email}
              />

              {/* Phone */}
              <Input
                label="Phone Number *"
                value={passenger.phone}
                onChange={(e) => setPassenger({...passenger, phone: e.target.value})}
                error={errors.phone}
              />

              {/* Date of Birth */}
              <Input
                label="Date of Birth *"
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => setPassenger({...passenger, dateOfBirth: e.target.value})}
                icon={<Calendar size={16} />}
                error={errors.dateOfBirth}
              />

              {/* Gender */}
              <div>
                <label className="form-label">Gender *</label>
                <select
                  value={passenger.gender}
                  onChange={(e) => setPassenger({...passenger, gender: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="form-label">Document Type</label>
                <select
                  value={passenger.documentType || 'passport'}
                  onChange={(e) => setPassenger({...passenger, documentType: e.target.value as 'passport' | 'id'})}
                  className="form-input"
                >
                  <option value="passport">Passport</option>
                  <option value="id">ID Card</option>
                </select>
              </div>

              {/* Document Number */}
              <Input
                label="Passport/ID Number"
                value={passenger.documentNumber || ''}
                onChange={(e) => setPassenger({...passenger, documentNumber: e.target.value})}
                placeholder="Enter Passport/ID Number"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/results')}
                className="w-full sm:flex-1 order-2 sm:order-1"
              >
                ← Back to Flights
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:flex-1 order-1 sm:order-2"
              >
                Continue to Payment →
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

