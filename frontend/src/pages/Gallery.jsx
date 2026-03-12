import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { X, ZoomIn, Grid } from 'lucide-react';

const galleryData = [
  { id: 1, category: 'Campus', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2069&auto=format&fit=crop', title: 'Main Building' },
  { id: 2, category: 'Events', url: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop', title: 'Annual Sports Day' },
  { id: 3, category: 'Academics', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop', title: 'Science Lab' },
];

const categories = ['All', 'Campus', 'Events', 'Academics'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = galleryData.filter(
    img => activeCategory === 'All' || img.category === activeCategory
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Photo Gallery"
        subtitle="Explore life at Jamia Al Furqan through our curated collection of moments."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Grid className="text-primary-500" /> Filter Gallery
            </h2>
            <div className="flex bg-white rounded-full p-1.5 shadow-md border border-gray-100 flex-wrap justify-center overflow-hidden">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer border-4 border-white aspect-square"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image.url} alt={image.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 md:p-8">
                        <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full mb-3 shadow-md w-max">
                          {image.category}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{image.title}</h3>
                        <div className="flex items-center gap-2 text-primary-400 font-medium text-sm">
                          <ZoomIn size={16} /> Click to enlarge
                        </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all border border-white/20"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={24} />
            </button>

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white p-2 rounded-2xl shadow-2xl">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 bg-black/60 backdrop-blur-md p-4 md:p-6 rounded-2xl text-white border border-white/10 mx-auto max-w-xl text-center">
                <span className="inline-block px-3 py-1 bg-primary-600/80 text-white text-xs font-bold rounded-full mb-2">
                  {selectedImage.category}
                </span>
                <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
