import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, MoreVertical, CheckCircle, Clock, Trash2, Mail, User, MessageSquare } from 'lucide-react';
import { formatDmy } from '../../lib/date';

export default function ManageContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        try {
            const res = await api.get('/admin/contact-messages');
            setMessages(res.data);
        } catch (error) {
            console.error('Failed fetching contact messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/admin/contact-messages/${id}`, { status: newStatus });
            fetchMessages();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await api.delete(`/admin/contact-messages/${id}`);
            fetchMessages();
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center w-max"><Clock size={12} className="mr-1" /> Pending</span>;
            case 'Responded': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center w-max"><CheckCircle size={12} className="mr-1" /> Responded</span>;
            case 'Archived': return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold flex items-center w-max"><Trash2 size={12} className="mr-1" /> Archived</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Contact Messages</h2>
                    <p className="text-sm text-slate-500 mt-1">View and respond to inquiries from the contact form.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, email, subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Sender</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Content</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 tracking-wider uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Loading messages...</td>
                            </tr>
                        ) : filteredMessages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400">No messages found.</td>
                            </tr>
                        ) : (
                            filteredMessages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {formatDmy(msg.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{msg.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center mt-1">
                                                    <Mail size={10} className="mr-1" /> {msg.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs">
                                            <div className="text-sm font-bold text-slate-800 truncate">{msg.subject || 'No Subject'}</div>
                                            <div className="text-xs text-slate-500 mt-1 line-clamp-2">{msg.message}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(msg.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <select 
                                                className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                value={msg.status}
                                                onChange={(e) => updateStatus(msg.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Responded">Responded</option>
                                                <option value="Archived">Archived</option>
                                            </select>
                                            <button 
                                                onClick={() => deleteMessage(msg.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete Message"
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
    );
}
