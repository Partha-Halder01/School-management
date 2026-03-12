import React from 'react';
import PageHeader from '../components/PageHeader';
import { Download, Trophy, Star } from 'lucide-react';

const resultsData = [
  { id: 1, year: '2023', exam: 'Annual Examination', class: 'Class X', date: 'May 15, 2023', passPercentage: 98.5, topScore: '99.2%', file: '#' },
];

const Results = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Examination Results"
        subtitle="Celebrating academic excellence and the hard work of our students."
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Trophy className="text-primary-500" /> Result Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resultsData.map((result) => (
                    <div key={result.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-3 border border-primary-200">
                            {result.year} | {result.class}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{result.exam}</h3>
                          <div className="flex items-center text-gray-500 text-sm gap-2">
                            Published: {result.date}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center min-w-[80px]">
                          <div className="text-xs text-gray-500 font-bold uppercase mb-1">Pass %</div>
                          <div className="text-xl font-extrabold text-green-600">{result.passPercentage}%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-secondary-500" />
                          <span className="text-sm font-medium text-gray-600">Top Score: <strong className="text-gray-900">{result.topScore}</strong></span>
                        </div>
                        <a href={result.file} className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors border border-primary-100">
                          <Download size={16} /> Download
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Results;