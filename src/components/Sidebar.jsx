import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  MdDashboard, MdFolder, MdPerson, MdLogout,
  MdCloudUpload, MdMenu, MdClose,
} from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { to: '/folders',   icon: MdFolder,    label: 'Folders'   },
  { to: '/profile',   icon: MdPerson,    label: 'Profile'   },
];

function NavContent({ onNavClick }) {
  const { logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3" onClick={onNavClick}>
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
            <MdCloudUpload className="text-white text-lg" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">DocVault</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Icon className="text-xl shrink-0" />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 bg-primary-400 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 transition"
        >
          {darkMode
            ? <FiSun className="text-xl text-yellow-400 shrink-0" />
            : <FiMoon className="text-xl shrink-0" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <MdLogout className="text-xl shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-slate-950 flex-col z-40 border-r border-slate-800">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
            <MdCloudUpload className="text-white text-sm" />
          </div>
          <span className="font-bold text-white">DocVault</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          {mobileOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800">
            <NavContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
