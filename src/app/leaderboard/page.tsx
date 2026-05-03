'use client';

import { useEffect, useState } from 'react';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { Query } from 'appwrite';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import type { UserRole } from '@/types/user.types';
import { ROLE_PERMISSIONS } from '@/types/user.types';

interface Operative {
  $id: string;
  name: string;
  reputation: number;
  reports: number;
  verifications: number;
  role: UserRole;
  joinDate: string;
}

export default function LeaderboardPage() {
  const [operatives, setOperatives] = useState<Operative[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopOperatives = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.OPERATIVES,
          [
            Query.orderDesc('reputation'),
            Query.limit(50) // Top 50 operatives
          ]
        );
        
        const mapped = res.documents.map(doc => ({
          $id: doc.$id,
          name: doc.name || 'Anonymous Node',
          reputation: doc.reputation || 0,
          reports: doc.reports || 0,
          verifications: doc.verifications || 0,
          role: (doc.role as UserRole) || 'operative',
          joinDate: doc.joinDate || doc.$createdAt,
        }));
        
        setOperatives(mapped);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopOperatives();
  }, []);

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        <header>
          <Link href="/community" className="text-sm text-zinc-500 hover:text-white transition-colors">&larr; Back to Sangathan</Link>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl">🏆</span>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Global Leaderboard</h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Top 50 Operatives ranked by Trust Points and Community Contributions
          </p>
        </header>

        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton lines={1} height="80px" className="rounded-2xl border-zinc-800" />
              <Skeleton lines={1} height="80px" className="rounded-2xl border-zinc-800" />
              <Skeleton lines={1} height="80px" className="rounded-2xl border-zinc-800" />
            </div>
          ) : operatives.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl animate-pulse text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">[ NO DATA AVAILABLE ]</p>
            </div>
          ) : (
            operatives.map((op, idx) => {
              const isTop3 = idx < 3;
              return (
                <div 
                  key={op.$id} 
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    idx === 0 ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]' :
                    idx === 1 ? 'bg-zinc-300/10 border-zinc-300/30' :
                    idx === 2 ? 'bg-orange-700/10 border-orange-700/30' :
                    'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-8 font-black text-xl text-center ${
                    idx === 0 ? 'text-yellow-500' :
                    idx === 1 ? 'text-zinc-300' :
                    idx === 2 ? 'text-orange-500' :
                    'text-zinc-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 ${
                    op.role === 'commander' ? 'bg-red-700' :
                    op.role === 'verifier' ? 'bg-green-700' : 'bg-blue-700'
                  }`}>
                    {op.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white truncate flex items-center gap-2">
                      {op.name}
                      {idx === 0 && <span title="Top Operative">👑</span>}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                        {op.role}
                      </span>
                      <span className="text-zinc-800 hidden sm:inline">|</span>
                      {op.reputation >= 100 && <span className="text-[8px] font-black bg-yellow-500/10 text-yellow-500 px-1 py-0.5 rounded">⭐ ELITE</span>}
                      {op.reports >= 10 && <span className="text-[8px] font-black bg-red-500/10 text-red-400 px-1 py-0.5 rounded">🦅 HAWK EYE</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-center">
                    <div className="hidden sm:block">
                      <p className="text-sm font-black text-white">{op.reports}</p>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Reports</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-black text-white">{op.verifications}</p>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Verified</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl ${isTop3 ? 'bg-white/5' : 'bg-zinc-800/50'}`}>
                      <p className={`text-lg font-black ${
                        idx === 0 ? 'text-yellow-500' :
                        idx === 1 ? 'text-zinc-300' :
                        idx === 2 ? 'text-orange-500' :
                        'text-white'
                      }`}>{op.reputation}</p>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Reputation</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
