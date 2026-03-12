import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../../lib/api';
import { Plus, Trash2, Edit, Quote, Star } from 'lucide-react';

const defaultTestimonials = [
    {
        name: 'Priya Sharma',
        role: 'Parent of Class 10 Student',
        text: 'The school has transformed my son. The teachers go beyond academics and focus on character building. Truly grateful for this institution.',
        stars: 5
    },
    {
        name: 'Rahul Verma',
        role: 'Alumni, Batch 2020',
        text: 'My years at Jamia Al Furqan were the best. The faculty mentored me through competitive exams and I got into IIT Delhi. Forever thankful.',
        stars: 5
    },
    {
        name: 'Dr. Meena Kapoor',
        role: 'Parent of Class 5 Student',
        text: 'A world-class learning environment with caring teachers. My daughter absolutely loves going to school every morning.',
        stars: 5
    },
    {
        name: 'Ankit Patel',
        role: 'Parent of Class 8 Student',
        text: 'The emphasis on holistic development sets this school apart. My son has excelled in both academics and sports. The infrastructure is truly world-class.',
        stars: 5
    },
    {
        name: 'Sunita Devi',
        role: 'Parent of Class 3 Student',
        text: 'The pre-primary program is exceptional. The play-based learning approach has made my daughter curious and confident. Teachers are extremely dedicated.',
        stars: 4
    },
    {
        name: 'Vikram Singh',
        role: 'Alumni, Batch 2018',
        text: 'Jamia Al Furqan gave me the foundation to succeed in life. The values, discipline, and knowledge I gained here have been invaluable in my career journey.',
        stars: 5
    }
];

const sanitizeStars = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return 5;
    return Math.min(5, Math.max(1, Math.round(num)));
};

export default function ManageTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const ratingDropdownRef = useRef(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        text: '',
        stars: 5
    });

    const fetchTestimonials = async () => {
        try {
            const res = await api.get('/settings');
            let items = [];
            const raw = res.data?.testimonials;
            if (raw) {
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (Array.isArray(parsed)) {
                    items = parsed;
                }
            }
            if (!items.length) items = defaultTestimonials;
            setTestimonials(items);
        } catch (error) {
            console.error('Failed fetching testimonials', error);
            setTestimonials(defaultTestimonials);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (!isModalOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
                setIsRatingOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);

        const handleClickOutside = (event) => {
            if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target)) {
                setIsRatingOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const openCreate = () => {
        setEditingIndex(null);
        setFormData({ name: '', role: '', text: '', stars: 5 });
        setIsRatingOpen(false);
        setIsModalOpen(true);
    };

    const openEdit = (idx) => {
        const t = testimonials[idx];
        setEditingIndex(idx);
        setFormData({
            name: t?.name || '',
            role: t?.role || '',
            text: t?.text || '',
            stars: sanitizeStars(t?.stars)
        });
        setIsRatingOpen(false);
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name.trim(),
            role: formData.role.trim(),
            text: formData.text.trim(),
            stars: sanitizeStars(formData.stars)
        };
        if (!payload.name || !payload.role || !payload.text) {
            return alert('Please fill all fields.');
        }

        const next = [...testimonials];
        if (editingIndex === null) next.unshift(payload);
        else next[editingIndex] = payload;

        try {
            await api.post('/admin/testimonials', { testimonials: next });
            setTestimonials(next);
            setIsRatingOpen(false);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save testimonials.');
        }
    };

    const handleDelete = async (idx) => {
        if (!window.confirm('Delete this testimonial?')) return;
        const next = testimonials.filter((_, i) => i !== idx);
        try {
            await api.post('/admin/testimonials', { testimonials: next });
            setTestimonials(next);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to delete testimonial.');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Quote className="mr-2 text-primary-600" /> Testimonials
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage testimonials shown on the homepage.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                    <Plus size={18} className="mr-2" /> Add Testimonial
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Message</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                                        Loading records...
                                    </div>
                                </td>
                            </tr>
                        ) : testimonials.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                                    No testimonials found.
                                </td>
                            </tr>
                        ) : (
                            testimonials.map((t, idx) => (
                                <tr key={`${t.name}-${idx}`} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{t.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={14} className={i < sanitizeStars(t.stars) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-[420px]">
                                        <p className="line-clamp-2">{t.text}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => openEdit(idx)} className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-primary-200">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(idx)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && createPortal(
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
                    onClick={() => {
                        setIsModalOpen(false);
                        setIsRatingOpen(false);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">{editingIndex === null ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
                            <p className="text-sm text-slate-500">These testimonials appear on the homepage.</p>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="e.g. Priya Sharma"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Role *</label>
                                <input
                                    type="text"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="e.g. Parent of Class 10 Student"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Rating *</label>
                                <div className="relative" ref={ratingDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsRatingOpen(prev => !prev)}
                                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-left text-slate-700 shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    >
                                        {sanitizeStars(formData.stars)} Star{sanitizeStars(formData.stars) > 1 ? 's' : ''}
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">v</span>
                                    </button>
                                    {isRatingOpen && (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                                            <div className="py-1">
                                                {[5, 4, 3, 2, 1].map(v => (
                                                    <button
                                                        key={v}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, stars: v }));
                                                            setIsRatingOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2 text-left text-sm transition ${
                                                            sanitizeStars(formData.stars) === v
                                                                ? 'bg-primary-600 text-white'
                                                                : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                                                        }`}
                                                    >
                                                        {v} Star{v > 1 ? 's' : ''}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Message *</label>
                                <textarea
                                    name="text"
                                    rows="4"
                                    required
                                    value={formData.text}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                    placeholder="Write the testimonial message..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsRatingOpen(false);
                                    }}
                                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Save Testimonial
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

