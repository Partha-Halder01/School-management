import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import { formatDmy } from '../../lib/date';

export default function StudentProfile() {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [feeSummary, setFeeSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const [studentRes, feeSummaryRes] = await Promise.all([
                    api.get(`/admin/students/${studentId}`),
                    api.get(`/admin/students/${studentId}/fee-summary`)
                ]);
                setStudent(studentRes.data);
                setFeeSummary(feeSummaryRes.data);
            } catch (error) {
                console.error('Failed to fetch student data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, [studentId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student || !feeSummary) {
        return <div>Failed to load student data.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Student Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-4xl mb-4">
                                {student.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                            <p className="text-sm text-slate-500">ID: {student.admission_no || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold">Email:</span> {student.email}</p>
                                <p><span className="font-semibold">Phone:</span> {student.phone || 'N/A'}</p>
                                <p><span className="font-semibold">Parent Name:</span> {student.parent_name || 'N/A'}</p>
                                <p><span className="font-semibold">Date of Birth:</span> {student.dob ? formatDmy(student.dob) : 'N/A'}</p>
                                <p><span className="font-semibold">Address:</span> {student.address || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Academic Information</h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold">Class:</span> {student.course_class?.name || 'No Class'}</p>
                                <p><span className="font-semibold">Roll Number:</span> {student.roll_no || 'N/A'}</p>
                                <p><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>{student.status}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800">Fee Summary</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Fee:</span>
                            <span className="font-bold text-slate-800">₹{feeSummary.total_fees}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Paid:</span>
                            <span className="font-bold text-green-600">₹{feeSummary.total_paid}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Remaining Balance:</span>
                            <span className="font-bold text-red-600">₹{feeSummary.balance}</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <h3 className="text-lg font-semibold text-slate-800 p-6">Payment History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {feeSummary.payments.map(payment => (
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
        </div>
    );
}
