import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../../lib/api';
import { Plus, Trash2, Edit, FileText, Upload } from 'lucide-react';
import { formatDmy } from '../../lib/date';

export default function ManageNotices() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        pdf: null
    });

    const fetchNotices = async () => {
        try {
            const res = await api.get('/admin/notices');
            setNotices(res.data);
        } catch (error) {
            console.error('Failed fetching notices', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    useEffect(() => {
        if (!isModalOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);

        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, pdf: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            if (formData.pdf) {
                data.append('pdf', formData.pdf);
            }

            await api.post('/admin/notices', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsModalOpen(false);
            setIsCategoryOpen(false);
            setFormData({ title: '', description: '', category: 'General', pdf: null });
            fetchNotices();
        } catch (error) {
            console.error('Failed to create notice', error);
        }
    };

    const deleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        try {
            await api.delete(`/admin/notices/${id}`);
            fetchNotices();
        } catch (error) {
            console.error('Failed to delete notice', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Notice Board Records</h2>
                    <p className="text-sm text-slate-500 mt-1">Publish and manage official school announcements.</p>
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setIsCategoryOpen(false);
                    }}
                    className="flex items-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                    <Plus size={18} className="mr-2" /> Publish Notice
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Attachment</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 tracking-wider">Actions</th>
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
                        ) : notices.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                                    No notices published yet.
                                </td>
                            </tr>
                        ) : (
                            notices.map((notice) => (
                                <tr key={notice.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {formatDmy(notice.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900 line-clamp-1">{notice.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                                            {notice.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {notice.pdf_path ? (
                                            <span className="flex items-center text-primary-600 font-medium">
                                                <FileText size={16} className="mr-1" /> PDF Attached
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-primary-200">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => deleteNotice(notice.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200">
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
                        setIsCategoryOpen(false);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">Publish New Notice</h3>
                            <p className="text-sm text-slate-500">Fill in the details to broadcast a new announcement.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Notice Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="e.g. Final Examination Schedule"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Category *</label>
                                <div className="relative" ref={categoryDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryOpen(prev => !prev)}
                                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-left text-slate-700 shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    >
                                        {{
                                            General: 'General Announcement',
                                            Academics: 'Academics',
                                            Events: 'Events & Holidays',
                                            Administrative: 'Administrative'
                                        }[formData.category] || 'General Announcement'}
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">v</span>
                                    </button>
                                    {isCategoryOpen && (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                                            <div className="py-1">
                                                {[
                                                    { value: 'General', label: 'General Announcement' },
                                                    { value: 'Academics', label: 'Academics' },
                                                    { value: 'Events', label: 'Events & Holidays' },
                                                    { value: 'Administrative', label: 'Administrative' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, category: opt.value }));
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2 text-left text-sm transition ${
                                                            formData.category === opt.value
                                                                ? 'bg-primary-600 text-white'
                                                                : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                    placeholder="Brief details about the notice..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Attach PDF Document</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary-400 transition-colors bg-slate-50 group relative">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-10 w-10 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label htmlFor="pdf-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 px-1">
                                                <span>Upload a file</span>
                                                <input id="pdf-upload" name="pdf" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500 tracking-wide mt-2">
                                            {formData.pdf ? formData.pdf.name : 'PDF up to 5MB'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsCategoryOpen(false);
                                    }}
                                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Publish Notice
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
