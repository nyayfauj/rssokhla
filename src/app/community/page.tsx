'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/types/user.types';
import { ROLE_PERMISSIONS, TRUST_WEIGHTS } from '@/types/user.types';
import Link from 'next/link';

const ROLE_LABELS: Record<UserRole, { label: string; color: string; icon: string }> = {
  observer: { label: 'Observer', color: 'text-zinc-500', icon: '👁️' },
  operative: { label: 'Operative', color: 'text-blue-400', icon: '👤' },
  verifier: { label: 'Verifier', color: 'text-green-400', icon: '✓' },
  commander: { label: 'Commander', color: 'text-red-400', icon: '★' },
};

export default function CommunityPage() {
  const { user, isAuthenticated, role } = useAuthStore();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

  // Mock data - in production this would fetch from Appwrite
  const mockUsers = [
    { $id: '1', name: 'Rahul Sharma', email: 'rahul@rssokhla.site', role: 'commander' as UserRole, reputation: 95, reports: 42, verifications: 38, joinDate: '2024-06-15' },
    { $id: '2', name: 'Ayesha Khan', email: 'ayesha@rssokhla.site', role: 'verifier' as UserRole, reputation: 78, reports: 23, verifications: 31, joinDate: '2024-08-20' },
    { $id: '3', name: 'Vikram Singh', email: 'vikram@rssokhla.site', role: 'operative' as UserRole, reputation: 45, reports: 18, verifications: 5, joinDate: '2024-11-10' },
    { $id: '4', name: 'Priya Patel', email: 'priya@rssokhla.site', role: 'operative' as UserRole, reputation: 52, reports: 21, verifications: 8, joinDate: '2025-01-05' },
    { $id: '5', name: 'Arjun Mehta', email: 'arjun@rssokhla.site', role: 'verifier' as UserRole, reputation: 81, reports: 29, verifications: 35, joinDate: '2024-09-12' },
  ];

  const filtered = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">&larr; Back to Monitor</Link>
          <div className="flex items-center gap-3 mt-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Community Operatives</h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Registered members with reporting & verification privileges
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ROLE_LABELS).map(([roleKey, config]) => {
            const count = roleKey === 'observer' ? '—' : mockUsers.filter(u => u.role === roleKey).length;
            return (
              <div key={roleKey} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
                <span className="text-xl">{config.icon}</span>
                <p className={`text-sm font-black ${config.color}`}>{config.label}s</p>
                <p className="text-xl font-black text-white">{count}</p>
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
          {filtered.map((u) => {
            const roleConfig = ROLE_LABELS[u.role];
            const trustWeight = TRUST_WEIGHTS[u.role];
            return (
              <div key={u.$id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white ${
                      u.role === 'commander' ? 'bg-red-700' :
                      u.role === 'verifier' ? 'bg-green-700' : 'bg-blue-700'
                    }`}>
                      {u.name.charAt(0)}
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

                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <p className="text-[10px] text-zinc-600">Joined: {new Date(u.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                  <div className="flex gap-1.5">
                    {ROLE_PERMISSIONS[u.role].slice(0, 3).map((perm, i) => (
                      <span key={i} className="text-[8px] font-bold bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-tighter">
                        {perm.split(':')[1]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">About Community Operatives</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Operatives are registered community members who can report incidents and verify reports.
            <span className="text-blue-400">Operatives</span> provide 1 trust point per verification,
            <span className="text-green-400">Verifiers</span> provide 5 points, and
            <span className="text-red-400">Commanders</span> provide 10 points.
            Reports need 10 points to achieve "Community Verified" status.
          </p>
        </div>
      </div>
    </main>
  );
}
