import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';

const About = () => {
  return (
    <div>
      <PageHeader
        title="About Jamia Al Furqan"
        subtitle="Discover our history, vision, and the people behind our success."
        image="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2069&auto=format&fit=crop"
      />
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our History</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 1998, Jamia Al Furqan began with a simple mission: to provide accessible, high-quality education to our community. Over the past two decades, we have grown from a small institution with just 50 students into a premier educational facility serving thousands.
            </p>
        </div>
      </section>
    </div>
  );
};

export default About;
