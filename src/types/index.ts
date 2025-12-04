export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  password_hash: string | null;
  totp_secret: string | null;
  totp_enabled: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  location: string | null;
  website: string | null;
  logo_url: string | null;
  sketch_score: number;
  total_reports: number;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  company_id: string;
  user_id: string;
  category: SketchCategory;
  title: string;
  content: string;
  severity: number;
  is_anonymous: number;
  upvotes: number;
  created_at: string;
  author_name?: string;
}

export type SketchCategory = 
  | 'pay'
  | 'policy'
  | 'interview_vs_reality'
  | 'management'
  | 'exit'
  | 'culture'
  | 'benefits'
  | 'other';

export const SKETCH_CATEGORIES: Record<SketchCategory, { label: string; emoji: string; description: string }> = {
  pay: {
    label: 'Pay Sketchy',
    emoji: '💰',
    description: 'Late payments, holiday pay BS, wage theft, "we\'ll fix it next check"'
  },
  policy: {
    label: 'Policy Sketchy',
    emoji: '📋',
    description: 'Rules that only benefit them, arbitrary enforcement'
  },
  interview_vs_reality: {
    label: 'Interview vs Reality',
    emoji: '🤥',
    description: 'What they promised vs what you got'
  },
  management: {
    label: 'Management Sketchy',
    emoji: '👔',
    description: 'Favoritism, gaslighting, "we\'re a family"'
  },
  exit: {
    label: 'Exit Sketchy',
    emoji: '🚪',
    description: 'How they treat people leaving, references, final pay'
  },
  culture: {
    label: 'Culture Sketchy',
    emoji: '🎭',
    description: 'Toxic vibes, cliques, retaliation, forced fun'
  },
  benefits: {
    label: 'Benefits Sketchy',
    emoji: '🏥',
    description: 'Insurance bait-and-switch, PTO lies, 401k games'
  },
  other: {
    label: 'Other Sketchy',
    emoji: '🚩',
    description: 'Red flags that don\'t fit elsewhere'
  }
};

export function getSketchScoreColor(score: number): string {
  if (score >= 80) return 'text-red-500';
  if (score >= 60) return 'text-orange-500';
  if (score >= 40) return 'text-yellow-500';
  if (score >= 20) return 'text-lime-500';
  return 'text-green-500';
}

export function getSketchScoreLabel(score: number): string {
  if (score >= 80) return 'EXTREMELY SKETCHY';
  if (score >= 60) return 'VERY SKETCHY';
  if (score >= 40) return 'SOMEWHAT SKETCHY';
  if (score >= 20) return 'SLIGHTLY SKETCHY';
  return 'SEEMS LEGIT';
}

export function getSketchScoreBg(score: number): string {
  if (score >= 80) return 'bg-red-500/20 border-red-500/50';
  if (score >= 60) return 'bg-orange-500/20 border-orange-500/50';
  if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/50';
  if (score >= 20) return 'bg-lime-500/20 border-lime-500/50';
  return 'bg-green-500/20 border-green-500/50';
}

