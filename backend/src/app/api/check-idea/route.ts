import { NextRequest, NextResponse } from 'next/server';
import type { IdeaCheckResult } from '@/types';
import {
    checkDomainAvailability,
    searchAppStore,
    searchProductHunt,
    searchReddit,
    searchGitHub,
    getGoogleTrends,
    searchTrademarks,
    analyzeWithAI,
} from '@/lib/api-services';
import {
    getCachedIdeaCheck,
    cacheIdeaCheck,
    saveUserSearch,
    checkUserLimits,
    trackEvent,
} from '@/lib/supabase';

// Rate limiting (in-memory, simple implementation)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT - 1 };
    }

    if (record.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT - record.count };
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Get request data
        const { idea, userId } = await request.json();

        if (!idea || typeof idea !== 'string') {
            return NextResponse.json(
                { error: 'Invalid idea provided' },
                { status: 400 }
            );
        }

        // Validate idea length
        if (idea.length < 3) {
            return NextResponse.json(
                { error: 'Idea must be at least 3 characters long' },
                { status: 400 }
            );
        }

        if (idea.length > 500) {
            return NextResponse.json(
                { error: 'Idea must be less than 500 characters' },
                { status: 400 }
            );
        }

        // Rate limiting (IP-based for anonymous users)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimit = checkRateLimit(ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please try again in a minute.',
                    retryAfter: 60,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': RATE_LIMIT.toString(),
                        'X-RateLimit-Remaining': '0',
                        'Retry-After': '60',
                    },
                }
            );
        }

        // Check user limits (if authenticated)
        if (userId) {
            const limitCheck = await checkUserLimits(userId);
            if (!limitCheck.allowed) {
                return NextResponse.json(
                    {
                        error: limitCheck.reason,
                        searchesRemaining: 0,
                        upgradeRequired: true,
                    },
                    { status: 403 }
                );
            }
        }

        console.log(`Checking idea: "${idea}" (User: ${userId || 'anonymous'})`);

        // Track the search event
        await trackEvent('idea_search_started', { idea }, userId);

        // Check cache first
        const cachedResult = await getCachedIdeaCheck(idea);
        if (cachedResult) {
            console.log(`Cache hit for: "${idea}"`);

            // Save to user's search history if authenticated
            if (userId) {
                await saveUserSearch(
                    userId,
                    idea,
                    cachedResult.id,
                    cachedResult.overall_score,
                    cachedResult.verdict
                );
            }

            // Track cache hit
            await trackEvent('idea_search_cache_hit', { idea }, userId);

            const result: IdeaCheckResult = {
                id: cachedResult.id,
                idea: cachedResult.idea,
                timestamp: cachedResult.created_at,
                cached: true,
                sources: cachedResult.sources,
                analysis: cachedResult.analysis,
            };

            const duration = Date.now() - startTime;
            console.log(`Returned cached result in ${duration}ms`);

            return NextResponse.json(result, {
                headers: {
                    'X-Cache': 'HIT',
                    'X-Response-Time': `${duration}ms`,
                    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                },
            });
        }

        console.log(`Cache miss - fetching fresh data for: "${idea}"`);

        // Run all API calls in parallel for speed
        const [domains, appStore, productHunt, reddit, github, trends, trademark] =
            await Promise.allSettled([
                checkDomainAvailability(idea),
                searchAppStore(idea),
                searchProductHunt(idea),
                searchReddit(idea),
                searchGitHub(idea),
                getGoogleTrends(idea),
                searchTrademarks(idea),
            ]);

        // Extract successful results or use empty arrays
        const sources = {
            domains: domains.status === 'fulfilled' ? domains.value : [],
            appStore: appStore.status === 'fulfilled' ? appStore.value : [],
            productHunt: productHunt.status === 'fulfilled' ? productHunt.value : [],
            reddit: reddit.status === 'fulfilled' ? reddit.value : [],
            github: github.status === 'fulfilled' ? github.value : [],
            trends:
                trends.status === 'fulfilled'
                    ? trends.value
                    : { keyword: idea, interest: 50, trend: 'stable' as const },
            trademark:
                trademark.status === 'fulfilled'
                    ? trademark.value
                    : { found: false, matches: [] },
        };

        // Log any failures
        const failures = [
            { name: 'domains', result: domains },
            { name: 'appStore', result: appStore },
            { name: 'productHunt', result: productHunt },
            { name: 'reddit', result: reddit },
            { name: 'github', result: github },
            { name: 'trends', result: trends },
            { name: 'trademark', result: trademark },
        ].filter((s) => s.result.status === 'rejected');

        if (failures.length > 0) {
            console.warn(
                `Some API calls failed: ${failures.map((f) => f.name).join(', ')}`
            );
        }

        // Get AI analysis based on all sources
        const analysis = await analyzeWithAI(idea, sources);

        const result: IdeaCheckResult = {
            id: `check_${Date.now()}`,
            idea,
            timestamp: new Date().toISOString(),
            cached: false,
            sources,
            analysis,
        };

        // Cache the result
        const cachedData = await cacheIdeaCheck(idea, result, userId);

        // Save to user's search history if authenticated
        if (userId && cachedData) {
            await saveUserSearch(
                userId,
                idea,
                cachedData.id,
                analysis.overallScore,
                analysis.verdict
            );
        }

        // Track successful search
        await trackEvent(
            'idea_search_completed',
            {
                idea,
                score: analysis.overallScore,
                verdict: analysis.verdict,
                cached: false,
            },
            userId
        );

        const duration = Date.now() - startTime;
        console.log(
            `Analysis complete for: "${idea}" - Score: ${analysis.overallScore} (${duration}ms)`
        );

        return NextResponse.json(result, {
            headers: {
                'X-Cache': 'MISS',
                'X-Response-Time': `${duration}ms`,
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            },
        });
    } catch (error) {
        console.error('Error checking idea:', error);

        // Track error
        await trackEvent('idea_search_error', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });

        return NextResponse.json(
            {
                error: 'Internal server error',
                message:
                    'We encountered an issue processing your request. Please try again.',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
