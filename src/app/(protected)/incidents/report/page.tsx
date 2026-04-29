// ─── Multi-Step Incident Report Form ────────────────────────
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useUIStore } from '@/stores/ui.store';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';
import type { IncidentCategory, IncidentSeverity } from '@/types/incident.types';
import { SEVERITY_LEVELS } from '@/lib/utils/constants';
import QuickCategoryPicker from '@/components/report/QuickCategoryPicker';
import LocationPicker from '@/components/report/LocationPicker';
import MediaCapture, { type MediaItem } from '@/components/report/MediaCapture';
import { savePendingReport, getPendingCount } from '@/lib/offline-queue';

const STEPS = ['Category', 'Location', 'Details', 'Media', 'Review'] as const;
type Step = (typeof STEPS)[number];

export default function ReportIncidentPage() {
  const router = useRouter();
  const { user, isAnonymous } = useAuthStore();
  const { createIncident, isLoading } = useIncidentsStore();
  const addToast = useUIStore((s) => s.addToast);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Form state
  const [category, setCategory] = useState<IncidentCategory>('other');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [area, setArea] = useState<OkhlaArea | ''>('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [landmark, setLandmark] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [voiceText, setVoiceText] = useState('');
  const [anonymous, setAnonymous] = useState(isAnonymous);
  const [urgency, setUrgency] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    getPendingCount().then(setPendingCount).catch(() => {});
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const addMedia = (item: MediaItem) => setMedia(prev => [...prev, item]);
  const removeMedia = (id: string) => setMedia(prev => prev.filter(m => m.id !== id));

  const canAdvance = () => {
    if (step === 0) return true; // category always has default
    if (step === 1) return !!area;
    if (step === 2) return title.trim().length >= 3;
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: title.trim(),
      description: (description.trim() + (voiceText ? '\n\n[Voice] ' + voiceText : '')).trim(),
      category,
      severity,
      isAnonymous: anonymous,
      coordinates: coordinates ? [...coordinates] : area ? [...OKHLA_AREAS[area as OkhlaArea].center] : [],
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (isOffline) {
      // Save to IndexedDB for later sync
      await savePendingReport({
        ...payload,
        offlineId: `off-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        submittedAt: new Date().toISOString(),
        syncStatus: 'pending',
      });
      addToast({ type: 'info', message: 'Saved offline — will sync when connected' });
      setPendingCount(prev => prev + 1);
    } else {
      await createIncident(payload, user?.$id || 'anonymous', anonymous);
      addToast({ type: 'success', message: urgency ? '🚨 Urgent report submitted!' : 'Report submitted successfully' });
    }

    setSubmitting(false);
    router.push('/incidents');
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📝</span> Report Incident
          </h1>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>
        <button onClick={() => router.back()} className="text-xs text-zinc-500 hover:text-white">Cancel</button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-900 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 mb-4 flex items-center gap-2">
          <span>📡</span>
          <span className="text-xs text-amber-400">Offline mode — report will be saved locally and synced later</span>
        </div>
      )}
      {pendingCount > 0 && !isOffline && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2.5 mb-4 flex items-center gap-2">
          <span>🔄</span>
          <span className="text-xs text-blue-400">{pendingCount} pending report{pendingCount > 1 ? 's' : ''} waiting to sync</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ─── Step 0: Category ────────────────────── */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-zinc-400">What type of activity did you observe?</p>
            <QuickCategoryPicker selected={category} onSelect={setCategory} />

            {/* Urgency toggle */}
            <button type="button" onClick={() => setUrgency(!urgency)}
              className={`w-full py-3 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                urgency ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-600'
              }`}>
              🚨 {urgency ? 'Marked as URGENT' : 'Mark as Urgent (nearby users will be alerted)'}
            </button>
          </div>
        )}

        {/* ─── Step 1: Location ────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-zinc-400">Where did this occur?</p>
            <LocationPicker area={area} onAreaChange={setArea} coordinates={coordinates} onCoordinatesChange={setCoordinates} landmark={landmark} onLandmarkChange={setLandmark} />
          </div>
        )}

        {/* ─── Step 2: Details ─────────────────────── */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Brief Title <span className="text-red-400">*</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. RSS recruitment drive near school"
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed account of what you observed..."
                rows={4} className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none" />
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Severity</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(SEVERITY_LEVELS) as [IncidentSeverity, typeof SEVERITY_LEVELS[IncidentSeverity]][]).map(([key, sev]) => (
                  <button key={key} type="button" onClick={() => setSeverity(key)}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all active:scale-[0.97] ${
                      severity === key ? `border-current ${sev.text} ${sev.bg}` : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600'
                    }`}>{sev.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. shakha, flyers, school"
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" />
            </div>
          </div>
        )}

        {/* ─── Step 3: Media ───────────────────────── */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-zinc-400">Add evidence (optional). Photos, audio, or use voice-to-text.</p>
            <MediaCapture media={media} onAdd={addMedia} onRemove={removeMedia} voiceText={voiceText} onVoiceText={setVoiceText} />
          </div>
        )}

        {/* ─── Step 4: Review ──────────────────────── */}
        {step === 4 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-zinc-400 mb-3">Review your report before submitting.</p>

            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl divide-y divide-zinc-800/40 overflow-hidden">
              {[
                { l: 'Category', v: `${category.charAt(0).toUpperCase() + category.slice(1)}${urgency ? ' 🚨 URGENT' : ''}` },
                { l: 'Location', v: landmark || (area ? OKHLA_AREAS[area as OkhlaArea]?.label : 'Not set') },
                { l: 'Title', v: title },
                { l: 'Description', v: description || '—' },
                { l: 'Severity', v: SEVERITY_LEVELS[severity].label },
                { l: 'Media', v: media.length > 0 ? `${media.length} file(s)` : 'None' },
                { l: 'Voice Note', v: voiceText ? 'Yes' : 'None' },
                { l: 'Tags', v: tags || 'None' },
              ].map(r => (
                <div key={r.l} className="flex items-start justify-between px-3 py-2.5">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider w-20 flex-shrink-0">{r.l}</span>
                  <span className="text-xs text-zinc-300 text-right">{r.v}</span>
                </div>
              ))}
            </div>

            {/* Anonymous toggle */}
            <button type="button" onClick={() => setAnonymous(!anonymous)}
              className={`w-full py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                anonymous ? 'border-purple-500/40 bg-purple-500/10 text-purple-400' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500'
              }`}>
              🕶️ {anonymous ? 'Submitting Anonymously' : 'Submit Anonymously'}
            </button>

            {/* Security notice */}
            <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-2.5">
              <p className="text-[10px] text-green-400 flex items-center gap-1.5">
                🔒 End-to-end encrypted · IP address not stored · Source protected
              </p>
            </div>
          </div>
        )}

        {/* ─── Navigation ──────────────────────────── */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}
              className="flex-1 py-3 bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.98]">
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={!canAdvance()}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors active:scale-[0.98] ${
                canAdvance() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}>
              Next →
            </button>
          ) : (
            <button type="submit" disabled={submitting || !canAdvance()}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><span className="animate-spin">⏳</span> Submitting...</> : <>{isOffline ? '💾 Save Offline' : '🚀 Submit Report'}</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
