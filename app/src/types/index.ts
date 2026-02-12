// Core types for the IdeaTaken application

export interface IdeaCheckRequest {
  idea: string;
  userId?: string;
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
  interest: number; // 0-100
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

export interface SourceCheckResult {
  source: string;
  status: 'checking' | 'success' | 'error' | 'unavailable';
  data?: any;
  error?: string;
}

export interface Competitor {
  name: string;
  url: string;
  description: string;
  source: string;
}

export type Verdict = 'Wide Open' | 'Opportunity' | 'Crowded' | 'Taken';

export interface AIAnalysis {
  overallScore: number; // 0-100
  verdict: Verdict;
  topCompetitors: Competitor[];
  keyRisks: string[];
  recommendation: string;
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

export interface UserProfile {
  id: string;
  email: string;
  tier: 'free' | 'pro';
  searchesRemaining?: number;
  searchHistory: string[]; // Array of result IDs
}
