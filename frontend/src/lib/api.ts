// API service for IdeaTaken backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface IdeaCheckRequest {
    idea: string;
}

export interface DomainCheckResult {
    domain: string;
    available: boolean;
    extension: string;
}

export interface AppStoreResult {
    name: string;
    url: string;
    rating?: number;
    downloads?: string;
    similarity: number;
}

export interface ProductHuntResult {
    name: string;
    url: string;
    tagline: string;
    upvotes: number;
    launchDate: string;
}

export interface RedditResult {
    title: string;
    url: string;
    subreddit: string;
    upvotes: number;
    comments: number;
}

export interface GitHubResult {
    name: string;
    url: string;
    description: string;
    stars: number;
    language: string;
}

export interface TrendsData {
    keyword: string;
    interest: number;
    trend: 'rising' | 'stable' | 'declining';
}

export interface TrademarkResult {
    found: boolean;
    matches: Array<{
        name: string;
        status: string;
        serialNumber: string;
    }>;
}

export interface Competitor {
    name: string;
    url: string;
    description: string;
    source: string;
}

export type Verdict = 'Wide Open' | 'Opportunity' | 'Crowded' | 'Taken';

export interface AIAnalysis {
    overallScore: number;
    verdict: Verdict;
    topCompetitors: Competitor[];
    keyRisks?: string[];  // Made optional since we removed it from new responses
    recommendation: string;
    nicheOpportunities?: string[];  // New: AI-generated niche suggestions
    uniqueAngles?: string[];  // New: Differentiation ideas
    marketGaps?: string;  // New: What's missing in the market
}

export interface IdeaCheckResult {
    id: string;
    idea: string;
    timestamp: string;
    sources: {
        domains: DomainCheckResult[];
        appStore: AppStoreResult[];
        productHunt: ProductHuntResult[];
        reddit: RedditResult[];
        github: GitHubResult[];
        trends: TrendsData;
        trademark: TrademarkResult;
    };
    analysis: AIAnalysis;
    cached: boolean;
}

export const checkIdea = async (idea: string, userId?: string): Promise<IdeaCheckResult> => {
    const response = await fetch(`${API_BASE_URL}/api/check-idea`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea, userId }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
};
