// ─── Incident Filter Sheet ──────────────────────────────────

'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useIncidentsStore } from '@/stores/incidents.store';
import type { IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/incident.types';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS, STATUS_LABELS } from '@/lib/utils/constants';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSheet({ isOpen, onClose }: FilterSheetProps) {
  const { filters, setFilters, clearFilters, fetchIncidents } = useIncidentsStore();
  const [localCategory, setLocalCategory] = useState<IncidentCategory | undefined>(filters.category);
  const [localSeverity, setLocalSeverity] = useState<IncidentSeverity | undefined>(filters.severity);
  const [localStatus, setLocalStatus] = useState<IncidentStatus | undefined>(filters.status);

  const handleApply = () => {
    setFilters({ category: localCategory, severity: localSeverity, status: localStatus });
    fetchIncidents({ category: localCategory, severity: localSeverity, status: localStatus });
    onClose();
  };

  const handleReset = () => {
    setLocalCategory(undefined);
    setLocalSeverity(undefined);
    setLocalStatus(undefined);
    clearFilters();
    fetchIncidents();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Incidents">
      <div className="space-y-5">
        {/* Category */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(INCIDENT_CATEGORIES) as [IncidentCategory, typeof INCIDENT_CATEGORIES[IncidentCategory]][]).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setLocalCategory(localCategory === key ? undefined : key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  localCategory === key
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Severity</h3>
          <div className="flex gap-2">
            {(Object.entries(SEVERITY_LEVELS) as [IncidentSeverity, typeof SEVERITY_LEVELS[IncidentSeverity]][]).map(([key, sev]) => (
              <button
                key={key}
                onClick={() => setLocalSeverity(localSeverity === key ? undefined : key)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  localSeverity === key
                    ? `${sev.bg} ${sev.text} border-current`
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(STATUS_LABELS) as [IncidentStatus, typeof STATUS_LABELS[IncidentStatus]][]).map(([key, st]) => (
              <button
                key={key}
                onClick={() => setLocalStatus(localStatus === key ? undefined : key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  localStatus === key
                    ? 'bg-zinc-800 text-white border-zinc-600'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <span className="w-2 h-2 inline-block rounded-full mr-1.5" style={{ backgroundColor: st.color }} />
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" fullWidth onClick={handleReset}>Reset</Button>
          <Button fullWidth onClick={handleApply}>Apply Filters</Button>
        </div>
      </div>
    </Modal>
  );
}
