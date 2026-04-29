// ─── Incident Detail Page ───────────────────────────────────

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import SeverityBadge from '@/components/incidents/SeverityBadge';
import { INCIDENT_CATEGORIES, STATUS_LABELS } from '@/lib/utils/constants';
import { formatDate, formatCoordinates } from '@/lib/utils/formatters';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { selectedIncident, isLoading, error, getIncident, verifyIncident } = useIncidentsStore();
  const { user, isAnonymous } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (id) getIncident(id);
  }, [id, getIncident]);

  const handleVerify = async () => {
    if (!user || isAnonymous) {
      addToast({ type: 'warning', message: 'Anonymous users cannot verify reports' });
      return;
    }
    setVerifying(true);
    await verifyIncident(id, user.$id);
    await getIncident(id);
    setVerifying(false);
    addToast({ type: 'success', message: 'Incident verified' });
  };

  const incident = selectedIncident;

  if (isLoading || !incident) {
    return (
      <div className="space-y-4">
        <Skeleton height="24px" width="60%" />
        <Skeleton variant="rectangular" height="200px" />
        <Skeleton lines={4} />
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="danger" padding="lg">
        <div className="text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-sm text-red-400 mt-3">{error}</p>
          <Button variant="danger" size="sm" onClick={() => router.push('/incidents')} className="mt-4">
            Back to Incidents
          </Button>
        </div>
      </Card>
    );
  }

  const category = INCIDENT_CATEGORIES[incident.category];
  const status = STATUS_LABELS[incident.status];
  const alreadyVerified = user ? incident.verifiedBy.includes(user.$id) : false;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{category.icon}</span>
            <Badge variant="default" size="sm">{category.label}</Badge>
            <SeverityBadge severity={incident.severity} />
          </div>
          <h1 className="text-xl font-bold text-white">{incident.title}</h1>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
          <span style={{ color: status.color }} className="font-medium">{status.label}</span>
        </div>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400">{formatDate(incident.timestamp)}</span>
        {incident.isAnonymous && (
          <>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">🕶️ Anonymous</span>
          </>
        )}
      </div>

      {/* Description */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</h2>
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{incident.description}</p>
      </Card>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Location */}
        {incident.coordinates.length === 2 && (
          <Card padding="sm">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase mb-1">Location</h3>
            <p className="text-xs text-zinc-300">{formatCoordinates(incident.coordinates)}</p>
          </Card>
        )}

        {/* Verification */}
        <Card padding="sm">
          <h3 className="text-[10px] font-semibold text-zinc-500 uppercase mb-1">Verifications</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{incident.verificationCount}</span>
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-5 h-5 rounded-full border-2 border-zinc-900 ${i <= incident.verificationCount ? 'bg-green-500' : 'bg-zinc-800'}`} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            {incident.verificationCount >= 3 ? 'Community verified ✓' : `${3 - incident.verificationCount} more needed`}
          </p>
        </Card>

        {/* Category detail */}
        <Card padding="sm">
          <h3 className="text-[10px] font-semibold text-zinc-500 uppercase mb-1">Category</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl">{category.icon}</span>
            <span className="text-sm text-white font-medium">{category.label}</span>
          </div>
        </Card>

        {/* Reporter */}
        <Card padding="sm">
          <h3 className="text-[10px] font-semibold text-zinc-500 uppercase mb-1">Reporter</h3>
          <p className="text-xs text-zinc-300">{incident.isAnonymous ? '🕶️ Anonymous' : incident.reporterId.slice(-8)}</p>
        </Card>
      </div>

      {/* Tags */}
      {incident.tags.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {incident.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Media */}
      {incident.mediaUrls.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Evidence ({incident.mediaUrls.length})</h2>
          <div className="grid grid-cols-3 gap-2">
            {incident.mediaUrls.map((url, i) => (
              <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📎</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {!isAnonymous && (
          <Button
            onClick={handleVerify}
            variant={alreadyVerified ? 'secondary' : 'primary'}
            fullWidth
            size="lg"
            isLoading={verifying}
            disabled={alreadyVerified}
            icon={<span>{alreadyVerified ? '✓' : '✅'}</span>}
          >
            {alreadyVerified ? 'Already Verified' : 'Verify This Incident'}
          </Button>
        )}
        <Button variant="outline" size="lg" className="flex-shrink-0" onClick={() => { navigator.share?.({ title: incident.title, text: incident.description, url: window.location.href }); }}>
          Share
        </Button>
      </div>
    </div>
  );
}
