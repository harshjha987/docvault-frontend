import { useState } from 'react';
  import { MdClose, MdContentCopy, MdCheck, MdLinkOff } from 'react-icons/md';

  const BASE_URL = 'https://api.docvault.site/api/v1';

  export default function ShareModal({ file, onClose, onRevoke }) {
    const [copied, setCopied] = useState(false);
    const [revoking, setRevoking] = useState(false);

    const shareUrl = `${BASE_URL}/files/shared/${file.shareToken}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(shareUrl);
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 w-full
  max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share File</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <MdClose className="text-2xl" />
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Anyone with this link can view and download <span className="font-medium text-gray-700
  dark:text-gray-300">{file.originalName}</span>
          </p>

          <div className="flex gap-2 mb-6">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
  text-gray-700 dark:text-gray-300 text-sm focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600
  dark:text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition shrink-0"
            >
              {copied ? <MdCheck className="text-green-500" /> : <MdContentCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <button
            onClick={handleRevoke}
            disabled={revoking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-800
  text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
          >
            <MdLinkOff />
            {revoking ? 'Revoking...' : 'Revoke Link'}
          </button>
        </div>
      </div>
    );
  }
