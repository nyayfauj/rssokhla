// ─── Public Incident View (SEO + OpenGraph + JSON-LD) ───────
// Server Component — NO 'use client' — fully SSR for crawlers

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS, STATUS_LABELS } from '@/lib/utils/constants';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';
import type { IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/incident.types';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://nyayfauj.org';

// ─── Fetch incident from Appwrite ────────────────────────────

interface IncidentDoc {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  mediaUrls: string[];
  isAnonymous: boolean;
  verifiedBy: string[];
  verificationCount: number;
  coordinates: number[];
  tags: string[];
  timestamp: string;
}

async function getIncident(id: string): Promise<IncidentDoc | null> {
  try {
    const { databases } = createAdminClient();
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.INCIDENTS, id);
    return doc as unknown as IncidentDoc;
  } catch {
    return null;
  }
}

function resolveArea(coords: number[]): string {
  if (!coords || coords.length < 2) return 'Okhla, New Delhi';
  let nearest: OkhlaArea = 'batla_house';
  let minDist = Infinity;
  (Object.entries(OKHLA_AREAS) as [OkhlaArea, { label: string; center: [number, number] }][]).forEach(([key, a]) => {
    const d = Math.hypot(a.center[0] - coords[0], a.center[1] - coords[1]);
    if (d < minDist) { minDist = d; nearest = key; }
  });
  return OKHLA_AREAS[nearest].label + ', Okhla';
}

// ─── generateMetadata (OpenGraph + Twitter Card) ─────────────

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident) return { title: 'Incident Not Found | NyayFauj' };

  const cat = INCIDENT_CATEGORIES[incident.category]?.label || incident.category;
  const location = resolveArea(incident.coordinates);
  const title = `${cat} in ${location} | NyayFauj Alert`;
  const description = incident.description.length > 160
    ? incident.description.substring(0, 157) + '...'
    : incident.description;
  const ogImage = incident.mediaUrls?.[0] || `${DOMAIN}/og-default.png`;
  const url = `${DOMAIN}/p/${incident.$id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'NyayFauj',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime: incident.$createdAt,
      modifiedTime: incident.$updatedAt,
      tags: incident.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

// ─── Page Component (Server Component) ───────────────────────

export default async function PublicIncidentPage({ params }: PageProps) {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident) notFound();

  const cat = INCIDENT_CATEGORIES[incident.category] || { label: incident.category, icon: '📋', color: '#6b7280' };
  const sev = SEVERITY_LEVELS[incident.severity] || { label: incident.severity, color: '#6b7280' };
  const status = STATUS_LABELS[incident.status] || { label: incident.status, color: '#6b7280' };
  const location = resolveArea(incident.coordinates);
  const date = new Date(incident.$createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // ─── Schema.org JSON-LD ──────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: incident.title,
    description: incident.description,
    dateCreated: incident.$createdAt,
    dateModified: incident.$updatedAt,
    datePublished: incident.$createdAt,
    reportNumber: incident.$id,
    about: {
      '@type': 'Event',
      name: `${cat.label} Activity`,
      location: {
        '@type': 'Place',
        name: location,
        geo: incident.coordinates.length >= 2 ? {
          '@type': 'GeoCoordinates',
          latitude: incident.coordinates[0],
          longitude: incident.coordinates[1],
        } : undefined,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'NyayFauj',
      url: DOMAIN,
    },
    keywords: (incident.tags || []).join(', '),
    ...((incident.mediaUrls || []).length > 0 && { image: incident.mediaUrls[0] }),
  };

  return (
    <>
      {/* JSON-LD for search engines */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-[#060808] text-white">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
          {/* Category & Severity badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: cat.color + '20', color: cat.color }}>
              {cat.label}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: sev.color + '20', color: sev.color }}>
              {sev.label}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: status.color + '20', color: status.color }}>
              {status.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">{incident.title}</h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-6">
            <span className="flex items-center gap-1">📍 {location}</span>
            <span className="flex items-center gap-1">📅 {date}</span>
            <span className="flex items-center gap-1">✓ {incident.verificationCount} verification{incident.verificationCount !== 1 ? 's' : ''}</span>
            {incident.isAnonymous && <span className="flex items-center gap-1">🕶️ Anonymous reporter</span>}
          </div>

          {/* Description */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 sm:p-5 mb-6">
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">{incident.description}</p>
          </div>

          {/* Media */}
          {(incident.mediaUrls || []).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Evidence</h2>
              <div className="grid grid-cols-2 gap-2">
                {incident.mediaUrls.map((url, i) => (
                  <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {(incident.tags || []).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Tags</h2>
              <div className="flex flex-wrap gap-1.5">
                {incident.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-zinc-400 bg-zinc-800/60 border border-zinc-700/40 rounded-full px-2 py-0.5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Coordinates */}
          {incident.coordinates.length >= 2 && (
            <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4 mb-6">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Location</h2>
              <p className="text-xs text-zinc-400 font-mono">
                {incident.coordinates[0].toFixed(6)}°N, {incident.coordinates[1].toFixed(6)}°E
              </p>
              <p className="text-xs text-zinc-500 mt-1">📍 {location}</p>
            </div>
          )}

          {/* Verification status */}
          <div className={`rounded-2xl p-4 mb-6 border ${
            incident.status === 'verified' ? 'bg-green-500/5 border-green-500/20' :
            incident.status === 'reported' ? 'bg-amber-500/5 border-amber-500/20' :
            'bg-zinc-900/30 border-zinc-800/40'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{incident.status === 'verified' ? '✅' : '⏳'}</span>
              <span className={`text-xs font-semibold ${
                incident.status === 'verified' ? 'text-green-400' : 'text-amber-400'
              }`}>
                {incident.status === 'verified' ? 'Community Verified' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">
              {incident.verificationCount} community member{incident.verificationCount !== 1 ? 's have' : ' has'} confirmed this report
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-red-950/40 to-zinc-900/40 border border-red-900/20 rounded-2xl p-4">
            <p className="text-sm font-semibold text-white mb-1">Witnessed similar activity?</p>
            <p className="text-xs text-zinc-400 mb-3">Help verify this report or submit your own observation.</p>
            <div className="flex gap-2">
              <a href="/anonymous" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-colors">
                Report Anonymously
              </a>
              <a href="/login" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl border border-zinc-700 transition-colors">
                Sign In to Verify
              </a>
            </div>
          </div>

          {/* Citation block */}
          <div className="mt-8 pt-6 border-t border-zinc-800/40">
            <h2 className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Cite this report</h2>
            <p className="text-[10px] text-zinc-500 font-mono leading-relaxed select-all">
              NyayFauj Community Report #{incident.$id.slice(0, 8)}. &quot;{incident.title}.&quot; NyayFauj Okhla Monitor, {date}. {DOMAIN}/p/{incident.$id}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-4 text-center">
          <p className="text-[10px] text-zinc-600">🛡️ NyayFauj — Community Monitor for Okhla · Data anonymized · Sources protected</p>
        </footer>
      </main>
    </>
  );
}
