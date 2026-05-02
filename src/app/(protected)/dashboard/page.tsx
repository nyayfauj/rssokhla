// ─── Dashboard Page ─────────────────────────────────────────

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useAlertsStore } from '@/stores/alerts.store';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import IncidentCard from '@/components/incidents/IncidentCard';
import SearchBar from '@/components/incidents/SearchBar';
import AlertBanner from '@/components/alerts/AlertBanner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { OKHLA_AREAS } from '@/types/location.types';

export default function DashboardPage() {
  const { user, isAnonymous, role } = useAuthStore();
  const { incidents, userIncidents, isLoading, error, fetchIncidents, fetchUserIncidents, offlineQueue } = useIncidentsStore();
  const { activeAlerts, fetchActiveAlerts } = useAlertsStore();
  const { offlineCount } = useOfflineSync();

  useEffect(() => {
    fetchIncidents();
    fetchActiveAlerts();
    if (user?.$id) {
      fetchUserIncidents(user.$id);
    }
  }, [fetchIncidents, fetchActiveAlerts, fetchUserIncidents, user?.$id]);

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isAnonymous ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-red-600/10 border-red-600/20 text-red-500'}`}>
            <span className="text-xl">{isAnonymous ? '🕶️' : '👤'}</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">
              {isAnonymous ? 'Observer // Active' : `Operative // ${user?.name || 'Monitor'}`}
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">
              Sector: Okhla · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
            </p>
          </div>
        </div>
        <Badge variant={role === 'commander' ? 'danger' : role === 'verifier' ? 'warning' : 'default'} size="md">
          {isAnonymous ? 'STEALTH PROTOCOL' : (role || 'user').replace(/_/g, ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Offline queue indicator */}
      {offlineCount > 0 && (
        <Card variant="danger" padding="sm" className="animate-pulse">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <span>📤</span>
            <span className="text-red-400">{offlineCount} Data Packets Waiting to Sync</span>
          </div>
        </Card>
      )}

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <span className="w-1 h-4 bg-red-600 rounded-full" /> Priority Alerts
          </h2>
          {activeAlerts.slice(0, 3).map((alert) => (
            <AlertBanner key={alert.$id} alert={alert} />
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active', value: incidents.filter(i => i.status === 'reported').length, icon: '📡' },
          { label: 'Verified', value: incidents.filter(i => i.status === 'verified').length, icon: '✓' },
          { label: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, icon: '🚨' },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-2xl text-center space-y-1">
            <div className="text-lg">{stat.icon}</div>
            <div className="text-xl font-black text-white">{stat.value}</div>
            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My Transmissions (Personalized) */}
      {userIncidents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full" /> My Transmissions
          </h2>
          <div className="space-y-3">
            {userIncidents.map((incident) => (
              <IncidentCard key={incident.$id} incident={incident} />
            ))}
          </div>
        </div>
      )}

      {/* Incident feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-2">
            <span className="w-1 h-4 bg-zinc-700 rounded-full" /> Global Intel Feed
          </h2>
          <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest">
            Filter Results
          </Button>
        </div>

        {isLoading && incidents.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height="120px" className="rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <Card variant="danger" padding="md">
            <div className="text-center py-4">
              <p className="text-xs text-red-400 mb-3 uppercase font-bold">{error}</p>
              <Button variant="danger" size="sm" onClick={() => fetchIncidents()}>
                Retry Connection
              </Button>
            </div>
          </Card>
        ) : incidents.length === 0 ? (
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-10 text-center space-y-4">
            <span className="text-5xl opacity-20">📡</span>
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">No Active Incidents</h3>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Okhla sector is currently quiet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.filter(i => !userIncidents.find(ui => ui.$id === i.$id)).map((incident) => (
              <IncidentCard key={incident.$id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
