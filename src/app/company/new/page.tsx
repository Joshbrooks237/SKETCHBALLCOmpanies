'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Marketing',
    'Consulting',
    'HR Services',
    'Food & Beverage',
    'Transportation',
    'Real Estate',
    'Education',
    'Entertainment',
    'Legal',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/company/new');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, industry, location, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add company');
        setLoading(false);
        return;
      }

      router.push(`/company/${data.slug}`);
    } catch {
      setError('Something went wrong');
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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Add a <span className="text-[var(--color-accent)]">Company</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Can't find your employer? Add them to the database.
          </p>
        </div>

        {!session && (
          <div className="card p-6 mb-8 border-[var(--color-warning)] bg-[var(--color-warning)]/10">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔐</span>
              <div>
                <h3 className="font-bold">Sign in to add a company</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  We need to verify you're real to prevent spam
                </p>
              </div>
              <Link href="/auth/signin?callbackUrl=/company/new" className="btn btn-primary ml-auto">
                Sign In
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name <span className="text-[var(--color-accent)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., Sketchy Corp Inc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input"
            >
              <option value="">Select an industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="input"
              placeholder="https://example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name || !session}
            className="btn btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Company...' : '+ Add Company'}
          </button>

          <p className="text-sm text-[var(--color-text-muted)] text-center">
            After adding, you'll be able to submit the first report
          </p>
        </form>

        <p className="text-center mt-6">
          <Link href="/companies" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            ← Back to Companies
          </Link>
        </p>
      </div>
    </div>
  );
}

