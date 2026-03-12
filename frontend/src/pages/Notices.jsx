import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Calendar, FileText } from 'lucide-react';

const noticesData = [
  { id: 1, title: 'Final Term Examination Schedule 2023-24', date: '2023-10-15', category: 'Academic' },
  { id: 2, title: 'Annual Sports Meet 2023 Registration', date: '2023-10-10', category: 'Event' },
];

const Notices = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Notice Board"
        subtitle="Stay updated with the latest announcements, schedules, and events."
        image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Announcements</h2>
            <div className="divide-y divide-gray-100">
                {noticesData.map((notice) => (
                    <div key={notice.id} className="py-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div className="space-y-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border-blue-200 border">{notice.category}</span>
                        <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm gap-1">
                            <Calendar size={14} /> <span>{notice.date}</span>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-primary-600 border-2 border-primary-100 hover:bg-primary-50 transition-all shrink-0">
                        <FileText size={18} /> View PDF
                      </button>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notices;