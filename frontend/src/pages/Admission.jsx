import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Send } from 'lucide-react';

const Admission = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div>
      <PageHeader
        title="Admission 2024-25"
        subtitle="Join the Jamia Al Furqan family. Start your educational journey with us today."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
      />
      <section className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-4 max-w-xl">
           <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Online Admission Enquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Student's Full Name *</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50 focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Class Applying For *</label>
                      <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50 focus:bg-white">
                        <option value="">Select a Class</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Class X">Class X</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                      {loading ? 'Submitting...' : <>Submit Enquiry <Send size={20} /></>}
                    </button>
                  </form>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Admission;
