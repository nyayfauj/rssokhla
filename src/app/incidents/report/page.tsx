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
  const [area, setArea] = useState<string>('');
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
    if (step === 0) return true;
    if (step === 1) return !!area || !!landmark;
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
      coordinates: coordinates ? [...coordinates] : [],
      locationId: area,
      landmark: landmark,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      media: media.map(m => m.blob),
    };

    if (isOffline) {
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
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white text-sm">📢</span>
            Report an Incident
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>
        <button onClick={() => router.back()} aria-label="Cancel report" className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-900 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-6 flex items-center gap-3" role="status">
          <span className="animate-pulse text-amber-500 text-lg" aria-hidden="true">📶</span>
          <div>
            <p className="text-xs font-semibold text-amber-500">You&apos;re Offline</p>
            <p className="text-xs text-amber-500/60">Your report will be saved locally and synced when you reconnect.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Step 0: Category ────────────────────── */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-sm font-medium text-zinc-400 mb-4">Select Report Category</p>
              <QuickCategoryPicker selected={category} onSelect={setCategory} />
            </div>

            <button type="button" onClick={() => setUrgency(!urgency)} aria-pressed={urgency}
              className={`w-full py-4 rounded-2xl border text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                urgency ? 'border-red-600 bg-red-600/20 text-red-500' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700'
              }`}>
              {urgency ? '🚨 High Priority' : 'Mark as Urgent'}
            </button>
          </div>
        )}

        {/* ─── Step 1: Location ────────────────────── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-sm font-medium text-zinc-400 mb-4">Select Location</p>
              <LocationPicker area={area} onAreaChange={setArea} coordinates={coordinates} onCoordinatesChange={setCoordinates} landmark={landmark} onLandmarkChange={setLandmark} />
            </div>
          </div>
        )}

        {/* ─── Step 2: Details ─────────────────────── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="report-title" className="text-sm font-medium text-zinc-400 ml-1">Report Title</label>
                <input id="report-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief description of the incident"
                  className="w-full bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-600 rounded-2xl px-5 py-4 text-sm focus:border-red-600 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label htmlFor="report-desc" className="text-sm font-medium text-zinc-400 ml-1">Description</label>
                <textarea id="report-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide details about what happened..."
                  rows={4} className="w-full bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-600 rounded-2xl px-5 py-4 text-sm focus:border-red-600 outline-none transition-all resize-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Severity Level</label>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Severity level">
                {(Object.entries(SEVERITY_LEVELS) as [IncidentSeverity, typeof SEVERITY_LEVELS[IncidentSeverity]][]).map(([key, sev]) => (
                  <button key={key} type="button" onClick={() => setSeverity(key)} aria-checked={severity === key} role="radio"
                    className={`py-3 rounded-xl border text-xs font-semibold transition-all active:scale-[0.97] ${
                      severity === key ? `border-current ${sev.text} ${sev.bg}` : 'border-zinc-800 bg-zinc-900 text-zinc-600 hover:border-zinc-700'
                    }`}>{sev.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: Media ───────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-sm font-medium text-zinc-400 mb-4">Photos &amp; Media</p>
              <MediaCapture media={media} onAdd={addMedia} onRemove={removeMedia} voiceText={voiceText} onVoiceText={setVoiceText} />
            </div>
          </div>
        )}

        {/* ─── Step 4: Review ──────────────────────── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl divide-y divide-zinc-800/20 overflow-hidden" role="list" aria-label="Report summary">
              {[
                { l: 'Location', v: landmark || (area ? OKHLA_AREAS[area as OkhlaArea]?.label : 'Not set') },
                { l: 'Category', v: category },
                { l: 'Title', v: title },
                { l: 'Severity', v: SEVERITY_LEVELS[severity].label },
                { l: 'Media', v: media.length > 0 ? `${media.length} file(s)` : 'None' },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between px-5 py-4" role="listitem">
                  <span className="text-xs text-zinc-500 font-medium">{r.l}</span>
                  <span className="text-sm text-zinc-300">{r.v}</span>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setAnonymous(!anonymous)} aria-pressed={anonymous}
              className={`w-full py-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                anonymous ? 'border-purple-600/40 bg-purple-600/10 text-purple-400' : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700'
              }`}>
              {anonymous ? '🕶️ Submitting Anonymously' : 'Submit with My Profile'}
            </button>

            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 space-y-2">
              <p className="text-xs text-zinc-400 font-medium flex items-center gap-2">
                ⚠️ Important
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Reports submitted to the platform are archived for community records. Please ensure the information you provide is accurate and submitted in good faith.
              </p>
            </div>
          </div>
        )}

        {/* ─── Navigation ──────────────────────────── */}
        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}
              aria-label="Go back to previous step"
              className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium rounded-2xl hover:bg-zinc-800 hover:text-zinc-200 transition-all active:scale-[0.98]">
              &larr; Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={!canAdvance()}
              className={`flex-1 py-4 text-sm font-semibold rounded-2xl transition-all active:scale-[0.98] shadow-lg ${
                canAdvance() ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' : 'bg-zinc-900 text-zinc-700 border border-zinc-800 cursor-not-allowed'
              }`}>
              Continue &rarr;
            </button>
          ) : (
            <button type="submit" disabled={submitting || !canAdvance()}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-red-900/40">
              {submitting ? <><span className="animate-spin text-lg" aria-hidden="true">⚙️</span> Submitting...</> : <>{isOffline ? '💾 Save Draft' : '🚀 Submit Report'}</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
