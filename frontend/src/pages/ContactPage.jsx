import { useState, useRef } from 'react';
import api from '../lib/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

const contactInfo = [
    { icon: MapPin, title: 'Location', value: 'East Fatepur, P.O: Magnavita, P.S: Karandighi', sub: 'Dist-Uttar Dinajpur (WB), India, Pin-733201' },
    { icon: Phone, title: 'Contact Number', value: '6295137443 / 9733412486', sub: 'Mon–Sat, 8AM – 4PM' },
    { icon: Mail, title: 'Email', value: 'jamiaalfurqan01@gmail.com', sub: 'We reply within 24 hrs' },
];

const faqs = [
    { q: 'What is the admission process?', a: 'Visit our Admission page to fill out the enquiry form. Our team will contact you within 48 hours with the next steps.' },
    { q: 'What are the school timings?', a: 'Regular school hours are 7:30 AM to 2:30 PM for all grades. Extra-curricular activities run from 3:00 PM to 5:00 PM.' },
    { q: 'Is transport facility available?', a: 'Yes, we provide GPS-enabled buses covering 20+ routes across the city with trained conductors and drivers.' },
    { q: 'Can I schedule a campus visit?', a: 'Absolutely! Use the form on this page or call us to schedule a guided campus tour any weekday between 9 AM and 3 PM.' },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    const ctaRef = useRef(null);
    const { scrollYProgress: ctaScroll } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
    const ctaY = useTransform(ctaScroll, [0, 1], ["0%", "30%"]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const response = await api.post('/contact', formData);
            if (response.data) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-[#f8fafc] font-sans antialiased overflow-hidden">

            {/* ═══════════════ HERO ═══════════════ */}
            <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img src="/images/indian_school_facility_1772721526084.png" alt="Contact" className="w-full h-full object-cover scale-[1.1]" />
                </motion.div>
                <div className="relative z-20 text-center text-white px-4 pt-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-bebas font-bold tracking-widest drop-shadow-2xl">
                            CONTACT <span className="text-primary-400 font-caveat lowercase text-6xl md:text-8xl tracking-normal block -mt-2">get in touch</span>
                        </h1>
                        <p className="text-xl font-light text-white/80 max-w-xl mx-auto mt-4">We'd love to hear from you. Reach out and we'll respond as soon as we can.</p>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ CONTACT INFO CARDS ═══════════════ */}
            <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {contactInfo.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                <item.icon size={26} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{item.title}</h3>
                            <p className="text-lg font-bold text-gray-900">{item.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════ FORM + MAP SECTION ═══════════════ */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-5 gap-12 items-start">

                    {/* Left side — Form (3 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div className="bg-primary-600 px-8 py-6">
                            <h2 className="text-3xl font-bebas font-bold text-white tracking-wide flex items-center gap-3">
                                <MessageCircle size={24} /> SEND US A MESSAGE
                            </h2>
                            <p className="text-primary-100 text-sm mt-1">Fill out the form and we'll get back to you within 24 hours.</p>
                        </div>

                        <div className="p-8">
                            {status === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 flex items-start mb-6">
                                    <CheckCircle2 className="w-6 h-6 mr-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-lg mb-1">Message Sent Successfully!</p>
                                        <p>Thank you for reaching out. We'll get back to you soon.</p>
                                        <button onClick={() => setStatus('idle')} className="mt-3 text-green-700 font-bold hover:underline text-sm">Send another message</button>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 flex items-start mb-6">
                                    <AlertCircle className="w-6 h-6 mr-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-lg mb-1">Submission Failed</p>
                                        <p>{errorMessage}</p>
                                    </div>
                                </div>
                            )}

                            {status !== 'success' && (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900" placeholder="Rahul Sharma" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address *</label>
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900" placeholder="rahul@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Subject</label>
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900" placeholder="Admission enquiry, campus visit, etc." />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Message *</label>
                                        <textarea name="message" required rows="5" value={formData.message} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none text-gray-900" placeholder="Tell us how we can help you..."></textarea>
                                    </div>
                                    <button type="submit" disabled={status === 'submitting'} className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0">
                                        {status === 'submitting' ? (
                                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Sending...</span></>
                                        ) : (
                                            <><Send size={18} /><span>Send Message</span></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Right side — Map + Quick Info (2 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Location (click to open map) */}
                        <a
                            href="https://maps.app.goo.gl/ki5rSYUQP2xs24ga8?g_st=aw"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-5 block hover:shadow-2xl transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-gray-900">School Campus</p>
                                    <p className="text-sm text-gray-500">East Fatepur, P.O: Magnavita, P.S: Karandighi, Dist-Uttar Dinajpur (WB), India, Pin-733201</p>
                                    <span className="text-sm font-semibold text-primary-600 mt-2 inline-block">
                                        Open in Google Maps
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Quick contact card */}
                        <div className="bg-primary-600 rounded-3xl p-6 text-white">
                            <h3 className="text-2xl font-bebas font-bold tracking-wide mb-4">NEED IMMEDIATE HELP?</h3>
                            <div className="space-y-4">
                                <a href="tel:+916295137443" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-primary-200">Call Now</p>
                                        <p className="font-bold">6295137443 / 9733412486</p>
                                    </div>
                                </a>
                                <a href="mailto:jamiaalfurqan01@gmail.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-primary-200">Email</p>
                                        <p className="font-bold">jamiaalfurqan01@gmail.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ FAQ SECTION ═══════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-3">FAQ</h2>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">FREQUENTLY ASKED QUESTIONS</h3>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className="border border-gray-200 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                                    <span className={`text-primary-600 text-2xl font-bold flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA — Parallax ═══════════════ */}
            <section ref={ctaRef} className="relative py-44 md:py-52 overflow-hidden">
                <motion.div style={{ y: ctaY }} className="absolute inset-0 -top-[30%] -bottom-[30%] z-0">
                    <img src="/images/indian_school_cta_1772805093260.png" alt="Campus" className="w-full h-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/60 z-[1]" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-white tracking-wide mb-6">
                            VISIT OUR <span className="font-caveat lowercase tracking-normal text-primary-300 block text-6xl md:text-7xl mt-2">campus today</span>
                        </h3>
                        <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">Schedule a guided tour and experience our world-class facilities firsthand.</p>
                        <a href="tel:+911234567890" className="inline-flex items-center px-10 py-4 bg-white text-primary-700 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl hover:-translate-y-1 transform transition-transform gap-3">
                            <Phone size={20} /> Call to Schedule
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
