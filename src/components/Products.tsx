import React from 'react';
import { Wrench, Car, Droplets, Shield, Award, Store, Filter, Zap, Disc } from 'lucide-react';

export const Products: React.FC = () => {
  const products = [
    {
      icon: Droplets,
      title: "Моторные части",
      description: "Высококачественные компоненты двигателя для максимальной защиты и производительности вашего автомобиля.",
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
      description: "Качественные кузовные элементы и аксессуары для восстановления и улучшения внешнего вида автомобиля.",
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 tracking-tight">
            ПРЕМИАЛЬНЫЕ <span className="text-blue-500">АВТОЗАПЧАСТИ</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя наш полный ассортимент высококачественных автомобильных запчастей и аксессуаров от ведущих мировых производителей
          </p>
        </div>

        {/* Products Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.title}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-500 hover:scale-105 border border-white/20"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
              
              {/* Product Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-400 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Products - Wide Format */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {additionalProducts.map((product, index) => (
            <div 
              key={product.title}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-500 hover:scale-105 border border-white/20"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-blue-500 p-3 rounded-full">
                  {index === 0 ? <Award className="w-6 h-6 text-black" /> : <Store className="w-6 h-6 text-black" />}
                </div>
              </div>
              
              {/* Product Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-blue-400 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;