'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Company, SKETCH_CATEGORIES, SketchCategory } from '@/types';

function ReportForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCompanyId = searchParams.get('company');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>(preselectedCompanyId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<SketchCategory>('pay');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [severity, setSeverity] = useState(3);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (query?: string) => {
    const url = query 
      ? `/api/companies?q=${encodeURIComponent(query)}`
      : '/api/companies';
    const res = await fetch(url);
    const data = await res.json();
    setCompanies(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/report');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany,
          category,
          title,
          content,
          severity,
          isAnonymous,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit report');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        const company = companies.find(c => c.id === selectedCompany);
        if (company) {
          router.push(`/company/${company.slug}`);
        } else {
          router.push('/companies');
        }
      }, 2000);
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="card p-12 text-center max-w-md">
          <span className="text-6xl mb-4 block">🎉</span>
          <h2 className="text-2xl font-bold mb-2">Report Submitted!</h2>
          <p className="text-[var(--color-text-secondary)]">
            Thank you for helping expose corporate red flags. Your voice matters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FILE A <span className="text-[var(--color-accent)]">REPORT</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Share your experience anonymously and help others avoid bad situations
          </p>
        </div>

        {!session && (
          <div className="card p-6 mb-8 border-[var(--color-warning)] bg-[var(--color-warning)]/10">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔐</span>
              <div>
                <h3 className="font-bold">Sign in to submit a report</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Your identity stays hidden - we just need to verify you're real
                </p>
              </div>
              <Link href="/auth/signin?callbackUrl=/report" className="btn btn-primary ml-auto">
                Sign In
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Company Selection */}
          <div className="card p-6">
            <label className="block text-lg font-bold mb-4">
              1. Select Company 🏢
            </label>
            <div className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchCompanies(e.target.value);
                }}
                className="input"
                placeholder="Search for a company..."
              />
              <div className="max-h-48 overflow-y-auto space-y-2">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => setSelectedCompany(company.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedCompany === company.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                    }`}
                  >
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {company.industry} • {company.location}
                    </div>
                  </button>
                ))}
              </div>
              <Link href="/company/new" className="text-sm text-[var(--color-accent)] hover:underline">
                + Add a new company
              </Link>
            </div>
          </div>

          {/* Category Selection */}
          <div className="card p-6">
            <label className="block text-lg font-bold mb-4">
              2. Select Category 📋
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(SKETCH_CATEGORIES) as [SketchCategory, typeof SKETCH_CATEGORIES[SketchCategory]][]).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    category === key
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="font-medium mt-2">{cat.label}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {cat.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Details */}
          <div className="card p-6">
            <label className="block text-lg font-bold mb-4">
              3. Share Your Experience ✍️
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="E.g., 'Didn't get paid for Thanksgiving because of probation'"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Details</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input min-h-[150px] resize-y"
                  placeholder="Share your story... What happened? When? How did it affect you?"
                  required
                />
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="card p-6">
            <label className="block text-lg font-bold mb-4">
              4. Rate Severity 📊
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="flex justify-between text-sm">
                <span className={severity === 1 ? 'text-green-500 font-bold' : 'text-[var(--color-text-muted)]'}>
                  1 - Minor
                </span>
                <span className={severity === 2 ? 'text-lime-500 font-bold' : 'text-[var(--color-text-muted)]'}>
                  2 - Moderate
                </span>
                <span className={severity === 3 ? 'text-yellow-500 font-bold' : 'text-[var(--color-text-muted)]'}>
                  3 - Significant
                </span>
                <span className={severity === 4 ? 'text-orange-500 font-bold' : 'text-[var(--color-text-muted)]'}>
                  4 - Severe
                </span>
                <span className={severity === 5 ? 'text-red-500 font-bold' : 'text-[var(--color-text-muted)]'}>
                  5 - Critical
                </span>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="card p-6">
            <label className="block text-lg font-bold mb-4">
              5. Privacy Settings 🔒
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 accent-[var(--color-accent)]"
              />
              <div>
                <div className="font-medium">Post anonymously</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Your name won't be shown (recommended)
                </div>
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !selectedCompany || !title || !content}
            className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : '🚩 Submit Report'}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Your report helps protect future employees and holds companies accountable
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <ReportForm />
    </Suspense>
  );
}

