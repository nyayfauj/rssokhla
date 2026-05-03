'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/types/user.types';
import { ROLE_PERMISSIONS, TRUST_WEIGHTS } from '@/types/user.types';
import Link from 'next/link';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { Query } from 'appwrite';
import { useDebounce } from '@/hooks/useDebounce';
import Skeleton from '@/components/ui/Skeleton';

const ROLE_LABELS: Record<UserRole, { label: string; color: string; icon: string }> = {
  observer: { label: 'Observer', color: 'text-zinc-500', icon: '👁️' },
  operative: { label: 'Operative', color: 'text-blue-400', icon: '👤' },
  verifier: { label: 'Verifier', color: 'text-green-400', icon: '✓' },
  commander: { label: 'Commander', color: 'text-red-400', icon: '★' },
};

// Define type for fetched user
interface Operative {
  $id: string;
  name: string;
  email: string;
  role: UserRole;
  reputation: number;
  reports: number;
  verifications: number;
  joinDate: string;
  [key: string]: any;
}

export default function CommunityPage() {
  const { user, isAuthenticated, role } = useAuthStore();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [operatives, setOperatives] = useState<Operative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchOperatives = async (cursor?: string) => {
    try {
      if (cursor) setIsFetchingMore(true);
      else setIsLoading(true);

      const queries = [Query.limit(20), Query.orderDesc('reputation')];
      if (cursor) queries.push(Query.cursorAfter(cursor));

      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.OPERATIVES,
        queries
      );
        
        // Map Appwrite documents to Operative interface
        const fetchedOperatives = res.documents.map(doc => ({
          $id: doc.$id,
          name: doc.name || 'Unknown',
          email: doc.email || 'No Email',
          role: (doc.role as UserRole) || 'operative',
          reputation: doc.reputation || 0,
          reports: doc.reports || 0,
          verifications: doc.verifications || 0,
          joinDate: doc.joinDate || doc.$createdAt,
        }));
        
        if (cursor) {
          setOperatives(prev => [...prev, ...fetchedOperatives]);
        } else {
          setOperatives(fetchedOperatives);
        }
        
        setHasMore(res.documents.length === 20);
        if (res.documents.length > 0) {
          setLastId(res.documents[res.documents.length - 1].$id);
        }
      } catch (error) {
        console.error('Failed to fetch operatives:', error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    }

  useEffect(() => {
    fetchOperatives();
  }, []);

  const filtered = operatives.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">&larr; Back to Monitor</Link>
          <div className="flex items-center gap-3 mt-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Sangathan Network</h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Verified community members with reporting & verification privileges
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ROLE_LABELS).map(([roleKey, config]) => {
            const count = roleKey === 'observer' ? '—' : operatives.filter(u => u.role === roleKey).length;
            return (
              <div key={roleKey} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
                <span className="text-xl">{config.icon}</span>
                <p className={`text-sm font-black ${config.color}`}>{config.label}s</p>
                <p className="text-xl font-black text-white">{isLoading ? '-' : count}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all" />
            <input
              type="text"
              placeholder="SEARCH OPERATIVES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full bg-zinc-900/80 border border-zinc-800/50 rounded-2xl px-5 py-3 text-[10px] font-black tracking-[0.2em] uppercase text-zinc-100 placeholder-zinc-700 focus:border-blue-600 outline-none transition-all"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl px-4 py-3 text-xs focus:border-blue-600 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="operative">Operatives</option>
            <option value="verifier">Verifiers</option>
            <option value="commander">Commanders</option>
          </select>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton lines={1} height="140px" className="rounded-2xl border-zinc-800" />
              <Skeleton lines={1} height="140px" className="rounded-2xl border-zinc-800" />
              <Skeleton lines={1} height="140px" className="rounded-2xl border-zinc-800" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-24 text-center space-y-6 border border-zinc-800 bg-zinc-950 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-900/20" />
              <div className="absolute top-0 right-0 p-3 opacity-30">
                <span className="text-[8px] font-mono text-zinc-500">SYS_ID: OP_NOT_FOUND</span>
              </div>
              <div className="w-16 h-16 border border-zinc-800 bg-zinc-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="w-2 h-2 bg-zinc-600 animate-pulse rounded-full" />
              </div>
              <div className="space-y-2">
                <p className="text-zinc-400 text-sm font-black uppercase tracking-[0.3em]">NO OPERATIVES DETECTED</p>
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest max-w-sm mx-auto">
                  Scan yielded zero results for this network clearance level or search query. Modify parameters to expand search radius.
                </p>
              </div>
            </div>
          ) : (
            filtered.map((u) => {
              const roleConfig = ROLE_LABELS[u.role] || ROLE_LABELS.observer;
              const trustWeight = TRUST_WEIGHTS[u.role] || 0;
              return (
                <div key={u.$id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white ${
                        u.role === 'commander' ? 'bg-red-700' :
                        u.role === 'verifier' ? 'bg-green-700' : 'bg-blue-700'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{u.name}</h3>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-black ${roleConfig.color}`}>{roleConfig.icon} {roleConfig.label}</span>
                          <span className="text-zinc-700">|</span>
                          <span className="text-[10px] text-zinc-500">Trust Weight: {trustWeight}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-black text-white">{u.reputation}</p>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Rep</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">{u.reports}</p>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Reports</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">{u.verifications}</p>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Verified</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-zinc-600">Joined: {new Date(u.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                      <span className="text-zinc-800 hidden sm:inline">|</span>
                      <div className="flex gap-1.5">
                        {u.reputation >= 100 && <span className="text-[9px] font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded flex items-center gap-1" title="Top 1% Trust Rating">⭐ ELITE</span>}
                        {u.reports >= 10 && <span className="text-[9px] font-black bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1" title="10+ Field Reports Submitted">🦅 HAWK EYE</span>}
                        {u.verifications >= 5 && <span className="text-[9px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded flex items-center gap-1" title="5+ Reports Verified">🛡️ VANGUARD</span>}
                        {u.joinDate && new Date().getTime() - new Date(u.joinDate).getTime() > 180 * 24 * 60 * 60 * 1000 && <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded flex items-center gap-1" title="Active for 6+ months">⚡ VETERAN</span>}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {(ROLE_PERMISSIONS[u.role] || []).slice(0, 3).map((perm, i) => (
                        <span key={i} className="text-[8px] font-bold bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {perm.split(':')[1]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {hasMore && filtered.length > 0 && !search && filterRole === 'all' && (
            <button
              onClick={() => lastId && fetchOperatives(lastId)}
              disabled={isFetchingMore}
              className="w-full mt-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-xs font-black text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {isFetchingMore ? 'Loading More...' : 'Load More Operatives'}
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">About NyayFauj Operatives</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Operatives are registered community members who can report incidents and verify reports.
            <span className="text-blue-400"> Operatives</span> provide 1 trust point per verification,
            <span className="text-green-400"> Verifiers</span> provide 5 points, and
            <span className="text-red-400"> Commanders</span> provide 10 points.
            Reports need 10 points to achieve "Community Verified" status.
          </p>
        </div>
      </div>
    </main>
  );
}
