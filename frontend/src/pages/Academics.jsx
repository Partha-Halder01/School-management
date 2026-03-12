import React from 'react';
import PageHeader from '../components/PageHeader';

const Academics = () => {
  return (
    <div>
      <PageHeader
        title="Academics at Jamia Al Furqan"
        subtitle="Our comprehensive curriculum designed for holistic development."
        image="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
      />
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Classes & Syllabus</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We offer classes from Nursery to XII, with specialized streams in Science, Commerce, and Arts.
            </p>
        </div>
      </section>
    </div>
  );
};

export default Academics;
