import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sketchfactor.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    password_hash TEXT,
    totp_secret TEXT,
    totp_enabled INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    industry TEXT,
    location TEXT,
    website TEXT,
    logo_url TEXT,
    sketch_score REAL DEFAULT 0,
    total_reports INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    severity INTEGER NOT NULL CHECK(severity >= 1 AND severity <= 5),
    is_anonymous INTEGER DEFAULT 1,
    upvotes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS report_votes (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK(vote_type IN ('up', 'down')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_id, user_id),
    FOREIGN KEY (report_id) REFERENCES reports(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
  CREATE INDEX IF NOT EXISTS idx_companies_sketch_score ON companies(sketch_score DESC);
  CREATE INDEX IF NOT EXISTS idx_reports_company ON reports(company_id);
  CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
`);

// Seed some initial companies for demo
const seedCompanies = [
  { name: 'TechBro Industries', slug: 'techbro-industries', industry: 'Technology', location: 'San Francisco, CA' },
  { name: 'Grindset Corp', slug: 'grindset-corp', industry: 'Finance', location: 'New York, NY' },
  { name: 'Hustle Culture LLC', slug: 'hustle-culture-llc', industry: 'Marketing', location: 'Austin, TX' },
  { name: 'Disruption Dynamics', slug: 'disruption-dynamics', industry: 'Consulting', location: 'Seattle, WA' },
  { name: 'Synergy Solutions', slug: 'synergy-solutions', industry: 'HR Services', location: 'Chicago, IL' },
];

const insertCompany = db.prepare(`
  INSERT OR IGNORE INTO companies (id, name, slug, industry, location)
  VALUES (?, ?, ?, ?, ?)
`);

seedCompanies.forEach((company, index) => {
  insertCompany.run(`seed-${index + 1}`, company.name, company.slug, company.industry, company.location);
});

export default db;

// User operations
export const createUser = db.prepare(`
  INSERT INTO users (id, email, name, image, password_hash)
  VALUES (?, ?, ?, ?, ?)
`);

export const getUserByEmail = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);

export const getUserById = db.prepare(`
  SELECT * FROM users WHERE id = ?
`);

export const updateUserTotp = db.prepare(`
  UPDATE users SET totp_secret = ?, totp_enabled = ? WHERE id = ?
`);

// Company operations
export const getAllCompanies = db.prepare(`
  SELECT * FROM companies ORDER BY sketch_score DESC, total_reports DESC
`);

export const getCompanyBySlug = db.prepare(`
  SELECT * FROM companies WHERE slug = ?
`);

export const getCompanyById = db.prepare(`
  SELECT * FROM companies WHERE id = ?
`);

export const searchCompanies = db.prepare(`
  SELECT * FROM companies 
  WHERE name LIKE ? OR industry LIKE ? OR location LIKE ?
  ORDER BY sketch_score DESC
`);

export const createCompany = db.prepare(`
  INSERT INTO companies (id, name, slug, industry, location, website)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export const updateCompanyScore = db.prepare(`
  UPDATE companies 
  SET sketch_score = ?, total_reports = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

// Report operations
export const createReport = db.prepare(`
  INSERT INTO reports (id, company_id, user_id, category, title, content, severity, is_anonymous)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

export const getReportsByCompany = db.prepare(`
  SELECT r.*, 
    CASE WHEN r.is_anonymous = 1 THEN 'Anonymous' ELSE u.name END as author_name
  FROM reports r
  LEFT JOIN users u ON r.user_id = u.id
  WHERE r.company_id = ?
  ORDER BY r.created_at DESC
`);

export const getReportById = db.prepare(`
  SELECT * FROM reports WHERE id = ?
`);

export const voteReport = db.prepare(`
  INSERT OR REPLACE INTO report_votes (id, report_id, user_id, vote_type)
  VALUES (?, ?, ?, ?)
`);

export const getReportVotes = db.prepare(`
  SELECT 
    SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END) as upvotes,
    SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END) as downvotes
  FROM report_votes WHERE report_id = ?
`);

// Calculate and update company sketch score
export function recalculateCompanyScore(companyId: string) {
  const reports = getReportsByCompany.all(companyId) as { severity: number }[];
  if (reports.length === 0) {
    updateCompanyScore.run(0, 0, companyId);
    return;
  }
  
  const avgSeverity = reports.reduce((sum, r) => sum + r.severity, 0) / reports.length;
  const sketchScore = Math.round(avgSeverity * 20); // Convert 1-5 to 0-100 scale
  updateCompanyScore.run(sketchScore, reports.length, companyId);
}

