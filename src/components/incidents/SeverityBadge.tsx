// ─── Severity Badge ─────────────────────────────────────────

import Badge from '@/components/ui/Badge';
import type { IncidentSeverity } from '@/types/incident.types';
import { SEVERITY_LEVELS } from '@/lib/utils/constants';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
}

export default function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const meta = SEVERITY_LEVELS[severity];
  const variant = severity === 'critical' || severity === 'high'
    ? 'danger'
    : severity === 'medium'
      ? 'warning'
      : 'success';

  return (
    <Badge variant={variant} size={size} pulse={severity === 'critical'}>
      {meta.label}
    </Badge>
  );
}
