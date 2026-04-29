// ─── Admin Security Dashboard ───────────────────────────────

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useAlertsStore } from '@/stores/alerts.store';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { role } = useAuthStore();
  const incidents = useIncidentsStore((s) => s.incidents);
  const alerts = useAlertsStore((s) => s.activeAlerts);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'incidents' | 'security'>('overview');

  // Gate: only moderators and admins
  if (role !== 'admin' && role !== 'moderator') {
    return (
      <div className="text-center py-16">
        <span className="text-5xl">🔒</span>
        <h1 className="text-xl font-bold text-white mt-4">Access Denied</h1>
        <p className="text-sm text-zinc-400 mt-2">This page requires moderator or admin privileges.</p>
        <Button className="mt-6" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const stats = {
    totalIncidents: incidents.length,
    criticalActive: incidents.filter((i) => i.severity === 'critical' && i.status === 'reported').length,
    unverified: incidents.filter((i) => i.status === 'reported').length,
    verified: incidents.filter((i) => i.status === 'verified').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    activeAlerts: alerts.length,
    categoryBreakdown: Object.entries(
      incidents.reduce<Record<string, number>>((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {})
    ),
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Security Dashboard</h1>
          <p className="text-xs text-zinc-500">Administration & threat overview</p>
        </div>
        <Badge variant={role === 'admin' ? 'danger' : 'warning'} size="md">{role}</Badge>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        {(['overview', 'incidents', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              selectedTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Incidents', value: stats.totalIncidents, icon: '📋', variant: 'default' as const },
              { label: 'Critical Active', value: stats.criticalActive, icon: '🚨', variant: 'danger' as const },
              { label: 'Unverified', value: stats.unverified, icon: '⏳', variant: 'warning' as const },
              { label: 'Active Alerts', value: stats.activeAlerts, icon: '🔔', variant: 'info' as const },
            ].map((stat) => (
              <Card key={stat.label} padding="sm" variant={stat.variant === 'danger' && stat.value > 0 ? 'danger' : 'default'}>
                <div className="flex items-start justify-between">
                  <span className="text-lg">{stat.icon}</span>
                  <Badge variant={stat.variant} size="sm">{stat.value}</Badge>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-[10px] text-zinc-500">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Status distribution */}
          <Card padding="md">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-3">Status Distribution</h3>
            <div className="space-y-2">
              {[
                { label: 'Reported', count: stats.unverified, color: 'bg-blue-500', total: stats.totalIncidents },
                { label: 'Verified', count: stats.verified, color: 'bg-green-500', total: stats.totalIncidents },
                { label: 'Resolved', count: stats.resolved, color: 'bg-zinc-500', total: stats.totalIncidents },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-20">{bar.label}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                      style={{ width: `${bar.total > 0 ? (bar.count / bar.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-8 text-right">{bar.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Category breakdown */}
          <Card padding="md">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-3">By Category</h3>
            {stats.categoryBreakdown.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {stats.categoryBreakdown.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-zinc-300 capitalize">{cat}</span>
                    <Badge variant="default" size="sm">{count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-4">No data available</p>
            )}
          </Card>
        </div>
      )}

      {/* Incidents Tab */}
      {selectedTab === 'incidents' && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase">Recent Unverified ({stats.unverified})</h3>
          {incidents
            .filter((i) => i.status === 'reported')
            .slice(0, 10)
            .map((incident) => (
              <Card key={incident.$id} interactive padding="sm" onClick={() => router.push(`/incidents/${incident.$id}`)}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{incident.title}</p>
                    <p className="text-[10px] text-zinc-500">{incident.category} · {incident.severity}</p>
                  </div>
                  <Badge variant={incident.severity === 'critical' ? 'danger' : 'default'} size="sm" pulse={incident.severity === 'critical'}>
                    {incident.severity}
                  </Badge>
                </div>
              </Card>
            ))}
          {stats.unverified === 0 && (
            <Card padding="md"><p className="text-xs text-zinc-500 text-center py-4">All caught up ✓</p></Card>
          )}
        </div>
      )}

      {/* Security Tab */}
      {selectedTab === 'security' && (
        <div className="space-y-4">
          <Card padding="md">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-3">Security Posture</h3>
            <div className="space-y-3">
              {[
                { label: 'End-to-End Encryption', status: 'Active', ok: true },
                { label: 'Rate Limiting', status: '60 req/min', ok: true },
                { label: 'Security Headers', status: 'CSP + HSTS', ok: true },
                { label: 'Input Sanitization', status: 'Enabled', ok: true },
                { label: 'Device Fingerprinting', status: 'Tracking', ok: true },
                { label: 'Session Management', status: 'httpOnly cookies', ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{item.label}</span>
                  <Badge variant={item.ok ? 'success' : 'danger'} size="sm">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md" variant="danger">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-3">Threat Assessment</h3>
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                stats.criticalActive > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {stats.criticalActive > 0 ? '⚠️' : '✅'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {stats.criticalActive > 0 ? `${stats.criticalActive} Critical Threat${stats.criticalActive !== 1 ? 's' : ''}` : 'No Active Threats'}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {stats.criticalActive > 0 ? 'Immediate attention required' : 'All monitored areas are clear'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
