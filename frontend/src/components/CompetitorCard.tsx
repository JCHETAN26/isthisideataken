import { ExternalLink } from "lucide-react";

interface CompetitorCardProps {
  name: string;
  url: string;
  description: string;
}

const CompetitorCard = ({ name, url, description }: CompetitorCardProps) => (
  <div className="rounded-xl border border-border bg-card p-5 card-hover">
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-semibold text-foreground">{name}</h4>
      <a
        href={`https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
      >
        Visit <ExternalLink className="h-3 w-3" />
      </a>
    </div>
    <p className="text-xs text-muted-foreground mb-1">{url}</p>
    <p className="text-sm text-secondary-foreground leading-relaxed">{description}</p>
  </div>
);

export default CompetitorCard;
