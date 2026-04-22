import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Navbar from '../components/Navbar';
  import ScrollToTop from '../components/ScrollToTop';
  import {
    getFolders,
    createFolder,
    deleteFolder,
    getFilesByFolder,
    renameFolder,
  } from '../services/api';
  import { MdDelete, MdCreateNewFolder, MdClose, MdFolder, MdEdit, MdCheck } from 'react-icons/md';
  import { BsFileEarmarkImage, BsFileEarmarkPdf, BsFileEarmarkWord, BsFileEarmarkExcel,
    BsFileEarmarkPpt, BsFileEarmarkZip, BsFileEarmarkPlay, BsFileEarmarkMusic,
    BsFileEarmarkCode, BsFileEarmarkText, BsFileEarmark } from 'react-icons/bs';

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <BsFileEarmarkImage className="text-3xl text-blue-400" />;
    if (type?.includes('pdf')) return <BsFileEarmarkPdf className="text-3xl text-red-500" />;
    if (type?.includes('word') || type?.includes('document') || type?.includes('msword')) return <BsFileEarmarkWord
  className="text-3xl text-blue-600" />;
    if (type?.includes('excel') || type?.includes('sheet') || type?.includes('spreadsheet')) return <BsFileEarmarkExcel
  className="text-3xl text-green-500" />;
    if (type?.includes('presentation') || type?.includes('powerpoint')) return <BsFileEarmarkPpt className="text-3xl text-orange-500"
   />;
    if (type?.includes('zip') || type?.includes('rar') || type?.includes('tar') || type?.includes('gzip')) return <BsFileEarmarkZip
  className="text-3xl text-yellow-500" />;
    if (type?.includes('video')) return <BsFileEarmarkPlay className="text-3xl text-purple-500" />;
    if (type?.includes('audio')) return <BsFileEarmarkMusic className="text-3xl text-pink-500" />;
    if (type?.includes('javascript') || type?.includes('json') || type?.includes('html') || type?.includes('css') ||
  type?.includes('xml')) return <BsFileEarmarkCode className="text-3xl text-emerald-500" />;
    if (type?.includes('text')) return <BsFileEarmarkText className="text-3xl text-gray-500" />;
    return <BsFileEarmark className="text-3xl text-gray-400" />;
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

    useEffect(() => {
      fetchFolders();
    }, []);

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
      } catch (err) {
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
        console.error('Api error', err);
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
      } catch (err) {
        alert('Rename failed');
      } finally {
        setRenamingId(null);
      }
    };

    const formatDate = (instant) => {
      return new Date(instant).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Folders</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {folders.length} folder{folders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-3 rounded-xl
  font-semibold hover:opacity-90 transition shadow-lg shadow-primary-500/25"
            >
              <MdCreateNewFolder className="text-xl" />
              New Folder
            </button>
          </div>

          {/* Folders Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : folders.length === 0 ? (
            <div className="text-center py-20">
              <MdFolder className="text-6xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No folders yet. Create your first folder!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 cursor-pointer hover:shadow-lg transition duration-300
   ${
                    selectedFolder?.id === folder.id
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <MdFolder className="text-4xl text-yellow-400" />
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleRenameStart(e, folder)}
                        className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg hover:bg-blue-100 transition"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(folder.id); }}
                        className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 transition"
                      >
                        <MdDelete />
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
                        className="flex-1 text-sm px-2 py-1 rounded border border-primary-400 bg-gray-50 dark:bg-gray-800
  text-gray-900 dark:text-white focus:outline-none"
                      />
                      <button onClick={() => handleRenameSubmit(folder.id)} className="text-green-500 hover:text-green-600"><MdCheck
  /></button>
                      <button onClick={() => setRenamingId(null)} className="text-gray-400 hover:text-gray-600"><MdClose /></button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{folder.name}</h3>
                  )}

                  <p className="text-sm text-gray-400">{folder.fileCount} file{folder.fileCount !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-gray-400">{formatDate(folder.createdAt)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Selected Folder Files */}
          {selectedFolder && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MdFolder className="text-yellow-400" />
                  {selectedFolder.name}
                </h2>
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              {folderFiles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <BsFileEarmark className="text-4xl text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">No files in this folder</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folderFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
                    >
                      <div className="mb-3">{getFileIcon(file.fileType)}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{file.originalName}</h3>
                      <p className="text-sm text-gray-400 mt-1">{formatDate(file.uploadedAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Folder Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 w-full
  max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Folder</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <MdClose className="text-2xl" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
              )}

              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
  text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-6"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />

              <button
                onClick={handleCreate}
                disabled={!folderName.trim() || creating}
                className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-xl font-semibold
  hover:opacity-90 transition disabled:opacity-50"
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
