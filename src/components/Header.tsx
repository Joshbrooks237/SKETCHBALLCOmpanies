'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-xl font-bold group-hover:animate-pulse-red">
              🚩
            </div>
            <span className="text-xl font-bold tracking-tight">
              SKETCH<span className="text-[var(--color-accent)]">FACTOR</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/companies" className="nav-link">
              Companies
            </Link>
            <Link href="/report" className="nav-link">
              Submit Report
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-24 h-10 skeleton" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-sm font-bold">
                      {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm">
                    {session.user?.name || 'Anonymous'}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 card p-2 shadow-xl">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm rounded hover:bg-[var(--color-bg-tertiary)]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/settings/2fa"
                      className="block px-4 py-2 text-sm rounded hover:bg-[var(--color-bg-tertiary)]"
                      onClick={() => setMenuOpen(false)}
                    >
                      🔐 Setup 2FA
                    </Link>
                    <hr className="my-2 border-[var(--color-border)]" />
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-danger)]"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin" className="btn btn-ghost text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary text-sm">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

