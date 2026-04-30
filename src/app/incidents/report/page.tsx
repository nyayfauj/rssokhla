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
          <h1 className="text-xl font-black uppercase tracking-tighter italic text-red-500 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white not-italic text-sm">INTEL</span> Transmit Intelligence
          </h1>
          <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">
            Phase {step + 1} / {STEPS.length}: Protocol {STEPS[step]}
          </p>
        </div>
        <button onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors">Abort</button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-900 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${progress}%` }} />
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-6 flex items-center gap-3">
          <span className="animate-pulse text-amber-500 text-lg">📡</span>
          <div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Offline Node Detected</p>
            <p className="text-[9px] text-amber-500/60 uppercase">Intel will be cached locally and synced on reconnection.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Step 0: Category ────────────────────── */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Select Intelligence Category</p>
              <QuickCategoryPicker selected={category} onSelect={setCategory} />
            </div>

            <button type="button" onClick={() => setUrgency(!urgency)}
              className={`w-full py-4 rounded-2xl border text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                urgency ? 'border-red-600 bg-red-600/20 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 hover:border-zinc-700'
              }`}>
              {urgency ? '🚨 MISSION CRITICAL / URGENT' : 'Mark as Urgent Intelligence'}
            </button>
          </div>
        )}

        {/* ─── Step 1: Location ────────────────────── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Pinpoint Operational Zone</p>
              <LocationPicker area={area} onAreaChange={setArea} coordinates={coordinates} onCoordinatesChange={setCoordinates} landmark={landmark} onLandmarkChange={setLandmark} />
            </div>
          </div>
        )}

        {/* ─── Step 2: Details ─────────────────────── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Intelligence Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.G. SUSPECTED SURVEILLANCE NEAR HUB"
                  className="w-full bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-700 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest focus:border-red-600 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Field Observations</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="DETAILED ACCOUNT OF THE OBSERVATION..."
                  rows={4} className="w-full bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-700 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest focus:border-red-600 outline-none transition-all resize-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Threat Level Assessment</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(SEVERITY_LEVELS) as [IncidentSeverity, typeof SEVERITY_LEVELS[IncidentSeverity]][]).map(([key, sev]) => (
                  <button key={key} type="button" onClick={() => setSeverity(key)}
                    className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all active:scale-[0.97] ${
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
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Evidence & Media Capture</p>
              <MediaCapture media={media} onAdd={addMedia} onRemove={removeMedia} voiceText={voiceText} onVoiceText={setVoiceText} />
            </div>
          </div>
        )}

        {/* ─── Step 4: Review ──────────────────────── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl divide-y divide-zinc-800/20 overflow-hidden">
              {[
                { l: 'Sector', v: landmark || (area ? OKHLA_AREAS[area as OkhlaArea]?.label : 'Not set') },
                { l: 'Category', v: category.toUpperCase() },
                { l: 'Title', v: title.toUpperCase() },
                { l: 'Threat', v: SEVERITY_LEVELS[severity].label.toUpperCase() },
                { l: 'Evidence', v: media.length > 0 ? `${media.length} FILE(S)` : 'NONE' },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between px-5 py-4">
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{r.l}</span>
                  <span className="text-[10px] text-zinc-300 font-bold tracking-widest">{r.v}</span>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setAnonymous(!anonymous)}
              className={`w-full py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                anonymous ? 'border-purple-600/40 bg-purple-600/10 text-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.05)]' : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 hover:border-zinc-700'
              }`}>
              {anonymous ? '🕶️ ANONYMOUS PROTOCOL ACTIVE' : 'TRANSMIT AS VERIFIED NODE'}
            </button>

            <div className="bg-red-600/5 border border-red-600/20 rounded-2xl p-4 space-y-2">
              <p className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2">
                ⚠️ IMMUTABILITY NOTICE
              </p>
              <p className="text-[8px] text-zinc-500 uppercase tracking-tighter leading-relaxed">
                Intelligence transmitted to the network is permanent and uneditable. You are exercising your fundamental duty under Article 51A of the Constitution.
              </p>
            </div>
          </div>
        )}

        {/* ─── Navigation ──────────────────────────── */}
        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 hover:text-zinc-300 transition-all active:scale-[0.98]">
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={!canAdvance()}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-[0.98] shadow-lg ${
                canAdvance() ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' : 'bg-zinc-900 text-zinc-700 border border-zinc-800 cursor-not-allowed'
              }`}>
              Analyze & Proceed →
            </button>
          ) : (
            <button type="submit" disabled={submitting || !canAdvance()}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-red-900/40">
              {submitting ? <><span className="animate-spin text-lg">⚙️</span> TRANSMITTING...</> : <>{isOffline ? '💾 CACHE INTEL' : '🚀 TRANSMIT INTELLIGENCE'}</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
