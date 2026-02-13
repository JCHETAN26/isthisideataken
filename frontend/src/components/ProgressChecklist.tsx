import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  "Searching App Store & Google Play...",
  "Scanning Product Hunt...",
  "Searching Reddit...",
  "Checking Google Trends...",
  "Scanning GitHub...",
  "Searching USPTO trademarks...",
  "Generating your viability report...",
];

interface ProgressChecklistProps {
  onComplete: () => void;
}

const ProgressChecklist = ({ onComplete }: ProgressChecklistProps) => {
  const [completedIndex, setCompletedIndex] = useState(-1);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCompletedIndex(i);
          if (i === steps.length - 1) {
            setTimeout(onComplete, 800);
          }
        }, (i + 1) * 600)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const progress = ((completedIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-secondary mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%`, boxShadow: "0 0 20px hsl(239 84% 67% / 0.5)" }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const isDone = i <= completedIndex;
          const isCurrent = i === completedIndex + 1;

          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 text-sm transition-all duration-300",
                isDone ? "opacity-100" : isCurrent ? "opacity-70" : "opacity-30",
                i <= completedIndex + 1 ? "animate-check-in" : ""
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {isDone ? (
                <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-success" />
                </div>
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-border shrink-0" />
              )}
              <span className={cn("text-foreground", isDone && "text-muted-foreground")}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressChecklist;
