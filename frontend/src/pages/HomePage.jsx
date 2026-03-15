import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import { formatDmy } from '../lib/date';
import {
    ArrowRight, BookOpen, Users, Trophy, Calendar, Award,
    GraduationCap, Shield, Lightbulb, Globe, Palette, FlaskConical,
    Dumbbell, Star, CheckCircle, ChevronRight, ChevronDown, ChevronLeft, Quote
} from 'lucide-react';

const stats = [
    { label: 'Year Established', end: 2016, suffix: '', icon: Award, color: 'from-primary-500 to-emerald-400' },
    { label: 'Total Students', end: 1000, suffix: '+', icon: Users, color: 'from-blue-500 to-cyan-400' },
    { label: 'Teachers on Staff', end: 70, suffix: '+', icon: BookOpen, color: 'from-amber-500 to-orange-400' },
    { label: 'Board Pass Rate', end: 100, suffix: '%', icon: Trophy, color: 'from-purple-500 to-pink-400' },
];

function CountUp({ end, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [hasStarted, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const features = [
    { icon: FlaskConical, title: 'STEM Labs', desc: 'Science and robotics spaces where students test ideas and build real projects.' },
    { icon: Globe, title: 'Global Exposure', desc: 'Student exchanges, MUN participation, and meaningful international collaborations.' },
    { icon: Palette, title: 'Arts & Culture', desc: 'Dance, theatre, music, and annual festivals that bring campus life alive.' },
    { icon: Dumbbell, title: 'Sports Academy', desc: 'Expert coaching in cricket, athletics, and swimming with structured practice plans.' },
    { icon: Shield, title: 'Safe Campus', desc: '24/7 monitoring, trained staff, and reliable transport for daily peace of mind.' },
    { icon: Lightbulb, title: 'Smart Classrooms', desc: 'Interactive boards and digital tools that make lessons more engaging.' },
];

const defaultTestimonials = [
    { name: 'Priya Sharma', role: 'Parent of Class 10 Student', text: 'The school has transformed my son. The teachers go beyond academics and focus on character building. Truly grateful for this institution.', stars: 5 },
    { name: 'Rahul Verma', role: 'Alumni, Batch 2020', text: 'My years at Jamia Al Furqan were the best. The faculty mentored me through competitive exams and I got into IIT Delhi. Forever thankful.', stars: 5 },
    { name: 'Dr. Meena Kapoor', role: 'Parent of Class 5 Student', text: 'A world-class learning environment with caring teachers. My daughter absolutely loves going to school every morning.', stars: 5 },
    { name: 'Ankit Patel', role: 'Parent of Class 8 Student', text: 'The emphasis on holistic development sets this school apart. My son has excelled in both academics and sports. The infrastructure is truly world-class.', stars: 5 },
    { name: 'Sunita Devi', role: 'Parent of Class 3 Student', text: 'The pre-primary program is exceptional. The play-based learning approach has made my daughter curious and confident. Teachers are extremely dedicated.', stars: 4 },
    { name: 'Vikram Singh', role: 'Alumni, Batch 2018', text: 'Jamia Al Furqan gave me the foundation to succeed in life. The values, discipline, and knowledge I gained here have been invaluable in my career journey.', stars: 5 },
];

const programs = [
    { title: 'Pre-Primary & Primary', grades: 'Nursery to Class 5', desc: 'Activity-based learning, phonics, mental math, and creative arts to build a strong foundation.', icon: Star },
    { title: 'Middle School', grades: 'Class 6 to Class 8', desc: 'Structured CBSE curriculum with science practicals, coding workshops, and personality development.', icon: BookOpen },
    { title: 'Senior Secondary', grades: 'Class 9 to Class 12', desc: 'Board exam preparation, career counseling, competitive exam coaching, and research projects.', icon: GraduationCap },
];

const fallbackHomeGallery = [
    { id: 'fallback-1', image_path: null, title: 'Student Activity', category: { name: 'Cultural Events' }, src: '/images/indian_school_activity_1772721546241.png' },
    { id: 'fallback-2', image_path: null, title: 'Campus Architecture', category: { name: 'Our Campus' }, src: '/images/parallax_background_1772721566600.png' },
    { id: 'fallback-3', image_path: null, title: 'School Facility', category: { name: 'Modern Labs' }, src: '/images/indian_school_facility_1772721526084.png' },
];

const fallbackNotices = [
    { id: 'fallback-n-1', title: 'Final Semester Examination Schedule Published For All Grades', category: 'Academics', description: 'The final semester examinations will commence from November. Detailed schedule attached for reference.', created_at: '2026-10-15' },
    { id: 'fallback-n-2', title: 'Annual Sports Day Registration Now Open', category: 'Sports', description: 'Register for Inter-House championships in athletics, cricket, basketball, and swimming events.', created_at: '2026-10-12' },
    { id: 'fallback-n-3', title: 'Parent-Teacher Meeting Scheduled for November', category: 'General', description: 'PTM will be held on the first Saturday of November. Attendance is mandatory for all parents.', created_at: '2026-10-10' },
];

const defaultHeroBanner = '/images/indian_school_hero_1772721506683.png';


function TestimonialsCarousel() {
    const [testimonials, setTestimonials] = useState(defaultTestimonials);
    const [isMobile, setIsMobile] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [desktopIdx, setDesktopIdx] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/settings');
                const raw = res.data?.testimonials;
                if (!raw) return;
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setTestimonials(parsed);
                }
            } catch (error) {
                console.error('Failed to load testimonials', error);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const updateViewport = () => {
            setIsMobile(window.innerWidth < 768);
        };
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    useEffect(() => {
        if (!isMobile || testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % testimonials.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [isMobile, testimonials.length]);

    useEffect(() => {
        if (!testimonials.length) {
            setCurrentIdx(0);
            setDesktopIdx(0);
            return;
        }
        setCurrentIdx((prev) => Math.min(prev, testimonials.length - 1));
    }, [testimonials.length]);

    const goNext = () => setCurrentIdx((prev) => (prev + 1) % testimonials.length);
    const goPrev = () => setCurrentIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    const maxDesktopIdx = Math.max(0, testimonials.length - 3);
    const desktopSteps = maxDesktopIdx + 1;
    const goNextDesktop = () => setDesktopIdx((prev) => (prev + 1) % desktopSteps);
    const goPrevDesktop = () => setDesktopIdx((prev) => (prev - 1 + desktopSteps) % desktopSteps);

    const onTouchStart = (e) => {
        setTouchEndX(null);
        setTouchStartX(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e) => setTouchEndX(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const distance = touchStartX - touchEndX;
        if (distance > 50) {
            if (isMobile) goNext();
            else goNextDesktop();
        }
        if (distance < -50) {
            if (isMobile) goPrev();
            else goPrevDesktop();
        }
    };

    useEffect(() => {
        setDesktopIdx((prev) => Math.min(prev, maxDesktopIdx));
    }, [maxDesktopIdx]);

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header + Arrows */}
                <div className="flex flex-col items-center md:flex-row md:items-end justify-between mb-10 md:mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-3">Testimonials</h2>
                        <h3 className="text-4xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">WHAT PARENTS SAY</h3>
                    </div>
                    {isMobile && testimonials.length > 1 && (
                        <div className="flex items-center gap-3">
                            <button onClick={goPrev} className="w-10 h-10 rounded-full border-2 border-primary-500 text-primary-600 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-all">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={goNext} className="w-10 h-10 rounded-full border-2 border-primary-500 text-primary-600 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                    {!isMobile && testimonials.length > 3 && (
                        <div className="flex items-center gap-3">
                            <button onClick={goPrevDesktop} className="w-10 h-10 rounded-full border-2 border-primary-500 text-primary-600 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-all">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={goNextDesktop} className="w-10 h-10 rounded-full border-2 border-primary-500 text-primary-600 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Carousel */}
                <div
                    className="md:hidden overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
                    >
                        {testimonials.map((t, idx) => (
                            <div key={`mobile-${t.name}-${idx}`} className="w-full flex-shrink-0">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md relative overflow-hidden h-full">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-emerald-400"></div>
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                                        <Quote size={20} />
                                    </div>
                                    <div className="flex gap-1 mb-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} className={`${i < (t.stars || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed mb-5 text-sm">{t.text}</p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bebas text-sm tracking-wide shadow-md flex-shrink-0">
                                            {t.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{t.name}</h4>
                                            <p className="text-primary-600 text-xs font-medium truncate">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={`dot-${idx}`}
                                    onClick={() => setCurrentIdx(idx)}
                                    className={`rounded-full transition-all duration-300 ${idx === currentIdx ? 'w-8 h-3 bg-primary-600' : 'w-3 h-3 bg-gray-300 hover:bg-primary-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Carousel (3 per view) */}
                <div
                    className="hidden md:block overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-out -mx-3"
                        style={{ transform: `translateX(-${desktopIdx * (100 / 3)}%)` }}
                    >
                        {testimonials.map((t, idx) => (
                            <div key={`desktop-card-${t.name}-${idx}`} className="w-1/3 flex-shrink-0 px-3 box-border">
                                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-md relative overflow-hidden h-full">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-emerald-400"></div>
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                                        <Quote size={20} />
                                    </div>
                                    <div className="flex gap-1 mb-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} className={`${i < (t.stars || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed mb-5 text-sm md:text-[15px]">{t.text}</p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bebas text-sm md:text-lg tracking-wide shadow-md flex-shrink-0">
                                            {t.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{t.name}</h4>
                                            <p className="text-primary-600 text-xs font-medium truncate">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {desktopSteps > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: desktopSteps }).map((_, idx) => (
                                <button
                                    key={`desktop-dot-${idx}`}
                                    onClick={() => setDesktopIdx(idx)}
                                    className={`rounded-full transition-all duration-300 ${idx === desktopIdx ? 'w-8 h-3 bg-primary-600' : 'w-3 h-3 bg-gray-300 hover:bg-primary-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    const [homeGallery, setHomeGallery] = useState(fallbackHomeGallery);
    const [latestNotices, setLatestNotices] = useState(fallbackNotices);
    const [heroBanner, setHeroBanner] = useState(defaultHeroBanner);
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
    const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
    const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
    const arrowOpacity = useTransform(heroScroll, [0, 0.15], [1, 0]);

    const galleryRef = useRef(null);
    const { scrollYProgress: galleryScroll } = useScroll({
        target: galleryRef,
        offset: ["start end", "end start"]
    });
    const y1 = useTransform(galleryScroll, [0, 1], ["0px", "-100px"]);
    const y2 = useTransform(galleryScroll, [0, 1], ["50px", "-150px"]);
    const y3 = useTransform(galleryScroll, [0, 1], ["0px", "-80px"]);

    const ctaRef = useRef(null);
    const { scrollYProgress: ctaScroll } = useScroll({
        target: ctaRef,
        offset: ["start end", "end start"]
    });
    const ctaY = useTransform(ctaScroll, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        const loadHomeGallery = async () => {
            try {
                const selected = await api.get('/galleries/home');
                if (Array.isArray(selected.data) && selected.data.length > 0) {
                    setHomeGallery(selected.data.slice(0, 3));
                    return;
                }

                const allGallery = await api.get('/galleries');
                if (Array.isArray(allGallery.data) && allGallery.data.length > 0) {
                    setHomeGallery(allGallery.data.slice(0, 3));
                    return;
                }

                setHomeGallery(fallbackHomeGallery);
            } catch (error) {
                console.error('Failed to load home gallery', error);
                setHomeGallery(fallbackHomeGallery);
            }
        };

        loadHomeGallery();
    }, []);

    useEffect(() => {
        const loadLatestNotices = async () => {
            try {
                const res = await api.get('/notices');
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setLatestNotices(res.data.slice(0, 3));
                    return;
                }
                setLatestNotices(fallbackNotices);
            } catch (error) {
                console.error('Failed to load latest notices', error);
                setLatestNotices(fallbackNotices);
            }
        };

        loadLatestNotices();
    }, []);

    useEffect(() => {
        const loadHeroBanner = async () => {
            try {
                const res = await api.get('/settings');
                const banner = res.data?.home_hero_banner;
                if (!banner) {
                    setHeroBanner(defaultHeroBanner);
                    return;
                }
                setHeroBanner(banner.startsWith('http') ? banner : `/storage/${banner}`);
            } catch (error) {
                console.error('Failed to load hero banner setting', error);
                setHeroBanner(defaultHeroBanner);
            }
        };

        loadHeroBanner();
    }, []);

    return (
        <div className="bg-[#f8fafc] font-sans antialiased overflow-hidden">

            {/* ═══════════════════════════════════════════════════════════════════
                1. HERO — Full-screen immersive parallax with navbar blended in
            ═══════════════════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden pb-32">
                <motion.div
                    style={{ y: heroY, scale: heroScale }}
                    className="absolute inset-0 z-0 origin-center"
                >
                    <img
                        src={heroBanner}
                        alt="Indian School Campus"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = defaultHeroBanner; }}
                    />
                </motion.div>

                {/* Clean dark overlay — no colored tints */}
                <div className="absolute inset-0 z-[1] bg-black/50" />

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-28"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-5xl sm:text-7xl md:text-[6.5rem] font-bebas font-bold tracking-[0.06em] text-white leading-[0.95] mb-6 drop-shadow-2xl"
                    >
                        SHAPING <span className="text-primary-400 font-caveat lowercase text-5xl sm:text-7xl md:text-[6rem] tracking-normal">tomorrow's</span>
                        <br />LEADERS TODAY
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl font-light text-white/85 max-w-3xl mx-auto leading-relaxed"
                    >
                        Established in 2016, our institution nurtures academic brilliance, character, and innovation for every learner.
                    </motion.p>

                    {/* Buttons — Apply is colorful green, Explore is clean transparent */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-10"
                    >
                        <Link to="/admission" className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-lg tracking-wide shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                            Apply for Admission <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="px-10 py-4 bg-transparent border-2 border-white/40 hover:border-white/70 text-white rounded-full font-bold text-lg tracking-wide transition-all transform hover:-translate-y-1">
                            Explore Campus
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/70"
                    >
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-400" /> Established 2016</span>
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-400" /> 1000+ Students</span>
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-400" /> Large Campus Area</span>
                    </motion.div>
                </motion.div>

                {/* Scroll arrow — simple animated chevron that fades on scroll */}
                <motion.div
                    style={{ opacity: arrowOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown size={32} className="text-white/60" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                2. STATS INFOGRAPHIC — Overlapping cards with count-up
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-30 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -12, transition: { duration: 0.3 } }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.12, type: 'spring', stiffness: 100 }}
                            className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl shadow-black/5 border border-gray-100 flex flex-col items-center text-center group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 relative overflow-hidden"
                        >
                            {/* Gradient top accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
                            {/* Icon with glow */}
                            <div className="relative mb-4">
                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                                <div className="relative w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform">
                                    <stat.icon size={26} />
                                </div>
                            </div>
                            {/* Counting number */}
                            <span className="text-4xl lg:text-5xl font-bebas font-bold text-gray-900 mb-1 tracking-wider">
                                <CountUp end={stat.end} suffix={stat.suffix} />
                            </span>
                            <span className="text-[11px] lg:text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                3. WELCOME / ABOUT — Full-width split with staggered image grid
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    {/* Left: Large hero image with floating badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="rounded-3xl overflow-hidden shadow-2xl">
                            <img src="/images/indian_school_facility_1772721526084.png" alt="Modern Facility" className="w-full h-[500px] lg:h-[580px] object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        {/* Floating accent badge */}
                        <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-primary-600 rounded-2xl p-6 shadow-2xl shadow-primary-200 text-white text-center">
                            <span className="text-5xl font-bebas font-bold tracking-wider block">2016</span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-200">Established</span>
                        </div>
                        {/* Small secondary image */}
                        <div className="absolute -top-6 -left-6 lg:-left-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden lg:block">
                            <img src="/images/indian_school_activity_1772721546241.png" alt="Activities" className="w-full h-full object-cover" />
                        </div>
                        {/* Decorative dot pattern */}
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 opacity-20 -z-10" style={{ backgroundImage: "radial-gradient(#22c55e 2px, transparent 2px)", backgroundSize: "12px 12px" }}></div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-primary-600"></span> Welcome to Jamia Al Furqan
                        </h2>
                        <h3 className="text-4xl lg:text-5xl font-bebas font-bold text-gray-900 leading-[1.1] mb-8 tracking-wide">
                            BUILDING BRIGHT FUTURES <span className="text-primary-600 font-caveat lowercase text-5xl lg:text-6xl tracking-normal block mt-2">since 2016</span>
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6 text-[17px]">
                            Jamia Al Furqan serves East Fatepur and nearby communities with quality education, discipline, and value-based learning. With 1000+ students and 70+ teachers, the school supports both resident and day boarder pathways.
                        </p>
                        <ul className="space-y-3 mb-10">
                            {['Year Established: 2016', 'Campus Size: Large Area', 'Total Students: 1000+', 'Board Exam Passing Rate: 100%'].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <CheckCircle size={18} className="text-primary-500 mr-3 flex-shrink-0" />
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/about" className="inline-flex items-center bg-primary-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-primary-700 transition-all group shadow-lg shadow-primary-100 hover:-translate-y-0.5 transform">
                            Read Our Story <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                4. ACADEMIC PROGRAMS — Card row
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-4">Academics</h2>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">OUR ACADEMIC PROGRAMS</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {programs.map((prog, idx) => {
                            const colors = [
                                { border: 'border-l-primary-500', bg: 'bg-primary-50', text: 'text-primary-600', hoverBg: 'group-hover:bg-primary-600' },
                                { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600' },
                                { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-600' },
                            ];
                            const c = colors[idx % colors.length];
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -12, transition: { duration: 0.3 } }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                                    className={`relative bg-white rounded-2xl p-8 border-l-4 ${c.border} shadow-lg shadow-gray-200/50 hover:shadow-2xl transition-shadow duration-500 group overflow-hidden`}
                                >
                                    {/* Background decorative number */}
                                    <span className="absolute top-4 right-6 text-7xl font-bebas font-bold text-gray-100 group-hover:text-primary-50 transition-colors duration-300 select-none">0{idx + 1}</span>

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className="relative mb-6">
                                            <div className={`w-16 h-16 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center ${c.hoverBg} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 transform shadow-sm`}>
                                                <prog.icon size={30} />
                                            </div>
                                        </div>

                                        <h4 className="text-2xl font-bebas font-bold text-gray-900 tracking-wide mb-2">{prog.title}</h4>
                                        <span className={`inline-block ${c.text} text-xs font-bold uppercase tracking-wider ${c.bg} px-3 py-1 rounded-full`}>{prog.grades}</span>
                                        <p className="text-gray-500 leading-relaxed mt-4 text-[15px]">{prog.desc}</p>
                                        <Link to="/academics" className={`inline-flex items-center ${c.text} font-bold mt-6 text-sm gap-1 group-hover:gap-3 transition-all`}>
                                            Learn More <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                5. WHY CHOOSE US — Feature grid
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#0d1a2f] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}></div>
                <div className="absolute top-20 -left-12 w-72 h-72 bg-primary-500/12 rounded-full blur-[110px] pointer-events-none"></div>
                <div className="absolute -bottom-16 right-0 w-80 h-80 bg-cyan-500/12 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
                        <h2 className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-primary-300 uppercase tracking-[0.14em] mb-5">Why Families Choose Us</h2>
                        <h3 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
                            Facilities that feel alive, practical, and built for real learning.
                        </h3>
                        <p className="text-slate-300/90 text-sm md:text-base mt-5 leading-relaxed">
                            From labs to arts and sports, every space is designed to help students explore confidently and grow every day.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {features.map((feat, idx) => {
                            const accents = [
                                { border: 'border-emerald-300/30', iconBg: 'bg-emerald-300/10', iconText: 'text-emerald-300', dot: 'bg-emerald-300' },
                                { border: 'border-cyan-300/30', iconBg: 'bg-cyan-300/10', iconText: 'text-cyan-300', dot: 'bg-cyan-300' },
                                { border: 'border-amber-300/30', iconBg: 'bg-amber-300/10', iconText: 'text-amber-300', dot: 'bg-amber-300' },
                                { border: 'border-violet-300/30', iconBg: 'bg-violet-300/10', iconText: 'text-violet-300', dot: 'bg-violet-300' },
                                { border: 'border-rose-300/30', iconBg: 'bg-rose-300/10', iconText: 'text-rose-300', dot: 'bg-rose-300' },
                                { border: 'border-teal-300/30', iconBg: 'bg-teal-300/10', iconText: 'text-teal-300', dot: 'bg-teal-300' },
                            ];
                            const a = accents[idx % accents.length];
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`relative rounded-3xl overflow-hidden border border-white/12 ${a.border} transition-all duration-400 group p-6 lg:p-7 bg-white/[0.045] hover:bg-white/[0.085] hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)]`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={`w-12 h-12 rounded-2xl ${a.iconBg} ${a.iconText} flex items-center justify-center border border-white/10 transition-transform duration-300 group-hover:scale-105`}>
                                                <feat.icon size={22} />
                                            </div>
                                            <span className="text-sm font-semibold tracking-[0.2em] text-white/35">0{idx + 1}</span>
                                        </div>

                                        <h4 className="text-lg lg:text-xl font-semibold text-white tracking-tight mb-2">{feat.title}</h4>
                                        <p className="text-slate-300 text-sm lg:text-[15px] leading-relaxed">{feat.desc}</p>

                                        <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/70">
                                            <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`}></span>
                                            <span>Everyday impact</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section ref={galleryRef} className="py-28 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-4">Campus Life</h2>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">
                            EXPERIENCE <span className="font-caveat text-primary-600 lowercase tracking-normal text-5xl md:text-6xl">the excellence</span>
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                        {homeGallery.map((img, idx) => (
                            <motion.div
                                key={img.id || idx}
                                style={{ y: [y1, y2, y3][idx] }}
                                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${idx === 0 ? 'row-span-2 h-[300px] md:h-full' : 'h-[200px] md:h-[260px]'}`}
                            >
                                <img
                                    src={img.image_path ? `/storage/${img.image_path}` : img.src}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={img.title || 'Gallery Image'}
                                    onError={(e) => { e.currentTarget.src = '/images/indian_school_facility_1772721526084.png'; }}
                                />
                                {/* Overlay with caption */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <span className="inline-block text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">{img.category?.name || 'Campus Life'}</span>
                                        <h4 className="text-white font-bold text-lg font-bebas tracking-wide">{img.title || 'Gallery Image'}</h4>
                                    </div>
                                </div>
                                {/* Border accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialsCarousel />

            {/* ═══════════════════════════════════════════════════════════════════
                8. NOTICE BOARD — Preview
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center md:flex-row md:items-end justify-between mb-10 md:mb-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center md:text-left">
                            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-3">Updates</h2>
                            <h3 className="text-4xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">LATEST NOTICES</h3>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <Link to="/notices" className="mt-4 md:mt-0 flex items-center text-primary-600 font-bold hover:text-primary-800 transition-colors group text-sm">
                                View All Notices
                                <span className="bg-primary-50 p-1.5 md:p-2 rounded-full ml-2 group-hover:bg-primary-100 transition-colors">
                                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-5 md:gap-8">
                        {latestNotices.map((notice, idx) => (
                            <motion.div
                                key={notice.id || idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 md:p-8 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500 group cursor-pointer"
                            >
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6 text-sm font-medium text-gray-500">
                                    <span className="flex items-center text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full text-xs">
                                        <Calendar size={14} className="mr-1.5" />
                                        {formatDmy(notice.created_at)}
                                    </span>
                                    <span className="uppercase tracking-wider text-xs">{notice.category || 'General'}</span>
                                </div>
                                <h4 className="text-xl md:text-2xl font-bold font-bebas tracking-wide text-gray-900 group-hover:text-primary-600 transition-colors mb-3 md:mb-4 line-clamp-2 leading-snug">
                                    {notice.title}
                                </h4>
                                <p className="text-gray-600 mb-4 md:mb-6 line-clamp-2 leading-relaxed text-sm">{notice.description || 'No description available.'}</p>
                                <button className="text-sm font-bold text-gray-900 group-hover:text-primary-600 flex items-center transition-colors">
                                    Read Full Notice <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                9. CTA BANNER — Parallax Background Image
            ═══════════════════════════════════════════════════════════════════ */}
            <section ref={ctaRef} className="relative py-44 md:py-52 overflow-hidden">
                {/* Parallax background image */}
                <motion.div style={{ y: ctaY }} className="absolute inset-0 -top-[30%] -bottom-[30%] z-0">
                    <img src="/images/indian_school_cta_1772805093260.png" alt="Campus" className="w-full h-full object-cover" />
                </motion.div>
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60 z-[1]" />
                <div className="absolute inset-0 opacity-10 z-[2]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "25px 25px" }}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-white tracking-wide mb-6">
                            READY TO JOIN <span className="font-caveat lowercase tracking-normal text-primary-300 block text-6xl md:text-7xl mt-2">our family?</span>
                        </h3>
                        <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">Enroll your child today and give them the foundation for a brilliant future.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/admission" className="px-10 py-4 bg-white text-primary-700 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl hover:-translate-y-1 transform transition-transform">
                                Apply Now
                            </Link>
                            <Link to="/contact" className="px-10 py-4 bg-transparent border-2 border-white/40 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors hover:-translate-y-1 transform transition-transform">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}


