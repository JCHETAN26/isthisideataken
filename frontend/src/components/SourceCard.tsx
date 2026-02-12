
import { Globe, Smartphone, Rocket, MessageSquare, TrendingUp, Github, Shield, Check, AlertTriangle, ExternalLink, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SourceItem {
  label: string;
  url?: string;
  sub?: string;
}

const icons: Record<string, React.ElementType> = {
  Domains: Globe,
  "App Store": Smartphone,
  "Product Hunt": Rocket,
  Reddit: MessageSquare,
  "Google Trends": TrendingUp,
  GitHub: Github,
  USPTO: Shield,
};

const sourceDescriptions: Record<string, string> = {
  Domains: "Checks registration status via WHOIS API",
  "App Store": "Searches Apple App Store for similar live apps",
  "Product Hunt": "Finds launched products via Product Hunt API",
  Reddit: "Scans recent discussions on popular subreddits",
  "Google Trends": "Analyzes search interest over time via Google Trends",
  GitHub: "Searches open source repositories on GitHub",
  USPTO: "Checks US Trademark Office database for exact matches",
};

type Status = "found" | "available" | "clear" | "taken";

interface SourceCardProps {
  source: string;
  status: Status;
  summary: string;
  items?: SourceItem[];
}

const statusConfig: Record<Status, { label: string; className: string; Icon: React.ElementType }> = {
  found: { label: "Found", className: "bg-warning/15 text-warning border-warning/20", Icon: AlertTriangle },
  taken: { label: "Taken", className: "bg-destructive/15 text-destructive border-destructive/20", Icon: X },
  available: { label: "Available", className: "bg-success/15 text-success border-success/20", Icon: Check },
  clear: { label: "Clear", className: "bg-success/15 text-success border-success/20", Icon: Check },
};

const SourceCard = ({ source, status, summary, items }: SourceCardProps) => {
  const IconComp = icons[source] || Globe;
  // Fallback to 'clear' if status is unknown (safety)
  const s = statusConfig[status] || statusConfig.clear;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center">
            <IconComp className="h-4 w-4 text-foreground/70" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              {source}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[200px]">{sourceDescriptions[source]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </div>
        </div>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase border", s.className)}>
          <s.Icon className="h-3 w-3" />
          {s.label}
        </span>
      </div>

      {/* Summary */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 font-medium">
        {summary}
      </p>

      {/* Items List */}
      {items && items.length > 0 && (
        <div className="mt-auto space-y-2 pt-2 border-t border-border/50">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex flex-col min-w-0 pr-2">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-foreground truncate hover:text-primary hover:underline underline-offset-2 flex items-center gap-1"
                  >
                    {item.label}
                    <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </a>
                ) : (
                  <span className="text-xs font-medium text-foreground truncate">{item.label}</span>
                )}
                {item.sub && <span className="text-[10px] text-muted-foreground truncate">{item.sub}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceCard;
