import React from 'react';
import { Droplets, Filter, Zap, Disc } from 'lucide-react';

/**
 * Products Component - Russian Version
 * Showcases key product categories with bold, masculine styling
 */
export const ProductsRu: React.FC = () => {
  const products = [
    {
      icon: Droplets,
      title: "Моторные части",
      description: "Высококачественные компоненты для максимальной защиты и производительности вашего автомобиля.",
      image: "/motornie chasti 2.jpg"
    },
    {
      icon: Filter,
      title: "Ходовые части",
      description: "Профессиональные компоненты подвески и ходовой части для комфортной и безопасной езды.",
      image: "/xodovie chasti.jpg"
    },
    {
      icon: Zap,
      title: "Моторное масло",
      description: "Премиальные синтетические и обычные масла для максимальной защиты двигателя и его долговечности.",
      image: "/motornoe maslo 2.jpg"
    },
    {
      icon: Disc,
      title: "Кузовные части",
      description: "Качественные кузовные элементы для восстановления и улучшения внешнего вида автомобиля.",
      image: "/kuzovnie chasti 2.jpg"
    }
  ];

  const additionalProducts = [
    {
      title: "Оригинальные автозапчасти",
      description: "Подлинные OEM запчасти от официальных производителей для гарантированного качества и совместимости.",
      image: "/originall.jpg"
    },
    {
      title: "Автомаркет автозапчасти",
      description: "Широкий ассортимент качественных запчастей по конкурентным ценам для всех марок автомобилей.",
      image: "/avtomarket.jpg"
    }
  ];

  return (
    <section id="products" className="py-20 relative bg-transparent">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/second_background_cap_with_avto_details.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: '-webkit-optimize-contrast',
          WebkitImageRendering: '-webkit-optimize-contrast',
          msInterpolationMode: 'nearest-neighbor'
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-black mb-6 tracking-tight">
            <span className="block sm:inline">ВЫСОКОКАЧЕСТВЕННЫЕ</span>{' '}
            <span className="text-[#144374]">АВТОЗАПЧАСТИ</span>
          </h2>
          <div className="w-24 h-1 bg-[#144374] mx-auto mb-8"></div>
          <p className="text-xl text-black max-w-3xl mx-auto font-medium">
            У нас вы можете приобрести как оригинальные запчасти, так и качественные аналоги мировых брендов — оптом и в розницу.
          </p>
        </div>

        {/* Products Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.title}
              className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-[#144374]"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <img 
                    src={`/znak ${index + 1}.png`}
                    alt={`${product.title} icon`}
                    className="w-52 h-52 object-cover filter brightness-110 contrast-110"
                    style={{ 
                      imageRendering: 'crisp-edges',
                      WebkitImageRendering: 'crisp-edges',
                      msImageRendering: 'crisp-edges'
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#144374] transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-white leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#144374] rounded-xl transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Additional Products - Wide Format */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {additionalProducts.map((product, index) => (
            <div 
              key={product.title}
              className="group relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-blue-500"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Product Image */}
                <div className="relative md:w-1/2 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-6 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-white leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};