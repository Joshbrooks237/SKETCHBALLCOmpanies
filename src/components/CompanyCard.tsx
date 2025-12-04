import Link from 'next/link';
import { Company, getSketchScoreColor, getSketchScoreLabel, getSketchScoreBg } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const scoreColor = getSketchScoreColor(company.sketch_score);
  const scoreLabel = getSketchScoreLabel(company.sketch_score);
  const scoreBg = getSketchScoreBg(company.sketch_score);

  return (
    <Link href={`/company/${company.slug}`}>
      <div className="card p-6 h-full cursor-pointer group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate group-hover:text-[var(--color-accent)] transition-colors">
              {company.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-text-secondary)]">
              {company.industry && (
                <span className="truncate">{company.industry}</span>
              )}
              {company.industry && company.location && (
                <span className="text-[var(--color-text-muted)]">•</span>
              )}
              {company.location && (
                <span className="truncate">{company.location}</span>
              )}
            </div>
          </div>

          {/* Sketch Score */}
          <div className={`flex flex-col items-center p-3 rounded-lg border ${scoreBg}`}>
            <span className={`text-2xl font-bold ${scoreColor}`}>
              {company.sketch_score}
            </span>
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Sketch
            </span>
          </div>
        </div>

        {/* Sketch meter */}
        <div className="mt-4">
          <div className="sketch-meter">
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
          <div className="flex justify-between mt-2">
            <span className={`text-xs font-semibold ${scoreColor}`}>
              {scoreLabel}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {company.total_reports} {company.total_reports === 1 ? 'report' : 'reports'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

