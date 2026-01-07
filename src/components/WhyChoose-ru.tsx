import React from 'react';
import { Shield, Truck, Award, Users } from 'lucide-react';

/**
 * WhyChoose Component - Russian Version
 * Highlights key advantages and trust factors
 */
export const WhyChooseRu: React.FC = () => {
  const reasons = [
    {
      icon: Shield,
      title: "Удобная оплата",
      description: "Удобная оплата через VISA, Master Card, Alif, DC, Kaspi, USDT для вашего комфорта"
    },
    {
      icon: Award,
      title: "За высокий уровень сервиса",
      description: "Профессиональное обслуживание и индивидуальный подход к каждому клиенту"
    },
    {
      icon: Truck,
      title: "Конкурирующие цены для вашего рынка",
      description: "Лучшие цены на рынке без компромиссов в качестве"
    },
    {
      icon: Users,
      title: "Быстрая доставка",
      description: "Гарантируем быструю доставку до вашего карго и полный контроль до вашего склада"
    }
  ];

  return (
    <section id="about" className="py-20 relative bg-transparent">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 tracking-tight">
            ПОЧЕМУ ВЫБИРАЮТ <span className="text-blue-500">C.A.P</span>
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
          <p className="text-xl text-black max-w-3xl mx-auto font-medium">
            Когда важны производительность и надежность, профессионалы доверяют C.A.P.
            за превосходное качество и непревзойденный сервис.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <div 
              key={reason.title}
              className="text-center group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 text-black rounded-full mb-6 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300 transform group-hover:scale-110 shadow-xl">
                <reason.icon className="h-10 w-10" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-black mb-4 group-hover:text-[#144374] transition-colors duration-300">
                {reason.title}
              </h3>
              <p className="text-black leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};