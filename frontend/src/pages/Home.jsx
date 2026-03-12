import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Users, Trophy, GraduationCap, MapPin, Calendar, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "Welcome to Jamia Al Furqan",
    subtitle: "Empowering minds, shaping the future. Experience world-class education.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
    ctaText: "Discover More",
    ctaLink: "/about"
  },
  {
    id: 2,
    title: "Admissions Open 2024-25",
    subtitle: "Join our community of learners. Limited seats available for the upcoming academic year.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    ctaText: "Apply Now",
    ctaLink: "/admission"
  }
];

const highlights = [
  { icon: <BookOpen className="w-10 h-10 text-primary-600" />, title: "Modern Curriculum", description: "Updated syllabus focusing on holistic development and practical knowledge." },
  { icon: <Users className="w-10 h-10 text-secondary-500" />, title: "Expert Faculty", description: "Highly qualified and experienced teachers dedicated to student success." },
  { icon: <Trophy className="w-10 h-10 text-primary-600" />, title: "Sports & Co-curricular", description: "Excellent facilities for overall physical and mental development." },
  { icon: <GraduationCap className="w-10 h-10 text-secondary-500" />, title: "100% Result", description: "Consistent track record of academic excellence in board examinations." }
];

const notices = [
  { id: 1, title: "Final Term Examination Schedule", date: "Oct 15, 2023", category: "Academic", isNew: true },
  { id: 2, title: "Annual Sports Meet 2023", date: "Oct 10, 2023", category: "Event", isNew: true },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="w-full">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0 parallax-bg"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 drop-shadow-md">
                  {slides[currentSlide].subtitle}
                </p>
                <Link
                  to={slides[currentSlide].ctaLink}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(2,132,199,0.5)]"
                >
                  {slides[currentSlide].ctaText}
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm">
          <ChevronRight size={32} />
        </button>
      </section>

      {/* Highlights Section */}
      <section className="relative z-20 -mt-20 px-4 mb-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 border-b-4 border-primary-500"
              >
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Board Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">Notice Board</h2>
                </div>
                <Link to="/notices" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 font-medium transition-colors">
                  View All <ArrowRight size={18} />
                </Link>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="space-y-6">
                  {notices.map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex flex-col md:flex-row gap-4 md:items-center justify-between border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-lg text-gray-900 border border-gray-200 text-center min-w-[80px]">
                          <div className="text-xs uppercase font-bold text-primary-500">{notice.date.split(' ')[0]}</div>
                          <div className="text-2xl font-bold">{notice.date.split(' ')[1].replace(',','')}</div>
                        </div>
                        <div>
                          <Link to={`/notices/${notice.id}`} className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {notice.title}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
