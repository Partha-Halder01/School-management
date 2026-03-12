import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { Link, useLocation } from 'react-router-dom';
import { Search, Plus, User, Mail, Phone, MapPin, Edit, Trash2, Calendar, BookOpen, Eye } from 'lucide-react';

export default function ManageStudents() {
    const location = useLocation();
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const classDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        parent_name: '',
        phone: '',
        course_class_id: '',
        roll_no: '',
        address: '',
        dob: '',
        status: 'active'
    });

    const romanToNumber = (value) => {
        const map = {
            I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6,
            VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12
        };
        return map[value] || null;
    };

    const getClassRank = (name = '') => {
        const cleaned = name.trim();
        if (/^LKG$/i.test(cleaned)) return 1;
        if (/^UKG$/i.test(cleaned)) return 2;

        const numericMatch = cleaned.match(/class\s*(\d{1,2})/i);
        if (numericMatch) {
            const num = Number(numericMatch[1]);
            return Number.isFinite(num) ? 2 + num : null;
        }

        const romanMatch = cleaned.match(/class\s*([ivx]{1,4})/i);
        if (romanMatch) {
            const num = romanToNumber(romanMatch[1].toUpperCase());
            return num ? 2 + num : null;
        }

        return null;
    };

    const getClassLabel = (name = '') => {
        const cleaned = name.trim();
        if (/^LKG$/i.test(cleaned)) return 'LKG';
        if (/^UKG$/i.test(cleaned)) return 'UKG';

        const numericMatch = cleaned.match(/class\s*(\d{1,2})/i);
        if (numericMatch) {
            return numericMatch[1];
        }

        const romanMatch = cleaned.match(/class\s*([ivx]{1,4})/i);
        if (romanMatch) {
            const num = romanToNumber(romanMatch[1].toUpperCase());
            return num ? String(num) : cleaned;
        }

        return cleaned;
    };

    const orderedClasses = Array.from(
        classes
            .map(c => ({ ...c, _rank: getClassRank(c.name) }))
            .filter(c => c._rank !== null)
            .sort((a, b) => a._rank - b._rank)
            .reduce((acc, c) => {
                if (!acc.has(c._rank)) acc.set(c._rank, c);
                return acc;
            }, new Map())
            .values()
    );

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
        } catch (error) {
            console.error('Failed fetching students', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await api.get('/admin/classes');
            setClasses(res.data);
        } catch (error) {
            console.error('Failed fetching classes', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    // If route changes while modal is open, close it so the UI never gets stuck dimmed.
    useEffect(() => {
        setShowModal(false);
        setEditingStudent(null);
        setIsClassOpen(false);
        setIsStatusOpen(false);
    }, [location.pathname]);

    // Allow Esc to close the enroll/edit modal.
    useEffect(() => {
        if (!showModal) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
                setIsClassOpen(false);
                setIsStatusOpen(false);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [showModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
                setIsClassOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setIsStatusOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsClassOpen(false);
                setIsStatusOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await api.put(`/admin/students/${editingStudent.id}`, formData);
            } else {
                await api.post('/admin/students', formData);
            }
            setShowModal(false);
            setEditingStudent(null);
            setIsClassOpen(false);
            setIsStatusOpen(false);
            setFormData({
                name: '', email: '', parent_name: '', phone: '',
                course_class_id: '', roll_no: '', address: '', dob: '', status: 'active'
            });
            fetchStudents();
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            ...student,
            course_class_id: student.course_class_id || '',
            dob: student.dob ? student.dob.split('T')[0] : ''
        });
        setIsClassOpen(false);
        setIsStatusOpen(false);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/admin/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error('Failed to delete student', error);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.admission_no && s.admission_no.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Enrolled Students</h2>
                    <p className="text-slate-500">Manage student records and admissions.</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingStudent(null);
                        setIsClassOpen(false);
                        setIsStatusOpen(false);
                        setShowModal(true);
                    }}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-primary-200"
                >
                    <Plus size={20} />
                    <span>Enroll New Student</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email or admission no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student Info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Class & Roll</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Loading students...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">No students found.</td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{student.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {student.admission_no || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900">{student.course_class?.name || 'No Class'}</div>
                                            <div className="text-xs text-slate-500">Roll: {student.roll_no || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 flex items-center">
                                                <Mail size={12} className="mr-1 text-slate-400" /> {student.email}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center mt-1">
                                                <Phone size={12} className="mr-1 text-slate-400" /> {student.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 whitespace-nowrap min-w-[120px]">
                                                <Link to={`/admin/students/${student.id}`} className="inline-flex p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="inline-flex p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-start md:items-center justify-center z-[90] p-3 md:p-4 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={(e) => {
                        // Click outside modal closes it (prevents stuck overlay).
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                            setIsClassOpen(false);
                            setIsStatusOpen(false);
                        }
                    }}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[calc(100dvh-1.5rem)] md:max-h-[90vh] overflow-y-auto mt-2 md:mt-0"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-2xl font-bold text-slate-800">{editingStudent ? 'Edit Student' : 'Enroll New Student'}</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setIsClassOpen(false);
                                    setIsStatusOpen(false);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6 pb-6 md:pb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Parent Name</label>
                                    <input type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Roll No</label>
                                    <input type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2" ref={classDropdownRef}>
                                    <label className="text-sm font-semibold text-slate-700">Class</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsClassOpen(prev => !prev)}
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-left text-slate-700 shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                        >
                                            {formData.course_class_id
                                                ? getClassLabel(orderedClasses.find(c => String(c.id) === String(formData.course_class_id))?.name || '')
                                                : 'Select Class'}
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">v</span>
                                        </button>
                                        {isClassOpen && (
                                            <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                                <div className="py-1">
                                                    {orderedClasses.map(c => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, course_class_id: c.id }));
                                                                setIsClassOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2 text-left text-sm transition ${
                                                                String(formData.course_class_id) === String(c.id)
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                                                            }`}
                                                        >
                                                            {getClassLabel(c.name)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Status</label>
                                    <div className="relative" ref={statusDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsStatusOpen(prev => !prev)}
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-left text-slate-700 shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                        >
                                            {formData.status === 'inactive' ? 'Inactive' : 'Active'}
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">v</span>
                                        </button>
                                        {isStatusOpen && (
                                            <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                                                <div className="py-1">
                                                    {[
                                                        { value: 'active', label: 'Active' },
                                                        { value: 'inactive', label: 'Inactive' }
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, status: opt.value }));
                                                                setIsStatusOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2 text-left text-sm transition ${
                                                                formData.status === opt.value
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
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <textarea name="address" rows="3" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                            </div>
                            <div className="sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 pt-4 pb-1 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setIsClassOpen(false);
                                        setIsStatusOpen(false);
                                    }}
                                    className="px-5 md:px-6 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-7 md:px-10 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition shadow-lg shadow-primary-200">
                                    {editingStudent ? 'Update Record' : 'Enroll Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

