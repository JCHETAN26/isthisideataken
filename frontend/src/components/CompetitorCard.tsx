import { ExternalLink } from "lucide-react";

interface CompetitorCardProps {
  name: string;
  url: string;
  description: string;
  source?: string;
}

const CompetitorCard = ({ name, url, description, source }: CompetitorCardProps) => {
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 card-hover flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground line-clamp-1">{name}</h4>
        <a
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {source && (
        <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">
          Source: {source}
        </span>
      )}

      <p className="text-sm text-secondary-foreground leading-relaxed line-clamp-4 flex-1">{description}</p>

      <p className="text-[10px] text-muted-foreground mt-4 truncate">{url}</p>
    </div>
  );
};

export default CompetitorCard;
