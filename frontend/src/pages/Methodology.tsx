import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Search, BarChart3, HelpCircle } from "lucide-react";

const Methodology = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-4xl font-bold mb-6 tracking-tight">Our Methodology</h1>
                <p className="text-xl text-muted-foreground mb-12">
                    How we calculate your startup's Novelty Score and why you can trust it.
                </p>

                <section className="space-y-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <Search className="h-6 w-6" />
                            <h2 className="text-2xl font-semibold">1. Multi-Vector Surveillance</h2>
                        </div>
                        <p className="text-secondary-foreground leading-relaxed">
                            We don't just search Google. Our engine performs parallel scans across five distinct vectors:
                        </p>
                        <ul className="mt-4 space-y-3">
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span><strong>Marketplaces:</strong> App Store, Product Hunt, and Chrome Store.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span><strong>Development:</strong> GitHub repositories and open-source forks.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span><strong>Community:</strong> Reddit threads and Hacker News discussions.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span><strong>Academic:</strong> Google Scholar and research papers for deep-tech novelty.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span><strong>Legal:</strong> USPTO trademark database.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <BarChart3 className="h-6 w-6" />
                            <h2 className="text-2xl font-semibold">2. Scoring Decomposition</h2>
                        </div>
                        <p className="text-secondary-foreground leading-relaxed">
                            Your score isn't a random number. It's built from specific modifiers:
                        </p>
                        <ul className="mt-4 space-y-3">
                            <li className="flex gap-3">
                                <span className="font-bold text-destructive">• Crowded (0-20):</span>
                                <span>Identical solutions exist with significant market traction.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-orange-500">• Opportunity (40-70):</span>
                                <span>Similar products exist, but they are outdated, poorly rated, or targeting a different niche.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-success">• Blue Ocean (85+):</span>
                                <span>No direct competitors found in any of our scanned vectors. Category giants may exist, but your specific novelty is untouched.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                            <h2 className="text-2xl font-semibold">3. "Relevance vs. Noise" Filtering</h2>
                        </div>
                        <p className="text-secondary-foreground leading-relaxed">
                            Our AI reads the descriptions and snippets of found results. If a "competitor" is found but is actually targeting a different industry or solving a different problem, our tool **dismisses** it and adds points back to your score. We show our work in the "Evidence Analysis" section of your report.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-muted/50 p-8 border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">The Human element</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Validation is a conversation, not a final verdict. If you disagree with our findings, you can "Challenge the AI" on your results page. We will reconsider our analysis based on your counter-arguments, ensuring the most accurate possible outcome for your vision.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Methodology;
