'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="card p-12 text-center max-w-md">
          <span className="text-6xl mb-4 block">⚙️</span>
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You need to be signed in to access settings
          </p>
          <Link href="/auth/signin?callbackUrl=/settings" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-2xl font-bold">
                {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
              </div>
            )}
            <div>
              <div className="font-bold">{session.user?.name || 'Anonymous User'}</div>
              <div className="text-[var(--color-text-secondary)]">{session.user?.email}</div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Security</h2>
          <div className="space-y-4">
            <Link href="/settings/2fa" className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Add an extra layer of security
                  </div>
                </div>
              </div>
              <span className="text-[var(--color-text-muted)]">→</span>
            </Link>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Privacy</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-medium">Default to Anonymous Reports</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Hide your identity on new reports
                  </div>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-accent)]" />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-red-500/30">
          <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Once you delete your account, there is no going back. Your reports will remain anonymous.
          </p>
          <button className="btn text-red-500 border border-red-500/30 hover:bg-red-500/10">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

