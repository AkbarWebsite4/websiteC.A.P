import React from 'react';

/**
 * Brands Component - Russian Version
 * Exact replica of the catalog image with small brand cards
 * Carefully extracted brand names from the catalog
 */
export const BrandsRu: React.FC = () => {
  // Моторные части - 36 карточек
  const motorBrands = [
    // First 10 brands with logos (1.png to 10.png)
    { name: "NDC", category: "Моторные части", logo: "/ndc.png" },
    { name: "TP", category: "Моторные части", logo: "/TP.png" },
    { name: "Водяной помпа", category: "Моторные части", logo: "/karta 3.png" },
    { name: "Фильтры", category: "Моторные части", logo: "/karta 4.png" },
    { name: "Подшипники", category: "Моторные части", logo: "/5.png" },
    { name: "ERISTIC Gasket", category: "Моторные части", logo: "/eristic.png" },
    { name: "Вкладыши", category: "Моторные части", logo: "/7.png" },
    { name: "Поршневые кольца", category: "Моторные части", logo: "/8.png" },
    { name: "Водяной помпа", category: "Моторные части", logo: "/9.png" },
    { name: "Фильтры", category: "Моторные части", logo: "/10.png" },
    
    // Next 5 brands with logos (11.png to 15.png)
    { name: "Подшипники", category: "Моторные части", logo: "/11.png" },
    { name: "Комплект прокладок", category: "Моторные части", logo: "/12.png" },
    { name: "Вкладыши", category: "Моторные части", logo: "/13.png" },
    { name: "Поршневые кольца", category: "Моторные части", logo: "/14.png" },
    { name: "Детали сцепления", category: "Моторные части", logo: "/15.png" },
    
    // Cards 16-20 with logos (16.png to 20.png)
    { name: "Фильтры", category: "Моторные части", logo: "/16.png" },
    { name: "Подшипники", category: "Моторные части", logo: "/17.png" },
    { name: "TONG HONG GASKETS", category: "Моторные части", logo: "/tong hong.png" },
    { name: "Переключатель давление масла", category: "Моторные части", logo: "/20.png" },
    
    // Cards 21-25 with logos (21.png to 25.png)
    { name: "Все компоненты двигателя", category: "Моторные части", logo: "/21.png" },
    { name: "Диск сцепление", category: "Моторные части", logo: "/23.png" },
    { name: "Все компоненты двигателя", category: "Моторные части", logo: "/24.png" },
    { name: "Топливный насос", category: "Моторные части", logo: "/22.png" },
    { name: "Сальники", category: "Моторные части", logo: "/musashi.png" },
    { name: "Ремень ГРМ", category: "Моторные части", logo: "/27.png" },
    { name: "Цепь ГРМ", category: "Моторные части", logo: "/28.png" },
    { name: "Свечи зажигания", category: "Моторные части", logo: "/koito.png" },
    { name: "Подшипники", category: "Моторные части", logo: "/30.png" },
    { name: "Клапан двигателя", category: "Моторные части", logo: "/31.png" },
    { name: "Ремкомплект цепь ГРМ", category: "Моторные части", logo: "/32.png" },
    { name: "Натяжитель цепи", category: "Моторные части", logo: "/33.png" },
    { name: "Ремень ГРМ", category: "Моторные части", logo: "/34.png" },
    { name: "Катушка зажигания", category: "Моторные части", logo: "/35.png" },
    { name: "Цепь ГРМ", category: "Моторные части", logo: "/36.png" },
  ];

  // Ходовые части - 6 карточек
  const hodovyeBrands = [
    { name: "", category: "Ходовые части", logo: "/1 copy.png" },
    { name: "", category: "Ходовые части", logo: "/2 copy.png" },
    { name: "", category: "Ходовые части", logo: "/3 copy.png" },
    { name: "Амортизаторы", category: "Ходовые части", logo: "/4 copy.png" },
    { name: "Амортизаторы", category: "Ходовые части", logo: "/5 copy.png" },
    { name: "Амортизаторы", category: "Ходовые части", logo: "/6 copy.png" },
  ];

  // Тормозные части и трансмиссии - 5 карточек
  const tormoznyeBrands = [
    { name: "", category: "Тормозные колодки", logo: "/tormoz 1.png" },
    { name: "", category: "Тормозные диски", logo: "/tormoz 2.png" },
    { name: "Гидравлические части тормоза", category: "Тормозная жидкость", logo: "/tormoz 3.png" },
    { name: "", category: "Трансмиссионное масло", logo: "/tormoz 4.png" },
    { name: "", category: "Сцепление", logo: "/tormoz 5.png" },
  ];

  // Кузовные части / Рестайлинг - 4 карточки
  const kuzovnyeBrands = [
    { name: "Кузовные компоненты", category: "Бамперы", logo: "/kuzovnie 1.png" },
    { name: "Фары", category: "Фары", logo: "/kuzovnie 2.png" },
    { name: "Фары", category: "Зеркала", logo: "/kuzovnie 3.png" },
    { name: "Кузовные части", category: "Молдинги", logo: "/kuzovnie 4.png" },
  ];

  return (
    <section id="brands" className="py-20 relative bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 tracking-tight">
            НАШИ <span className="text-[#144374]">БРЕНДЫ</span>
          </h2>
          <div className="w-24 h-1 bg-[#144374] mx-auto mb-8"></div>
        </div>

        {/* All Brands Grid - Прямоугольные карточки */}
        <div className="relative z-10">
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {/* Моторные части */}
            {motorBrands.map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`}
                className="group brand-card-animated"
                style={{ animationDelay: `${2 + index * 0.05}s` }}
              >
                {/* Прямоугольная карточка с градиентом */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-1 hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 flex items-center justify-center overflow-hidden border border-[#144374]/20 hover:border-[#144374]/40 relative shadow-lg hover:shadow-[#144374]/10 hover:shadow-xl transform hover:scale-105" style={{ width: '140px', height: '100px' }}>
                  {brand.logo ? (
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-cover max-w-none filter brightness-110 contrast-110 rounded-lg"
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        imageRendering: 'crisp-edges',
                        WebkitImageRendering: 'crisp-edges',
                        msImageRendering: 'crisp-edges'
                      }}
                    />
                  ) : (
                    <div className="text-black font-bold text-sm text-center leading-tight break-words p-1">
                      {brand.name}
                    </div>
                  )}
                  
                  {/* Gradient Shadow - всегда показывается */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl py-2">
                    {brand.name && (
                      <div className="text-white text-xs font-bold text-center px-1">
                        {brand.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Ходовые части */}
            {hodovyeBrands.map((brand, index) => (
              <div 
                key={`hodovye-${brand.name}-${index}`}
                className="group brand-card-animated"
                style={{ animationDelay: `${3.7 + index * 0.05}s` }}
              >
                {/* Прямоугольная карточка с градиентом */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-1 hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 flex items-center justify-center overflow-hidden border border-[#144374]/20 hover:border-[#144374]/40 relative shadow-lg hover:shadow-[#144374]/10 hover:shadow-xl transform hover:scale-105" style={{ width: '140px', height: '100px' }}>
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-cover max-w-none filter brightness-110 contrast-110 rounded-lg"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      imageRendering: 'crisp-edges',
                      WebkitImageRendering: 'crisp-edges',
                      msImageRendering: 'crisp-edges'
                    }}
                  />
                  
                  {/* Gradient Shadow - точно такая же как у карточек с названиями */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl py-2">
                    <div className="text-white text-xs font-bold text-center px-1">
                      {brand.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Тормозные части и трансмиссии */}
            {tormoznyeBrands.map((brand, index) => (
              <div 
                key={`tormoznye-${brand.name}-${index}`}
                className="group brand-card-animated"
                style={{ animationDelay: `${4 + index * 0.05}s` }}
              >
                {/* Прямоугольная карточка с градиентом */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-1 hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 flex items-center justify-center overflow-hidden border border-[#144374]/20 hover:border-[#144374]/40 relative shadow-lg hover:shadow-[#144374]/10 hover:shadow-xl transform hover:scale-105" style={{ width: '140px', height: '100px' }}>
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-cover max-w-none filter brightness-110 contrast-110 rounded-lg"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      imageRendering: 'crisp-edges',
                      WebkitImageRendering: 'crisp-edges',
                      msImageRendering: 'crisp-edges'
                    }}
                  />
                  
                  {/* Gradient Shadow - точно такая же как у карточек с названиями */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl py-2">
                    <div className="text-white text-xs font-bold text-center px-1">
                      {brand.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Кузовные части / Рестайлинг */}
            {kuzovnyeBrands.map((brand, index) => (
              <div 
                key={`kuzovnye-${brand.name}-${index}`}
                className="group brand-card-animated"
                style={{ animationDelay: `${4.3 + index * 0.05}s` }}
              >
                {/* Прямоугольная карточка с градиентом */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-1 hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 flex items-center justify-center overflow-hidden border border-[#144374]/20 hover:border-[#144374]/40 relative shadow-lg hover:shadow-[#144374]/10 hover:shadow-xl transform hover:scale-105" style={{ width: '140px', height: '100px' }}>
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-cover max-w-none filter brightness-110 contrast-110 rounded-lg"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      imageRendering: 'crisp-edges',
                      WebkitImageRendering: 'crisp-edges',
                      msImageRendering: 'crisp-edges'
                    }}
                  />
                  
                  {/* Gradient Shadow - точно такая же как у карточек с названиями */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl py-2">
                    <div className="text-white text-xs font-bold text-center px-1">
                      {brand.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Моторное масло */}
            {[
              { name: "Моторное масло", category: "Синтетическое масло", logo: "/royal super 2.png" },
              { name: "Моторные масла", category: "Полусинтетическое масло", logo: "/lukoil 2.png" },
              { name: "Моторное масло", category: "Минеральное масло", logo: "/drivol 2.png" },
              { name: "Топливный насос", category: "Топливная система", logo: "/fd elecman.png" },
              { name: "Моторное масло", category: "Премиальное масло", logo: "/eneos.png" },
              { name: "Моторное масло", category: "Премиальное масло", logo: "/total 2.png" },
              { name: "Поршни и гильзы", category: "Моторные части", logo: "/toto.jpg" },
              { name: "Моторные масла", category: "Оригинальное масло", logo: "/Toyota oil 2png.png" },
              { name: "Моторное масло", category: "Синтетическое масло", logo: "/Valvoline 2.png" },
              { name: "Фильтры", category: "Фильтрация", logo: "/vic.jpg" },
            ].map((brand, index) => (
              <div 
                key={`oil-${brand.name}-${index}`}
                className="group brand-card-animated"
                style={{ animationDelay: `${4.5 + index * 0.05}s` }}
              >
                {/* Прямоугольная карточка с градиентом */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-1 hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 flex items-center justify-center overflow-hidden border border-[#144374]/20 hover:border-[#144374]/40 relative shadow-lg hover:shadow-[#144374]/10 hover:shadow-xl transform hover:scale-105" style={{ width: '140px', height: '100px' }}>
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-cover max-w-none filter brightness-110 contrast-110 rounded-lg"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      imageRendering: 'crisp-edges',
                      WebkitImageRendering: 'crisp-edges',
                      msImageRendering: 'crisp-edges'
                    }}
                  />
                  
                  {/* Gradient Shadow - всегда показывается */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl py-2">
                    <div className="text-white text-xs font-bold text-center px-1">
                      {brand.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};