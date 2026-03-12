import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, FlaskConical, Palette, Trophy, Monitor, Globe, Music, Dumbbell, GraduationCap, TrendingUp, Star, Lightbulb } from 'lucide-react';

const levels = [
    { title: 'KG Class', grades: 'Nursery-KG', desc: 'A joyful early-years program focused on phonics, numbers, storytelling, and social development through guided play.', icon: Star, color: 'from-emerald-400 to-primary-500' },
    { title: 'Primary School', grades: 'Grades 1–5', desc: 'Building strong foundations through play-based and activity-driven learning with an emphasis on literacy, numeracy, and creativity.', icon: Star, color: 'from-primary-500 to-primary-600' },
    { title: 'Middle School', grades: 'Grades 6–8', desc: 'Expanding horizons with a rigorous curriculum, hands-on experiments, and exposure to diverse subjects and co-curricular activities.', icon: BookOpen, color: 'from-primary-600 to-primary-700' },
    { title: 'Secondary School', grades: 'Grades 9–12', desc: 'Preparing for competitive exams and higher education with specialized streams in Science, Commerce, and Humanities.', icon: GraduationCap, color: 'from-primary-700 to-primary-800' },
];

const subjects = [
    { name: 'Mathematics', icon: TrendingUp },
    { name: 'Science', icon: FlaskConical },
    { name: 'English', icon: BookOpen },
    { name: 'Computer Science', icon: Monitor },
    { name: 'Social Studies', icon: Globe },
    { name: 'Art & Design', icon: Palette },
    { name: 'Music', icon: Music },
    { name: 'Physical Education', icon: Dumbbell },
];

const programs = [
    { title: 'STEM Excellence', desc: 'Robotics lab, coding bootcamps, and science olympiad preparation with dedicated mentors.', icon: Lightbulb, stat: '15+ Labs' },
    { title: 'Arts & Culture', desc: 'Theater, dance, visual arts, and annual cultural festivals that celebrate Indian heritage.', icon: Palette, stat: '10+ Clubs' },
    { title: 'Sports Academy', desc: 'Professional coaching in cricket, basketball, athletics, and yoga with national-level representation.', icon: Trophy, stat: '8 Sports' },
    { title: 'Global Connect', desc: 'Student exchange programs, Model UN, and foreign language courses for global exposure.', icon: Globe, stat: '5 Countries' },
];

const stats = [
    { value: '98%', label: 'Board Pass Rate' },
    { value: '85%', label: 'Score 90%+' },
    { value: '120+', label: 'Merit Scholarships' },
    { value: '50+', label: 'Competitions Won' },
];

const feeStructure = [
    {
        title: 'K.G. - VIII',
        rows: [
            { cls: 'K.G.', admission: '5,000 (Day Boarders)', resident: 'N/A', day: '2,000 + Transport' },
            { cls: 'Class I & II', admission: '8,000 (Resident & Day Boarders)', resident: '4,000', day: '2,000 + Transport' },
            { cls: 'Class III, IV & V', admission: '10,000 (Resident & Day Boarders)', resident: '5,000', day: '2,000 + Transport' },
            { cls: 'Class VI, VII & VIII', admission: '12,000', resident: '6,000', day: 'N/A' },
        ],
    },
    {
        title: 'EDADI & HIFZ',
        rows: [
            { cls: 'EDADI', admission: '10,000', resident: '6,000', day: 'N/A' },
            { cls: 'HIFZ + CLASS', admission: '8,000', resident: '5,000', day: 'N/A' },
        ],
    },
];

function AcademicsPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    const ctaRef = useRef(null);
    const { scrollYProgress: ctaScroll } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
    const ctaY = useTransform(ctaScroll, [0, 1], ["0%", "30%"]);

    return (
        <div className="bg-[#f8fafc] font-sans antialiased overflow-hidden">

            {/* Parallax Hero */}
            <section ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-20">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img src="/images/academics_hero.png" alt="Academics" className="w-full h-full object-cover scale-[1.1]" />
                </motion.div>
                <div className="relative z-20 text-center text-white px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-bebas font-bold tracking-widest drop-shadow-2xl">
                            ACADEMICS <span className="text-primary-400 font-caveat lowercase text-6xl md:text-8xl tracking-normal block -mt-2">shaping minds</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto mt-6">
                            A rigorous, holistic curriculum designed to ignite curiosity and excellence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Curriculum Levels */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">Curriculum</h2>
                    <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">OUR PROGRAMS</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {levels.map((level, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-500 group"
                        >
                            <div className={`bg-gradient-to-r ${level.color} p-6 text-white`}>
                                <level.icon size={36} className="mb-3 opacity-80" />
                                <h4 className="text-3xl font-bebas font-bold tracking-wide">{level.title}</h4>
                                <span className="text-sm font-medium opacity-80">{level.grades}</span>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-600 leading-relaxed">{level.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-100/60 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-12">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-3">School Information</h2>
                        <h3 className="text-4xl sm:text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">FEES STRUCTURE</h3>
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-hidden">
                            <div className="px-6 md:px-7 py-5 bg-gradient-to-r from-primary-600 to-emerald-500 text-white">
                                <h4 className="text-3xl md:text-4xl font-bebas font-bold tracking-wide">ALL CLASSES</h4>
                            </div>
                            <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {feeStructure.flatMap(group => group.rows).map((row) => (
                                    <div key={row.cls} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 md:p-5">
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <p className="font-bebas text-2xl md:text-3xl tracking-wide text-gray-900">{row.cls}</p>
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Fees</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm md:text-[15px] text-gray-700">
                                            <div className="bg-white rounded-xl border border-gray-100 p-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Admission</p>
                                                <p className="font-semibold text-gray-900">{row.admission}</p>
                                            </div>
                                            <div className="bg-white rounded-xl border border-gray-100 p-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Monthly (Resident)</p>
                                                <p className="font-semibold text-gray-900">{row.resident}</p>
                                            </div>
                                            <div className="bg-white rounded-xl border border-gray-100 p-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Monthly (Day)</p>
                                                <p className="font-semibold text-gray-900">{row.day}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subjects Grid */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute -top-20 right-10 w-64 h-64 bg-primary-100/70 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 left-10 w-72 h-72 bg-emerald-100/70 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-3">What We Teach</h2>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">
                            CORE <span className="text-primary-600">SUBJECTS</span>
                        </h3>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm md:text-base">
                            A balanced curriculum that builds strong foundations, creativity, and critical thinking.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                        {subjects.map((subj, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: idx * 0.06 }}
                                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-[0_8px_20px_rgba(2,6,23,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(2,6,23,0.12)] transition-all duration-300 group cursor-pointer"
                            >
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 text-primary-700 flex items-center justify-center mb-4 shadow-sm group-hover:from-primary-600 group-hover:to-emerald-500 group-hover:text-white transition-colors">
                                    <subj.icon size={26} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">{subj.name}</h4>
                                <div className="mt-3 w-10 h-1 rounded-full bg-primary-100 mx-auto group-hover:bg-primary-500 transition-colors"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Programs */}
            <section className="py-24 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-4">Beyond Textbooks</h2>
                        <h3 className="text-5xl md:text-7xl font-bebas font-bold text-white tracking-widest">
                            SPECIAL <span className="font-caveat text-primary-400 lowercase tracking-normal text-6xl md:text-8xl block mt-2">programs</span>
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {programs.map((prog, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center flex-shrink-0">
                                        <prog.icon size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-2xl font-bebas font-bold text-white tracking-wide">{prog.title}</h4>
                                            <span className="text-primary-400 font-bold text-sm bg-primary-500/10 px-3 py-1 rounded-full">{prog.stat}</span>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">{prog.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic Results Infographic */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">Results</h2>
                    <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">ACADEMIC EXCELLENCE</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300"
                        >
                            <span className="text-5xl lg:text-6xl font-bebas font-bold text-primary-600 tracking-wider block mb-2">{stat.value}</span>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA — Parallax */}
            <section ref={ctaRef} className="relative py-44 md:py-52 overflow-hidden">
                <motion.div style={{ y: ctaY }} className="absolute inset-0 -top-[30%] -bottom-[30%] z-0">
                    <img src="/images/indian_school_cta_1772805093260.png" alt="Campus" className="w-full h-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/60 z-[1]" />
                <div className="absolute inset-0 opacity-10 z-[2]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "25px 25px" }}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-white tracking-wide mb-6">
                            CURIOUS TO <span className="font-caveat lowercase tracking-normal text-primary-300 block text-6xl md:text-7xl mt-2">learn more?</span>
                        </h3>
                        <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">Download our prospectus or schedule a campus visit to experience our academic environment.</p>
                        <a href="/contact" className="inline-block px-10 py-4 bg-white text-primary-700 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl hover:-translate-y-1 transform transition-transform">
                            Schedule a Visit
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export { AcademicsPage };
export default AcademicsPage;

