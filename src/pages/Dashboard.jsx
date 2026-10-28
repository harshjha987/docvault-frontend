import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import FilePreviewModal from '../components/FilePreviewModal';
import ShareModal from '../components/ShareModal';
import {
  getAllFiles, uploadFile, deleteFile, downloadFile,
  searchFiles, getFolders, getFilesByFolder,
  shareFile, revokeShare, moveFile, getStats,
} from '../services/api';
import {
  MdUpload, MdDelete, MdDownload, MdSearch,
  MdInsertDriveFile, MdClose, MdPreview, MdShare,
  MdFolder,
} from 'react-icons/md';
import { FiMove } from 'react-icons/fi';
import {
  BsFileEarmarkImage, BsFileEarmarkPdf, BsFileEarmarkWord,
  BsFileEarmarkExcel, BsFileEarmarkPpt, BsFileEarmarkZip,
  BsFileEarmarkPlay, BsFileEarmarkMusic, BsFileEarmarkCode,
  BsFileEarmarkText, BsFileEarmark,
} from 'react-icons/bs';

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareModalFile, setShareModalFile] = useState(null);
  const [moveModalFile, setMoveModalFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles(0);
    fetchFolders();
    fetchStats();
  }, []);

  const fetchFiles = async (page = 0) => {
    setLoading(true);
    try {
      const res = await getAllFiles(page);
      setFiles(res.data.content);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await getFolders();
      setFolders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchFiles(0);
    } else {
      try {
        const res = await searchFiles(query);
        setFiles(res.data);
        setTotalPages(0);
        setCurrentPage(0);
        setTotalElements(res.data.length);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (selectedFolder) formData.append('folderId', selectedFolder);
      await uploadFile(formData);
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedFolder('');
      fetchFiles(0);
      fetchStats();
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await deleteFile(id);
      setFiles(files.filter((f) => f.id !== id));
      fetchStats();
    } catch {
      alert('Delete failed');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Download failed');
    }
  };

  const handleShare = async (file) => {
    if (file.shareToken) {
      setShareModalFile(file);
    } else {
      const res = await shareFile(file.id);
      setShareModalFile(res.data);
      setFiles(files.map((f) => (f.id === file.id ? res.data : f)));
    }
  };

  const handleRevoke = async (id) => {
    await revokeShare(id);
    setFiles(files.map((f) => (f.id === id ? { ...f, shareToken: null } : f)));
  };

  const handleMove = async (folderId) => {
    try {
      await moveFile(moveModalFile.id, folderId || null);
      setMoveModalFile(null);
      fetchFiles(currentPage);
    } catch {
      alert('Move failed');
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (instant) =>
    new Date(instant).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getFileIcon = (type) => {
    if (type?.includes('image'))       return <BsFileEarmarkImage className="text-3xl text-blue-400" />;
    if (type?.includes('pdf'))         return <BsFileEarmarkPdf className="text-3xl text-red-500" />;
    if (type?.includes('word') || type?.includes('document') || type?.includes('msword'))
                                       return <BsFileEarmarkWord className="text-3xl text-blue-600" />;
    if (type?.includes('excel') || type?.includes('sheet') || type?.includes('spreadsheet'))
                                       return <BsFileEarmarkExcel className="text-3xl text-green-500" />;
    if (type?.includes('presentation') || type?.includes('powerpoint'))
                                       return <BsFileEarmarkPpt className="text-3xl text-orange-500" />;
    if (type?.includes('zip') || type?.includes('rar') || type?.includes('tar') || type?.includes('gzip'))
                                       return <BsFileEarmarkZip className="text-3xl text-yellow-500" />;
    if (type?.includes('video'))       return <BsFileEarmarkPlay className="text-3xl text-purple-500" />;
    if (type?.includes('audio'))       return <BsFileEarmarkMusic className="text-3xl text-pink-500" />;
    if (type?.includes('javascript') || type?.includes('json') || type?.includes('html') ||
        type?.includes('css') || type?.includes('xml'))
                                       return <BsFileEarmarkCode className="text-3xl text-emerald-500" />;
    if (type?.includes('text'))        return <BsFileEarmarkText className="text-3xl text-gray-500" />;
    return <BsFileEarmark className="text-3xl text-gray-400" />;
  };

  const statsCards = stats ? [
    { label: 'Total Files',   value: stats.totalFiles,            icon: MdInsertDriveFile, color: 'text-primary-500',  bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { label: 'Storage Used',  value: formatSize(stats.totalSize), icon: MdUpload,          color: 'text-violet-500',   bg: 'bg-violet-50 dark:bg-violet-500/10'   },
    { label: 'Total Folders', value: stats.totalFolders,          icon: MdFolder,          color: 'text-amber-500',    bg: 'bg-amber-50 dark:bg-amber-500/10'     },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Files</h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">
                {searchQuery ? files.length : totalElements} file{(searchQuery ? files.length : totalElements) !== 1 ? 's' : ''} stored
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-primary-500/25 text-sm"
            >
              <MdUpload className="text-lg" />
              Upload File
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {statsCards.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</span>
                    <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`${color} text-lg`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search files by name..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-slate-700/50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <MdInsertDriveFile className="text-6xl text-gray-200 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white font-semibold mb-1">No files yet</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Upload your first file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file, i) => (
                <div
                  key={file.id}
                  className={`animate-fadeInUp delay-${Math.min(i * 100, 600)} bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      {getFileIcon(file.fileType)}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500 font-medium mt-1">
                      {formatSize(file.size)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm mb-0.5">
                    {file.originalName}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
                    {formatDate(file.uploadedAt)}
                  </p>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPreviewFile(file)}
                      title="Preview"
                      className="p-2 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                    >
                      <MdPreview className="text-base" />
                    </button>
                    <button
                      onClick={() => handleShare(file)}
                      title="Share"
                      className="p-2 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                    >
                      <MdShare className={`text-base ${file.shareToken ? 'text-primary-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => setMoveModalFile(file)}
                      title="Move"
                      className="p-2 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                    >
                      <FiMove className="text-base" />
                    </button>
                    <button
                      onClick={() => handleDownload(file.id, file.originalName)}
                      className="flex-1 flex items-center justify-center gap-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 py-2 rounded-lg text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-500/20 transition"
                    >
                      <MdDownload className="text-sm" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      title="Delete"
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => fetchFiles(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 transition"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => fetchFiles(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-7 w-full max-w-md animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upload File</h2>
              <button onClick={() => { setShowUploadModal(false); setError(''); setSelectedFile(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">
                <MdClose className="text-xl" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm border border-red-100 dark:border-red-500/20">{error}</div>
            )}

            <div
              className="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl p-8 text-center mb-4 cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <MdUpload className="text-4xl text-gray-300 dark:text-slate-600 mx-auto mb-2" />
              {selectedFile ? (
                <p className="text-gray-700 dark:text-slate-300 font-medium text-sm">{selectedFile.name}</p>
              ) : (
                <p className="text-gray-400 dark:text-slate-500 text-sm">Click to select a file</p>
              )}
              <input id="fileInput" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>

            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white mb-5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
            >
              <option value="">No folder (root)</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg shadow-primary-500/25"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}

      {/* Move Modal */}
      {moveModalFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-7 w-full max-w-md animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Move File</h2>
              <button onClick={() => setMoveModalFile(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">
                <MdClose className="text-xl" />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 truncate">
              Moving: <span className="text-gray-900 dark:text-white font-semibold">{moveModalFile.originalName}</span>
            </p>

            <select
              defaultValue=""
              id="moveFolderSelect"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white mb-5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
            >
              <option value="">Root (no folder)</option>
              {folders
                .filter((f) => f.id !== moveModalFile.folderId)
                .map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
            </select>

            <button
              onClick={() => handleMove(document.getElementById('moveFolderSelect').value || null)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-primary-500/25"
            >
              Move
            </button>
          </div>
        </div>
      )}

      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} onDownload={handleDownload} />
      )}
      {shareModalFile && (
        <ShareModal file={shareModalFile} onClose={() => setShareModalFile(null)} onRevoke={handleRevoke} />
      )}

      <ScrollToTop />
    </div>
  );
}
