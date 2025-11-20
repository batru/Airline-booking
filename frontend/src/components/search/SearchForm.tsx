import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowLeftRight, Search } from 'lucide-react';
import { SearchData } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { validateField, rules } from '../../utils/validation';

interface SearchFormProps {
  onSearch?: (searchData: SearchData) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<SearchData>({
    from: 'Mogadishu',
    to: 'Nairobi',
    departure: '2025-11-15',
    return: '2025-11-22',
    passengers: 1,
    tripType: 'round'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSearching, setIsSearching] = useState(false);

  // Validation rules (relaxed for demo)
  const validationRules = {
    from: rules.required('Please enter departure city'),
    to: rules.required('Please enter destination city'),
    departure: rules.required('Please select departure date'),
    return: searchData.tripType === 'round' ? rules.required('Please select return date') : undefined
  };

  // Validate field on change
  const validateFieldByName = (name: string, value: string) => {
    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return true;

    const result = validateField(value, rule);
    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [name]: result.error! }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    return result.isValid;
  };

  // Handle input change
  const handleInputChange = (name: string, value: string) => {
    setSearchData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateFieldByName(name, value);
    }
  };

  // Handle input blur
  const handleInputBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateFieldByName(name, searchData[name as keyof SearchData] as string);
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    Object.keys(validationRules).forEach(name => {
      const rule = validationRules[name as keyof typeof validationRules];
      if (rule) {
        const result = validateField(searchData[name as keyof SearchData] as string, rule);
        if (!result.isValid) {
          newErrors[name] = result.error!;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSearch = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSearching(true);
    
    try {
      if (onSearch) {
        onSearch(searchData);
      } else {
        navigate('/results', { state: searchData });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSwap = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
    
    // Clear errors for swapped fields
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.from;
      delete newErrors.to;
      return newErrors;
    });
  };

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && 
    searchData.from && 
    searchData.to && 
    searchData.departure && 
    (searchData.tripType !== 'round' || searchData.return);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        {/* Trip Type Selection */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {[
            { value: 'round', label: 'Round trip' },
            { value: 'oneway', label: 'One Way' },
            { value: 'multi', label: 'Multi-city' }
          ].map((type) => (
            <Button
              key={type.value}
              variant={searchData.tripType === type.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSearchData({...searchData, tripType: type.value as any})}
              className="flex-1 sm:flex-none"
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* From Field */}
          <Input
            label="From"
            value={searchData.from}
            onChange={(e) => handleInputChange('from', e.target.value)}
            onBlur={() => handleInputBlur('from')}
            error={touched.from ? errors.from : undefined}
            icon={<MapPin size={16} />}
            placeholder="Departure city"
          />

          {/* To Field */}
          <Input
            label="To"
            value={searchData.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
            onBlur={() => handleInputBlur('to')}
            error={touched.to ? errors.to : undefined}
            icon={<MapPin size={16} />}
            placeholder="Destination city"
          />

          {/* Departure Date */}
          <Input
            label="Departure Date"
            value={searchData.departure}
            onChange={(e) => handleInputChange('departure', e.target.value)}
            onBlur={() => handleInputBlur('departure')}
            error={touched.departure ? errors.departure : undefined}
            icon={<Calendar size={16} />}
            variant="date"
            min={new Date().toISOString().split('T')[0]}
          />

          {/* Travelers */}
          <div>
            <label className="form-label">Travelers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={searchData.passengers}
                onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'traveler' : 'travelers'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Return Date for Round Trip */}
        {searchData.tripType === 'round' && (
          <div className="mb-4 sm:mb-6">
            <Input
              label="Return Date"
              value={searchData.return || ''}
              onChange={(e) => handleInputChange('return', e.target.value)}
              onBlur={() => handleInputBlur('return')}
              error={touched.return ? errors.return : undefined}
              icon={<Calendar size={16} />}
              variant="date"
              min={searchData.departure}
            />
          </div>
        )}

        {/* Swap Button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Button
            variant="tertiary"
            size="sm"
            onClick={handleSwap}
            className="p-2 rounded-full"
            title="Swap destinations"
          >
            <ArrowLeftRight size={18} />
          </Button>
        </div>

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <Alert
            type="error"
            title="Please fix the following errors:"
            className="mb-4"
          >
            <ul className="list-disc list-inside space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          loading={isSearching}
          disabled={!isFormValid}
          size="lg"
          className="w-full"
          leftIcon={<Search size={20} />}
        >
          {isSearching ? 'Searching...' : 'Search Flights'}
        </Button>
      </div>
    </div>
  );
};