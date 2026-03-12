import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, image }) => {
  return (
    <section className="relative h-[400px] w-full flex items-center justify-center overflow-hidden parallax-bg" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 text-center px-4 max-w-3xl mt-16">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 drop-shadow-sm font-medium"
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-1 w-24 bg-primary-500 mx-auto mt-6 rounded-full"
        ></motion.div>
      </div>
    </section>
  );
};

export default PageHeader;