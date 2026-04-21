import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import {
  getAllFiles,
  uploadFile,
  deleteFile,
  downloadFile,
  searchFiles,
  getFolders,
  getFilesByFolder
} from '../services/api';
import {
  MdUpload,
  MdDelete,
  MdDownload,
  MdSearch,
  MdInsertDriveFile,
  MdClose,
} from 'react-icons/md';
import { FiFolder } from 'react-icons/fi';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await getAllFiles();
      setFiles(res.data);
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

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchFiles();
    } else {
      const res = await searchFiles(query);
      setFiles(res.data);
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
      fetchFiles();
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      alert('Download failed');
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (instant) => {
    return new Date(instant).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return '🖼️';
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('word') || type?.includes('document')) return '📝';
    if (type?.includes('excel') || type?.includes('sheet')) return '📊';
    if (type?.includes('zip') || type?.includes('rar')) return '🗜️';
    return '📁';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Files
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {files.length} file{files.length !== 1 ? 's' : ''} stored
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-3 rounded-xl
  font-semibold hover:opacity-90 transition shadow-lg shadow-primary-500/25"
          >
            <MdUpload className="text-xl" />
            Upload File
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search files..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
  text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-20">
            <MdInsertDriveFile className="text-6xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No files yet. Upload your first file!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file,i) => (
              <div
                key={file.id}
                className={`animate-fadeInUp delay-${Math.min(
                  i * 100,
                  600
                )} bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg
                hover:border-primary-200 dark:hover:border-primary-800 transition duration-300`}
              >
                {/* File Icon */}
                <div className="text-4xl mb-3">
                  {getFileIcon(file.fileType)}
                </div>

                {/* File Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                  {file.originalName}
                </h3>

                {/* File Meta */}
                <p className="text-sm text-gray-400 mb-1">
                  {formatSize(file.size)}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {formatDate(file.uploadedAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file.id, file.originalName)}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600
  dark:text-primary-400 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition"
                  >
                    <MdDownload />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="flex items-center justify-center p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg
  hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 w-full
  max-w-md"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upload File
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* File Input */}
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center mb-4 cursor-pointer
   hover:border-primary-500 transition"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <MdUpload className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              {selectedFile ? (
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {selectedFile.name}
                </p>
              ) : (
                <p className="text-gray-400">Click to select a file</p>
              )}
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            {/* Folder Select */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
  text-gray-900 dark:text-white mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">No folder (root)</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-xl font-semibold
  hover:opacity-90 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
