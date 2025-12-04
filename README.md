# 🚩 SketchFactor

**Expose Corporate Red Flags. The People Have The Power.**

SketchFactor is an anonymous platform for employees to rate and review the "sketch factor" of companies. Help future employees avoid bad situations by sharing your experiences.

## Features

- 🏢 **Company Directory** - Browse and search companies with sketch scores
- 📝 **Anonymous Reports** - Share experiences without fear of retaliation
- 📊 **Sketch Categories** - Rate companies on pay, policy, management, culture, and more
- 🔐 **2FA Security** - Two-factor authentication to protect your identity
- 🔍 **Google OAuth** - Easy sign-in with your Google account

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd sketchfactor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables. Create a `.env.local` file:
```env
# Authentication - Generate with: openssl rand -base64 32
AUTH_SECRET=your-super-secret-key

# Google OAuth (get from https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXTAUTH_URL=http://localhost:3000
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
4. Set the application type to "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local`

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth.js with Google OAuth + TOTP 2FA
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

## Project Structure

```
sketchfactor/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Auth pages (signin, signup)
│   │   ├── companies/    # Company listing
│   │   ├── company/      # Company detail & new company
│   │   ├── report/       # Submit report
│   │   └── settings/     # User settings & 2FA
│   ├── components/       # React components
│   ├── lib/              # Database & auth utilities
│   └── types/            # TypeScript types
├── public/               # Static assets
└── sketchfactor.db       # SQLite database (auto-created)
```

## Sketch Categories

- 💰 **Pay Sketchy** - Late payments, holiday pay BS, wage theft
- 📋 **Policy Sketchy** - Rules that only benefit them
- 🤥 **Interview vs Reality** - What they promised vs what you got
- 👔 **Management Sketchy** - Favoritism, gaslighting, toxic leadership
- 🚪 **Exit Sketchy** - How they treat people leaving
- 🎭 **Culture Sketchy** - Toxic vibes, forced fun, cliques
- 🏥 **Benefits Sketchy** - Insurance bait-and-switch, PTO lies
- 🚩 **Other Red Flags** - Everything else

## Contributing

This is a project for the people. Contributions welcome!

## License

MIT

---

**Remember: The people have the power. Your voice matters.**
