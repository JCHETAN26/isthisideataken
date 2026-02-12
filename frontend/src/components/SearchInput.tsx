import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  size?: "default" | "large";
}

const SearchInput = ({ onSearch, loading = false, size = "default" }: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`relative group ${isLarge ? "text-lg" : "text-sm"}`}>
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center rounded-xl border border-border bg-card focus-within:border-primary/50 focus-within:glow-input-focus transition-all duration-300">
          <Search className={`${isLarge ? "ml-5 h-5 w-5" : "ml-4 h-4 w-4"} text-muted-foreground shrink-0`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your startup idea..."
            className={`flex-1 bg-transparent ${isLarge ? "px-4 py-5" : "px-3 py-3"} text-foreground placeholder:text-muted-foreground focus:outline-none`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className={`${isLarge ? "mr-2.5 px-5 py-2.5 text-sm" : "mr-2 px-4 py-2 text-xs"} inline-flex items-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Check My Idea
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchInput;
