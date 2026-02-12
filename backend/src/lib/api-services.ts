// API Service Functions for IdeaTaken
// This file contains all the external API integrations

import axios from 'axios';

// ============================================================================
// AI-POWERED DOMAIN NAME GENERATION
// ============================================================================

async function generateCreativeDomainNames(idea: string): Promise<string[]> {
    console.log('🎨 Generating creative domain names for:', idea);
    try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const prompt = `Generate 8 creative, brandable domain names for this startup idea: "${idea}"

Requirements:
- Short (5-12 characters ideal)
- Memorable and catchy
- Easy to spell and pronounce
- Reflects the core concept but NOT literal words
- Mix of playful, professional, and creative styles
- Can use: portmanteaus, abbreviations, made-up words, puns, metaphors

Return ONLY the names, one per line, no explanations or extra text.
Example format:
Ledge
Clarify
Centsible
Coinpath`;

        console.log('🤖 Calling Claude API...');
        const message = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 512,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = message.content[0];
        if (content.type === 'text') {
            console.log('✅ AI Response:', content.text);
            // Parse the response - split by newlines and clean up
            const names = content.text
                .split('\n')
                .map(line => line.trim().toLowerCase())
                .filter(line => line.length > 0 && /^[a-z]+$/.test(line))
                .slice(0, 8);

            console.log('🎯 Parsed names:', names);
            return names.length > 0 ? names : generateFallbackNames(idea);
        }
    } catch (error) {
        console.error('❌ Error generating creative domain names:', error);
    }

    console.log('⚠️ Using fallback names');
    return generateFallbackNames(idea);
}

function generateFallbackNames(idea: string): string[] {
    // Fallback: extract key words and create simple combinations
    const words = idea
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(' ')
        .filter(w => w.length > 3)
        .slice(0, 3);

    if (words.length === 0) return ['myapp', 'getapp', 'useapp'];

    const base = words[0];
    return [
        base,
        `${base}app`,
        `${base}hq`,
        `get${base}`,
        `${base}io`,
        words.slice(0, 2).join(''),
    ].slice(0, 6);
}

export async function checkDomainAvailability(idea: string) {
    // Step 1: Generate creative domain name suggestions using AI
    const creativeNames = await generateCreativeDomainNames(idea);

    const extensions = ['.com', '.io', '.ai', '.co'];
    const results = [];

    // Step 2: Check availability for each creative name
    for (const creativeName of creativeNames) {
        for (const ext of extensions) {
            const fullDomain = `${creativeName}${ext}`;

            try {
                // Using RapidAPI Domain Availability Checker
                const response = await axios.get(
                    `https://domain-availability.whoisxmlapi.com/api/v1`,
                    {
                        params: {
                            domainName: fullDomain,
                        },
                        headers: {
                            'x-rapidapi-key': process.env.RAPID_API_KEY,
                            'x-rapidapi-host': 'domain-availability.whoisxmlapi.com'
                        }
                    }
                );

                const isAvailable = response.data.DomainInfo?.domainAvailability === 'AVAILABLE';

                results.push({
                    domain: fullDomain,
                    available: isAvailable,
                    extension: ext,
                });

                console.log(`✅ Checked ${fullDomain}: ${isAvailable ? 'Available' : 'Taken'}`);
            } catch (error) {
                console.error(`Error checking domain ${fullDomain}:`, error);
                // Fallback to mock data on error
                results.push({
                    domain: fullDomain,
                    available: Math.random() > 0.5,
                    extension: ext,
                });
            }

            // Only check first extension for each name to save API calls
            // (User can see if .com is available and decide to check others)
            break;
        }
    }

    return results;
}

// ============================================================================
// APP STORE SEARCH
// ============================================================================

export async function searchAppStore(idea: string) {
    try {
        // Using iTunes Search API (free, no key needed)
        const response = await axios.get('https://itunes.apple.com/search', {
            params: {
                term: idea,
                entity: 'software',
                limit: 10,
            },
        });

        return response.data.results.map((app: any) => ({
            name: app.trackName,
            url: app.trackViewUrl,
            rating: app.averageUserRating || 0,
            downloads: `${app.userRatingCount || 0}+ reviews`,
            similarity: calculateSimilarity(idea, app.trackName + ' ' + app.description),
        }));
    } catch (error) {
        console.error('Error searching App Store:', error);
        return [];
    }
}

// ============================================================================
// PRODUCT HUNT SEARCH
// ============================================================================

export async function searchProductHunt(idea: string) {
    try {
        // Product Hunt API requires OAuth token
        const response = await axios.post(
            'https://api.producthunt.com/v2/api/graphql',
            {
                query: `
          query {
            posts(first: 5, order: VOTES, postedAfter: "2023-01-01") {
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
        `,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.data.posts.edges.map((edge: any) => ({
            name: edge.node.name,
            url: edge.node.url,
            tagline: edge.node.tagline,
            upvotes: edge.node.votesCount,
            launchDate: edge.node.createdAt.split('T')[0],
        }));
    } catch (error) {
        console.error('Error searching Product Hunt:', error);
        return [];
    }
}

// ============================================================================
// REDDIT SEARCH
// ============================================================================

export async function searchReddit(idea: string) {
    try {
        // Reddit API (no auth needed for search)
        const response = await axios.get('https://www.reddit.com/search.json', {
            params: {
                q: idea,
                limit: 10,
                sort: 'relevance',
            },
            headers: {
                'User-Agent': 'IdeaTaken/1.0',
            },
        });

        return response.data.data.children.map((post: any) => ({
            title: post.data.title,
            url: `https://reddit.com${post.data.permalink}`,
            subreddit: post.data.subreddit,
            upvotes: post.data.ups,
            comments: post.data.num_comments,
        }));
    } catch (error) {
        console.error('Error searching Reddit:', error);
        return [];
    }
}

// ============================================================================
// GITHUB SEARCH
// ============================================================================

export async function searchGitHub(idea: string) {
    try {
        // GitHub Search API
        const response = await axios.get('https://api.github.com/search/repositories', {
            params: {
                q: idea,
                sort: 'stars',
                order: 'desc',
                per_page: 10,
            },
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        return response.data.items.map((repo: any) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description || 'No description',
            stars: repo.stargazers_count,
            language: repo.language || 'Unknown',
        }));
    } catch (error) {
        console.error('Error searching GitHub:', error);
        return [];
    }
}

// ============================================================================
// GOOGLE TRENDS
// ============================================================================

export async function getGoogleTrends(idea: string) {
    try {
        // Using google-trends-api npm package or SerpAPI
        // Note: Google Trends doesn't have an official API
        // You can use: https://serpapi.com/google-trends-api

        const response = await axios.get('https://serpapi.com/search', {
            params: {
                engine: 'google_trends',
                q: idea,
                api_key: process.env.SERP_API_KEY,
            },
        });

        const interest = response.data.interest_over_time?.timeline_data?.[0]?.values?.[0]?.value || 50;

        return {
            keyword: idea.substring(0, 50),
            interest: Math.min(100, interest),
            trend: (interest > 60 ? 'rising' : interest > 40 ? 'stable' : 'declining') as 'rising' | 'stable' | 'declining',
        };
    } catch (error) {
        console.error('Error getting Google Trends:', error);
        return {
            keyword: idea.substring(0, 50),
            interest: 50,
            trend: 'stable' as const,
        };
    }
}

// ============================================================================
// USPTO TRADEMARK SEARCH
// ============================================================================

export async function searchTrademarks(idea: string) {
    try {
        // USPTO Trademark API
        // Note: This is a simplified example
        const keywords = idea.split(' ').slice(0, 3).join(' ');

        const response = await axios.get(
            `https://uspto-trademark.p.rapidapi.com/v1/trademarkSearch/${encodeURIComponent(keywords)}`,
            {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                    'X-RapidAPI-Host': 'uspto-trademark.p.rapidapi.com',
                },
            }
        );

        const matches = response.data.items || [];

        return {
            found: matches.length > 0,
            matches: matches.slice(0, 5).map((item: any) => ({
                name: item.markIdentification,
                status: item.status,
                serialNumber: item.serialNumber,
            })),
        };
    } catch (error) {
        console.error('Error searching trademarks:', error);
        return {
            found: false,
            matches: [],
        };
    }
}

// ============================================================================
// AI ANALYSIS (Claude)
// ============================================================================

export async function analyzeWithAI(idea: string, sources: any) {
    try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const prompt = `You are a startup advisor helping an entrepreneur validate: "${idea}"

Market research:
- Domains: ${JSON.stringify(sources.domains)}
- App Store: ${sources.appStore.length} similar apps
- Product Hunt: ${sources.productHunt.length} launches
- Reddit: ${sources.reddit.length} discussions
- GitHub: ${sources.github.length} projects
- Trends: ${sources.trends.interest}/100, ${sources.trends.trend}
- Trademarks: ${sources.trademark.found ? sources.trademark.matches.length + ' found' : 'None'}

Be MOTIVATING. Even if crowded, help them find their angle.

Return JSON:
{
  "score": 0-100,
  "verdict": "Wide Open|Opportunity|Crowded|Taken",
  "nicheOpportunities": ["3 specific niches like 'budgeting for freelancers'"],
  "uniqueAngles": ["2 differentiation ideas"],
  "marketGaps": "What's missing in current solutions",
  "competitors": [{"name": "", "description": ""}],
  "recommendation": "Actionable, motivating 2-3 sentences"
}`;

        const message = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = message.content[0];
        if (content.type === 'text') {
            let jsonText = content.text;
            const jsonMatch = content.text.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) jsonText = jsonMatch[1];

            const analysis = JSON.parse(jsonText.trim());
            return {
                overallScore: analysis.score,
                verdict: analysis.verdict,
                nicheOpportunities: analysis.nicheOpportunities || [],
                uniqueAngles: analysis.uniqueAngles || [],
                marketGaps: analysis.marketGaps || '',
                topCompetitors: analysis.competitors || [],
                recommendation: analysis.recommendation,
            };
        }
    } catch (error) {
        console.error('Error with AI analysis:', error);
    }

    // Fallback analysis
    return generateFallbackAnalysis(sources);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateSimilarity(text1: string, text2: string): number {
    // Simple word overlap similarity
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const overlap = words1.filter(w => words2.includes(w)).length;
    return Math.min(100, Math.round((overlap / Math.max(words1.length, words2.length)) * 100));
}

function generateFallbackAnalysis(sources: any) {
    const competitorCount =
        sources.appStore.length +
        sources.productHunt.length +
        sources.github.length;

    const score = Math.max(0, 100 - (competitorCount * 10));

    let verdict: 'Wide Open' | 'Opportunity' | 'Crowded' | 'Taken';
    if (score <= 25) verdict = 'Taken';
    else if (score <= 60) verdict = 'Crowded';
    else if (score <= 85) verdict = 'Opportunity';
    else verdict = 'Wide Open';

    return {
        overallScore: score,
        verdict,
        nicheOpportunities: [
            'Target a specific industry vertical (e.g., healthcare, education)',
            'Focus on an underserved demographic (e.g., seniors, students)',
            'Specialize in a unique use case or workflow'
        ],
        uniqueAngles: [
            'AI-powered automation to reduce manual work',
            'Superior UX with focus on simplicity'
        ],
        marketGaps: 'Existing solutions may lack personalization, modern UX, or affordable pricing. Consider what pain points remain unsolved.',
        topCompetitors: [
            ...sources.appStore.slice(0, 3),
            ...sources.productHunt.slice(0, 3),
            ...sources.github.slice(0, 3),
        ].slice(0, 3).map((item: any) => ({
            name: item.name,
            url: item.url,
            description: item.description || item.tagline || `${item.rating || 0} stars`,
            source: item.trackName ? 'App Store' : item.tagline ? 'Product Hunt' : 'GitHub',
        })),
        recommendation: `${score > 60 ? 'Great opportunity! ' : 'Market is competitive but not impossible. '}Find your niche by targeting a specific segment, offering unique features, or building a better user experience than existing solutions.`,
    };
}
