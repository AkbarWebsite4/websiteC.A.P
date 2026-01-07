import React from 'react';
import { MessageCircle, MapPin, Clock, Mail, Send } from 'lucide-react';

/**
 * Contact Component - Russian Version
 * Contact information and final CTA
 */
export const ContactRu: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Здравствуйте, меня интересуют");
    window.open(`https://wa.me/971561747182?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:commonautoparts.uae@gmail.com', '_self');
  };

  return (
    <section id="contact" className="py-12 relative bg-transparent">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 tracking-tight">
              СВЯЖИТЕСЬ С <span className="text-blue-500">НАМИ</span>
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-400 font-medium">
              ЧЕРЕЗ
            </p>
          </div>

          {/* Contact Methods - 4 options */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-16">
            {/* WhatsApp */}
            <div
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="bg-green-600 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 group-hover:bg-green-500 transition-colors duration-300">
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-black group-hover:text-green-400 transition-colors duration-300">
                WhatsApp
              </h3>
            </div>

            {/* Telegram */}
            <div
              onClick={() => window.open('https://t.me/manager_commonautoparts', '_blank')}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="bg-blue-500 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 group-hover:bg-blue-400 transition-colors duration-300">
                <Send className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-black group-hover:text-blue-400 transition-colors duration-300">
                Telegram
              </h3>
            </div>

            {/* Instagram */}
            <div
              onClick={() => window.open('https://www.instagram.com/commonautoparts?igsh=YWNzZjUxOXFlMTA3', '_blank')}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8 rounded-xl border border-gray-700 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 group-hover:from-purple-400 group-hover:to-pink-400 transition-colors duration-300">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-black group-hover:text-pink-400 transition-colors duration-300">
                Instagram
              </h3>
            </div>

            {/* Email */}
            <div
              onClick={handleEmailClick}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="bg-red-600 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 group-hover:bg-red-500 transition-colors duration-300">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-black group-hover:text-red-400 transition-colors duration-300">
                Email
              </h3>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img
              src="/cap logotip.jpg"
              alt="C.A.P. Logo"
              className="h-10 w-10 rounded-full object-cover border border-[#144374] brightness-110 contrast-125 saturate-110"
            />
            <div>
              <h4 className="text-lg font-bold text-black">C.A.P</h4>
              <p className="text-sm text-gray-400 font-normal">Common Auto Parts</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Common Auto Parts. Все права защищены.
          </p>
        </div>
      </div>
    </section>
  );
};