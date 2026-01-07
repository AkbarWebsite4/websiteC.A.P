import React, { useState } from 'react';
import { MessageCircle, ArrowDown, Instagram, Search } from 'lucide-react';

/**
 * Hero Component
 * Bold, masculine hero section with premium automotive styling
 */
export const Hero: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello, I'm interested in C.A.P. auto parts.");
    window.open(`https://wa.me/971561747182?text=${message}`, '_blank');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/catalog.html?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/background_cap_with_avto_details.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'high-quality',
          opacity: 1
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-black mb-8 leading-tight tracking-tight mt-16">
          <span className="block text-blue-500 text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-widest">
            C.A.P
          </span>
          <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl">
            Your guide in the world of auto parts
          </span>
        </h1>

        {/* Tagline */}
        <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 mb-8 font-bold tracking-wide">
          QUALITY GUARANTEED
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
          Professional high-quality auto parts. When reliability matters, choose C.A.P.
        </p>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl p-2 shadow-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by code, name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-6 pr-16 py-4 bg-gray-800/90 border border-gray-600 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base font-medium"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-black p-3 rounded-lg transition-colors shadow-lg"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};