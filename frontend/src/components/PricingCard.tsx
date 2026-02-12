import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  onCta: () => void;
}

const PricingCard = ({ title, price, period, features, cta, highlighted = false, onCta }: PricingCardProps) => (
  <div
    className={cn(
      "rounded-2xl border p-8 flex flex-col",
      highlighted
        ? "border-primary/50 bg-card glow-primary relative"
        : "border-border bg-card"
    )}
  >
    {highlighted && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
        Most Popular
      </span>
    )}
    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-bold text-foreground">{price}</span>
      {period && <span className="text-sm text-muted-foreground">/{period}</span>}
    </div>
    <ul className="space-y-3 mb-8 flex-1">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
          <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button
      onClick={onCta}
      className={cn(
        "w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
        highlighted
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
    >
      {cta}
    </button>
  </div>
);

export default PricingCard;
