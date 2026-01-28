// app/pastes/[id]/page.tsx
import { getPasteForView } from "@/lib/pasteRepo";
import { getNow } from "@/lib/time";
import PasteActions from "./PasteActions";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fakeReq = { headers: new Map() } as any;
  const now = getNow(fakeReq);

  const paste = await getPasteForView(id, now);

  if (!paste) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-slate-100">404</h1>
          <p className="text-xl text-slate-400">
            Paste not found, expired, or no views remaining
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            Create a new paste
          </a>
        </div>
      </div>
    );
  }

  const hasExpiry = paste.expiresAt !== null;
  const isExpiringSoon = hasExpiry
    ? new Date(paste.expiresAt).getTime() - now.getTime() < 24 * 60 * 60 * 1000
    : false;

  const hasViewLimit = paste.remainingViews !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-12">
        {/* Metadata + Actions bar */}
        <div className="mb-8 flex flex-col gap-6">
          {/* Title + expiry + views */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Paste <span className="text-slate-500 font-mono">#{id}</span>
              </h1>

              {hasExpiry ? (
                <p className="text-sm">
                  Expires{" "}
                  <time
                    className={`font-medium ${isExpiringSoon ? "text-orange-400" : "text-slate-300"}`}
                    dateTime={paste.expiresAt}
                  >
                    {new Date(paste.expiresAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}
                  </time>
                  {isExpiringSoon && (
                    <span className="ml-2 text-xs bg-orange-900/40 text-orange-300 px-2 py-0.5 rounded">
                      soon
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  No expiration date •{" "}
                  <span className="text-emerald-400 font-medium">
                    Lives forever
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
              <div>
                {hasViewLimit ? (
                  <>
                    <span className="text-slate-200 font-medium">
                      {paste.remainingViews}
                    </span>{" "}
                    views remaining
                  </>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    Unlimited views
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions – placed here so they feel connected to the paste info */}
          <PasteActions content={paste.content} filename={`paste-${id}.txt`} />
        </div>

        {/* Main paste card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">
          <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-700/60 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">Content</span>
            <span className="text-slate-500">
              Server-rendered • No JS required
            </span>
          </div>

          <div className="p-5 md:p-6">
            <pre
              className="
                whitespace-pre-wrap break-words font-mono text-base leading-7
                text-slate-50 bg-slate-950/60 p-6 md:p-8 rounded-xl border border-slate-700/50
                overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900
              "
            >
              {paste.content}
            </pre>
          </div>

          <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-4">
            <span>Pastebin Lite • Public paste</span>
            <span>
              {hasViewLimit ? (
                <>Remaining: {paste.remainingViews} views</>
              ) : (
                <>Unlimited views • No limit</>
              )}
            </span>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-10 text-center text-slate-500 text-sm space-x-6">
          <a href="/" className="hover:text-slate-300 transition-colors">
            Create new paste
          </a>
        </div>
      </div>
    </div>
  );
}
