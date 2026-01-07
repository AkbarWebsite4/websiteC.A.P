import React from 'react';
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

/**
 * Footer Component
 * Comprehensive footer with contact information, links, and social media
 * Features responsive layout and organized sections
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-blue-900 text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img
                src="/C.A.P logo.jpg"
                alt="Common Auto Parts"
                className="h-12 w-12 rounded-full object-cover"
              />
              <h3 className="text-2xl font-normal">Common Auto Parts</h3>
            </div>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-blue-200 hover:text-black transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-black transition-colors duration-200">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-black transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-300" />
                <span className="text-blue-200">1-800-AUTO-PARTS</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-300" />
                <span className="text-blue-200">info@commonautoparts.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-300 mt-1" />
                <div className="text-blue-200">
                  <div>123 Auto Parts Drive</div>
                  <div>Parts City, PC 12345</div>
                  <div>United States</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <div className="space-y-3">
              <a href="#home" className="block text-blue-200 hover:text-black transition-colors duration-200">
                Home
              </a>
              <a href="#products" className="block text-blue-200 hover:text-white transition-colors duration-200">
                Products
              </a>
              <a href="#brands" className="block text-blue-200 hover:text-white transition-colors duration-200">
                Brands
              </a>
              <a href="#about" className="block text-blue-200 hover:text-white transition-colors duration-200">
                About Us
              </a>
              <a href="#contact" className="block text-blue-200 hover:text-white transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-blue-200 text-sm">
              © {currentYear} Common Auto Parts. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-blue-200 hover:text-black transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-black transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-blue-200 hover:text-black transition-colors duration-200">
                Warranty
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};