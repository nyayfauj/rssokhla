// ─── Badge Component ────────────────────────────────────────

import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'danger' | 'warning' | 'success' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
  className?: string;
}

const VARIANT_MAP: Record<BadgeVariant, string> = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const SIZE_MAP: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({ children, variant = 'default', size = 'sm', pulse, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full border
        ${VARIANT_MAP[variant]}
        ${SIZE_MAP[size]}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            variant === 'danger' ? 'bg-red-400' : variant === 'warning' ? 'bg-amber-400' : 'bg-green-400'
          }`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-green-500'
          }`} />
        </span>
      )}
      {children}
    </span>
  );
}
