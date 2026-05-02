// ─── Settings Page ──────────────────────────────────────────

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { APP_VERSION } from '@/lib/utils/constants';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAnonymous, role, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const addToast = useUIStore((s) => s.addToast);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleLogout = async () => {
    await logout();
    addToast({ type: 'info', message: 'Signed out successfully' });
    router.push('/');
  };

  const requestNotifications = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationsEnabled(perm === 'granted');
      addToast({
        type: perm === 'granted' ? 'success' : 'warning',
        message: perm === 'granted' ? 'Notifications enabled' : 'Notifications denied',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-24">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500" aria-hidden="true">&#x2699;&#xFE0F;</span>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </div>

      {/* Profile */}
      <Card padding="md" className="border-zinc-800/50 bg-zinc-900/20">
        <h2 className="text-sm font-medium text-zinc-500 mb-4">Profile</h2>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            {isAnonymous ? <span aria-hidden="true">&#x1F576;&#xFE0F;</span> : user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-white">{isAnonymous ? 'Anonymous User' : user?.name}</p>
            <p className="text-xs text-zinc-500 truncate">{isAnonymous ? 'Browsing anonymously' : user?.email}</p>
            <div className="mt-2 flex">
              <Badge variant={role === 'commander' ? 'danger' : role === 'verifier' ? 'warning' : 'default'} size="sm">
                {role?.replace(/_/g, ' ') || 'user'}
              </Badge>
            </div>
          </div>
        </div>
        {isAnonymous && (
          <button 
            onClick={() => router.push('/sangathan')}
            aria-label="Create an account to join the community"
            className="w-full mt-6 py-4 bg-white text-black text-sm font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-[0.98]"
          >
            Join the Sangathan
          </button>
        )}
      </Card>

      {/* Security */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Security</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Auth</p>
              <p className="text-xs text-zinc-500">TOTP-based verification</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/settings/2fa')}>
              {isAnonymous ? 'Unavailable' : 'Setup'}
            </Button>
          </div>
          <div className="h-px bg-zinc-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Encryption</p>
              <p className="text-xs text-zinc-500">AES-256-GCM for sensitive data</p>
            </div>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
          <div className="h-px bg-zinc-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Device Fingerprint</p>
              <p className="text-xs text-zinc-500">Browser-based identification</p>
            </div>
            <Badge variant="info" size="sm">Active</Badge>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Push Notifications</p>
            <p className="text-xs text-zinc-500">Get alerted for critical incidents</p>
          </div>
          <Button variant={notificationsEnabled ? 'secondary' : 'outline'} size="sm" onClick={requestNotifications}>
            {notificationsEnabled ? 'Enabled' : 'Enable'}
          </Button>
        </div>
      </Card>

      {/* Appearance */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Dark Mode</p>
            <p className="text-xs text-zinc-500">Currently: {theme}</p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-12 h-7 rounded-full bg-zinc-800 border border-zinc-700 relative transition-colors"
            role="switch"
            aria-checked={theme === 'dark'}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </Card>

      {/* Data & Storage */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Data &amp; Storage</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Cached Data</p>
              <p className="text-xs text-zinc-500">Offline reports and assets</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Clear cached data"
              onClick={() => {
                if ('caches' in window) {
                  caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
                  addToast({ type: 'success', message: 'Cache cleared' });
                }
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">About</h2>
        <div className="space-y-2 text-xs text-zinc-400">
          <div className="flex justify-between"><span>Version</span><span className="text-zinc-300">{APP_VERSION}</span></div>
          <div className="flex justify-between"><span>Platform</span><span className="text-zinc-300">NyayFauj PWA</span></div>
          <div className="flex justify-between"><span>Backend</span><span className="text-zinc-300">Appwrite</span></div>
        </div>
      </Card>

      {/* Sign Out */}
      <Button variant="danger" fullWidth size="lg" onClick={() => setShowLogoutConfirm(true)}>
        Sign Out
      </Button>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} title="Sign Out?">
        <p className="text-sm text-zinc-400 mb-4">
          {isAnonymous
            ? 'Your anonymous session will be lost and any unsynced reports may be deleted.'
            : 'You will need to sign in again to access your account.'}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleLogout}>Sign Out</Button>
        </div>
      </Modal>
    </div>
  );
}
