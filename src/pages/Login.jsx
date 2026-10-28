import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { MdCloudUpload, MdSecurity, MdFolder, MdSearch } from 'react-icons/md';
import { FiEye, FiEyeOff, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: MdSecurity,    text: 'JWT secured authentication' },
  { icon: MdFolder,      text: 'Organized folder system'    },
  { icon: MdSearch,      text: 'Instant file search'        },
  { icon: MdCloudUpload, text: 'AWS S3 cloud storage'       },
];

export default function Login() {
  const { login } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(form);
      login(res.data.token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <MdCloudUpload className="text-white text-2xl" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">DocVault</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
            Secure Cloud Storage
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your documents,
            <br />
            <span className="text-primary-400">always accessible.</span>
          </h2>
          <p className="text-slate-400 text-base mb-8 leading-relaxed">
            Secure cloud storage for all your important files — organized, searchable, and always within reach.
          </p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500/15 border border-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="text-primary-400 text-sm" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-xs">© 2025 DocVault. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Theme toggle */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
          >
            {darkMode
              ? <FiSun className="text-yellow-400 text-lg" />
              : <FiMoon className="text-gray-600 text-lg" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md animate-scaleIn">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                  <MdCloudUpload className="text-white text-xl" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">DocVault</span>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5">Welcome back</h1>
              <p className="text-gray-500 dark:text-slate-400">Sign in to your DocVault account</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-200 dark:border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25 mt-1"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex items-center my-6">
              <div className="flex-1 border-t border-gray-200 dark:border-slate-700" />
              <span className="px-4 text-sm text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-900">or</span>
              <div className="flex-1 border-t border-gray-200 dark:border-slate-700" />
            </div>

            <a
              href="https://api.docvault.site/oauth2/authorization/google"
              className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-slate-700 rounded-xl py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition font-medium"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </a>

            <p className="text-center text-gray-500 dark:text-slate-400 mt-6 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 font-semibold hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
