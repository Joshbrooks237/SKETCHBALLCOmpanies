'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TwoFactorSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'success'>('intro');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startSetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/2fa/setup');
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to setup 2FA');
        setLoading(false);
        return;
      }
      
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('qr');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Invalid token');
        setLoading(false);
        return;
      }
      
      setStep('success');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
          <span className="text-6xl mb-4 block">🔐</span>
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You need to be signed in to setup 2FA
          </p>
          <Link href="/auth/signin?callbackUrl=/settings/2fa" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            🔐 Two-Factor Authentication
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 'intro' && (
            <div className="text-center">
              <span className="text-6xl mb-6 block">🛡️</span>
              <h2 className="text-xl font-bold mb-4">Protect Your Account</h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Two-factor authentication adds an extra layer of security. You'll need your phone to sign in.
              </p>
              <ul className="text-left text-sm space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Protects your anonymous identity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Works with Google Authenticator, Authy, etc.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Required to submit sensitive reports</span>
                </li>
              </ul>
              <button
                onClick={startSetup}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            </div>
          )}

          {step === 'qr' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">Scan QR Code</h2>
              <p className="text-[var(--color-text-secondary)] mb-6 text-center text-sm">
                Open your authenticator app and scan this QR code
              </p>
              
              <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Or enter this code manually:
                </p>
                <code className="block p-3 bg-[var(--color-bg-tertiary)] rounded text-sm break-all">
                  {secret}
                </code>
              </div>

              <button
                onClick={() => setStep('verify')}
                className="btn btn-primary w-full"
              >
                I've Scanned the Code
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">Verify Setup</h2>
              <p className="text-[var(--color-text-secondary)] mb-6 text-center text-sm">
                Enter the 6-digit code from your authenticator app
              </p>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('qr')}
                  className="btn btn-secondary flex-1"
                >
                  ← Back
                </button>
                <button
                  onClick={verifyToken}
                  disabled={loading || token.length !== 6}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <span className="text-6xl mb-6 block">🎉</span>
              <h2 className="text-xl font-bold mb-4 text-green-500">
                2FA Enabled!
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Your account is now protected with two-factor authentication.
              </p>
              <Link href="/" className="btn btn-primary w-full">
                Continue to SketchFactor
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          <Link href="/settings" className="hover:text-[var(--color-text)]">
            ← Back to Settings
          </Link>
        </p>
      </div>
    </div>
  );
}

