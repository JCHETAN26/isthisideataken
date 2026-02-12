'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Globe,
    Smartphone,
    TrendingUp,
    Github,
    MessageSquare,
    Award,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Share2
} from 'lucide-react';
import type { IdeaCheckResult, SourceCheckResult, Verdict } from '@/types';

function ResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const idea = searchParams.get('idea');

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<IdeaCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sourceStatuses, setSourceStatuses] = useState<Record<string, SourceCheckResult>>({
        domains: { source: 'Domain Availability', status: 'checking' },
        appStore: { source: 'App Stores', status: 'checking' },
        productHunt: { source: 'Product Hunt', status: 'checking' },
        reddit: { source: 'Reddit', status: 'checking' },
        github: { source: 'GitHub', status: 'checking' },
        trends: { source: 'Google Trends', status: 'checking' },
        trademark: { source: 'USPTO Trademarks', status: 'checking' },
    });

    useEffect(() => {
        if (!idea) {
            router.push('/');
            return;
        }

        const checkIdea = async () => {
            try {
                const response = await fetch('/api/check-idea', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idea }),
                });

                if (!response.ok) {
                    throw new Error('Failed to check idea');
                }

                const data = await response.json();
                setResult(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        checkIdea();
    }, [idea, router]);

    const getVerdictColor = (verdict: Verdict) => {
        switch (verdict) {
            case 'Wide Open':
                return 'from-green-500 to-emerald-600';
            case 'Opportunity':
                return 'from-blue-500 to-cyan-600';
            case 'Crowded':
                return 'from-yellow-500 to-orange-600';
            case 'Taken':
                return 'from-red-500 to-rose-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        if (score >= 25) return 'text-orange-400';
        return 'text-red-400';
    };

    const SourceIcon = ({ source }: { source: string }) => {
        const icons: Record<string, any> = {
            domains: Globe,
            appStore: Smartphone,
            productHunt: TrendingUp,
            reddit: MessageSquare,
            github: Github,
            trends: TrendingUp,
            trademark: Award,
        };
        const Icon = icons[source] || CheckCircle2;
        return <Icon className="w-5 h-5" />;
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'checking':
                return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />;
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            case 'error':
            case 'unavailable':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            default:
                return <XCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    if (!idea) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Search
                    </button>
                    <h1 className="text-3xl font-bold mb-2">Idea Validation Results</h1>
                    <p className="text-[var(--text-secondary)]">"{idea}"</p>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {/* Loading State - Source Checks */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4">Checking Sources...</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(sourceStatuses).map(([key, status]) => (
                                    <div
                                        key={key}
                                        className="flex items-center gap-3 p-4 bg-[var(--surface-elevated)] rounded-lg"
                                    >
                                        <SourceIcon source={key} />
                                        <span className="flex-1">{status.source}</span>
                                        <StatusIcon status={status.status} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Loading Skeleton */}
                        <div className="card">
                            <div className="skeleton h-32 mb-4"></div>
                            <div className="skeleton h-20"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="card border-red-500/20">
                        <div className="flex items-center gap-3 text-red-400 mb-4">
                            <XCircle className="w-6 h-6" />
                            <h2 className="text-xl font-semibold">Error</h2>
                        </div>
                        <p className="text-[var(--text-secondary)]">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary mt-4"
                        >
                            Try Again
                        </button>
                    </div>
                ) : result ? (
                    <div className="space-y-6">
                        {/* Viability Score Card */}
                        <div className="card relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
                            <div className="relative">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Viability Score</h2>
                                        <div className={`inline-flex px-4 py-2 rounded-full bg-gradient-to-r ${getVerdictColor(result.analysis.verdict)} text-white font-semibold`}>
                                            {result.analysis.verdict}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-6xl font-bold ${getScoreColor(result.analysis.overallScore)}`}>
                                            {result.analysis.overallScore}
                                        </div>
                                        <div className="text-[var(--text-secondary)]">out of 100</div>
                                    </div>
                                </div>

                                <div className="p-4 bg-[var(--surface-elevated)] rounded-lg">
                                    <h3 className="font-semibold mb-2">AI Recommendation</h3>
                                    <p className="text-[var(--text-secondary)]">{result.analysis.recommendation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Competitors */}
                        {result.analysis.topCompetitors.length > 0 && (
                            <div className="card">
                                <h2 className="text-xl font-semibold mb-4">Top Competitors Found</h2>
                                <div className="space-y-3">
                                    {result.analysis.topCompetitors.map((competitor, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-[var(--surface-elevated)] rounded-lg hover:bg-[var(--border)] transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1">{competitor.name}</h3>
                                                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                                                        {competitor.description}
                                                    </p>
                                                    <span className="text-xs text-[var(--text-tertiary)]">
                                                        Source: {competitor.source}
                                                    </span>
                                                </div>
                                                <a
                                                    href={competitor.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-secondary text-sm px-4 py-2"
                                                >
                                                    Visit
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Risks */}
                        {result.analysis.keyRisks.length > 0 && (
                            <div className="card border-yellow-500/20">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                    Key Risks
                                </h2>
                                <ul className="space-y-2">
                                    {result.analysis.keyRisks.map((risk, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span className="text-[var(--text-secondary)]">{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Share Button */}
                        <div className="card text-center">
                            <button className="btn-secondary inline-flex items-center gap-2">
                                <Share2 className="w-5 h-5" />
                                Share Results
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
