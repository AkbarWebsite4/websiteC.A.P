import React, { useState } from 'react';
import { ArrowDown, Search } from 'lucide-react';

/**
 * Hero Component - Russian Version
 * Bold, masculine hero section with premium automotive styling
 */
export const HeroRu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
        className="absolute inset-0 z-0 hero-background"
        style={{
          backgroundImage: 'url(/background_cap_with_avto_details.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'high-quality',
          opacity: 1
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Centered Logo */}
        <div className="mb-6 mt-24 content-reveal delay-1">
          <img
            src="/cap logotip.jpg"
            alt="C.A.P. Logo"
            className="h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 rounded-full object-cover border-4 border-blue-600 shadow-2xl mx-auto brightness-110 contrast-125 saturate-110 filter drop-shadow-2xl"
            style={{
              imageRendering: 'crisp-edges',
              WebkitImageRendering: 'crisp-edges',
              msImageRendering: 'crisp-edges'
            }}
          />
        </div>

        {/* Main Heading - C.A.P text */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight hero-title-animated">
          <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tight content-reveal delay-2">
            <img
              src="/Parts 1.png"
              alt="Ваш проводник в сфере автозапчастей"
              className="h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto object-contain filter brightness-110 contrast-125 saturate-110"
              style={{
                imageRendering: 'crisp-edges',
                WebkitImageRendering: 'crisp-edges',
                msImageRendering: 'crisp-edges'
              }}
            />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mt-4 tracking-wide content-reveal delay-3">
              Ваш проводник в сфере автозапчастей
            </h2>
          </div>

        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-medium -mt-2 content-reveal delay-4">
          <span className="tracking-wide">Мы предлагаем профессиональный сервис, широкий выбор и быстрые поставки.</span>
        </p>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto content-reveal delay-5 mb-12">
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-2 border-[#144374]/50 rounded-2xl p-2 shadow-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по коду, названию или бренду..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-6 pr-16 py-4 bg-gray-800/90 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#144374] focus:ring-2 focus:ring-[#144374]/20 transition-all text-base font-medium"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#144374] hover:bg-[#1e5ba8] text-white p-3 rounded-lg transition-colors shadow-lg"
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