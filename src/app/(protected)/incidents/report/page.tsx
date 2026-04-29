// ─── Incident Report Form Page ──────────────────────────────

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useUIStore } from '@/stores/ui.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import type { IncidentCategory, IncidentSeverity } from '@/types/incident.types';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';
import { OKHLA_AREAS } from '@/types/location.types';
import type { OkhlaArea } from '@/types/location.types';

export default function ReportIncidentPage() {
  const router = useRouter();
  const { user, isAnonymous } = useAuthStore();
  const { createIncident, isLoading } = useIncidentsStore();
  const addToast = useUIStore((s) => s.addToast);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('other');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [area, setArea] = useState<OkhlaArea | ''>('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      addToast({ type: 'error', message: 'Title and description are required' });
      return;
    }

    const areaData = area ? OKHLA_AREAS[area] : null;

    await createIncident(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        isAnonymous,
        coordinates: areaData ? [...areaData.center] : [],
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      },
      user?.$id || 'anonymous',
      isAnonymous
    );

    addToast({ type: 'success', message: 'Incident reported successfully' });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Report Incident</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Submit a new observation. {isAnonymous ? 'Reporting anonymously.' : 'Your identity is protected.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <Input
          label="Title"
          placeholder="Brief description of the activity"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Description</label>
          <textarea
            placeholder="Detailed account of what you observed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(INCIDENT_CATEGORIES) as [IncidentCategory, typeof INCIDENT_CATEGORIES[IncidentCategory]][]).map(([key, cat]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`
                  p-2.5 rounded-xl border text-center transition-all text-xs
                  ${category === key
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                  }
                `}
              >
                <span className="text-lg block mb-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Severity</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(SEVERITY_LEVELS) as [IncidentSeverity, typeof SEVERITY_LEVELS[IncidentSeverity]][]).map(([key, sev]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSeverity(key)}
                className={`
                  py-2 rounded-xl border text-xs font-medium transition-all
                  ${severity === key
                    ? `border-current ${sev.text} ${sev.bg}`
                    : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600'
                  }
                `}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        {/* Area */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Area</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value as OkhlaArea)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <option value="">Select area...</option>
            {Object.entries(OKHLA_AREAS).map(([key, a]) => (
              <option key={key} value={key}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <Input
          label="Tags (comma-separated)"
          placeholder="e.g. shakha, meeting, flyers"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Anonymous indicator */}
        {isAnonymous && (
          <Card variant="default" padding="sm">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>🕶️</span>
              <span>This report will be submitted anonymously</span>
            </div>
          </Card>
        )}

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
}
