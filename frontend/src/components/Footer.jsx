import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, GraduationCap, ArrowRight, Heart, ChevronDown } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Academics', path: '/academics' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
];

const resources = [
  { name: 'Notice', path: '/notices' },
  { name: 'Admission', path: '/admission' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <footer className="bg-gray-900 font-sans">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="space-y-5 mb-8 md:mb-0">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </span>
              <span className="text-2xl font-bebas font-bold text-white tracking-wider">
                JAMIA <span className="text-primary-400 font-caveat text-3xl ml-1 tracking-normal">AL FURQAN</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nurturing young minds since 1975. A CBSE-affiliated institution committed to academic excellence, character building, and holistic development.
            </p>
            <div className="flex gap-3 pt-1">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, idx) => (
                <a key={idx} href={social.href} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b border-gray-800 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('quickLinks')}
              className="w-full flex items-center justify-between md:pointer-events-none group"
            >
              <h4 className="text-white text-sm font-bold uppercase tracking-[0.15em] mb-0 md:mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span> Quick Links
              </h4>
              <ChevronDown size={18} className={`text-gray-400 md:hidden transition-transform duration-300 ${openSection === 'quickLinks' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-[grid-template-rows,margin] duration-300 md:!grid-rows-[1fr] md:!mt-0 ${openSection === 'quickLinks' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr] mt-0'}`}>
              <ul className="space-y-3 overflow-hidden">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                      <ArrowRight size={14} className="text-gray-600 group-hover:text-primary-400 transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="border-b border-gray-800 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('resources')}
              className="w-full flex items-center justify-between md:pointer-events-none group"
            >
              <h4 className="text-white text-sm font-bold uppercase tracking-[0.15em] mb-0 md:mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span> Resources
              </h4>
              <ChevronDown size={18} className={`text-gray-400 md:hidden transition-transform duration-300 ${openSection === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-[grid-template-rows,margin] duration-300 md:!grid-rows-[1fr] md:!mt-0 ${openSection === 'resources' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr] mt-0'}`}>
              <ul className="space-y-3 overflow-hidden">
                {resources.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                      <ArrowRight size={14} className="text-gray-600 group-hover:text-primary-400 transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between md:pointer-events-none group"
            >
              <h4 className="text-white text-sm font-bold uppercase tracking-[0.15em] mb-0 md:mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span> Contact
              </h4>
              <ChevronDown size={18} className={`text-gray-400 md:hidden transition-transform duration-300 ${openSection === 'contact' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-[grid-template-rows,margin] duration-300 md:!grid-rows-[1fr] md:!mt-0 ${openSection === 'contact' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr] mt-0'}`}>
              <ul className="space-y-4 overflow-hidden">
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 group-hover:bg-primary-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <MapPin size={16} className="text-primary-400" />
                  </div>
                  <span className="text-gray-400 text-sm leading-relaxed">East Fatepur, P.O: Magnavita, P.S: Karandighi, Dist-Uttar Dinajpur (WB), India, Pin-733201</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 group-hover:bg-primary-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={16} className="text-primary-400" />
                  </div>
                  <a href="tel:+916295137443" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">6295137443 / 9733412486</a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 group-hover:bg-primary-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail size={16} className="text-primary-400" />
                  </div>
                  <a href="mailto:jamiaalfurqan01@gmail.com" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">jamiaalfurqan01@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Jamia Al Furqan. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
            <span className="text-gray-700">|</span>
            <a href="https://www.adozeal.in/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">Developed by Partha adozeal <Heart size={12} className="text-red-500 fill-red-500" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
