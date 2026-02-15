import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Share2, ArrowLeft, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import VerdictBadge from "@/components/VerdictBadge";
import SourceCard from "@/components/SourceCard";
import CompetitorCard from "@/components/CompetitorCard";
import type { IdeaCheckResult } from "@/lib/api";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, result } = (location.state as { query?: string; result?: IdeaCheckResult }) || {};

  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `My startup idea "${query}" scored ${result.analysis.overallScore}/100 on IsThisIdeaTaken — Verdict: ${result.analysis.verdict}. Check yours at isthisideataken.com`
    );
    toast.success("Copied to clipboard!");
  };

  // Map sources to the format expected by SourceCard
  const sources = [
    {
      source: "Google Web",
      status: (result.sources.google && result.sources.google.length > 0 ? "found" : "clear") as "found" | "clear",
      summary: result.sources.google && result.sources.google.length > 0 ? `Found ${result.sources.google.length} relevant websites` : "No direct web competitors found",
      items: result.sources.google?.slice(0, 3).map(res => ({
        label: res.name,
        url: res.url,
        sub: res.description.substring(0, 60) + "..."
      }))
    },
    {
      source: "App Store",
      status: (result.sources.appStore.length > 0 ? "found" : "clear") as "found" | "clear",
      summary: result.sources.appStore.length > 0 ? `${result.sources.appStore.length} similar apps found` : "No direct competitors found",
      items: result.sources.appStore.slice(0, 3).map(app => ({
        label: app.name,
        url: app.url,
        sub: `Rating: ${app.rating} ★`
      }))
    },
    {
      source: "Product Hunt",
      status: (result.sources.productHunt.length > 0 ? "found" : "clear") as "found" | "clear",
      summary: result.sources.productHunt.length > 0 ? `${result.sources.productHunt.length} launches found` : "No recent launches found",
      items: result.sources.productHunt.slice(0, 3).map(p => ({
        label: p.name,
        url: p.url,
        sub: `${p.upvotes} upvotes`
      }))
    },
    {
      source: "Hacker News",
      status: (result.sources.hn && result.sources.hn.length > 0 ? "found" : "clear") as "found" | "clear",
      summary: result.sources.hn && result.sources.hn.length > 0 ? `${result.sources.hn.length} relevant stories` : "No major HN discussions",
      items: result.sources.hn?.slice(0, 3).map(h => ({
        label: h.title,
        url: h.url,
        sub: `${h.points} points • ${h.comments} comments`
      }))
    },
    {
      source: "Reddit",
      status: (result.sources.reddit.length > 0 ? "found" : "clear") as "found" | "clear",
      summary: result.sources.reddit.length > 0 ? `${result.sources.reddit.length} discussions found` : "No major discussions found",
      items: result.sources.reddit.slice(0, 3).map(r => ({
        label: r.title,
        url: r.url,
        sub: `r/${r.subreddit} • ${r.upvotes} upvotes`
      }))
    },
    {
      source: "Google Trends",
      status: "found" as "found",
      summary: `Interest Level: ${result.sources.trends.interest}/100 (${result.sources.trends.trend})`,
      items: [{
        label: "View Report on Google Trends",
        url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(query)}`,
        sub: "Last 12 months data"
      }]
    },
    {
      source: "GitHub",
      status: (result.sources.github.length > 0 ? "found" : "clear") as "found" | "clear",
      summary: result.sources.github.length > 0 ? `${result.sources.github.length} open source projects` : "No similar repos found",
      items: result.sources.github.slice(0, 3).map(g => ({
        label: g.name,
        url: g.url,
        sub: `${g.stars} stars • ${g.language}`
      }))
    },
    {
      source: "USPTO",
      status: (result.sources.trademark.found ? "taken" : "clear") as "taken" | "clear",
      summary: result.sources.trademark.found ? `${result.sources.trademark.matches.length} trademark matches` : "No exact trademark match",
      items: result.sources.trademark.matches?.slice(0, 3).map(t => ({
        label: t.name,
        sub: `Status: ${t.status}`,
        url: `https://tmsearch.uspto.gov/search/search-results?searchString=${encodeURIComponent(t.name)}`
      }))
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Search again
          </button>
          <button onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <Share2 className="h-3.5 w-3.5" /> Share result
          </button>
        </div>

        {/* Idea */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Idea analyzed</p>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-8">"{query}"</h1>

        {/* Score hero */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <ScoreRing score={result.analysis.overallScore} />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <VerdictBadge verdict={result.analysis.verdict} className="text-sm" />
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${result.analysis.sentiment === 'Positive' ? 'bg-green-500/10 text-green-500' :
                    result.analysis.sentiment === 'Critical' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                  }`}>
                  {result.analysis.sentiment} Sentiment
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Confidence: {result.analysis.confidenceScore}%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              {result.analysis.recommendation}
            </p>
          </div>
        </div>

        {/* AI Analysis - Enhanced with Niche Opportunities */}
        <div className="rounded-xl border-l-4 border-l-primary border border-border bg-card p-6 mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">AI-Powered Insights</h3>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Powered by Claude</span>
            </div>
          </div>

          {/* Main Recommendation */}
          <p className="text-sm text-secondary-foreground leading-relaxed mb-6">
            {result.analysis.recommendation}
          </p>

          {/* Niche Opportunities */}
          {result.analysis.nicheOpportunities && result.analysis.nicheOpportunities.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">💡 Niche Opportunities</h4>
              <ul className="space-y-2">
                {result.analysis.nicheOpportunities.map((niche: string, idx: number) => (
                  <li key={idx} className="text-sm text-secondary-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>{niche}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unique Angles */}
          {result.analysis.uniqueAngles && result.analysis.uniqueAngles.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">🎯 Differentiation Ideas</h4>
              <ul className="space-y-2">
                {result.analysis.uniqueAngles.map((angle: string, idx: number) => (
                  <li key={idx} className="text-sm text-secondary-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>{angle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Market Gaps */}
          {result.analysis.marketGaps && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">🔍 Market Gaps</h4>
              <p className="text-sm text-secondary-foreground">{result.analysis.marketGaps}</p>
            </div>
          )}
        </div>

        {/* Source cards */}
        <h3 className="font-semibold text-foreground mb-4">Source Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {sources.map((s) => (
            <SourceCard key={s.source} {...s} />
          ))}
        </div>

        {/* Competitors */}
        {result.analysis.topCompetitors.length > 0 && (
          <>
            <h3 className="font-semibold text-foreground mb-4">Top Competitors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              {result.analysis.topCompetitors.map((c) => (
                <CompetitorCard key={c.name} name={c.name} url={c.url} description={c.description} source={c.source} />
              ))}
            </div>
          </>
        )}

        {/* Risks */}
        {result.analysis.keyRisks?.length > 0 && (
          <>
            <h3 className="font-semibold text-foreground mb-4">Key Risks</h3>
            <div className="space-y-2 mb-12">
              {result.analysis.keyRisks.map((r) => (
                <div key={r} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <p className="text-sm text-secondary-foreground">{r}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pro CTA */}
        <div className="relative rounded-2xl border border-primary/30 bg-card overflow-hidden mb-10">
          <div className="p-8 text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-2">Want the full report?</h3>
            <p className="text-sm text-muted-foreground mb-4">Get competitor deep-dives, market sizing, and PDF export.</p>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Upgrade to Pro →
            </button>
          </div>
          {/* Blurred teaser */}
          <div className="h-24 bg-gradient-to-t from-card to-transparent relative">
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Check another idea
          </button>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-lg p-3 sm:hidden z-40">
        <button
          onClick={() => navigate("/pricing")}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Upgrade to Pro →
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Results;
