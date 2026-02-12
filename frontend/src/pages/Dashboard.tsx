
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, History, Settings, ArrowRight, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import VerdictBadge from "@/components/VerdictBadge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [searches, setSearches] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      fetchSearches();
    }
  }, [user, loading, navigate]);

  const fetchSearches = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('user_searches')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearches(data || []);
    } catch (error) {
      console.error('Error fetching searches:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex pt-14 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden sm:flex flex-col w-64 border-r border-border p-4 gap-1 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
          <div className="mb-6 px-3">
            <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            New Search
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-accent text-accent-foreground"
          >
            <History className="h-4 w-4" />
            History
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Search History</h1>
              <p className="text-muted-foreground">Your recent idea validations and market analysis reports.</p>
            </div>
          </div>

          {fetching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-xl border border-border bg-card/50 animate-pulse" />
              ))}
            </div>
          ) : searches.length > 0 ? (
            <div className="grid gap-4">
              {searches.map((search) => (
                <div
                  key={search.id}
                  className="rounded-xl border border-border bg-card p-4 sm:p-6 transition-all hover:bg-accent/50 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate pr-4">{search.idea}</h3>
                      <p className="text-sm text-muted-foreground">
                        Checked on {new Date(search.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-muted-foreground">Score</span>
                        <span className={`text-2xl font-bold ${search.overall_score >= 80 ? 'text-red-500' :
                            search.overall_score >= 60 ? 'text-orange-500' :
                              'text-green-500'
                          }`}>
                          {search.overall_score}/100
                        </span>
                      </div>

                      <div className="h-8 w-px bg-border hidden sm:block" />

                      <VerdictBadge verdict={search.verdict} />

                      <button
                        onClick={() => navigate("/results", { state: { idea: search.idea, id: search.idea_check_id } })}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                      >
                        View Report
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-border bg-card/50">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No searches yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start validating your startup ideas to verify market demand and competition.
              </p>
              <Button onClick={() => navigate("/")} size="lg">
                Check Your First Idea
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Simple Button component if not imported
function Button({ children, onClick, size = "default", className = "" }: any) {
  const sizeClasses = size === "lg" ? "px-8 py-3 text-base" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  )
}

export default Dashboard;
