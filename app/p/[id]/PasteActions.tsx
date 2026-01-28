// app/pastes/[id]/PasteActions.tsx
'use client';

import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

interface PasteActionsProps {
  content: string;
  filename?: string;
}

export default function PasteActions({
  content,
  filename = 'paste.txt',
}: PasteActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-end mb-6">
      <button
        onClick={handleCopy}
        disabled={copied}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200
          border border-slate-600 cursor-pointer
          ${copied 
            ? 'bg-green-900/40 text-green-300 border-green-700/50 ' 
            : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 hover:text-white'}
        `}
        title="Copy to clipboard"
      >
        {copied ? (
          <>
            <Check size={16} /> Copied!
          </>
        ) : (
          <>
            <Copy size={16} /> Copy
          </>
        )}
      </button>

      <button
        onClick={handleDownload}
        disabled={downloaded}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200
          border border-slate-600 cursor-pointer
          ${downloaded 
            ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' 
            : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 hover:text-white'}
        `}
        title="Download as text file"
      >
        {downloaded ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : (
          <>
            <Download size={16} /> Download
          </>
        )}
      </button>
    </div>
  );
}