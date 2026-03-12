import React from 'react';
import PageHeader from '../components/PageHeader';
import { Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team."
        image="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-t-8 border-primary-500 relative overflow-hidden">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Send a Message</h3>
                <p className="text-gray-500 mb-8">Fill out the form below and we will contact you shortly.</p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Your Name *</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email Address *</label>
                      <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Message *</label>
                    <textarea rows="5" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all resize-none"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    Send Message <Send size={20} />
                  </button>
                </form>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;