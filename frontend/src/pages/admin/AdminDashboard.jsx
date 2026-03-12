import { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';
import { Navigate, Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, ArrowUpRight, ArrowDownRight, IndianRupee, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function getLast7MonthBuckets() {
  const now = new Date();
  const buckets = [];

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.push({
      key,
      name: d.toLocaleString('en-US', { month: 'short' }),
    });
  }

  return buckets;
}

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const roleId = Number(user?.role_id) || 1;

  if (roleId === 2) return <Navigate to="/editor/enquiries" replace />;
  if (roleId === 3) return <Navigate to="/accountant/students" replace />;

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeEnquiries: 0,
    totalRevenue: 0,
    totalTeachers: 0,
  });
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [enquiriesRes, studentsRes, staffRes, paymentsRes] = await Promise.all([
          api.get('/admin/enquiries'),
          api.get('/admin/students'),
          api.get('/admin/staff'),
          api.get('/admin/fee-payments'),
        ]);

        const enquiries = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : [];
        const students = Array.isArray(studentsRes.data) ? studentsRes.data : [];
        const staff = Array.isArray(staffRes.data) ? staffRes.data : [];
        const feePayments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];

        const pendingCount = enquiries.filter((eq) => {
          const status = String(eq?.status || '').toLowerCase();
          return status === 'pending' || status === '';
        }).length;

        const totalRevenue = feePayments.reduce((sum, payment) => {
          const amount = Number(payment?.amount_paid || 0);
          return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        setStats({
          totalStudents: students.length,
          activeEnquiries: pendingCount,
          totalRevenue,
          totalTeachers: staff.length,
        });
        setPayments(feePayments);
        setLoadError('');
      } catch (error) {
        console.error('Failed to load stats', error);
        setLoadError('Could not load latest dashboard metrics. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const revenueData = useMemo(() => {
    const monthBuckets = getLast7MonthBuckets();
    const totals = new Map(monthBuckets.map((bucket) => [bucket.key, 0]));

    for (const payment of payments) {
      const rawDate = payment?.payment_date || payment?.created_at;
      if (!rawDate) continue;

      const d = new Date(rawDate);
      if (Number.isNaN(d.getTime())) continue;

      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!totals.has(monthKey)) continue;

      const amount = Number(payment?.amount_paid || 0);
      const safeAmount = Number.isFinite(amount) ? amount : 0;
      totals.set(monthKey, (totals.get(monthKey) || 0) + safeAmount);
    }

    return monthBuckets.map((bucket) => ({
      name: bucket.name,
      amount: totals.get(bucket.key) || 0,
    }));
  }, [payments]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: GraduationCap,
      to: '/admin/students',
      change: null,
      changeType: 'neutral',
      changeLabel: 'Live data',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Pending Enquiries',
      value: stats.activeEnquiries,
      icon: Users,
      to: '/admin/enquiries',
      change: null,
      changeType: 'neutral',
      changeLabel: 'Requires attention',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Total Faculty',
      value: stats.totalTeachers,
      icon: BookOpen,
      to: '/admin/staff',
      change: null,
      changeType: 'neutral',
      changeLabel: 'Live data',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Fee Collection',
      value: `\u20B9${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      to: '/admin/fees',
      change: null,
      changeType: 'neutral',
      changeLabel: 'Total collected',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening at your school today.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl font-semibold text-sm border border-primary-100">
          <Calendar size={16} />
          Academic Year 2026-2027
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
            aria-label={`Open ${card.title}`}
          >
            <div className={`h-1 bg-gradient-to-r ${card.gradient}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">{card.value}</h3>
                </div>
                <div className={`p-3 ${card.iconBg} ${card.iconColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon size={22} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm font-medium">
                <div>
                  {card.changeType === 'up' && (
                    <span className="text-green-600 flex items-center gap-1">
                      <ArrowUpRight size={14} /> {card.change} {card.changeLabel}
                    </span>
                  )}
                  {card.changeType === 'down' && (
                    <span className="text-red-500 flex items-center gap-1">
                      <ArrowDownRight size={14} /> {card.change} {card.changeLabel}
                    </span>
                  )}
                  {card.changeType === 'neutral' && (
                    <span className="text-gray-400">{card.changeLabel}</span>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-6 pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Fee Revenue Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly fee collection trend</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-primary-600 font-medium">
              <TrendingUp size={16} />
              <span>{`\u20B9${stats.totalRevenue.toLocaleString()} collected`}</span>
            </div>
          </div>
          <div className="h-72 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(value) => `\u20B9${Math.round(value / 1000)}k`} />
                <Tooltip
                  cursor={{ fill: '#F0FDF4' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '13px' }}
                  formatter={(value) => [`\u20B9${Number(value || 0).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#16A34A" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Quick Actions</h3>
          <p className="text-xs text-gray-400 mb-5">Shortcuts to common tasks</p>
          <div className="space-y-3">
            {[
              { label: 'View Enquiries', path: '/admin/enquiries', color: 'bg-primary-50 text-primary-600 hover:bg-primary-100' },
              { label: 'Manage Students', path: '/admin/students', color: 'bg-primary-50 text-primary-600 hover:bg-primary-100' },
              { label: 'Fee Management', path: '/admin/fees', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
              { label: 'Post Notice', path: '/admin/notices', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
              { label: 'Upload Gallery', path: '/admin/gallery', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
              { label: 'Manage Staff', path: '/admin/staff', color: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
            ].map((action, idx) => (
              <Link key={idx} to={action.path} className={`flex items-center justify-between p-3.5 rounded-xl ${action.color} transition-all duration-200 group`}>
                <span className="text-sm font-bold">{action.label}</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
