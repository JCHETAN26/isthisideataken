# API Integration Roadmap

This document outlines how to integrate real APIs to replace the mock data in IdeaTaken.

## 🎯 Overview

Currently, the app uses mock data in `/src/app/api/check-idea/route.ts`. This guide shows how to integrate each real API source.

## 📋 API Sources to Integrate

### 1. Domain Availability Check

**Options:**
- **RapidAPI Domain Availability** (Recommended)
  - URL: https://rapidapi.com/apininjas/api/domain-availability
  - Cost: Free tier available
  
- **Namecheap API**
  - URL: https://www.namecheap.com/support/api/
  - Cost: Free for Namecheap customers

**Implementation:**

\`\`\`typescript
async function checkDomains(idea: string): Promise<DomainCheckResult[]> {
  const baseKeyword = idea.toLowerCase().replace(/\s+/g, '');
  const extensions = ['.com', '.io', '.ai', '.co'];
  
  const results = await Promise.all(
    extensions.map(async (ext) => {
      const domain = \`\${baseKeyword}\${ext}\`;
      
      try {
        const response = await fetch(
          \`https://domain-availability.p.rapidapi.com/check?domain=\${domain}\`,
          {
            headers: {
              'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
              'X-RapidAPI-Host': 'domain-availability.p.rapidapi.com'
            }
          }
        );
        
        const data = await response.json();
        
        return {
          domain,
          available: data.available,
          extension: ext
        };
      } catch (error) {
        console.error(\`Domain check failed for \${domain}:\`, error);
        return {
          domain,
          available: false,
          extension: ext
        };
      }
    })
  );
  
  return results;
}
\`\`\`

### 2. App Store Search

**Options:**
- **iTunes Search API** (Free, official)
  - URL: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
  - No API key required

**Implementation:**

\`\`\`typescript
async function searchAppStore(idea: string): Promise<AppStoreResult[]> {
  try {
    const response = await fetch(
      \`https://itunes.apple.com/search?term=\${encodeURIComponent(idea)}&entity=software&limit=5\`
    );
    
    const data = await response.json();
    
    return data.results.map((app: any) => ({
      name: app.trackName,
      url: app.trackViewUrl,
      rating: app.averageUserRating,
      downloads: app.userRatingCount ? \`\${app.userRatingCount}+\` : 'N/A',
      similarity: calculateSimilarity(idea, app.trackName + ' ' + app.description)
    }));
  } catch (error) {
    console.error('App Store search failed:', error);
    return [];
  }
}

function calculateSimilarity(text1: string, text2: string): number {
  // Simple keyword matching - can be improved with NLP
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const matches = words1.filter(word => words2.includes(word));
  return Math.round((matches.length / words1.length) * 100);
}
\`\`\`

### 3. Google Play Store Search

**Options:**
- **Google Play Scraper** (npm package)
  - Package: \`google-play-scraper\`
  - Free, no API key needed

**Installation:**
\`\`\`bash
npm install google-play-scraper
\`\`\`

**Implementation:**

\`\`\`typescript
import gplay from 'google-play-scraper';

async function searchGooglePlay(idea: string): Promise<AppStoreResult[]> {
  try {
    const results = await gplay.search({
      term: idea,
      num: 5
    });
    
    return results.map(app => ({
      name: app.title,
      url: app.url,
      rating: app.scoreText,
      downloads: app.installs,
      similarity: calculateSimilarity(idea, app.title + ' ' + app.summary)
    }));
  } catch (error) {
    console.error('Google Play search failed:', error);
    return [];
  }
}
\`\`\`

### 4. Product Hunt Search

**Options:**
- **Product Hunt API v2** (GraphQL)
  - URL: https://api.producthunt.com/v2/docs
  - Requires OAuth token

**Setup:**
1. Create app at https://www.producthunt.com/v2/oauth/applications
2. Get API token

**Implementation:**

\`\`\`typescript
async function searchProductHunt(idea: string): Promise<ProductHuntResult[]> {
  const query = \`
    query {
      posts(first: 5, order: VOTES, postedAfter: "2020-01-01") {
        edges {
          node {
            name
            tagline
            votesCount
            createdAt
            url
          }
        }
      }
    }
  \`;
  
  try {
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.PRODUCT_HUNT_TOKEN}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    return data.data.posts.edges
      .filter((edge: any) => {
        const text = edge.node.name + ' ' + edge.node.tagline;
        return calculateSimilarity(idea, text) > 30;
      })
      .map((edge: any) => ({
        name: edge.node.name,
        url: edge.node.url,
        tagline: edge.node.tagline,
        upvotes: edge.node.votesCount,
        launchDate: edge.node.createdAt
      }));
  } catch (error) {
    console.error('Product Hunt search failed:', error);
    return [];
  }
}
\`\`\`

### 5. Reddit Search

**Options:**
- **Reddit API** (Free)
  - URL: https://www.reddit.com/dev/api
  - Requires OAuth

**Implementation:**

\`\`\`typescript
async function searchReddit(idea: string): Promise<RedditResult[]> {
  try {
    const response = await fetch(
      \`https://www.reddit.com/search.json?q=\${encodeURIComponent(idea)}&limit=5&sort=relevance\`,
      {
        headers: {
          'User-Agent': 'IdeaTaken/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    return data.data.children.map((post: any) => ({
      title: post.data.title,
      url: \`https://reddit.com\${post.data.permalink}\`,
      subreddit: post.data.subreddit,
      upvotes: post.data.ups,
      comments: post.data.num_comments
    }));
  } catch (error) {
    console.error('Reddit search failed:', error);
    return [];
  }
}
\`\`\`

### 6. GitHub Search

**Options:**
- **GitHub REST API** (Free)
  - URL: https://docs.github.com/en/rest
  - Rate limit: 60 requests/hour (unauthenticated), 5000/hour (authenticated)

**Implementation:**

\`\`\`typescript
async function searchGitHub(idea: string): Promise<GitHubResult[]> {
  try {
    const response = await fetch(
      \`https://api.github.com/search/repositories?q=\${encodeURIComponent(idea)}&sort=stars&per_page=5\`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': \`token \${process.env.GITHUB_TOKEN}\` // Optional but recommended
        }
      }
    );
    
    const data = await response.json();
    
    return data.items.map((repo: any) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description || 'No description',
      stars: repo.stargazers_count,
      language: repo.language || 'Unknown'
    }));
  } catch (error) {
    console.error('GitHub search failed:', error);
    return [];
  }
}
\`\`\`

### 7. Google Trends

**Options:**
- **google-trends-api** (npm package)
  - Package: \`google-trends-api\`
  - Free, no API key

**Installation:**
\`\`\`bash
npm install google-trends-api
\`\`\`

**Implementation:**

\`\`\`typescript
import googleTrends from 'google-trends-api';

async function checkGoogleTrends(idea: string): Promise<TrendsData> {
  try {
    const results = await googleTrends.interestOverTime({
      keyword: idea,
      startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    });
    
    const data = JSON.parse(results);
    const values = data.default.timelineData.map((item: any) => item.value[0]);
    const avgInterest = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    
    // Determine trend
    const recentAvg = values.slice(-3).reduce((a: number, b: number) => a + b, 0) / 3;
    const olderAvg = values.slice(0, 3).reduce((a: number, b: number) => a + b, 0) / 3;
    
    let trend: 'rising' | 'stable' | 'declining';
    if (recentAvg > olderAvg * 1.2) trend = 'rising';
    else if (recentAvg < olderAvg * 0.8) trend = 'declining';
    else trend = 'stable';
    
    return {
      keyword: idea,
      interest: Math.round(avgInterest),
      trend
    };
  } catch (error) {
    console.error('Google Trends check failed:', error);
    return {
      keyword: idea,
      interest: 0,
      trend: 'stable'
    };
  }
}
\`\`\`

### 8. USPTO Trademark Search

**Options:**
- **USPTO TESS** (Complex, requires scraping)
- **Trademarkia API** (Paid)
- **Simplified approach**: Use keyword search

**Implementation (Simplified):**

\`\`\`typescript
async function checkTrademarks(idea: string): Promise<TrademarkResult> {
  // Note: Full USPTO integration is complex
  // This is a simplified version
  
  try {
    // Extract main keywords
    const keywords = idea.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    // For MVP, we can use a simple check or third-party API
    // Full implementation would require USPTO TESS API
    
    return {
      found: false,
      matches: []
    };
  } catch (error) {
    console.error('Trademark check failed:', error);
    return {
      found: false,
      matches: []
    };
  }
}
\`\`\`

### 9. AI Analysis with Claude

**Implementation:**

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk';

async function analyzeWithClaude(
  idea: string,
  sources: any
): Promise<AIAnalysis> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  
  const prompt = \`
You are an expert startup advisor. Analyze this startup idea and the research data below.

Idea: "\${idea}"

Research Data:
- Domains: \${JSON.stringify(sources.domains)}
- App Store: \${JSON.stringify(sources.appStore)}
- Product Hunt: \${JSON.stringify(sources.productHunt)}
- Reddit: \${JSON.stringify(sources.reddit)}
- GitHub: \${JSON.stringify(sources.github)}
- Google Trends: \${JSON.stringify(sources.trends)}

Provide a JSON response with:
{
  "overallScore": <0-100>,
  "verdict": "<Wide Open|Opportunity|Crowded|Taken>",
  "topCompetitors": [{"name": "", "url": "", "description": "", "source": ""}],
  "keyRisks": ["risk1", "risk2", "risk3"],
  "recommendation": "2-3 sentence summary"
}
\`;
  
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });
  
  const content = message.content[0];
  if (content.type === 'text') {
    return JSON.parse(content.text);
  }
  
  throw new Error('Unexpected response format');
}
\`\`\`

## 🔄 Updated Main API Route

\`\`\`typescript
// /src/app/api/check-idea/route.ts

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();
    
    // Run all checks in parallel
    const [
      domains,
      appStore,
      googlePlay,
      productHunt,
      reddit,
      github,
      trends,
      trademark
    ] = await Promise.all([
      checkDomains(idea),
      searchAppStore(idea),
      searchGooglePlay(idea),
      searchProductHunt(idea),
      searchReddit(idea),
      searchGitHub(idea),
      checkGoogleTrends(idea),
      checkTrademarks(idea)
    ]);
    
    const sources = {
      domains,
      appStore: [...appStore, ...googlePlay],
      productHunt,
      reddit,
      github,
      trends,
      trademark
    };
    
    // Get AI analysis
    const analysis = await analyzeWithClaude(idea, sources);
    
    const result: IdeaCheckResult = {
      id: \`check_\${Date.now()}\`,
      idea,
      timestamp: new Date().toISOString(),
      cached: false,
      sources,
      analysis
    };
    
    // Cache in Supabase
    await cacheResult(result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to check idea' }, { status: 500 });
  }
}
\`\`\`

## 📦 Required Environment Variables

Add to `.env.local`:

\`\`\`env
# APIs
RAPID_API_KEY=your_key_here
PRODUCT_HUNT_TOKEN=your_token_here
GITHUB_TOKEN=your_token_here
ANTHROPIC_API_KEY=your_key_here

# Database
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
\`\`\`

## 🎯 Implementation Priority

1. **Phase 1** (Essential):
   - ✅ Domain availability
   - ✅ App Store search
   - ✅ GitHub search
   - ✅ Claude AI analysis

2. **Phase 2** (Important):
   - Product Hunt
   - Reddit
   - Google Trends

3. **Phase 3** (Nice to have):
   - Trademark search
   - Additional sources

## 🧪 Testing

Create test cases for each API:

\`\`\`typescript
// Test ideas
const testIdeas = [
  "fitness tracking app",
  "meal planning service",
  "project management tool",
  "social media scheduler"
];
\`\`\`

## 📊 Rate Limiting

Implement rate limiting to avoid API quota issues:

\`\`\`typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 d"), // 3 requests per day
});
\`\`\`

## ✅ Checklist

- [ ] Set up all API accounts
- [ ] Get API keys
- [ ] Install required packages
- [ ] Implement each API integration
- [ ] Test each integration
- [ ] Add error handling
- [ ] Implement caching
- [ ] Add rate limiting
- [ ] Test full flow
- [ ] Deploy to production

---

**Estimated Time**: 1-2 weeks for full integration
**Cost**: Most APIs are free tier, ~$20-50/month for production
