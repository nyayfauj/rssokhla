// ─── Protected Layout (responsive: sidebar + bottom nav) ────

import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';
import OfflineBanner from '@/components/layout/OfflineBanner';
import QuickReportFAB from '@/components/report/QuickReportFAB';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <OfflineBanner />
        <main className="page-container flex-1 animate-fade-in">
          {children}
        </main>
        {/* Mobile bottom nav — hidden on desktop */}
        <BottomNav />
      </div>

      {/* Quick Report FAB — accessible from any screen */}
      <QuickReportFAB />
    </div>
  );
}
