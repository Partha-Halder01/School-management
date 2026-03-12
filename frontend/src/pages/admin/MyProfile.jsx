import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { UserCircle, Save, Lock, LogOut } from 'lucide-react';

export default function MyProfile() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/user');

                if (userRes.data) {
                    setCredentials(prev => ({ ...prev, email: userRes.data.email }));
                }
            } catch (error) {
                console.error('Failed to load user', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCredentialsChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const saveCredentials = async (e) => {
        e.preventDefault();
        if (credentials.password && credentials.password !== credentials.password_confirmation) {
            return alert("Passwords do not match!");
        }

        try {
            const res = await api.post('/user/credentials', {
                email: credentials.email,
                password: credentials.password,
                password_confirmation: credentials.password_confirmation
            });
            alert(res.data?.message || 'Login credentials updated successfully! You may want to log in again.');
            setCredentials(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to update credentials.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <UserCircle size={48} className="text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your account access details and password securely.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Lock className="mr-2 text-slate-600" /> Login Information
                    </h2>
                </div>
                <form onSubmit={saveCredentials} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address (Login ID)</label>
                        <input
                            type="email" name="email" value={credentials.email} onChange={handleCredentialsChange} required
                            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                            <input
                                type="password" name="password" value={credentials.password} onChange={handleCredentialsChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Leave blank to keep unchanged"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                            <input
                                type="password" name="password_confirmation" value={credentials.password_confirmation} onChange={handleCredentialsChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Repeat new password"
                            />
                        </div>
                    </div>
                    <div className="flex justify-start pt-2">
                        <button type="submit" className="flex items-center px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-bold shadow-md transition">
                            <Save size={18} className="mr-2" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="p-6 border-b border-red-50 bg-red-50/30">
                    <h2 className="text-xl font-bold text-red-800 flex items-center">
                        <LogOut className="mr-2 text-red-600" /> Account Actions
                    </h2>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4 text-sm font-medium">
                        Sign out of your account on this device. You will need to enter your credentials again to access the portal.
                    </p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="flex items-center px-6 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white font-bold shadow-sm transition border border-red-100 hover:border-red-500"
                    >
                        <LogOut size={18} className="mr-2" /> Secure Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
