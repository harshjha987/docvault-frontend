import { useState } from 'react';
  import { MdClose, MdContentCopy, MdCheck, MdLinkOff } from 'react-icons/md';

  const BASE_URL = 'https://api.docvault.site/api/v1';

  export default function ShareModal({ file, onClose, onRevoke }) {
    const [copied, setCopied] = useState(false);
    const [revoking, setRevoking] = useState(false);

    const shareUrl = `${BASE_URL}/files/shared/${file.shareToken}`;

    const handleCopy = () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleRevoke = async () => {
      setRevoking(true);
      await onRevoke(file.id);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 w-full
  max-w-md">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Share File</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
              <MdClose className="text-2xl" />
            </button>
          </div>

          {/* File name */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Anyone with this link can view and download{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300 break-all">
              {file.originalName}
            </span>
          </p>

          {/* URL Box */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all select-all">
              {shareUrl}
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20
  text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition mb-3"
          >
            {copied ? <MdCheck className="text-green-500 text-lg" /> : <MdContentCopy className="text-lg" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          {/* Revoke Button */}
          <button
            onClick={handleRevoke}
            disabled={revoking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-800
  text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
          >
            <MdLinkOff className="text-lg" />
            {revoking ? 'Revoking...' : 'Revoke Link'}
          </button>
        </div>
      </div>
    );
  }
