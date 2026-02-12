'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  const [idea, setIdea] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsSearching(true);

    try {
      // Navigate to results page with the idea as a query parameter
      const encodedIdea = encodeURIComponent(idea);
      router.push(`/results?idea=${encodedIdea}`);
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };

  const exampleIdeas = [
    "An app that tracks your water intake using AI",
    "A platform for renting designer clothes",
    "AI-powered meal planning based on your fridge contents",
    "A marketplace for local home chefs"
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-[var(--text-secondary)]">
                Validate your startup idea in seconds
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Is Your Idea{' '}
              <span className="gradient-text">Already Taken?</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Search across domains, app stores, Product Hunt, GitHub, and more to discover
              if your startup idea already exists—before you invest time and money.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your startup idea..."
                  className="w-full pl-16 pr-6 py-5 text-lg bg-[var(--surface-elevated)] border-2 border-[var(--border)] rounded-2xl text-white placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-300"
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !idea.trim()}
                className="mt-4 w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 md:mt-0 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Check Availability
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Example Ideas */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-[var(--text-tertiary)] mb-3">Try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleIdeas.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setIdea(example)}
                  className="px-4 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-white transition-all duration-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-hover text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Source Analysis</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                We check 7+ sources simultaneously including domains, app stores, Product Hunt, GitHub, and more.
              </p>
            </div>

            <div className="card-hover text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Get a comprehensive viability score and actionable recommendations powered by Claude AI.
              </p>
            </div>

            <div className="card-hover text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Results in seconds with parallel processing and intelligent caching for instant insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="border-t border-[var(--border)] py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Describe Your Idea', desc: 'Type in your startup concept in plain English' },
                { step: '02', title: 'We Search Everything', desc: 'Our system checks 7+ sources in parallel' },
                { step: '03', title: 'AI Analyzes Results', desc: 'Claude AI processes all findings' },
                { step: '04', title: 'Get Your Report', desc: 'Receive a detailed viability score and insights' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold gradient-text mb-4">{item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-[var(--border)] py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Validate Your Idea?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Join thousands of entrepreneurs who've saved time and money by validating their ideas first.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Your Free Search
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="container-custom">
          <div className="text-center text-[var(--text-tertiary)] text-sm">
            <p>© 2026 IdeaTaken. Built to help entrepreneurs validate faster.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
