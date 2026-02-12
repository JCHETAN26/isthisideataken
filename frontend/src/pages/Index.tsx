import { useNavigate } from "react-router-dom";
import SearchInput from "@/components/SearchInput";
import VerdictBadge from "@/components/VerdictBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Search, BarChart3 } from "lucide-react";

const examples = [
  { idea: "AI resume builder", score: 82, verdict: "Taken" as const },
  { idea: "Local event discovery app", score: 45, verdict: "Crowded" as const },
  { idea: "Decentralized pet insurance", score: 12, verdict: "Wide Open" as const },
];

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate("/loading", { state: { query } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="mesh-bg relative flex flex-col items-center justify-center px-4 pt-32 pb-24 sm:pt-40 sm:pb-32 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground mb-8 animate-fade-in">
            <Zap className="h-3 w-3 text-primary" />
            10,432 ideas checked this month
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-5 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Know if your idea{" "}
            <span className="text-gradient">already exists.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            Search domains, App Store, Product Hunt, Reddit, GitHub and more — in one shot.
          </p>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <SearchInput onSearch={handleSearch} size="large" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-foreground mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Search, step: "01", title: "Describe your idea", desc: "Write your startup concept in plain English." },
              { icon: Zap, step: "02", title: "We search 7 sources", desc: "Domains, apps, PH, Reddit, trends, GitHub, trademarks." },
              { icon: BarChart3, step: "03", title: "Get your score", desc: "Instant viability report with competitors and risks." },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-primary font-mono mb-1">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example results */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-foreground mb-3">See what you'll get</h2>
          <p className="text-center text-sm text-muted-foreground mb-12">Example results from real idea checks.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {examples.map((ex) => (
              <div key={ex.idea} className="rounded-xl border border-border bg-card p-5 card-hover">
                <p className="text-sm font-medium text-foreground mb-3">"{ex.idea}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{ex.score}<span className="text-xs text-muted-foreground font-normal">/100</span></span>
                  <VerdictBadge verdict={ex.verdict} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
