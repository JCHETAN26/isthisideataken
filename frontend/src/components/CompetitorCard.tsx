import { ExternalLink } from "lucide-react";

interface CompetitorCardProps {
  name: string;
  url: string;
  description: string;
  source?: string;
  status?: 'relevant' | 'dismissed';
  reasoning?: string;
}

const CompetitorCard = ({ name, url, description, source, status, reasoning }: CompetitorCardProps) => {
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 card-hover flex flex-col h-full border-l-4 border-l-primary/20">
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col gap-1 overflow-hidden">
          <h4 className="font-semibold text-foreground line-clamp-1">{name}</h4>
          <div className="flex items-center gap-2">
            {source && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                {source}
              </span>
            )}
            {status && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${status === 'relevant' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                }`}>
                {status}
              </span>
            )}
          </div>
        </div>
        <a
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <p className="text-[13px] text-secondary-foreground leading-relaxed line-clamp-2 mb-4 italic flex-1">
        "{description}"
      </p>

      {reasoning && (
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50 mb-3">
          <p className="text-[11px] text-foreground font-medium leading-tight">
            <span className="text-primary font-bold">AI Insight: </span>
            {reasoning}
          </p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground truncate opacity-40">{url}</p>
    </div>
  );
};

export default CompetitorCard;
