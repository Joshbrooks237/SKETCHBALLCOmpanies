'use client';

import { useState, useEffect } from 'react';
import CompanyCard from '@/components/CompanyCard';
import type { Company } from '@/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (query?: string) => {
    setLoading(true);
    try {
      const url = query 
        ? `/api/companies?q=${encodeURIComponent(query)}`
        : '/api/companies';
      const res = await fetch(url);
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies(search);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            COMPANY <span className="text-[var(--color-accent)]">DIRECTORY</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            Search for a company to see its sketch score, or add a new company to the database
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company name, industry, or location..."
                className="input pl-12"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Add Company CTA */}
        <div className="max-w-2xl mx-auto mb-12 card p-6 border-dashed">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold mb-1">Can't find your company?</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Add it to the database and be the first to file a report
              </p>
            </div>
            <a href="/company/new" className="btn btn-secondary whitespace-nowrap">
              + Add Company
            </a>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 h-48">
                <div className="skeleton h-6 w-3/4 mb-4" />
                <div className="skeleton h-4 w-1/2 mb-6" />
                <div className="skeleton h-8 w-full" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold mb-2">No companies found</h3>
            <p className="text-[var(--color-text-secondary)]">
              {search ? `No results for "${search}"` : 'Be the first to add a company'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[var(--color-text-secondary)]">
                Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
              </p>
              <select className="input w-auto">
                <option value="sketch_score">Sort by Sketch Score</option>
                <option value="reports">Sort by Reports</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

