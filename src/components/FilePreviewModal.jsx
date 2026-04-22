import { useState, useEffect, useRef } from 'react';
import { MdClose, MdDownload } from 'react-icons/md';
import { BsFileEarmarkMusic } from 'react-icons/bs';
import { MdInsertDriveFile } from 'react-icons/md';
import { downloadFile } from '../services/api';

export default function FilePreviewModal({ file, onClose, onDownload }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [objectUrl, setObjectUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const urlRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    const fetchPreview = async () => {
      try {
        const res = await downloadFile(file.id);
        const blob = res.data;

        if (isTextType(file.fileType)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setTextContent(e.target.result);
            setLoading(false);
          };
          reader.readAsText(blob);
        } else if (isPreviewable(file.fileType)) {
          const url = URL.createObjectURL(blob);
          urlRef.current = url;
          setObjectUrl(url);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch {
        setError('Failed to load preview.');
        setLoading(false);
      }
    };

    fetchPreview();

    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [file]);

  const isTextType = (type) =>
    type?.startsWith('text/') ||
    type?.includes('json') ||
    type?.includes('javascript') ||
    type?.includes('xml') ||
    type?.includes('css') ||
    type?.includes('html');

  const isPreviewable = (type) =>
    type?.startsWith('image/') ||
    type?.includes('pdf') ||
    type?.startsWith('video/') ||
    type?.startsWith('audio/') ||
    isTextType(type);

  const renderPreview = () => {
    const type = file.fileType;

    if (type?.startsWith('image/')) {
      return (
        <img
          src={objectUrl}
          alt={file.originalName}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      );
    }

    if (type?.includes('pdf')) {
      return (
        <iframe
          src={objectUrl}
          className="w-full h-full rounded-lg"
          title={file.originalName}
        />
      );
    }

    if (type?.startsWith('video/')) {
      return (
        <video src={objectUrl} controls className="max-w-full max-h-full rounded-lg">
          Your browser does not support video playback.
        </video>
      );
    }

    if (type?.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <BsFileEarmarkMusic className="text-8xl text-pink-400" />
          <audio src={objectUrl} controls className="w-full max-w-md">
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    if (isTextType(type)) {
      return (
        <pre className="w-full h-full overflow-auto text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-4
rounded-lg font-mono whitespace-pre-wrap break-words">
          {textContent}
        </pre>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
        <MdInsertDriveFile className="text-6xl text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Preview not available for this file type
        </p>
        <button
          onClick={() => onDownload(file.id, file.originalName)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-3 rounded-xl
font-semibold hover:opacity-90 transition"
        >
          <MdDownload />
          Download Instead
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-4xl
 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="font-semibold text-gray-900 dark:text-white truncate mr-4">
            {file.originalName}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDownload(file.id, file.originalName)}
              className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3
py-2 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition"
            >
              <MdDownload />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-0">
          {loading ? (
            <div className="text-gray-400">Loading preview...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            renderPreview()
          )}
        </div>
      </div>
    </div>
  );
}
