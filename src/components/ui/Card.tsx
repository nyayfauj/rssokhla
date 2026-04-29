// ─── Card Component ─────────────────────────────────────────

import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'danger' | 'success';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const VARIANT_MAP = {
  default: 'bg-zinc-900 border-zinc-800',
  elevated: 'bg-zinc-900 border-zinc-700 shadow-xl shadow-black/20',
  danger: 'bg-red-950/30 border-red-900/50',
  success: 'bg-green-950/30 border-green-900/50',
};

const PADDING_MAP = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        border rounded-2xl
        ${VARIANT_MAP[variant]}
        ${PADDING_MAP[padding]}
        ${interactive ? 'cursor-pointer hover:border-zinc-600 active:scale-[0.99] transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
