// ─── Skeleton Component ─────────────────────────────────────

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  lines?: number;
}

export default function Skeleton({ className = '', variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-zinc-800 rounded-lg';

  if (variant === 'circular') {
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={{ width: width || '40px', height: height || '40px' }}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={`${baseClasses} ${className}`}
        style={{ width: width || '100%', height: height || '120px' }}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={baseClasses}
          style={{
            width: i === lines - 1 && lines > 1 ? '75%' : (width || '100%'),
            height: height || '16px',
          }}
        />
      ))}
    </div>
  );
}
