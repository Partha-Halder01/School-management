import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, BookOpen, Trophy, Star } from 'lucide-react';

const milestones = [
    { year: '2016', title: 'Foundation', desc: 'Jamia Al Furqan was established to provide value-based, quality education for East Fatepur and nearby communities.' },
    { year: '2018', title: 'Campus Growth', desc: 'Expanded classrooms and core facilities to support increasing student enrollment.' },
    { year: '2020', title: 'Digital Learning', desc: 'Introduced smart teaching practices and technology-enabled learning support.' },
    { year: '2023', title: 'Academic Progress', desc: 'Strengthened academic mentoring and improved board-exam readiness programs.' },
    { year: '2026', title: 'Community Impact', desc: 'Now serving 1000+ students with 70+ teachers across resident and day-boarder pathways.' },
];

const achievements = [
    { icon: Award, value: '2016', label: 'Year Established' },
    { icon: Users, value: '1000+', label: 'Total Students' },
    { icon: BookOpen, value: '70+', label: 'Teachers on Staff' },
    { icon: Trophy, value: '100%', label: 'Board Pass Rate' },
];

const values = [
    { icon: Target, title: 'Our Mission', desc: 'To nurture young minds with a balanced blend of academic rigor, moral values, and life skills, preparing them to become responsible citizens and global leaders.', color: 'primary' },
    { icon: Eye, title: 'Our Vision', desc: 'To be a center of educational excellence that inspires innovation, fosters creativity, and empowers every student to realize their full potential.', color: 'secondary' },
    { icon: Heart, title: 'Our Values', desc: 'Integrity, compassion, perseverance, and respect form the bedrock of our educational philosophy. We cultivate character alongside knowledge.', color: 'primary' },
];

const leaders = [
    { name: 'Dr. Rajesh Sharma', role: 'Principal', initials: 'RS' },
    { name: 'Mrs. Priya Kapoor', role: 'Vice Principal', initials: 'PK' },
    { name: 'Mr. Anil Gupta', role: 'Academic Director', initials: 'AG' },
    { name: 'Dr. Meera Iyer', role: 'Head of Research', initials: 'MI' },
];

export default function AboutPage() {
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
                    <img src="/images/about_hero.png" alt="School Campus" className="w-full h-full object-cover scale-[1.1]" />
                </motion.div>
                <div className="relative z-20 text-center text-white px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-bebas font-bold tracking-widest drop-shadow-2xl">
                            ABOUT <span className="text-primary-400 font-caveat lowercase text-6xl md:text-8xl tracking-normal block -mt-2">our legacy</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto mt-6">
                            Building strong futures through quality education, discipline, and values.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">What Drives Us</h2>
                    <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">OUR FOUNDATION</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${item.color === 'primary' ? 'bg-primary-50 text-primary-600' : 'bg-amber-50 text-amber-600'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} />
                            </div>
                            <h4 className="text-2xl font-bebas font-bold text-gray-900 tracking-wide mb-4">{item.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Achievements Infographic */}
            <section className="py-24 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-4">By The Numbers</h2>
                        <h3 className="text-5xl md:text-7xl font-bebas font-bold text-white tracking-widest">
                            OUR <span className="font-caveat text-primary-400 lowercase tracking-normal text-6xl md:text-8xl block mt-2">achievements</span>
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {achievements.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors"
                            >
                                <div className="w-14 h-14 mx-auto rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mb-4">
                                    <item.icon size={28} />
                                </div>
                                <span className="text-4xl lg:text-5xl font-bebas font-bold text-white tracking-wider block mb-2">{item.value}</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Timeline */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">Our History</h2>
                    <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">THE JOURNEY</h3>
                </div>
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary-200 hidden md:block"></div>
                    <div className="space-y-12 md:space-y-0">
                        {milestones.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className={`md:flex items-center mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                        <span className="text-4xl font-bebas font-bold text-primary-600 tracking-wider">{item.year}</span>
                                        <h4 className="text-xl font-bold text-gray-900 mt-2 mb-3">{item.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex w-8 h-8 rounded-full bg-primary-600 border-4 border-white shadow-lg items-center justify-center absolute left-1/2 -translate-x-1/2">
                                    <Star size={14} className="text-white" />
                                </div>
                                <div className="md:w-1/2"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">The Team</h2>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 tracking-wide">OUR LEADERS</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {leaders.map((person, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-bebas tracking-wider shadow-xl group-hover:scale-105 transition-transform mb-6">
                                    {person.initials}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">{person.name}</h4>
                                <p className="text-primary-600 font-medium mt-1">{person.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section — Parallax */}
            <section ref={ctaRef} className="relative py-44 md:py-52 overflow-hidden">
                <motion.div style={{ y: ctaY }} className="absolute inset-0 -top-[30%] -bottom-[30%] z-0">
                    <img src="/images/indian_school_cta_1772805093260.png" alt="Campus" className="w-full h-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/60 z-[1]" />
                <div className="absolute inset-0 opacity-10 z-[2]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "25px 25px" }}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 className="text-5xl md:text-6xl font-bebas font-bold text-white tracking-wide mb-6">
                            READY TO BE PART OF <span className="font-caveat lowercase tracking-normal text-primary-300 block text-6xl md:text-7xl mt-2">our story?</span>
                        </h3>
                        <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">Join thousands of families who have trusted us with their children's future.</p>
                        <a href="/admission" className="inline-block px-10 py-4 bg-white text-primary-700 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl hover:-translate-y-1 transform transition-transform">
                            Apply for Admission
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
