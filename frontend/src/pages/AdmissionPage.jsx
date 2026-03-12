import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, FileCheck, ClipboardList, Users, GraduationCap, Phone, Mail } from 'lucide-react';

const steps = [
    { icon: ClipboardList, title: 'Submit Enquiry', desc: 'Fill out the form with student details.' },
    { icon: FileCheck, title: 'Document Review', desc: 'Our team reviews your application.' },
    { icon: Users, title: 'Interview', desc: 'Meet with our admissions counselor.' },
    { icon: GraduationCap, title: 'Enrollment', desc: 'Welcome to the Jamia Al Furqan family!' },
];

export default function AdmissionPage() {
    const [formData, setFormData] = useState({
        candidate_name: '', parent_name: '', phone: '', email: '', class_applied: '', details: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const classDropdownRef = useRef(null);
    const classOptions = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const response = await api.post('/enquiries', formData);
            if (response.data) {
                setStatus('success');
                setFormData({ candidate_name: '', parent_name: '', phone: '', email: '', class_applied: '', details: '' });
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        const onClickOutside = (event) => {
            if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
                setIsClassDropdownOpen(false);
            }
        };

        const onEscape = (event) => {
            if (event.key === 'Escape') {
                setIsClassDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onEscape);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onEscape);
        };
    }, []);

    return (
        <div className="bg-[#f8fafc] font-sans antialiased overflow-hidden">
            <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img src="/images/indian_school_hero_1772721506683.png" alt="Admission" className="w-full h-full object-cover scale-[1.1]" />
                </motion.div>
                <div className="relative z-20 text-center text-white px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-bebas font-bold tracking-widest drop-shadow-2xl">
                            ADMISSION <span className="text-primary-400 font-caveat lowercase text-6xl md:text-8xl tracking-normal block -mt-2">begin your journey</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">How It Works</h2>
                    <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">ADMISSION PROCESS</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.12 }}
                            className="relative text-center"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                                <step.icon size={32} />
                            </div>
                            <span className="absolute top-0 right-0 md:right-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                            <h4 className="text-xl font-bebas font-bold text-gray-900 tracking-wide mb-2">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-5">
                            <div className="md:col-span-2 bg-gradient-to-br from-primary-700 to-primary-900 p-10 text-white flex flex-col justify-between">
                                <div>
                                    <h3 className="text-3xl font-bebas font-bold tracking-wide mb-6">CONTACT INFORMATION</h3>
                                    <p className="text-primary-200 mb-8 leading-relaxed">
                                        Have questions about the admission process? Reach out directly.
                                    </p>
                                    <div className="space-y-6">
                                        <div className="flex items-center">
                                            <div className="bg-primary-600 p-3 rounded-full mr-4"><Phone size={20} /></div>
                                            <div>
                                                <h4 className="font-semibold">Phone</h4>
                                                <p className="text-primary-200">9733412486</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="bg-primary-600 p-3 rounded-full mr-4"><Mail size={20} /></div>
                                            <div>
                                                <h4 className="font-semibold">Email</h4>
                                                <p className="text-primary-200">jamiaalfurqan01@gmail.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 hidden md:block">
                                    <img src="/images/indian_school_activity_1772721546241.png" alt="Students" className="rounded-2xl shadow-lg border-4 border-primary-600/50 opacity-90" />
                                </div>
                            </div>

                            <div className="md:col-span-3 p-10">
                                <h3 className="text-3xl font-bebas font-bold text-gray-900 tracking-wide mb-8 border-b pb-4">SUBMIT ENQUIRY</h3>

                                {status === 'success' && (
                                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 flex items-start mb-8">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Enquiry Submitted!</h4>
                                            <p>Our admissions counselor will contact you within 24 hours.</p>
                                        </div>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-5 flex items-start mb-8">
                                        <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Submission Failed</h4>
                                            <p>{errorMessage}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name *</label>
                                            <input type="text" name="candidate_name" required value={formData.candidate_name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Parent/Guardian Name</label>
                                            <input type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} placeholder="e.g. Jane Doe" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="e.g. (123) 456-7890" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Class Applying For *</label>
                                        <div ref={classDropdownRef} className="relative">
                                            <input type="hidden" name="class_applied" value={formData.class_applied} required />
                                            <button
                                                type="button"
                                                onClick={() => setIsClassDropdownOpen((prev) => !prev)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-left text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none flex items-center justify-between"
                                            >
                                                <span>{formData.class_applied || 'Select a class...'}</span>
                                                <span className={`text-slate-500 transition-transform ${isClassDropdownOpen ? 'rotate-180' : ''}`}>v</span>
                                            </button>

                                            {isClassDropdownOpen && (
                                                <div className="absolute z-30 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                                    {classOptions.map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData((prev) => ({ ...prev, class_applied: option }));
                                                                setIsClassDropdownOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left text-sm transition ${
                                                                formData.class_applied === option
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                                                            }`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Details</label>
                                        <textarea name="details" rows="4" value={formData.details} onChange={handleChange} placeholder="Tell us about the student..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={status === 'submitting'} className={`w-full flex items-center justify-center font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all ${status === 'submitting' ? 'bg-primary-400 cursor-not-allowed text-white' : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transform hover:-translate-y-1'}`}>
                                        {status === 'submitting' ? (
                                            <span className="flex items-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>Submitting...</span>
                                        ) : (
                                            <span className="flex items-center">Submit Enquiry <Send className="ml-2 h-5 w-5" /></span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

