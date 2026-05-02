// ─── Toast Component ────────────────────────────────────────

'use client';

import { useUIStore, type Toast as ToastType } from '@/stores/ui.store';

const ICON_MAP = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const COLOR_MAP = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

const ICON_COLOR_MAP = {
  success: 'text-green-400 bg-green-500/20',
  error: 'text-red-400 bg-red-500/20',
  warning: 'text-amber-400 bg-amber-500/20',
  info: 'text-blue-400 bg-blue-500/20',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-xl border backdrop-blur-md
        animate-in slide-in-from-top-2 fade-in duration-300
        ${COLOR_MAP[toast.type]}
      `}
    >
      <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${ICON_COLOR_MAP[toast.type]}`}>
        {ICON_MAP[toast.type]}
      </span>
      <p className="text-sm text-zinc-200 flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
