import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-fade-in">
              <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-[var(--color-accent)] bg-[var(--color-accent-muted)] rounded-full border border-[var(--color-accent)]/30">
                🚨 CORPORATE ACCOUNTABILITY NOW
              </span>
            </div>
            
            <h1 className="headline text-gradient animate-fade-in stagger-1 opacity-0">
              EXPOSE THE<br />SKETCH
            </h1>
            
            <p className="mt-8 text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-2xl mx-auto animate-fade-in stagger-2 opacity-0">
              Anonymous platform for employees to rate and expose corporate red flags.
              <span className="text-[var(--color-text)]"> The people have the power.</span>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3 opacity-0">
              <Link href="/companies" className="btn btn-primary text-lg px-8 py-4">
                🔍 Search Companies
              </Link>
              <Link href="/report" className="btn btn-secondary text-lg px-8 py-4">
                📝 Submit a Report
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in stagger-4 opacity-0">
            {[
              { label: 'Companies Exposed', value: '2,847', emoji: '🏢' },
              { label: 'Reports Filed', value: '15,392', emoji: '📋' },
              { label: 'Employees Protected', value: '50K+', emoji: '🛡️' },
              { label: 'Red Flags Raised', value: '∞', emoji: '🚩' },
            ].map((stat) => (
              <div key={stat.label} className="card p-6 text-center">
                <span className="text-3xl mb-2 block">{stat.emoji}</span>
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 bg-[var(--color-bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              SKETCH <span className="text-[var(--color-accent)]">CATEGORIES</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg">
              Rate companies across multiple dimensions of corporate shadiness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '💰', label: 'Pay Sketchy', desc: 'Wage theft, late payments, holiday pay games' },
              { emoji: '📋', label: 'Policy Sketchy', desc: 'Rules designed to benefit only them' },
              { emoji: '🤥', label: 'Interview vs Reality', desc: 'What they promised vs what you got' },
              { emoji: '👔', label: 'Management Sketchy', desc: 'Favoritism, gaslighting, toxic leadership' },
              { emoji: '🚪', label: 'Exit Sketchy', desc: 'How they treat people leaving' },
              { emoji: '🎭', label: 'Culture Sketchy', desc: 'Toxic vibes, forced fun, cliques' },
              { emoji: '🏥', label: 'Benefits Sketchy', desc: 'Insurance bait-and-switch, PTO lies' },
              { emoji: '🚩', label: 'Other Red Flags', desc: 'Everything else that needs exposing' },
            ].map((cat) => (
              <div key={cat.label} className="card p-6 group hover:border-[var(--color-accent)]/50">
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <h3 className="text-lg font-bold mb-2">{cat.label}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              HOW IT <span className="text-[var(--color-accent)]">WORKS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up Securely',
                desc: 'Create an account with Google or email. Enable 2FA for extra protection. Your identity stays hidden.',
                icon: '🔐'
              },
              {
                step: '02', 
                title: 'File Your Report',
                desc: 'Search for your company or add it. Rate the sketch factor across categories. Share your story anonymously.',
                icon: '📝'
              },
              {
                step: '03',
                title: 'Help Others',
                desc: 'Your report helps future employees avoid bad situations. Upvote reports. Spread awareness.',
                icon: '🛡️'
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="card p-8">
                  <span className="text-5xl font-bold text-[var(--color-accent)]/20">{item.step}</span>
                  <span className="text-4xl block my-4">{item.icon}</span>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-accent)]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            READY TO CALL OUT<br />
            <span className="text-[var(--color-accent)]">CORPORATE BS?</span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8">
            Your voice matters. Your experience matters.<br />
            Help others make informed decisions.
          </p>
          <Link href="/auth/signup" className="btn btn-primary text-lg px-12 py-4 animate-pulse-red">
            JOIN THE MOVEMENT →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚩</span>
            <span className="font-bold">SKETCHFACTOR</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2024 SketchFactor. Exposing corporate red flags since day one.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
