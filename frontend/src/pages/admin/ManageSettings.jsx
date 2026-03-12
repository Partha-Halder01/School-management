import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Settings, Save, Lock, MessageCircle } from 'lucide-react';

export default function ManageSettings() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const role = Number(user?.role_id) || 1;
    const isAdmin = role === 1;

    const [settings, setSettings] = useState({
        whatsapp_number: '',
        whatsapp_text: '',
        home_hero_banner: ''
    });
    const [heroBannerFile, setHeroBannerFile] = useState(null);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, userRes] = await Promise.all([
                    api.get('/settings'),
                    api.get('/user')
                ]);

                if (settingsRes.data) {
                    setSettings({
                        whatsapp_number: settingsRes.data.whatsapp_number || '',
                        whatsapp_text: settingsRes.data.whatsapp_text || '',
                        home_hero_banner: settingsRes.data.home_hero_banner || ''
                    });
                }
                if (userRes.data) {
                    setCredentials(prev => ({ ...prev, email: userRes.data.email }));
                }
            } catch (error) {
                console.error('Failed to load settings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSettingsChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleCredentialsChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const saveSettings = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append('settings', JSON.stringify(settings));
            if (heroBannerFile) {
                payload.append('hero_banner_image', heroBannerFile);
            }

            await api.post('/admin/settings', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Settings saved successfully!');
            setHeroBannerFile(null);
        } catch (error) {
            console.error(error);
            alert('Failed to save settings.');
        }
    };

    const saveCredentials = async (e) => {
        e.preventDefault();
        if (credentials.password && credentials.password !== credentials.password_confirmation) {
            return alert("Passwords do not match!");
        }

        try {
            await api.post('/admin/settings/credentials', { email: credentials.email, password: credentials.password });
            alert('Admin Login Credentials updated successfully!');
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
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <MessageCircle className="mr-2 text-green-500" /> Site Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Configure WhatsApp and homepage hero banner.</p>
                </div>
                <form onSubmit={saveSettings} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">WhatsApp Number</label>
                            <input
                                type="text" name="whatsapp_number" value={settings.whatsapp_number} onChange={handleSettingsChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. 919876543210"
                            />
                            <p className="text-xs text-slate-500 mt-1">Include country code without '+' sign.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Message Text</label>
                            <input
                                type="text" name="whatsapp_text" value={settings.whatsapp_text} onChange={handleSettingsChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. Hello Jamia Al Furqan, I have an inquiry!"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Homepage Banner Image URL (Optional)</label>
                            <input
                                type="text"
                                name="home_hero_banner"
                                value={settings.home_hero_banner}
                                onChange={handleSettingsChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. https://example.com/banner.jpg"
                            />
                            <p className="text-xs text-slate-500 mt-1">You can paste an image URL or upload an image file below.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Upload Homepage Banner (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setHeroBannerFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                {heroBannerFile ? `Selected: ${heroBannerFile.name}` : 'JPG/PNG/WEBP up to 5MB'}
                            </p>
                        </div>
                    </div>

                    {!!settings.home_hero_banner && (
                        <div className="pt-2">
                            <p className="text-sm font-bold text-slate-700 mb-2">Current Banner Preview</p>
                            <img
                                src={settings.home_hero_banner.startsWith('http') ? settings.home_hero_banner : `/storage/${settings.home_hero_banner}`}
                                alt="Current Hero Banner"
                                className="w-full max-w-2xl h-44 object-cover rounded-xl border border-slate-200"
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="flex items-center px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-md">
                            <Save size={18} className="mr-2" /> Save Settings
                        </button>
                    </div>
                </form>
            </div>

            {isAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Lock className="mr-2 text-slate-600" /> Admin Access Credentials
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Update your login email and password.</p>
                </div>
                <form onSubmit={saveCredentials} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Admin Email Address</label>
                        <input
                            type="email" name="email" value={credentials.email} onChange={handleCredentialsChange} required
                            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
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
                        <button type="submit" className="flex items-center px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-bold shadow-md">
                            <Save size={18} className="mr-2" /> Update Credentials
                        </button>
                    </div>
                </form>
                </div>
            )}
        </div>
    );
}

