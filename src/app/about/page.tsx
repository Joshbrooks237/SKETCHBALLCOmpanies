import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-6xl mb-4 block">🚩</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-[var(--color-accent)]">SketchFactor</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)]">
            Empowering employees. Exposing red flags. One report at a time.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span>💡</span> Why We Built This
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Too many employees discover red flags about their company only after it's too late. 
              The "probationary" employee who doesn't get holiday pay. The promised remote work 
              that becomes mandatory in-office. The "unlimited PTO" that gets you fired for taking 
              vacation.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mt-4">
              We built SketchFactor to give future employees the information they need to make 
              informed decisions, and to give current employees a voice to expose corporate BS 
              without fear of retaliation.
            </p>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span>🔒</span> Your Privacy Matters
            </h2>
            <ul className="space-y-3 text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong className="text-[var(--color-text)]">Anonymous by default:</strong> Your identity is hidden unless you choose otherwise</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong className="text-[var(--color-text)]">2FA protection:</strong> Extra security to protect your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong className="text-[var(--color-text)]">No employer access:</strong> Companies cannot see who reported them</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong className="text-[var(--color-text)]">Minimal data:</strong> We only collect what's necessary</span>
              </li>
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span>⚖️</span> Fair & Balanced
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              We're not here to destroy companies unfairly. We're here to surface patterns and 
              give employees accurate information. Reports with more upvotes rise to the top. 
              Companies with consistently positive reports will show low sketch scores.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mt-4">
              Our goal is transparency, not destruction. Good companies have nothing to fear.
            </p>
          </div>

          <div className="card p-8 border-[var(--color-accent)]/30">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span>✊</span> The People Have The Power
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              Every report you submit helps someone else make a better decision. Every upvote 
              validates someone's experience. Every share spreads awareness.
            </p>
            <p className="text-lg font-semibold text-[var(--color-text)]">
              Together, we can hold corporations accountable.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn btn-primary">
              Join the Movement
            </Link>
            <Link href="/companies" className="btn btn-secondary">
              Browse Companies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

