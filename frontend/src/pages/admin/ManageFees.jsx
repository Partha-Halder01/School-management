import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Search, Plus, User, CreditCard, Calendar, Trash2, Filter, Download, CheckCircle, Clock, Eye } from 'lucide-react';
import { formatDmy } from '../../lib/date';
import * as XLSX from 'xlsx';

export default function ManageFees() {
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentDropdown, setStudentDropdown] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [filters, setFilters] = useState({
        className: 'All',
        balanceStatus: 'All',
        dateFrom: '',
        dateTo: ''
    });
    const [totalFee, setTotalFee] = useState(0);
    const [formData, setFormData] = useState({
        student_id: '',
        amount_paid: '',
        total_fee: '',
        discount: '0',
        payment_date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const [paymentsRes, studentsRes] = await Promise.all([
                api.get('/admin/fee-payments'),
                api.get('/admin/students')
            ]);

            setPayments(paymentsRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Failed fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.student_id) {
            const fetchFeeSummary = async () => {
                try {
                    const res = await api.get(`/admin/students/${formData.student_id}/fee-summary`);
                    setTotalFee(res.data.total_fees);
                } catch (error) {
                    console.error('Failed to fetch fee summary', error);
                }
            };
            fetchFeeSummary();
        }
    }, [formData.student_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/fee-payments', { ...formData, total_fee: totalFee });
            setShowModal(false);
            setFormData({
                student_id: '', amount_paid: '', total_fee: '', discount: '0',
                payment_date: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleCompleteYear = async () => {
        if (!window.confirm('Are you sure you want to complete this year for this student? This will archive their current fee records.')) return;
        try {
            await api.post(`/admin/students/${formData.student_id}/complete-year`, {});
            setShowModal(false);
            setFormData({
                student_id: '', fee_id: '', amount_paid: '', discount: '0',
                payment_date: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    const studentFeeSummary = payments.reduce((acc, payment) => {
        if (!acc[payment.student_id]) {
            acc[payment.student_id] = {
                student: payment.student,
                total_amount: payment.fee.amount,
                paid_amount: 0,
                last_payment_date: ''
            };
        }
        acc[payment.student_id].paid_amount += parseFloat(payment.amount_paid);
        if (!acc[payment.student_id].last_payment_date || new Date(payment.payment_date) > new Date(acc[payment.student_id].last_payment_date)) {
            acc[payment.student_id].last_payment_date = payment.payment_date;
        }
        return acc;
    }, {});

    const classOptions = useMemo(() => {
        const set = new Set();
        students.forEach(s => {
            if (s.course_class?.name) {
                set.add(s.course_class.name);
            }
        });
        return ['All', ...Array.from(set)];
    }, [students]);

    const studentById = useMemo(() => {
        const map = new Map();
        students.forEach(s => map.set(String(s.id), s));
        return map;
    }, [students]);

    const matchesFilters = (summary) => {
        const student = summary.student || {};
        const resolvedStudent = studentById.get(String(student.id)) || student;
        const className = resolvedStudent.course_class?.name || '';
        if (filters.className !== 'All' && className !== filters.className) return false;

        const remaining = summary.total_amount - summary.paid_amount;
        if (filters.balanceStatus === 'Paid' && remaining > 0) return false;
        if (filters.balanceStatus === 'Due' && remaining <= 0) return false;

        if (filters.dateFrom) {
            const from = new Date(filters.dateFrom);
            const last = new Date(summary.last_payment_date);
            if (last < from) return false;
        }
        if (filters.dateTo) {
            const to = new Date(filters.dateTo);
            const last = new Date(summary.last_payment_date);
            if (last > to) return false;
        }

        return true;
    };

    const filteredPaymentsFinal = Object.values(studentFeeSummary)
        .filter(s => {
            const term = searchTerm.toLowerCase();
            return (
                s.student?.name?.toLowerCase().includes(term) ||
                s.student?.email?.toLowerCase().includes(term) ||
                s.student?.phone?.toLowerCase().includes(term) ||
                s.student?.admission_no?.toLowerCase().includes(term)
            );
        })
        .filter(matchesFilters);

    const totalDueAmount = Object.values(studentFeeSummary).reduce((sum, summary) => {
        const due = Number(summary.total_amount || 0) - Number(summary.paid_amount || 0);
        return sum + (due > 0 ? due : 0);
    }, 0);

    const totalPages = Math.max(1, Math.ceil(filteredPaymentsFinal.length / pageSize));
    const paginatedPayments = filteredPaymentsFinal.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters.className, filters.balanceStatus, filters.dateFrom, filters.dateTo]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleDownload = () => {
        const rows = filteredPaymentsFinal.map(summary => {
            const student = summary.student || {};
            const resolvedStudent = studentById.get(String(student.id)) || student;
            const remaining = summary.total_amount - summary.paid_amount;
            return {
                Date: formatDmy(summary.last_payment_date),
                Student: resolvedStudent.name || '',
                AdmissionNo: resolvedStudent.admission_no || '',
                Class: resolvedStudent.course_class?.name || '',
                RollNo: resolvedStudent.roll_no || '',
                Phone: resolvedStudent.phone || '',
                Email: resolvedStudent.email || '',
                TotalAmount: summary.total_amount,
                PaidAmount: summary.paid_amount,
                RemainingBalance: remaining
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Fees');
        XLSX.writeFile(workbook, `fees-report-${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Fee Management</h2>
                    <p className="text-slate-500">Track student payments and fee collection.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-primary-200"
                >
                    <Plus size={20} />
                    <span>Record New Payment</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CreditCard size={20} /></div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Total Collected</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                            ₹{payments.reduce((acc, curr) => acc + parseFloat(curr.amount_paid), 0).toFixed(2)}
                        </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><User size={20} /></div>
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Payments Count</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{payments.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20} /></div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Total Due Amount</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">₹{totalDueAmount.toFixed(2)}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowFilters(prev => !prev)}
                            className={`p-2 rounded-lg transition border ${showFilters ? 'text-primary-600 border-primary-200 bg-primary-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-slate-200'}`}
                            title="Filter"
                        >
                            <Filter size={18} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition border border-slate-200"
                            title="Download Excel"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="px-6 pb-6 border-b border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Class</label>
                                <select
                                    value={filters.className}
                                    onChange={(e) => { setFilters(prev => ({ ...prev, className: e.target.value })); setCurrentPage(1); }}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    {classOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Balance</label>
                                <select
                                    value={filters.balanceStatus}
                                    onChange={(e) => { setFilters(prev => ({ ...prev, balanceStatus: e.target.value })); setCurrentPage(1); }}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="All">All</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Due">Due</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">From</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => { setFilters(prev => ({ ...prev, dateFrom: e.target.value })); setCurrentPage(1); }}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">To</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => { setFilters(prev => ({ ...prev, dateTo: e.target.value })); setCurrentPage(1); }}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Balance</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-400">Loading payment history...</td></tr>
                            ) : filteredPaymentsFinal.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-400">No payment records found.</td></tr>
                            ) : (
                                paginatedPayments.map((summary) => {
                                    const resolvedStudent = studentById.get(String(summary.student.id)) || summary.student;
                                    return (
                                    <tr key={summary.student.id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {formatDmy(summary.last_payment_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-3 text-xs">
                                                    {resolvedStudent.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{resolvedStudent.name || 'Unknown'}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                ID: {resolvedStudent.admission_no || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {resolvedStudent.course_class?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            ₹{summary.total_amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-green-600">₹{summary.paid_amount}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            ₹{summary.total_amount - summary.paid_amount}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center justify-end gap-2">
                                                <Link to={`/admin/fees/${summary.student.id}/${resolvedStudent.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                                                    <Eye size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(summary.student.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <span className="text-xs text-slate-500">
                        Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredPaymentsFinal.length)} of {filteredPaymentsFinal.length}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[32px] px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                                    page === currentPage ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'text-slate-600 border-slate-200 hover:bg-white'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-2xl font-bold text-slate-800">Record Fee Payment</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Select Student</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={studentSearch}
                                        onChange={(e) => { setStudentSearch(e.target.value); setStudentDropdown(true); }}
                                        onFocus={() => setStudentDropdown(true)}
                                        placeholder="Search by name, email, phone, or ID"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                    {studentDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg">
                                            {students
                                                .filter(s => 
                                                    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                                    s.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                                    s.phone?.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                                    s.admission_no?.toLowerCase().includes(studentSearch.toLowerCase())
                                                )
                                                .map(s => (
                                                    <div 
                                                        key={s.id} 
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, student_id: s.id }));
                                                            setStudentSearch(`${s.name} (${s.course_class?.name || 'No Class'})`);
                                                            setStudentDropdown(false);
                                                        }}
                                                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        {s.name} ({s.course_class?.name || 'No Class'}){s.admission_no ? ` • ID: ${s.admission_no}` : ''}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Total Price (₹)</label>
                                    <input type="number" value={totalFee} onChange={(e) => setTotalFee(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Amount Paid (₹)</label>
                                    <input type="number" name="amount_paid" required value={formData.amount_paid} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Discount (₹)</label>
                                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Remaining Balance (₹)</label>
                                    <input type="number" disabled value={totalFee - formData.amount_paid - formData.discount} className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                            </div>
                            {(totalFee - formData.amount_paid - formData.discount) === 0 &&
                                <div className="text-green-600 font-bold text-center">Payment Completed</div>
                            }
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Payment Date</label>
                                <input type="date" name="payment_date" required value={formData.payment_date} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div className="flex justify-end space-x-4 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                                {(totalFee - formData.amount_paid - formData.discount) === 0 ? (
                                    <button type="button" onClick={handleCompleteYear} className="px-10 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-lg shadow-green-200">
                                        Complete This Year
                                    </button>
                                ) : (
                                    <button type="submit" className="px-10 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition shadow-lg shadow-primary-200">
                                        Record Payment
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
