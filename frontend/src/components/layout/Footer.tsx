import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Logo Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-900 text-sm sm:text-lg font-bold">S</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">SkyBooker</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300">
              Airline Trade Association | ATA | was aviation user of all up to Haebagkyongin good
            </p>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              © 2025 SkyBooker. All rights reserved.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">BookAir</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">About Us</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 flex justify-center sm:justify-end space-x-4">
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Facebook</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Twitter</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Instagram</a>
        </div>
      </div>
    </footer>
  );
};