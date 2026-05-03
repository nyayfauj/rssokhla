// ─── Protected Layout (responsive: sidebar + bottom nav) ────

import BottomNav from '@/components/layout/BottomNav';
import OfflineBanner from '@/components/layout/OfflineBanner';
import QuickReportFAB from '@/components/report/QuickReportFAB';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050606] flex flex-col">
      <div className="flex-1 flex flex-col min-h-screen">
        <OfflineBanner />
        <main className="flex-1 animate-fade-in pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Quick Report FAB — accessible from any screen */}
      <QuickReportFAB />
    </div>
  );
}
