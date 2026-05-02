import { type ReactNode, type HTMLAttributes, useCallback } from 'react';

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
  onClick,
  onKeyDown,
  ...props
}: CardProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).click();
      }
    },
    [interactive, onKeyDown]
  );

  return (
    <div
      className={`
        border rounded-2xl
        ${VARIANT_MAP[variant]}
        ${PADDING_MAP[padding]}
        ${interactive ? 'cursor-pointer hover:border-zinc-600 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50' : ''}
        ${className}
      `}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}
