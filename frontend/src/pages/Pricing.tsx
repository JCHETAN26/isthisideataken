import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "What sources do you search?", a: "We check domain availability, App Store, Google Play, Product Hunt, Reddit, Google Trends, GitHub, and USPTO trademarks." },
  { q: "How accurate is the viability score?", a: "The score is based on real data from 7 sources. It's a directional indicator, not a guarantee — use it alongside your own research." },
  { q: "Can I export my results?", a: "Pro users can export full reports as PDF. Free users get on-screen results only." },
  { q: "Is there a team plan?", a: "Not yet, but it's coming soon. Contact us if you're interested in volume pricing." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel your Pro subscription anytime, no questions asked. You'll keep access through the end of your billing period." },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Simple pricing</h1>
          <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          <PricingCard
            title="Free"
            price="$0"
            features={[
              "3 searches per day",
              "Basic viability report",
              "Source breakdown",
              "Ad supported",
            ]}
            cta="Get Started"
            onCta={() => {}}
          />
          <PricingCard
            title="Pro"
            price="$9"
            period="month"
            highlighted
            features={[
              "Unlimited searches",
              "Full detailed reports",
              "PDF export",
              "Saved search history",
              "No ads",
            ]}
            cta="Start Free Trial"
            onCta={() => {}}
          />
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">Frequently asked questions</h2>
        <div className="space-y-2 max-w-xl mx-auto">
          {faqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openFaq === i && "rotate-180")} />
              </div>
              {openFaq === i && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              )}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
