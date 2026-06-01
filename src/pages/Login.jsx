import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { MdCloudUpload } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

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
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow border border-gray-200
  dark:border-gray-700"
      >
        {darkMode ? (
          <FiSun className="text-yellow-400 text-xl" />
        ) : (
          <FiMoon className="text-gray-600 text-xl" />
        )}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <MdCloudUpload className="text-primary-500 text-4xl" />
            <span className="font-bold text-2xl bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              DocVault
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="animate-scaleIn bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
  text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
  text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-xl font-semibold text-lg
  hover:opacity-90 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4">
    <div className="relative flex items-center justify-center mb-4">
      <div className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
      <span className="bg-white dark:bg-gray-900 px-3 text-sm text-gray-400 absolute">or</span>
    </div>

    <a
      href="https://api.docvault.site/oauth2/authorization/google"
      className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-3
  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
    >
      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
      Continue with Google
    </a>
  </div>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
