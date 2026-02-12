import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProgressChecklist from "@/components/ProgressChecklist";
import { checkIdea, type IdeaCheckResult } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const query = (location.state as { query?: string })?.query || "Your startup idea";
  const [result, setResult] = useState<IdeaCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  useEffect(() => {
    if (authLoading || isFetching || result || error) return;

    const fetchResults = async () => {
      setIsFetching(true);
      try {
        const data = await checkIdea(query, user?.id);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check idea');
        console.error('Error checking idea:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchResults();
  }, [query, user, authLoading]);

  const handleComplete = () => {
    if (result) {
      navigate("/results", { state: { query, result } });
    } else if (error) {
      // Show error state or navigate back
      console.error('Cannot navigate to results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-14">
        <div className="relative">
          {/* Pulsing glow */}
          <div className="absolute inset-0 -m-20 rounded-full bg-primary/10 animate-pulse blur-3xl" />

          <div className="relative text-center mb-12">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Analyzing</p>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground max-w-md">"{query}"</h1>
            {error && (
              <p className="text-sm text-destructive mt-2">Error: {error}</p>
            )}
          </div>

          <ProgressChecklist onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
