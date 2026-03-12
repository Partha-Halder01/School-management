import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera } from 'lucide-react';

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get('/galleries');
                setImages(res.data);
            } catch (error) {
                console.error('Failed fetching gallery', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    return (
        <div className="bg-[#f8fafc] font-sans antialiased overflow-hidden">

            {/* Parallax Hero */}
            <section ref={heroRef} className="relative h-[50vh] flex items-center justify-center overflow-hidden pt-20">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img src="/images/indian_school_activity_1772721546241.png" alt="Gallery" className="w-full h-full object-cover scale-[1.1]" />
                </motion.div>
                <div className="relative z-20 text-center text-white px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-bebas font-bold tracking-widest drop-shadow-2xl">
                            GALLERY <span className="text-primary-400 font-caveat lowercase text-6xl md:text-8xl tracking-normal block -mt-2">moments captured</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center flex-col items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading gallery...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No media available yet</h3>
                        <p className="text-gray-500">Check back soon!</p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {images.map((img, idx) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                                className="break-inside-avoid group overflow-hidden rounded-2xl shadow-sm bg-gray-200 relative cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={`/storage/${img.image_path}`}
                                    alt={img.title}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-bold text-lg leading-tight">{img.title}</h3>
                                            <span className="text-primary-300 text-sm mt-1">{img.category?.name || 'General'}</span>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                            <ZoomIn size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 backdrop-blur-sm p-2 rounded-full transition-colors z-10" onClick={() => setSelectedImage(null)}>
                            <X size={28} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={`/storage/${selectedImage.image_path}`}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white">
                            <h3 className="text-2xl font-bebas font-bold tracking-wide">{selectedImage.title}</h3>
                            <p className="text-primary-400 text-sm mt-1">{selectedImage.category?.name || 'General'}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
