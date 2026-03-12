import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react';

export default function ManageGallery() {
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        gallery_category_id: '',
        photo: null,
        show_on_home: false,
    });

    const fetchData = async () => {
        try {
            const [imagesRes, catsRes] = await Promise.all([
                api.get('/admin/gallery'),
                api.get('/admin/gallery-categories')
            ]);

            setImages(imagesRes.data);
            setCategories(catsRes.data);
            if (catsRes.data.length > 0) {
                setFormData(prev => ({ ...prev, gallery_category_id: catsRes.data[0].id }));
            }
        } catch (error) {
            console.error('Failed fetching gallery data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!isModalOpen) return;
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isModalOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await api.post('/admin/gallery-categories', { name: newCategoryName, is_active: true });
            setCategories([res.data.data, ...categories]);
            setFormData(prev => ({ ...prev, gallery_category_id: res.data.data.id }));
            setNewCategoryName('');
            setShowAddCategory(false);
            setIsCategoryOpen(false);
        } catch (error) {
            console.error('Failed to create category', error);
            alert('Failed to create category.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.photo || !formData.gallery_category_id) return alert('Photo and Category are required');

        try {
            const data = new FormData();
            data.append('title', formData.title || 'Untitled');
            data.append('gallery_category_id', formData.gallery_category_id);
            data.append('image', formData.photo);
            data.append('show_on_home', formData.show_on_home ? '1' : '0');

            await api.post('/admin/gallery', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsModalOpen(false);
            setIsCategoryOpen(false);
            setFormData(prev => ({ ...prev, title: '', photo: null, show_on_home: false }));
            fetchData();
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image. Please try again.');
        }
    };

    const toggleShowOnHome = async (img) => {
        try {
            await api.put(`/admin/gallery/${img.id}`, { show_on_home: !img.show_on_home });
            setImages(prev =>
                prev.map(item =>
                    item.id === img.id ? { ...item, show_on_home: !item.show_on_home } : item
                )
            );
        } catch (error) {
            console.error('Failed to update homepage visibility', error);
            alert('Failed to update "Show on Home" setting.');
        }
    };

    const deleteImage = async (id) => {
        if (!window.confirm('Delete this image permanently?')) return;
        try {
            await api.delete(`/admin/gallery/${id}`);
            fetchData();
        } catch (error) {
            console.error('Failed to delete image', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Gallery Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Upload and organize campus photos.</p>
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setIsCategoryOpen(false);
                    }}
                    className="flex items-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                    <Plus size={18} className="mr-2" /> Upload Photo
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <ImageIcon size={48} className="mx-auto mb-3 text-slate-300" />
                        <p>No photos uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img.id} className="group relative rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-square bg-slate-100">
                                <img
                                    src={`/storage/${img.image_path}`}
                                    alt={img.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Missing+Image' }}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <p className="text-white font-medium text-sm truncate">{img.title}</p>
                                    <p className="text-slate-300 text-xs truncate capitalize">{img.category?.name || 'General'}</p>
                                </div>
                                {img.show_on_home && (
                                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-md font-semibold z-10">
                                        Home
                                    </span>
                                )}
                                <button
                                    onClick={() => deleteImage(img.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md z-10"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={() => toggleShowOnHome(img)}
                                    className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-md font-semibold z-10 transition-colors ${img.show_on_home ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700/90 hover:bg-slate-800'}`}
                                >
                                    {img.show_on_home ? 'Shown on Home' : 'Show on Home'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">Upload New Photo</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Photo Title (Optional)</label>
                                <input
                                    type="text" name="title" value={formData.title} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Annual Sports Day 2026"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-bold text-slate-700">Category *</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddCategory(!showAddCategory);
                                            setIsCategoryOpen(false);
                                        }}
                                        className="text-xs text-primary-600 hover:text-primary-800 font-semibold cursor-pointer"
                                    >
                                        + New Category
                                    </button>
                                </div>

                                {showAddCategory && (
                                    <div className="flex space-x-2 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <input
                                            type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Category Name (e.g. Sports)" className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                                        />
                                        <button type="button" onClick={handleAddCategory} className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg font-semibold hover:bg-primary-700">
                                            Save
                                        </button>
                                    </div>
                                )}

                                {categories.length > 0 ? (
                                    <div className="relative" ref={categoryDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryOpen(prev => !prev)}
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-left text-slate-700 shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                        >
                                            {categories.find(cat => String(cat.id) === String(formData.gallery_category_id))?.name || 'Select Category'}
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">v</span>
                                        </button>
                                        {isCategoryOpen && (
                                            <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                                <div className="py-1">
                                                    {categories.map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, gallery_category_id: cat.id }));
                                                                setIsCategoryOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2 text-left text-sm transition ${
                                                                String(formData.gallery_category_id) === String(cat.id)
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                                                            }`}
                                                        >
                                                            {cat.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-red-500 font-medium">Please add a new category first.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Image File *</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary-400 transition-colors bg-slate-50 group">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-10 w-10 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500">
                                                <span>Upload a file</span>
                                                <input name="photo" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500 tracking-wide mt-2">
                                            {formData.photo ? formData.photo.name : 'PNG, JPG, GIF up to 5MB'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="show_on_home"
                                    checked={formData.show_on_home}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary-600 border-slate-300 rounded"
                                />
                                <span className="text-sm font-semibold text-slate-700">Show this image on homepage gallery</span>
                            </label>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsCategoryOpen(false);
                                    }}
                                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-md">
                                    Upload Photo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
