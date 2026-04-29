// ─── New Karyakarta Profile Form ────────────────────────────

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { KaryakartaRank, Affiliation, ActivityType, ThreatLevel } from '@/types/karyakarta.types';
import { RANK_LABELS, AFFILIATION_LABELS, ACTIVITY_LABELS } from '@/types/karyakarta.types';

export default function NewProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Identity
  const [fullName, setFullName] = useState('');
  const [aliases, setAliases] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [ageEstimate, setAgeEstimate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState('');
  const [build, setBuild] = useState('');
  const [marks, setMarks] = useState('');

  // Contact
  const [phones, setPhones] = useState('');
  const [emails, setEmails] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('facebook');
  const [socialHandle, setSocialHandle] = useState('');
  const [socialEntries, setSocialEntries] = useState<{platform: string; handle: string}[]>([]);

  // Location
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentArea, setCurrentArea] = useState('');
  const [previousAddress, setPreviousAddress] = useState('');
  const [frequentLocations, setFrequentLocations] = useState('');

  // Org
  const [rank, setRank] = useState<KaryakartaRank>('unknown');
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [shakhaLocation, setShakhaLocation] = useState('');
  const [shakhaTimings, setShakhaTimings] = useState('');
  const [involvementSince, setInvolvementSince] = useState('');

  // Activity
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('medium');

  // Employment
  const [currentOccupation, setCurrentOccupation] = useState('');
  const [employer, setEmployer] = useState('');
  const [previousOccupation, setPreviousOccupation] = useState('');

  // Vehicles
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleDesc, setVehicleDesc] = useState('');

  // Notes
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  const steps = ['Identity', 'Contact & Social', 'Location', 'Organization', 'Activity', 'Employment', 'Notes'];

  const addSocial = () => {
    if (socialHandle.trim()) {
      setSocialEntries([...socialEntries, { platform: socialPlatform, handle: socialHandle.trim() }]);
      setSocialHandle('');
    }
  };

  const toggleAff = (a: Affiliation) => setAffiliations(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const toggleAct = (a: ActivityType) => setActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In production, this submits to Appwrite
    alert('Profile saved (mock). In production this writes to Appwrite.');
    router.push('/profiles');
  };

  const Input = ({ label, value, onChange, placeholder, ...rest }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; [k: string]: unknown }) => (
    <div className="space-y-1">
      <label className="text-[10px] sm:text-xs font-medium text-zinc-400">{label}</label>
      <input {...rest} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all" />
    </div>
  );

  const TextArea = ({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) => (
    <div className="space-y-1">
      <label className="text-[10px] sm:text-xs font-medium text-zinc-400">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none" />
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-4 py-4 pb-24">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-4">
        ← Back
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Add Karyakarta Profile</h1>
      <p className="text-xs text-zinc-500 mb-4">Step {step + 1} of {steps.length}: <span className="text-zinc-300">{steps[step]}</span></p>

      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-red-500' : 'bg-zinc-800'}`} />)}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 0: Identity */}
        {step === 0 && (
          <div className="space-y-3">
            <Input label="Full Name *" value={fullName} onChange={setFullName} placeholder="Enter full name" />
            <Input label="Aliases (comma-separated)" value={aliases} onChange={setAliases} placeholder="aka names" />
            <Input label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="Father's name" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Age Estimate" value={ageEstimate} onChange={setAgeEstimate} placeholder="e.g. 35-40" />
              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-medium text-zinc-400">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value as 'male'|'female'|'other')}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30">
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <Input label="Height" value={height} onChange={setHeight} placeholder="e.g. 5'8&quot;" />
            <Input label="Build" value={build} onChange={setBuild} placeholder="slim, medium, heavy, muscular" />
            <Input label="Distinguishing Marks" value={marks} onChange={setMarks} placeholder="Scars, tattoos, etc." />
          </div>
        )}

        {/* Step 1: Contact */}
        {step === 1 && (
          <div className="space-y-3">
            <Input label="Phone Numbers (comma-separated)" value={phones} onChange={setPhones} placeholder="+91 XXXXX XXXXX" />
            <Input label="Email Addresses" value={emails} onChange={setEmails} placeholder="email@example.com" />
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-medium text-zinc-400">Social Media</label>
              <div className="flex gap-2">
                <select value={socialPlatform} onChange={e => setSocialPlatform(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl px-2 py-2 text-xs">
                  {['facebook','twitter','instagram','whatsapp','telegram','youtube','linkedin','other'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input value={socialHandle} onChange={e => setSocialHandle(e.target.value)} placeholder="Handle/URL"
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/30" />
                <button type="button" onClick={addSocial} className="px-3 bg-zinc-800 text-white rounded-xl text-sm hover:bg-zinc-700">+</button>
              </div>
              {socialEntries.length > 0 && (
                <div className="space-y-1 mt-2">
                  {socialEntries.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-800/40 rounded-lg px-2.5 py-1.5">
                      <span className="text-xs text-zinc-300"><span className="text-zinc-500 capitalize">{s.platform}:</span> {s.handle}</span>
                      <button type="button" onClick={() => setSocialEntries(socialEntries.filter((_, j) => j !== i))} className="text-xs text-zinc-600 hover:text-red-400">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-3">
            <TextArea label="Current Address" value={currentAddress} onChange={setCurrentAddress} placeholder="H.No, Gali, Area..." rows={2} />
            <Input label="Primary Area" value={currentArea} onChange={setCurrentArea} placeholder="e.g. Okhla Phase 2, Shaheen Bagh" />
            <TextArea label="Previous Address" value={previousAddress} onChange={setPreviousAddress} placeholder="Previous known address" rows={2} />
            <Input label="Frequently Visited (comma-separated)" value={frequentLocations} onChange={setFrequentLocations} placeholder="Markets, parks, temples..." />
          </div>
        )}

        {/* Step 3: Org */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-medium text-zinc-400">Rank / Position</label>
              <select value={rank} onChange={e => setRank(e.target.value as KaryakartaRank)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30">
                {(Object.entries(RANK_LABELS) as [KaryakartaRank, typeof RANK_LABELS[KaryakartaRank]][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-medium text-zinc-400">Affiliations</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(AFFILIATION_LABELS) as [Affiliation, typeof AFFILIATION_LABELS[Affiliation]][]).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => toggleAff(k)}
                    className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                      affiliations.includes(k) ? `${v.color} bg-zinc-800 border-current` : 'text-zinc-500 border-zinc-800 bg-zinc-900'
                    }`}>{v.icon} {v.label}</button>
                ))}
              </div>
            </div>
            <Input label="Shakha Location" value={shakhaLocation} onChange={setShakhaLocation} placeholder="Park, ground, etc." />
            <Input label="Shakha Timings" value={shakhaTimings} onChange={setShakhaTimings} placeholder="6 AM - 7 AM" />
            <Input label="Involved Since" value={involvementSince} onChange={setInvolvementSince} placeholder="Year, e.g. 2010" />
          </div>
        )}

        {/* Step 4: Activity */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-medium text-zinc-400">Known Activities</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(ACTIVITY_LABELS) as [ActivityType, typeof ACTIVITY_LABELS[ActivityType]][]).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => toggleAct(k)}
                    className={`text-xs px-2 py-1.5 rounded-lg border text-left transition-colors ${
                      activities.includes(k) ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-zinc-500 border-zinc-800 bg-zinc-900'
                    }`}>{v.icon} {v.label}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-medium text-zinc-400">Threat Assessment</label>
              <div className="grid grid-cols-4 gap-2">
                {(['low','medium','high','critical'] as ThreatLevel[]).map(t => (
                  <button key={t} type="button" onClick={() => setThreatLevel(t)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors capitalize ${
                      threatLevel === t ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Employment */}
        {step === 5 && (
          <div className="space-y-3">
            <Input label="Current Occupation" value={currentOccupation} onChange={setCurrentOccupation} placeholder="Shopkeeper, driver, etc." />
            <Input label="Employer / Business" value={employer} onChange={setEmployer} placeholder="Self-employed, company name..." />
            <Input label="Previous Occupation" value={previousOccupation} onChange={setPreviousOccupation} placeholder="Previous job/work" />
            <p className="text-[10px] text-zinc-600 mt-1">Vehicle info (optional)</p>
            <div className="grid grid-cols-3 gap-2">
              <Input label="Type" value={vehicleType} onChange={setVehicleType} placeholder="Car, bike" />
              <Input label="Number" value={vehicleNumber} onChange={setVehicleNumber} placeholder="DL XX" />
              <Input label="Color/Make" value={vehicleDesc} onChange={setVehicleDesc} placeholder="Black Honda" />
            </div>
          </div>
        )}

        {/* Step 6: Notes */}
        {step === 6 && (
          <div className="space-y-3">
            <TextArea label="Intelligence Notes" value={notes} onChange={setNotes} placeholder="Any additional intelligence, observations, or context..." rows={5} />
            <Input label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="organizer, shakha-runner, active" />
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors">
              Previous
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={step === 0 && !fullName.trim()}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Next
            </button>
          ) : (
            <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">
              Save Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
