import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://nyayfauj.org';

async function getIncident(id: string) {
  try {
    const { databases } = createAdminClient();
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.INCIDENTS, id);
    return doc;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident) return { title: 'Burned | NyayFauj' };

  // Check if link is older than 24 hours
  const createdTime = new Date(incident.$createdAt).getTime();
  const now = new Date().getTime();
  const ageHours = (now - createdTime) / (1000 * 60 * 60);
  
  if (ageHours > 24) {
    return { title: 'Classified Intel Destroyed', robots: { index: false, follow: false } };
  }

  return {
    title: `ENCRYPTED DOSSIER | NyayFauj Burner Link`,
    robots: { index: false, follow: false },
  };
}

export default async function BurnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident) notFound();

  // Burner logic check
  const createdTime = new Date(incident.$createdAt).getTime();
  const now = new Date().getTime();
  const ageHours = (now - createdTime) / (1000 * 60 * 60);

  if (ageHours > 24) {
    return (
      <main className="min-h-screen bg-[#050606] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-red-950 rounded-full mx-auto flex items-center justify-center border border-red-900 animate-pulse">
            <span className="text-4xl">🔥</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-red-500 uppercase tracking-widest">Link Burned</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
              This classified intelligence dossier has self-destructed per the 24-hour security protocol.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const cat = INCIDENT_CATEGORIES[incident.category as keyof typeof INCIDENT_CATEGORIES] || { label: incident.category, icon: '📋', color: '#6b7280' };

  return (
    <main className="min-h-screen bg-[#050606] text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 border border-red-900/50 bg-red-950/20 p-4 rounded-xl flex items-start gap-4">
          <span className="text-2xl animate-pulse">🔥</span>
          <div>
            <h2 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Self-Destructing Burner Link</h2>
            <p className="text-xs text-zinc-400">This URL is unlisted, encrypted, and will permanently self-destruct exactly 24 hours after creation. Do not forward this URL to unauthorized personnel.</p>
            <p className="text-[10px] text-zinc-500 mt-2 font-mono">Time Remaining: {Math.max(0, 24 - ageHours).toFixed(1)} hours</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-8xl font-black italic">CLASSIFIED</span>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">
                Sector: {incident.locationId}
              </span>
              <span className="px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-[9px] font-black uppercase tracking-widest text-red-500">
                {cat.label}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
              {incident.title}
            </h1>
            
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">
              Transmission Logged: {new Date(incident.timestamp).toLocaleString()}
            </p>

            <div className="pt-6 border-t border-zinc-800/50">
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium whitespace-pre-line font-mono">
                {incident.description}
              </p>
            </div>

            {incident.mediaUrls && incident.mediaUrls.length > 0 && (
              <div className="pt-6">
                <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Classified Evidence</h2>
                <div className="grid grid-cols-2 gap-3">
                  {incident.mediaUrls.map((url: string, i: number) => (
                    <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative">
                      {/* Visual redaction effect */}
                      <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay pointer-events-none" />
                      <img src={url} alt="Evidence" className="w-full h-full object-cover filter contrast-125 grayscale" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
