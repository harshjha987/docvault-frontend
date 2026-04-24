import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import { getProfile, updateProfile, changePassword, deleteAccount, getStats } from '../services/api';
import { MdEdit, MdCheck, MdClose, MdPerson, MdEmail, MdCalendarToday, MdLock, MdDeleteForever } from 'react-icons/md';

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
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12 space-y-6">

        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center
 text-white text-xl font-bold shrink-0">
              {getInitials(profile.name)}
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50
dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <button onClick={handleUpdateName} disabled={nameLoading} className="p-1.5 text-green-500 hover:bg-green-50
dark:hover:bg-green-900/20 rounded-lg transition">
                    <MdCheck className="text-xl" />
                  </button>
                  <button onClick={() => { setEditingName(false); setNewName(profile.name); }} className="p-1.5 text-gray-400
hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <MdClose className="text-xl" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{profile.name}</h2>
                  <button onClick={() => setEditingName(true)} className="p-1.5 text-gray-400 hover:text-gray-600
dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <MdEdit />
                  </button>
                </div>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <MdEmail className="text-lg shrink-0" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <MdCalendarToday className="text-lg shrink-0" />
              <span>Joined {formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFiles}</p>
              <p className="text-xs text-gray-400 mt-1">Files</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatSize(stats.totalSize)}</p>
              <p className="text-xs text-gray-400 mt-1">Storage</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFolders}</p>
              <p className="text-xs text-gray-400 mt-1">Folders</p>
            </div>
          </div>
        )}

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-5">
            <MdLock className="text-xl text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-xl font-semibold
hover:opacity-90 transition disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MdDeleteForever className="text-xl text-red-500" />
            <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Permanently deletes your account, all your files, and folders. This cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="w-full py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-500 font-semibold hover:bg-red-50
dark:hover:bg-red-900/20 transition disabled:opacity-50"
          >
            {deleteLoading ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>

      </div>
      <ScrollToTop />
    </div>
  );
}
