// ─── Loading Page ───────────────────────────────────────────

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin mx-auto" />
        </div>
        <p className="text-xs text-zinc-500">Loading...</p>
      </div>
    </div>
  );
}
