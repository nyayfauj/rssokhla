// ─── Alerts Page ────────────────────────────────────────────
'use client';
import { useEffect } from 'react';
import { useAlertsStore } from '@/stores/alerts.store';
import AlertBanner from '@/components/alerts/AlertBanner';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function AlertsPage() {
  const { alerts, isLoading, error, fetchAlerts } = useAlertsStore();
  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">Alerts</h1>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i} padding="md"><Skeleton lines={2} /></Card>)}</div>
      ) : error ? (
        <Card variant="danger" padding="md">
          <p className="text-sm text-red-400 mb-3">{error}</p>
          <Button variant="danger" size="sm" onClick={fetchAlerts}>Retry</Button>
        </Card>
      ) : alerts.length === 0 ? (
        <Card padding="lg"><div className="text-center py-6"><span className="text-4xl">🔔</span><h3 className="text-sm font-semibold text-white mt-3">No alerts</h3><p className="text-xs text-zinc-500 mt-1">All clear in your monitored areas</p></div></Card>
      ) : (
        <div className="space-y-2">{alerts.map(a => <AlertBanner key={a.$id} alert={a} />)}</div>
      )}
    </div>
  );
}
