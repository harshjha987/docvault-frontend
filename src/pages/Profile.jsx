import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import { getProfile, updateProfile, changePassword, deleteAccount, getStats } from '../services/api';
import {
  MdEdit, MdCheck, MdClose, MdEmail,
  MdCalendarToday, MdLock, MdDeleteForever,
  MdInsertDriveFile, MdFolder,
} from 'react-icons/md';
import { MdUpload } from 'react-icons/md';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
      setNewName(res.data.name);
    } catch {
      navigate('/login');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch {}
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setNameLoading(true);
    try {
      const res = await updateProfile({ name: newName });
      setProfile(res.data);
      setEditingName(false);
    } catch {}
    setNameLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setPasswordSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Current password is incorrect');
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account and all your files. Are you sure?')) return;
    if (!window.confirm('This action cannot be undone. Confirm once more.')) return;
    setDeleteLoading(true);
    try {
      await deleteAccount();
      localStorage.removeItem('token');
      navigate('/');
    } catch {}
    setDeleteLoading(false);
  };

  const formatDate = (instant) =>
    new Date(instant).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <main className="md:ml-64 pt-14 md:pt-0 flex items-center justify-center h-screen">
        <p className="text-gray-400 dark:text-slate-500">Loading...</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">

          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">Manage your account settings</p>
          </div>

          {/* Profile Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-primary-500/25">
                {getInitials(profile.name)}
              </div>
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                    <button onClick={handleUpdateName} disabled={nameLoading} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition">
                      <MdCheck className="text-xl" />
                    </button>
                    <button onClick={() => { setEditingName(false); setNewName(profile.name); }} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                      <MdClose className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{profile.name}</h2>
                    <button onClick={() => setEditingName(true)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                      <MdEdit className="text-sm" />
                    </button>
                  </div>
                )}
                <p className="text-gray-500 dark:text-slate-400 text-sm truncate">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-gray-100 dark:border-slate-700 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                <MdEmail className="text-base shrink-0 text-gray-400 dark:text-slate-500" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                <MdCalendarToday className="text-base shrink-0 text-gray-400 dark:text-slate-500" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Files',   value: stats.totalFiles,            icon: MdInsertDriveFile, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
                { label: 'Storage', value: formatSize(stats.totalSize), icon: MdUpload,          color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-500/10'   },
                { label: 'Folders', value: stats.totalFolders,          icon: MdFolder,          color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10'     },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 text-center">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`${color} text-lg`} />
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Change Password */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdLock className="text-lg text-gray-400 dark:text-slate-500" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                <input
                  key={field}
                  type="password"
                  placeholder={field === 'currentPassword' ? 'Current password' : field === 'newPassword' ? 'New password' : 'Confirm new password'}
                  value={passwordData[field]}
                  onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
                />
              ))}

              {passwordError && <p className="text-red-500 dark:text-red-400 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 dark:text-green-400 text-sm">{passwordSuccess}</p>}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-primary-500/25"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-500/20 p-6">
            <div className="flex items-center gap-2 mb-2">
              <MdDeleteForever className="text-lg text-red-500" />
              <h3 className="text-base font-semibold text-red-500">Danger Zone</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Permanently deletes your account, all your files, and folders. This cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="w-full py-3 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-50 text-sm"
            >
              {deleteLoading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>

        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}
