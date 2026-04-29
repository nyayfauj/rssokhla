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
    <div className="space-y-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-white">Settings</h1>

      {/* Profile */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl font-bold text-white">
            {isAnonymous ? '👤' : user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">{isAnonymous ? 'Anonymous Observer' : user?.name}</p>
            <p className="text-xs text-zinc-400 truncate">{isAnonymous ? 'No email on file' : user?.email}</p>
            <Badge variant={role === 'admin' ? 'danger' : role === 'moderator' ? 'warning' : 'default'} size="sm" className="mt-1.5">
              {role.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        {isAnonymous && (
          <Button variant="outline" size="sm" className="mt-4" fullWidth onClick={() => router.push('/register')}>
            Upgrade to Full Account
          </Button>
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
            <Badge variant="info" size="sm">Tracked</Badge>
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
            className="w-12 h-7 rounded-full bg-zinc-800 border border-zinc-700 relative transition-colors"
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </Card>

      {/* Data & Storage */}
      <Card padding="md">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Data & Storage</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Cached Data</p>
              <p className="text-xs text-zinc-500">Offline reports and assets</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
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
