import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, MoreVertical, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { formatDmy } from '../../lib/date';

export default function ManageEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEnquiries = async () => {
        try {
            const res = await api.get('/admin/enquiries');
            setEnquiries(res.data);
        } catch (error) {
            console.error('Failed fetching enquiries', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/admin/enquiries/${id}`, { status: newStatus });
            fetchEnquiries();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const deleteEnquiry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

        try {
            await api.delete(`/admin/enquiries/${id}`);
            fetchEnquiries();
        } catch (error) {
            console.error('Failed to delete enquiry', error);
        }
    };

    const filteredEnquiries = enquiries.filter(e =>
        e.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.phone && e.phone.includes(searchTerm)) ||
        (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center w-max"><Clock size={12} className="mr-1" /> Pending</span>;
            case 'Approved': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center w-max"><CheckCircle size={12} className="mr-1" /> Approved</span>;
            case 'FollowUp': return <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold flex items-center w-max"><Clock size={12} className="mr-1" /> Follow Up</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Admission Enquiries</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage and track student admission requests.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, phone, email..."
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Candidate / Parents</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Contact Info</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Class</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                                        Loading records...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredEnquiries.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                                    No enquiries found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filteredEnquiries.map((enquiry) => (
                                <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {formatDmy(enquiry.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900">{enquiry.candidate_name}</div>
                                        <div className="text-sm text-slate-500">{enquiry.parent_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900">{enquiry.phone}</div>
                                        <div className="text-sm text-slate-500">{enquiry.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        {enquiry.class_applied}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(enquiry.status || 'Pending')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {enquiry.status !== 'Approved' && (
                                                <button
                                                    onClick={() => updateStatus(enquiry.id, 'Approved')}
                                                    className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-green-200"
                                                    title="Mark Approved"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {enquiry.status !== 'FollowUp' && (
                                                <button
                                                    onClick={() => updateStatus(enquiry.id, 'FollowUp')}
                                                    className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-primary-200"
                                                    title="Mark for Follow Up"
                                                >
                                                    <Clock size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteEnquiry(enquiry.id)}
                                                className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                title="Delete Record"
                                            >
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
        </div>
    );
}
