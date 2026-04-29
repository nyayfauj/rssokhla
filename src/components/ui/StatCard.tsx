// ─── Stat Card Component ────────────────────────────────────

import Card from '@/components/ui/Card';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down'; value: string };
  variant?: 'default' | 'danger';
}

export default function StatCard({ icon, label, value, trend, variant = 'default' }: StatCardProps) {
  return (
    <Card padding="sm" variant={variant === 'danger' ? 'danger' : 'default'}>
      <div className="flex items-start justify-between">
        <span className="text-lg">{icon}</span>
        {trend && (
          <span className={`text-[10px] font-semibold ${trend.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mt-1.5">{value}</p>
      <p className="text-[10px] text-zinc-500 mt-0.5">{label}</p>
    </Card>
  );
}
