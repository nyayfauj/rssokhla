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
  const { incidents, isLoading, error, fetchIncidents, offlineQueue } = useIncidentsStore();
  const { activeAlerts, fetchActiveAlerts } = useAlertsStore();
  const { offlineCount } = useOfflineSync();

  useEffect(() => {
    fetchIncidents();
    fetchActiveAlerts();
  }, [fetchIncidents, fetchActiveAlerts]);

  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {isAnonymous ? 'Observer Mode' : `Welcome, ${user?.name || 'Monitor'}`}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Okhla Community Monitor · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <Badge variant={role === 'admin' ? 'danger' : role === 'moderator' ? 'warning' : 'default'} size="md">
          {(role || 'user').replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Offline queue indicator */}
      {offlineCount > 0 && (
        <Card variant="danger" padding="sm">
          <div className="flex items-center gap-2 text-sm">
            <span>📤</span>
            <span className="text-red-300">{offlineCount} report{offlineCount !== 1 ? 's' : ''} waiting to sync</span>
          </div>
        </Card>
      )}

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Alerts</h2>
          {activeAlerts.slice(0, 3).map((alert) => (
            <AlertBanner key={alert.$id} alert={alert} />
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Active', value: incidents.filter(i => i.status === 'reported').length, icon: '📡' },
          { label: 'Verified', value: incidents.filter(i => i.status === 'verified').length, icon: '✓' },
          { label: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, icon: '🚨' },
        ].map((stat) => (
          <Card key={stat.label} padding="sm">
            <div className="text-center">
              <div className="text-lg">{stat.icon}</div>
              <div className="text-xl font-bold text-white mt-1">{stat.value}</div>
              <div className="text-[10px] text-zinc-500">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Area quick links */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Monitored Areas</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {Object.entries(OKHLA_AREAS).slice(0, 6).map(([key, area]) => (
            <button
              key={key}
              className="flex-shrink-0 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors whitespace-nowrap"
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent Incidents</h2>
          <Button variant="ghost" size="sm">
            Filter
          </Button>
        </div>

        {isLoading && incidents.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} padding="md">
                <Skeleton lines={3} />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card variant="danger" padding="md">
            <div className="text-center py-4">
              <p className="text-sm text-red-400 mb-3">{error}</p>
              <Button variant="danger" size="sm" onClick={() => fetchIncidents()}>
                Retry
              </Button>
            </div>
          </Card>
        ) : incidents.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-6">
              <span className="text-4xl">📡</span>
              <h3 className="text-sm font-semibold text-white mt-3">No incidents yet</h3>
              <p className="text-xs text-zinc-500 mt-1">Be the first to report activity in your area</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <IncidentCard key={incident.$id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
