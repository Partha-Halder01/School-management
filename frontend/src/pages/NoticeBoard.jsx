import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, FileText, Download, Filter, Search } from 'lucide-react';
import { formatDmy } from '../lib/date';

export default function NoticeBoard() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await api.get('/notices');
                setNotices(res.data);
            } catch (error) {
                console.error('Failed to fetch notices:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const categories = ['All', ...new Set(notices.map(notice => notice.category || 'General'))];

    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (notice.description && notice.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || notice.category === activeCategory || (!notice.category && activeCategory === 'General');
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString) => formatDmy(dateString);

    return (
        <div className="bg-[#f8fafc] font-sans antialiased overflow-hidden">

            {/* Parallax Hero */}
            <section ref={heroRef} className="relative h-[50vh] flex items-center justify-center overflow-hidden pt-20">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img src="/images/indian_school_facility_1772721526084.png" alt="Notice Board" className="w-full h-full object-cover scale-[1.1]" />
                </motion.div>
                <div className="relative z-20 text-center text-white px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-bebas font-bold tracking-widest drop-shadow-2xl">
                            NOTICES <span className="text-primary-400 font-caveat lowercase text-6xl md:text-8xl tracking-normal block -mt-2">stay informed</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 flex flex-col md:flex-row gap-6 justify-between items-center"
                >
                    <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Filter size={20} className="text-gray-400 mr-2 flex-shrink-0" />
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                        />
                    </div>
                </motion.div>

                {/* Notices List */}
                {loading ? (
                    <div className="flex justify-center flex-col items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading official notices...</p>
                    </div>
                ) : filteredNotices.length > 0 ? (
                    <div className="space-y-6">
                        {filteredNotices.map((notice, idx) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex items-start flex-1">
                                        <div className="bg-primary-50 p-4 rounded-xl mr-6 hidden sm:flex items-center justify-center border border-primary-100">
                                            <FileText size={32} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className="bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                    {notice.category || 'General'}
                                                </span>
                                                <span className="flex items-center text-sm text-gray-500 font-medium">
                                                    <Calendar size={14} className="mr-1" />
                                                    {formatDate(notice.created_at)}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                                                {notice.title}
                                            </h2>
                                            {notice.description && (
                                                <p className="text-gray-600 line-clamp-3 leading-relaxed">{notice.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    {notice.pdf_path && (
                                        <div className="flex items-center md:items-start md:flex-col justify-end pt-2 md:pt-0">
                                            <a
                                                href={`/storage/${notice.pdf_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-primary-600 hover:text-white text-primary-600 border border-primary-200 px-6 py-3 rounded-xl font-semibold transition-all w-full md:w-auto"
                                            >
                                                <Download size={18} />
                                                <span>Download PDF</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No notices found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
                        <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="mt-6 text-primary-600 font-semibold hover:text-primary-800">
                            Clear all filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
