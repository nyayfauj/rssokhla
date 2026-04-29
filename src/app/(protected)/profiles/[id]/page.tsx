// ─── Karyakarta Profile Detail Page ─────────────────────────

'use client';

import { useParams, useRouter } from 'next/navigation';
import { MOCK_PROFILES } from '@/lib/mock-profiles';
import { RANK_LABELS, AFFILIATION_LABELS, THREAT_COLORS, ACTIVITY_LABELS } from '@/types/karyakarta.types';
import Link from 'next/link';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const p = MOCK_PROFILES.find(pr => pr.$id === id);

  if (!p) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <span className="text-5xl">🕵️</span>
        <h1 className="text-xl font-bold text-white mt-4">Profile Not Found</h1>
        <button onClick={() => router.push('/profiles')} className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm">Back to Profiles</button>
      </div>
    );
  }

  const threat = THREAT_COLORS[p.threatLevel];
  const rank = RANK_LABELS[p.rank];

  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60 flex items-center gap-2">
        <span className="text-xs">{icon}</span>
        <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value?: string | number | null }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between items-start gap-2 py-1.5 border-b border-zinc-800/20 last:border-0">
        <span className="text-[10px] sm:text-xs text-zinc-500 flex-shrink-0">{label}</span>
        <span className="text-[10px] sm:text-xs text-zinc-300 text-right">{value}</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 space-y-3">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      {/* Header Card */}
      <div className={`bg-zinc-900/60 border rounded-2xl p-4 ${p.threatLevel === 'critical' ? 'border-red-800/50' : 'border-zinc-800/50'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 ${
            p.threatLevel === 'critical' ? 'bg-gradient-to-br from-red-600 to-red-800' :
            p.threatLevel === 'high' ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
            'bg-gradient-to-br from-zinc-600 to-zinc-800'
          }`}>
            {p.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white">{p.fullName}</h1>
            {p.aliases.length > 0 && <p className="text-xs text-zinc-500">aka {p.aliases.join(', ')}</p>}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${threat.bg} ${threat.text} ${threat.border}`}>
                {threat.label.toUpperCase()} THREAT
              </span>
              <span className="text-[10px] text-zinc-400">{rank.label}</span>
              {!p.isActive && <span className="text-[9px] text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5">INACTIVE</span>}
            </div>
          </div>
        </div>

        {/* Affiliations */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.affiliations.map(aff => {
            const a = AFFILIATION_LABELS[aff];
            return <span key={aff} className={`text-xs ${a.color} bg-zinc-800/60 px-2 py-0.5 rounded-lg`}>{a.icon} {a.label}</span>;
          })}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[
            { v: p.sightings.length, l: 'Sightings' },
            { v: p.linkedIncidentIds.length, l: 'Incidents' },
            { v: p.associates.length, l: 'Associates' },
            { v: `${p.reliabilityScore}%`, l: 'Reliability' },
          ].map(s => (
            <div key={s.l} className="text-center bg-zinc-800/30 rounded-lg py-1.5">
              <p className="text-sm font-bold text-white">{s.v}</p>
              <p className="text-[9px] text-zinc-500">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Identity */}
      <Section title="Identity" icon="🪪">
        <Field label="Full Name" value={p.fullName} />
        <Field label="Father's Name" value={p.fatherName} />
        <Field label="DOB" value={p.dateOfBirth} />
        <Field label="Age Estimate" value={p.ageEstimate} />
        <Field label="Gender" value={p.gender} />
        {p.physicalDescription && (
          <>
            <Field label="Height" value={p.physicalDescription.height} />
            <Field label="Build" value={p.physicalDescription.build} />
            <Field label="Complexion" value={p.physicalDescription.complexion} />
            <Field label="Facial Hair" value={p.physicalDescription.facialHair} />
            <Field label="Marks" value={p.physicalDescription.distinguishingMarks} />
          </>
        )}
      </Section>

      {/* Contact */}
      <Section title="Contact" icon="📞">
        {p.phoneNumbers.map((ph, i) => <Field key={i} label={`Phone ${i + 1}`} value={ph} />)}
        {p.emails.map((em, i) => <Field key={i} label={`Email ${i + 1}`} value={em} />)}
        {p.phoneNumbers.length === 0 && p.emails.length === 0 && <p className="text-xs text-zinc-600">No contact info recorded</p>}
      </Section>

      {/* Social Media */}
      {p.socialMedia.length > 0 && (
        <Section title="Social Media" icon="🌐">
          {p.socialMedia.map((sm, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/20 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs capitalize text-zinc-400">{sm.platform}</span>
                <span className="text-xs text-zinc-300">{sm.handle}</span>
              </div>
              {sm.followersCount && <span className="text-[10px] text-zinc-500">{sm.followersCount.toLocaleString()} followers</span>}
            </div>
          ))}
        </Section>
      )}

      {/* Addresses */}
      {p.addresses.length > 0 && (
        <Section title="Addresses" icon="📍">
          {p.addresses.map((addr, i) => (
            <div key={i} className="py-2 border-b border-zinc-800/20 last:border-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase bg-zinc-800/40 px-1.5 py-0.5 rounded">{addr.type}</span>
                {addr.since && <span className="text-[9px] text-zinc-600">Since {addr.since}</span>}
              </div>
              <p className="text-xs text-zinc-300">{addr.address}</p>
              {addr.area && <p className="text-[10px] text-zinc-500">{addr.area}{addr.city ? `, ${addr.city}` : ''}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Organization */}
      <Section title="Organization" icon="🏴">
        <Field label="Rank" value={rank.label} />
        <Field label="Shakha" value={p.shakhaLocation} />
        <Field label="Shakha Time" value={p.shakhaTimings} />
        <Field label="Senior Contact" value={p.seniorContact} />
        <Field label="Active Since" value={p.involvementSince} />
      </Section>

      {/* Known Activities */}
      <Section title="Known Activities" icon="📋">
        <div className="flex flex-wrap gap-1.5">
          {p.knownActivities.map(act => {
            const a = ACTIVITY_LABELS[act];
            return <span key={act} className="text-xs text-zinc-300 bg-zinc-800/50 px-2 py-1 rounded-lg">{a.icon} {a.label}</span>;
          })}
        </div>
        {p.areasOfOperation.length > 0 && (
          <div className="mt-2.5">
            <p className="text-[10px] text-zinc-500 mb-1">Areas of Operation:</p>
            <div className="flex flex-wrap gap-1.5">
              {p.areasOfOperation.map(area => <span key={area} className="text-[10px] text-zinc-400 bg-zinc-800/40 px-2 py-0.5 rounded">{area.replace(/_/g, ' ')}</span>)}
            </div>
          </div>
        )}
      </Section>

      {/* Sightings */}
      {p.sightings.length > 0 && (
        <Section title={`Sightings (${p.sightings.length})`} icon="👁️">
          {p.sightings.map((s, i) => (
            <div key={i} className="py-2 border-b border-zinc-800/20 last:border-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-white font-medium">{ACTIVITY_LABELS[s.activity]?.icon} {s.location}</span>
                {s.isVerified && <span className="text-[9px] text-green-400">✓ Verified</span>}
              </div>
              <p className="text-[10px] text-zinc-400">{s.description}</p>
              <p className="text-[9px] text-zinc-600 mt-0.5">{new Date(s.date).toLocaleDateString('en-IN')}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Employment */}
      {p.employmentHistory.length > 0 && (
        <Section title="Employment" icon="💼">
          {p.employmentHistory.map((emp, i) => (
            <div key={i} className="py-1.5 border-b border-zinc-800/20 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300 font-medium">{emp.occupation}</span>
                {emp.isCurrent && <span className="text-[9px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Current</span>}
              </div>
              {emp.employer && <p className="text-[10px] text-zinc-500">{emp.employer}</p>}
              {emp.since && <p className="text-[9px] text-zinc-600">{emp.since}{emp.until ? ` — ${emp.until}` : ' — present'}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Vehicles */}
      {p.vehicles.length > 0 && (
        <Section title="Vehicles" icon="🚗">
          {p.vehicles.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-zinc-300">{v.make || v.type} {v.color && `(${v.color})`}</span>
              {v.number && <span className="text-[10px] text-zinc-500 font-mono">{v.number}</span>}
            </div>
          ))}
        </Section>
      )}

      {/* Associates */}
      {p.associates.length > 0 && (
        <Section title={`Associates (${p.associates.length})`} icon="🤝">
          {p.associates.map((assoc, i) => (
            <Link key={i} href={`/profiles/${assoc.profileId}`}
              className="flex items-center justify-between py-1.5 border-b border-zinc-800/20 last:border-0 hover:bg-zinc-800/20 -mx-1 px-1 rounded transition-colors">
              <div>
                <span className="text-xs text-zinc-300">{assoc.name}</span>
                {assoc.notes && <span className="text-[10px] text-zinc-600 ml-2">{assoc.notes}</span>}
              </div>
              <span className="text-[9px] text-zinc-500 capitalize bg-zinc-800/40 px-1.5 py-0.5 rounded">{assoc.relationship}</span>
            </Link>
          ))}
        </Section>
      )}

      {/* Intelligence Notes */}
      <Section title="Intelligence" icon="🔐">
        <Field label="Verification" value={p.verificationStatus.replace(/_/g, ' ')} />
        <Field label="Reliability" value={`${p.reliabilityScore}%`} />
        <Field label="Last Seen" value={p.lastSeenLocation} />
        {p.internalNotes && (
          <div className="mt-2 bg-zinc-800/30 rounded-lg p-2.5">
            <p className="text-[10px] text-zinc-500 uppercase mb-1">Notes</p>
            <p className="text-xs text-zinc-300 leading-relaxed">{p.internalNotes}</p>
          </div>
        )}
        {p.sources.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] text-zinc-500 mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">{p.sources.map((s, i) => <span key={i} className="text-[9px] text-zinc-500 bg-zinc-800/40 px-1.5 py-0.5 rounded">{s}</span>)}</div>
          </div>
        )}
        <div className="mt-2">
          <p className="text-[10px] text-zinc-500 mb-1">Tags:</p>
          <div className="flex flex-wrap gap-1">{p.tags.map(t => <span key={t} className="text-[9px] text-red-400/70 bg-red-500/5 border border-red-500/10 px-1.5 py-0.5 rounded">#{t}</span>)}</div>
        </div>
      </Section>
    </div>
  );
}
