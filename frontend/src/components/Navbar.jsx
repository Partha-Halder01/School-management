import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, ArrowRight, Home, BookOpen, Image, Bell, Info, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Academics', path: '/academics', icon: BookOpen },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Notices', path: '/notices', icon: Bell },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const navBg = !scrolled
        ? 'bg-transparent border-transparent'
        : 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100';

    const textColor = !scrolled ? 'text-white' : 'text-gray-600';
    const activeColor = !scrolled ? 'text-white font-bold' : 'text-primary-600 font-bold';
    const logoColor = !scrolled ? 'text-white' : 'text-gray-900';
    const logoAccent = !scrolled ? 'text-primary-300' : 'text-primary-600';
    const iconBg = !scrolled ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary-600';
    const hoverColor = !scrolled ? 'hover:text-primary-300' : 'hover:text-primary-600';
    const hamburgerColor = !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${navBg}`}>
                <div className="w-full px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                            <div className={`${iconBg} p-2 rounded-lg text-white shadow-md transition-colors`}>
                                <GraduationCap size={22} />
                            </div>
                            <span className={`text-2xl font-bold font-bebas ${logoColor} tracking-wide transition-colors`}>
                                Jamia <span className={`${logoAccent} font-caveat text-3xl transition-colors`}>Al Furqan</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links — no underline */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`${location.pathname === link.path
                                        ? activeColor
                                        : `${textColor} ${hoverColor}`
                                        } px-3 py-1.5 text-[13px] uppercase tracking-[0.08em] font-medium transition-colors`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Admission CTA */}
                        <div className="hidden lg:flex items-center">
                            <Link
                                to="/admission"
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 ${
                                    !scrolled
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500'
                                        : 'bg-primary-600 text-white shadow-md shadow-primary-200 hover:bg-primary-700'
                                }`}
                            >
                                Admission <ArrowRight size={15} />
                            </Link>
                        </div>

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`lg:hidden inline-flex items-center justify-center p-2 rounded-lg ${hamburgerColor} focus:outline-none transition-colors`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Side Drawer */}
            <div
                className={`fixed top-0 right-0 z-[70] h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                            <GraduationCap size={18} />
                        </div>
                        <span className="text-lg font-bold font-bebas text-gray-900 tracking-wide">
                            Jamia <span className="text-primary-600 font-caveat text-xl">Al Furqan</span>
                        </span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Drawer Links with icons + staggered entrance */}
                <div className="px-4 py-5 space-y-1.5">
                    {navLinks.map((link, idx) => {
                        const isActive = location.pathname === link.path;
                        const IconComp = link.icon;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                                    isActive
                                        ? 'bg-primary-50 text-primary-600 font-bold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                                }`}
                                style={{
                                    animation: isOpen ? `slideIn 0.3s ease-out ${idx * 0.05}s both` : 'none',
                                }}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isActive ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-50'
                                }`}>
                                    <IconComp size={18} />
                                </div>
                                <span className="uppercase">{link.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Drawer Bottom CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/80">
                    <Link
                        to="/admission"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-primary-200 hover:bg-primary-700 transition-colors"
                    >
                        Apply for Admission <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Slide-in animation keyframes */}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </>
    );
}
