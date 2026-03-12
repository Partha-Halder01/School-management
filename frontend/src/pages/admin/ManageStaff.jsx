import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { Users, Trash2, Plus, ShieldCheck } from 'lucide-react';

export default function ManageStaff() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const roleDropdownRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: 2 });

    // Only Super Admins should hit this component ideally, but protect data anyway
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        if (!showModal) return;
        const handleClickOutside = (event) => {
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
                setIsRoleOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsRoleOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showModal]);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/admin/staff');
            setStaff(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createStaff = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/staff', formData);
            setStaff([res.data.user, ...staff]);
            setShowModal(false);
            setIsRoleOpen(false);
            setFormData({ name: '', email: '', password: '', role_id: 2 });
        } catch (error) {
            const apiError = error.response?.data;
            const validationMessage = apiError?.errors?.email?.[0] || apiError?.errors?.name?.[0] || apiError?.errors?.password?.[0];
            alert(validationMessage || apiError?.message || 'Failed to create staff member.');
        }
    };

    const deleteStaff = async (id) => {
        if (!window.confirm('Are you sure you want to permanently revoke this staff access?')) return;
        try {
            await api.delete(`/admin/staff/${id}`);
            setStaff(staff.filter(s => s.id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete staff member.');
        }
    };

    const getRoleBadge = (role_id) => {
        if (role_id === 2) return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Content Editor</span>;
        if (role_id === 3) return <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Accountant</span>;
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Unknown</span>;
    };

    const roleId = Number(currentUser?.role_id) || 1;

    if (roleId !== 1) {
        return (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-center shadow-sm">
                <ShieldCheck size={32} className="mr-4" />
                <div>
                    <h3 className="text-xl font-bold">Access Denied</h3>
                    <p>You do not have administrative privileges to manage staff accounts.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Users className="mr-3 text-primary-600" size={28} /> Staff Management
                    </h1>
                    <p className="text-slate-500 mt-1">Generate Editor and Accountant accounts for team members.</p>
                </div>
                <button
                    onClick={() => {
                        setShowModal(true);
                        setIsRoleOpen(false);
                    }}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition shadow-md flex items-center"
                >
                    <Plus size={20} className="mr-2" /> Add Staff
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
            ) : staff.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-slate-100">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">No Staff Accounts Yet</h3>
                    <p className="text-slate-500 mt-1">Click the Add Staff button to create Editor or Accountant logins.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Staff Name</th>
                                    <th className="px-6 py-4">Email Login</th>
                                    <th className="px-6 py-4">Assigned Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {staff.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                        <td className="px-6 py-4">{getRoleBadge(user.role_id)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteStaff(user.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Revoke Access">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Create Staff Account</h3>
                        <form onSubmit={createStaff} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address (Login)</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="jane@schoolcms.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Secure Password</label>
                                <input type="text" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Min 6 characters" />
                            </div>
                            <div ref={roleDropdownRef}>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">System Role Allocation</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsRoleOpen(prev => !prev)}
                                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-left text-slate-700 shadow-sm hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    >
                                        {formData.role_id === 3 ? 'Accountant (Fees, Students Data)' : 'Content Editor (Gallery, Notices, Enquiries)'}
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">v</span>
                                    </button>
                                    {isRoleOpen && (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                                            <div className="py-1">
                                                {[
                                                    { value: 2, label: 'Content Editor (Gallery, Notices, Enquiries)' },
                                                    { value: 3, label: 'Accountant (Fees, Students Data)' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, role_id: opt.value }));
                                                            setIsRoleOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2 text-left text-sm transition ${
                                                            formData.role_id === opt.value
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
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setIsRoleOpen(false);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-bold transition shadow-md">
                                    Generate Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
