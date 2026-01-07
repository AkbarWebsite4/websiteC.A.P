import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, LogIn, Home, Package, Award, Mail, Phone, User } from 'lucide-react';

/**
 * Header Component - Russian Version
 * Premium navigation with bold styling and WhatsApp CTA
 */
export const HeaderRu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUserStatus = () => {
      const userStr = localStorage.getItem('capCurrentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.full_name || user.email);
        } catch (e) {
          setUserName(null);
        }
      } else {
        setUserName(null);
      }
    };

    checkUserStatus();
    window.addEventListener('storage', checkUserStatus);

    const interval = setInterval(checkUserStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkUserStatus);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Главная', href: '#home', icon: Home },
    { name: 'Продукты', href: '#products', icon: Package },
    { name: 'Бренды', href: '#brands', icon: Award },
    { name: 'О нас', href: '#about', icon: Mail },
    { name: 'Контакты', href: '#contact', icon: Phone }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Здравствуйте, меня интересуют");
    window.open(`https://wa.me/971561747182?text=${message}`, '_blank');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-2xl' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* Mobile Menu Button - Left Corner */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-300 hover:text-black hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Navigation - Centered with absolute positioning */}
            <div className="hidden lg:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-[#144374] font-semibold transition-colors duration-200 relative group tracking-wide nav-item-animated"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#144374] transition-all duration-200 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Login/Register Button - Desktop - Far Right */}
            <div className="hidden lg:flex ml-auto">
              <a
                href="/auth.html"
                className="flex items-center space-x-2 bg-[#144374] hover:bg-[#1e5ba8] text-black px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg"
              >
                {userName ? (
                  <>
                    <User className="w-5 h-5" />
                    <span>{userName}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Регистрация/Вход</span>
                  </>
                )}
              </a>
            </div>

            {/* Login/Register Button - Mobile */}
            <a
              href="/auth.html"
              className="lg:hidden flex items-center space-x-2 bg-[#144374] hover:bg-[#1e5ba8] text-black px-4 py-2 rounded-lg font-semibold transition-colors text-sm ml-auto"
            >
              {userName ? (
                <>
                  <User className="w-4 h-4" />
                  <span>{userName}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Регистрация/Вход</span>
                </>
              )}
            </a>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-[100]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 bottom-0 h-screen w-80 bg-gradient-to-b from-gray-900 to-black border-r border-gray-700 shadow-xl transform transition-transform duration-300 ease-out z-[101] ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-black">Меню</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600/20 hover:text-black transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};