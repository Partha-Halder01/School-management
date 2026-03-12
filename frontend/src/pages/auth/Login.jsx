import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('admin@schoolcms.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/login', {
        email,
        password
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        const userRole = Number(response.data.user.role_id) || 1;
        if (userRole === 2) navigate('/editor/enquiries');
        else if (userRole === 3) navigate('/accountant/students');
        else navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased relative bg-[#f8fafc] overflow-hidden">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-10 z-50 flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium text-sm transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Website
      </Link>

      {/* Login Screen */}
      <div className="w-full flex items-center justify-center px-4 py-12 relative flex-1">

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 md:w-96 md:h-96 bg-primary-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 md:w-96 md:h-96 bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10">

          {/* Login Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative z-10 transition-all">
            {/* Header */}
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-5">
                <ShieldCheck size={28} className="text-primary-600" />
              </div>
              <h2 className="text-4xl font-bebas font-bold text-gray-900 tracking-wide">LOGIN</h2>
              <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 font-bold text-lg">!</span>
                  </div>
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 font-medium text-sm"
                    placeholder="admin@schoolcms.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 font-medium text-sm"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember me</label>
                </div>
                <a href="#" className="text-sm font-bold text-primary-600 hover:text-primary-500 transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-4 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-lg mt-2 ${isLoading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-primary-200 hover:shadow-xl transform hover:-translate-y-0.5 active:scale-[0.98]'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-primary-50/60 p-5 rounded-xl border border-primary-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-primary-400 rounded-full"></span> Demo Credentials
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { role: 'Admin', email: 'admin@schoolcms.com', color: 'text-primary-700 bg-primary-100' },
                { role: 'Editor', email: 'editor@schoolcms.com', color: 'text-emerald-700 bg-emerald-100' },
                { role: 'Accountant', email: 'accountant@schoolcms.com', color: 'text-amber-700 bg-amber-100' },
              ].map((cred, idx) => (
                <div key={idx} className="flex items-center justify-between text-gray-600">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cred.color}`}>{cred.role}</span>
                  <span className="text-xs">{cred.email} / password</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              * Each role has restricted dashboard access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
