// ─── Incident Card Component ────────────────────────────────

'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Incident } from '@/types/incident.types';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS, STATUS_LABELS } from '@/lib/utils/constants';
import { timeAgo, truncate } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';

interface IncidentCardProps {
  incident: Incident;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  const router = useRouter();
  const category = INCIDENT_CATEGORIES[incident.category];
  const severity = SEVERITY_LEVELS[incident.severity];
  const status = STATUS_LABELS[incident.status];

  return (
    <Card
      interactive
      variant={incident.severity === 'critical' ? 'danger' : 'default'}
      onClick={() => router.push(`/incidents/${incident.$id}`)}
      className="group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{category.icon}</span>
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
            {incident.title}
          </h3>
        </div>
        <Badge
          variant={incident.severity === 'critical' ? 'danger' : incident.severity === 'high' ? 'warning' : 'default'}
          pulse={incident.severity === 'critical'}
          size="sm"
        >
          {severity.label}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
        {truncate(incident.description, 120)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500">{timeAgo(incident.timestamp)}</span>
          <span style={{ color: status.color }} className="font-medium">
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {incident.isAnonymous && (
            <span className="text-zinc-600">👤 Anon</span>
          )}
          {incident.verificationCount > 0 && (
            <span className="text-green-500">
              ✓ {incident.verificationCount}
            </span>
          )}
          {incident.mediaUrls.length > 0 && (
            <span className="text-zinc-500">📎 {incident.mediaUrls.length}</span>
          )}
        </div>
      </div>

      {/* Tags */}
      {incident.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {incident.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded">
              #{tag}
            </span>
          ))}
          {incident.tags.length > 3 && (
            <span className="text-[10px] text-zinc-600">+{incident.tags.length - 3}</span>
          )}
        </div>
      )}
    </Card>
  );
}
