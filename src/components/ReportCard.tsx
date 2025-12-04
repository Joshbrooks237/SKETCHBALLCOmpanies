import { Report, SKETCH_CATEGORIES, SketchCategory } from '@/types';

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const category = SKETCH_CATEGORIES[report.category as SketchCategory];
  const timeAgo = getTimeAgo(new Date(report.created_at));

  return (
    <div className={`report-card severity-${report.severity}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{category?.emoji || '🚩'}</span>
            <span className="badge badge-warning">
              {category?.label || report.category}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {timeAgo}
            </span>
          </div>
          
          <h4 className="text-lg font-semibold mb-2">{report.title}</h4>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {report.content}
          </p>
          
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-muted)]">
              by {report.author_name || 'Anonymous'}
            </span>
            <div className="flex items-center gap-1">
              <SeverityIndicator severity={report.severity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeverityIndicator({ severity }: { severity: number }) {
  const labels = ['Minor', 'Moderate', 'Significant', 'Severe', 'Critical'];
  const colors = ['bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`w-2 h-4 rounded-sm ${
              level <= severity ? colors[severity - 1] : 'bg-[var(--color-bg-tertiary)]'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--color-text-muted)]">
        {labels[severity - 1]}
      </span>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  
  return date.toLocaleDateString();
}

