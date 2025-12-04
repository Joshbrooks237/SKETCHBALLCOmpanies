'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ReportCard from '@/components/ReportCard';
import { Company, Report, getSketchScoreColor, getSketchScoreLabel, SKETCH_CATEGORIES, SketchCategory } from '@/types';

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchCompanyData();
  }, [slug]);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch(`/api/companies/${slug}`);
      if (!res.ok) throw new Error('Company not found');
      const data = await res.json();
      setCompany(data.company);
      setReports(data.reports);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-12 w-64 mb-4" />
          <div className="skeleton h-6 w-96 mb-8" />
          <div className="card p-8">
            <div className="skeleton h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen py-24 px-4 text-center">
        <span className="text-6xl mb-4 block">😕</span>
        <h1 className="text-3xl font-bold mb-4">Company Not Found</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          This company doesn't exist in our database yet.
        </p>
        <Link href="/companies" className="btn btn-primary">
          Browse Companies
        </Link>
      </div>
    );
  }

  const scoreColor = getSketchScoreColor(company.sketch_score);
  const scoreLabel = getSketchScoreLabel(company.sketch_score);

  // Calculate category breakdown
  const categoryBreakdown = Object.keys(SKETCH_CATEGORIES).map(cat => ({
    category: cat as SketchCategory,
    count: reports.filter(r => r.category === cat).length,
    ...SKETCH_CATEGORIES[cat as SketchCategory]
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/companies" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-8">
          ← Back to Companies
        </Link>

        {/* Company Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                {company.industry && (
                  <span className="badge">{company.industry}</span>
                )}
                {company.location && (
                  <span>📍 {company.location}</span>
                )}
              </div>
            </div>

            {/* Sketch Score */}
            <div className="flex flex-col items-center p-6 bg-[var(--color-bg-tertiary)] rounded-xl">
              <span className={`text-6xl font-bold ${scoreColor}`}>
                {company.sketch_score}
              </span>
              <span className={`text-sm font-bold mt-1 ${scoreColor}`}>
                {scoreLabel}
              </span>
              <span className="text-xs text-[var(--color-text-muted)] mt-2">
                Based on {company.total_reports} {company.total_reports === 1 ? 'report' : 'reports'}
              </span>
            </div>
          </div>

          {/* Sketch Meter */}
          <div className="mt-8">
            <div className="sketch-meter h-4">
              <div
                className={`sketch-meter-fill ${
                  company.sketch_score >= 80 ? 'bg-red-500' :
                  company.sketch_score >= 60 ? 'bg-orange-500' :
                  company.sketch_score >= 40 ? 'bg-yellow-500' :
                  company.sketch_score >= 20 ? 'bg-lime-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${company.sketch_score}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
              <span>Legit</span>
              <span>Extremely Sketchy</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href={`/report?company=${company.id}`} className="btn btn-primary flex-1">
            📝 Submit a Report
          </Link>
          <button className="btn btn-secondary flex-1">
            🔔 Get Alerts
          </button>
          <button className="btn btn-ghost">
            📤 Share
          </button>
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-bold mb-4">Report Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {categoryBreakdown.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setFilter(filter === cat.category ? 'all' : cat.category)}
                  className={`badge cursor-pointer transition-all ${
                    filter === cat.category 
                      ? 'badge-danger' 
                      : 'bg-[var(--color-bg-tertiary)] border-[var(--color-border)]'
                  }`}
                >
                  {cat.emoji} {cat.label} ({cat.count})
                </button>
              ))}
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="badge bg-[var(--color-bg-tertiary)] border-[var(--color-border)] cursor-pointer"
                >
                  ✕ Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reports */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Reports ({filteredReports.length})
          </h2>
          
          {filteredReports.length === 0 ? (
            <div className="card p-12 text-center">
              <span className="text-5xl mb-4 block">📋</span>
              <h3 className="text-xl font-bold mb-2">No reports yet</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Be the first to expose what's really going on at {company.name}
              </p>
              <Link href={`/report?company=${company.id}`} className="btn btn-primary">
                Submit the First Report
              </Link>
            </div>
          ) : (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

