import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admission', path: '/admission' },
    { name: 'Notices', path: '/notices' },
    { name: 'Results', path: '/results' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      {/* Top Bar */}
      <div className={`hidden lg:flex container mx-auto px-4 justify-between items-center text-sm transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-10 opacity-100 text-white border-b border-white/20 mb-2'}`}>
        <div className="flex space-x-6">
          <span className="flex items-center"><Phone size={14} className="mr-2" /> +1 234 567 8900</span>
          <span className="flex items-center"><Mail size={14} className="mr-2" /> jamiaalfurqan01@gmail.com</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="hover:text-primary-300 transition-colors font-medium">Portal Login</Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${scrolled ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>
              JAF
            </div>
            <span className={`font-bold text-2xl tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Jamia Al Furqan
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  location.pathname === link.path
                    ? (scrolled ? 'text-primary-600 bg-primary-50' : 'text-white bg-white/20')
                    : (scrolled ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-50' : 'text-gray-100 hover:text-white hover:bg-white/10')
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admission" className={`ml-4 px-6 py-2 rounded-full font-bold shadow-md transition-all ${
              scrolled ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white text-primary-600 hover:bg-gray-100'
            }`}>
              Apply Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 rounded-md ${scrolled ? 'text-gray-600' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 flex flex-col px-4 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-3 rounded-md font-medium ${location.pathname === link.path ? 'text-primary-600 bg-primary-50' : 'text-gray-600'}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
