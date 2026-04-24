import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { MdCloudUpload } from 'react-icons/md';

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  
  

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200
dark:border-gray-700 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MdCloudUpload className="text-primary-500 text-3xl" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              DocVault
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {token ? <></>:  <a
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition
font-medium"
            >
              Features
            </a>}
            {/* <a
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition
font-medium"
            >
              Features
            </a> */}
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition font-medium"
                >
                  Dashboard
                </Link>
                <Link to="/profile"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition font-medium"
                >
                  
                  Profile</Link>
                <Link
                  to="/folders"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition font-medium"
                >
                  Folders
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium
hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400 text-xl" />
              ) : (
                <FiMoon className="text-gray-600 text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300"
          >
            {menuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700">
            {/* <a
              href="#features"
              className="text-gray-600 dark:text-gray-300 font-medium"
            >
              Features
            </a> */}
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-300 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 dark:text-gray-300 font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/folders"
                  className="text-gray-600 dark:text-gray-300 font-medium"
                >
                  Folders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="text-primary-500 font-medium">
                  Get Started
                </Link>
              </>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-left text-gray-600 dark:text-gray-300 font-medium"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
