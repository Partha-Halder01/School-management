import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { formatDmy } from '../../lib/date';

export default function StudentFeeDetails() {
    const { studentId, studentName } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [feeSummary, setFeeSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPayment, setNewPayment] = useState({ amount_paid: '', payment_date: new Date().toISOString().split('T')[0] });
    const [updatingUrl, setUpdatingUrl] = useState(false);

    const toSlug = (value = '') => value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setNewPayment(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/fee-payments', { 
                student_id: studentId, 
                ...newPayment, 
                total_fee: feeSummary.total_fees 
            });
            setNewPayment({ amount_paid: '', payment_date: new Date().toISOString().split('T')[0] });
            const feeSummaryRes = await api.get(`/admin/students/${studentId}/fee-summary`);
            setFeeSummary(feeSummaryRes.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            try {
                const [studentRes, feeSummaryRes] = await Promise.all([
                    api.get(`/admin/students/${studentId}`),
                    api.get(`/admin/students/${studentId}/fee-summary`)
                ]);
                setStudent(studentRes.data);
                setFeeSummary(feeSummaryRes.data);
                const slug = toSlug(studentRes.data?.name || '');
                if (slug && slug !== studentName && !updatingUrl) {
                    setUpdatingUrl(true);
                    navigate(`/admin/fees/${studentId}/${slug}`, { replace: true });
                }
            } catch (error) {
                console.error('Failed to fetch student data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, [studentId, studentName, navigate, updatingUrl]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student || !feeSummary) {
        return <div>Failed to load student data.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Student Fees</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {student.name}
                        <span className="text-slate-400 font-medium text-base ml-2">({student.admission_no || 'N/A'})</span>
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{student.status}</span>
                    <span className="text-sm text-slate-500">Class {student.course_class?.name || 'No Class'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Student Information</h3>
                            <span className="text-xs text-slate-400">Profile Overview</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <p><span className="font-semibold text-slate-700">Name:</span> {student.name}</p>
                                <p><span className="font-semibold text-slate-700">Parent:</span> {student.parent_name || 'N/A'}</p>
                                <p><span className="font-semibold text-slate-700">Phone:</span> {student.phone || 'N/A'}</p>
                                <p><span className="font-semibold text-slate-700">Email:</span> {student.email || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p><span className="font-semibold text-slate-700">Class:</span> {student.course_class?.name || 'No Class'}</p>
                                <p><span className="font-semibold text-slate-700">Roll No:</span> {student.roll_no || 'N/A'}</p>
                                <p><span className="font-semibold text-slate-700">DOB:</span> {student.dob ? formatDmy(student.dob) : 'N/A'}</p>
                                <p><span className="font-semibold text-slate-700">Address:</span> {student.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-800">Payment History</h3>
                            <div className="text-xs text-slate-400">Latest on top</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {[...feeSummary.payments].reverse().map(payment => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {formatDmy(payment.payment_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-green-600">₹{payment.amount_paid}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-lg shadow-primary-600/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Fee Summary</h3>
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Current Year</span>
                        </div>
                        <div className="mt-5 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/80">Total Fee</span>
                                <span className="font-bold">₹{feeSummary.total_fees}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/80">Total Paid</span>
                                <span className="font-bold">₹{feeSummary.total_paid}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/80">Remaining</span>
                                <span className="font-bold">₹{feeSummary.balance}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800">Record New Payment</h3>
                        <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Amount Paid (₹)</label>
                                <input type="number" name="amount_paid" value={newPayment.amount_paid} onChange={handlePaymentChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Payment Date</label>
                                <input type="date" name="payment_date" value={newPayment.payment_date} onChange={handlePaymentChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <button type="submit" className="w-full px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition shadow-lg shadow-primary-200">
                                Record Payment
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800">Quick Notes</h3>
                        <p className="text-sm text-slate-500 mt-2">Use this space to record fee reminders, follow-ups, or special concessions for this student.</p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                            <div className="rounded-xl border border-slate-200 px-3 py-2 bg-slate-50">Last paid: {feeSummary.payments?.length ? formatDmy(feeSummary.payments[feeSummary.payments.length - 1].payment_date) : 'N/A'}</div>
                            <div className="rounded-xl border border-slate-200 px-3 py-2 bg-slate-50">Payments: {feeSummary.payments?.length || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
