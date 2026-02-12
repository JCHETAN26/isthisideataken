import { cn } from "@/lib/utils";

type Verdict = "Wide Open" | "Opportunity" | "Crowded" | "Taken";

interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
}

const verdictStyles: Record<Verdict, string> = {
  "Wide Open": "bg-success/15 text-success border-success/30",
  "Opportunity": "bg-info/15 text-info border-info/30",
  "Crowded": "bg-warning/15 text-warning border-warning/30",
  "Taken": "bg-destructive/15 text-destructive border-destructive/30",
};

const VerdictBadge = ({ verdict, className }: VerdictBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
      verdictStyles[verdict],
      className
    )}
  >
    {verdict}
  </span>
);

export default VerdictBadge;
