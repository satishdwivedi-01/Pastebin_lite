'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react'; // optional: npm install lucide-react

export default function Home() {
  const [content, setContent] = useState('');
  const [maxViews, setMaxViews] = useState<number | ''>('');
  const [ttlMinutes, setTtlMinutes] = useState<number | ''>('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit() {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const payload: any = { content };
      if (maxViews !== '' && maxViews >= 1) payload.max_views = maxViews;
      if (ttlMinutes !== '' && ttlMinutes >= 1) payload.ttl_seconds = ttlMinutes * 60;

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create paste');

      const data = await res.json();
      setUrl(data.url);
      // Optional: reset form after success
      // setContent('');
      // setMaxViews('');
      // setTtlMinutes('');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Quick Paste
          </h1>
          <p className="mt-3 text-slate-400">Share code, text, anything — instantly • optional limits</p>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-black/40">
          <div className="p-6 pb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type anything here..."
              className="w-full h-[min(50vh,480px)] resize-none rounded-xl bg-slate-900/70 border border-slate-700/70 p-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono text-base leading-relaxed transition-all"
              spellCheck={false}
            />

            {/* Optional settings */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="max-views" className="block mb-2 text-sm font-medium text-slate-300">
                  Max Views (optional)
                </label>
                <input
                  id="max-views"
                  type="number"
                  min={1}
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl bg-slate-900/70 border border-slate-700/70 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="mt-1.5 text-xs text-slate-500">Leave empty for unlimited views</p>
              </div>

              <div>
                <label htmlFor="expiry" className="block mb-2 text-sm font-medium text-slate-300">
                  Expiry (minutes, optional)
                </label>
                <input
                  id="expiry"
                  type="number"
                  min={1}
                  value={ttlMinutes}
                  onChange={(e) => setTtlMinutes(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 1440 (1 day)"
                  className="w-full rounded-xl bg-slate-900/70 border border-slate-700/70 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="mt-1.5 text-xs text-slate-500">Leave empty for no expiry</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-700/60 px-6 py-5">
            <button
              onClick={submit}
              disabled={isLoading || !content.trim()}
              className={`
                px-8 py-3 rounded-xl font-medium text-white
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-500 hover:to-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-blue-900/30
                flex items-center gap-2
              `}
            >
              {isLoading ? <>Creating...</> : <>Create Paste</>}
            </button>

            {url && (
              <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-700/50">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium truncate max-w-[240px] sm:max-w-[360px]"
                >
                  {url}
                </a>

                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="Copy link"
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} className="text-slate-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">
          Pastes are public • No sign-up required • Limits optional
        </p>
      </div>
    </div>
  );
}