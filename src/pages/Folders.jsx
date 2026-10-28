import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import { getFolders, createFolder, deleteFolder, getFilesByFolder, renameFolder } from '../services/api';
import { MdDelete, MdCreateNewFolder, MdClose, MdFolder, MdEdit, MdCheck } from 'react-icons/md';
import {
  BsFileEarmarkImage, BsFileEarmarkPdf, BsFileEarmarkWord,
  BsFileEarmarkExcel, BsFileEarmarkPpt, BsFileEarmarkZip,
  BsFileEarmarkPlay, BsFileEarmarkMusic, BsFileEarmarkCode,
  BsFileEarmarkText, BsFileEarmark,
} from 'react-icons/bs';

const getFileIcon = (type) => {
  if (type?.includes('image'))       return <BsFileEarmarkImage className="text-2xl text-blue-400" />;
  if (type?.includes('pdf'))         return <BsFileEarmarkPdf className="text-2xl text-red-500" />;
  if (type?.includes('word') || type?.includes('document') || type?.includes('msword'))
                                     return <BsFileEarmarkWord className="text-2xl text-blue-600" />;
  if (type?.includes('excel') || type?.includes('sheet') || type?.includes('spreadsheet'))
                                     return <BsFileEarmarkExcel className="text-2xl text-green-500" />;
  if (type?.includes('presentation') || type?.includes('powerpoint'))
                                     return <BsFileEarmarkPpt className="text-2xl text-orange-500" />;
  if (type?.includes('zip') || type?.includes('rar') || type?.includes('tar') || type?.includes('gzip'))
                                     return <BsFileEarmarkZip className="text-2xl text-yellow-500" />;
  if (type?.includes('video'))       return <BsFileEarmarkPlay className="text-2xl text-purple-500" />;
  if (type?.includes('audio'))       return <BsFileEarmarkMusic className="text-2xl text-pink-500" />;
  if (type?.includes('javascript') || type?.includes('json') || type?.includes('html') ||
      type?.includes('css') || type?.includes('xml'))
                                     return <BsFileEarmarkCode className="text-2xl text-emerald-500" />;
  if (type?.includes('text'))        return <BsFileEarmarkText className="text-2xl text-gray-500" />;
  return <BsFileEarmark className="text-2xl text-gray-400" />;
};

export default function Folders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderFiles, setFolderFiles] = useState([]);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchFolders(); }, []);

  const fetchFolders = async () => {
    try {
      const res = await getFolders();
      setFolders(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    setCreating(true);
    setError('');
    try {
      await createFolder({ name: folderName });
      setFolderName('');
      setShowModal(false);
      fetchFolders();
    } catch (err) {
      setError(err.response?.data?.message || 'Folder already exists or error occurred');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this folder?')) return;
    try {
      await deleteFolder(id);
      setFolders(folders.filter((f) => f.id !== id));
      if (selectedFolder?.id === id) setSelectedFolder(null);
    } catch {
      alert('Delete failed');
    }
  };

  const handleFolderClick = async (folder) => {
    if (renamingId) return;
    setSelectedFolder(folder);
    try {
      const res = await getFilesByFolder(folder.id);
      setFolderFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameStart = (e, folder) => {
    e.stopPropagation();
    setRenamingId(folder.id);
    setRenameValue(folder.name);
  };

  const handleRenameSubmit = async (id) => {
    if (!renameValue.trim()) return;
    try {
      await renameFolder(id, { name: renameValue });
      setFolders(folders.map((f) => (f.id === id ? { ...f, name: renameValue } : f)));
      if (selectedFolder?.id === id) setSelectedFolder((prev) => ({ ...prev, name: renameValue }));
    } catch {
      alert('Rename failed');
    } finally {
      setRenamingId(null);
    }
  };

  const formatDate = (instant) =>
    new Date(instant).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Folders</h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">
                {folders.length} folder{folders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-primary-500/25 text-sm"
            >
              <MdCreateNewFolder className="text-lg" />
              New Folder
            </button>
          </div>

          {/* Folders Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <MdFolder className="text-6xl text-gray-200 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white font-semibold mb-1">No folders yet</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Create your first folder to organize files</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                    selectedFolder?.id === folder.id
                      ? 'border-primary-500 shadow-md shadow-primary-500/15 dark:border-primary-400'
                      : 'border-gray-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                      <MdFolder className="text-2xl text-amber-500" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleRenameStart(e, folder)}
                        className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition"
                      >
                        <MdEdit className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(folder.id); }}
                        className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {renamingId === folder.id ? (
                    <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(folder.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="flex-1 text-sm px-2 py-1 rounded-lg border border-primary-400 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none"
                      />
                      <button onClick={() => handleRenameSubmit(folder.id)} className="text-green-500 hover:text-green-400 transition">
                        <MdCheck />
                      </button>
                      <button onClick={() => setRenamingId(null)} className="text-gray-400 hover:text-gray-600 transition">
                        <MdClose />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{folder.name}</h3>
                  )}

                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                    {folder.fileCount} file{folder.fileCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{formatDate(folder.createdAt)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Selected Folder Files */}
          {selectedFolder && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MdFolder className="text-amber-500" />
                  {selectedFolder.name}
                </h2>
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  <MdClose className="text-lg" />
                </button>
              </div>

              {folderFiles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <BsFileEarmark className="text-4xl text-gray-200 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-slate-400 text-sm">No files in this folder</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folderFiles.map((file) => (
                    <div key={file.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-xl shrink-0">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{file.originalName}</h3>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{formatDate(file.uploadedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Folder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-7 w-full max-w-md animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Folder</h2>
              <button onClick={() => { setShowModal(false); setError(''); setFolderName(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">
                <MdClose className="text-xl" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm border border-red-100 dark:border-red-500/20">{error}</div>
            )}

            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-5 transition text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />

            <button
              onClick={handleCreate}
              disabled={!folderName.trim() || creating}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-primary-500/25"
            >
              {creating ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
