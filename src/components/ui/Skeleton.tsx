// ─── Skeleton Component ─────────────────────────────────────

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  lines?: number;
}

export default function Skeleton({ className = '', variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-zinc-900/80 rounded-lg';
  const shimmerClasses = 'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-600/5 to-transparent animate-[shimmer_2s_infinite]';

  const Shimmer = () => (
    <div className={shimmerClasses} />
  );

  const style = { width: width || '100%', height: height || '16px' };

  if (variant === 'circular') {
    return (
      <div className={`${baseClasses} rounded-full ${className}`} style={{ ...style, width: width || '40px', height: height || '40px' }}>
        <Shimmer />
      </div>
    );
  }

  if (variant === 'rectangular') {
    return (
      <div className={`${baseClasses} ${className}`} style={{ ...style, height: height || '120px' }}>
        <Shimmer />
      </div>
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
        >
          <Shimmer />
        </div>
      ))}
    </div>
  );
}
