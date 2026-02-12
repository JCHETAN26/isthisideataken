import { NextRequest, NextResponse } from 'next/server';
import type { IdeaCheckResult } from '@/types';

// Mock function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
    try {
        const { idea } = await request.json();

        if (!idea || typeof idea !== 'string') {
            return NextResponse.json(
                { error: 'Invalid idea provided' },
                { status: 400 }
            );
        }

        // Simulate processing time
        await delay(2000);

        // Mock result - In production, this would call real APIs
        const mockResult: IdeaCheckResult = {
            id: `check_${Date.now()}`,
            idea,
            timestamp: new Date().toISOString(),
            cached: false,
            sources: {
                domains: [
                    { domain: 'example.com', available: false, extension: '.com' },
                    { domain: 'example.io', available: true, extension: '.io' },
                    { domain: 'example.ai', available: true, extension: '.ai' },
                ],
                appStore: [
                    {
                        name: 'Similar App 1',
                        url: 'https://apps.apple.com/example',
                        rating: 4.5,
                        downloads: '10K+',
                        similarity: 85,
                    },
                ],
                productHunt: [
                    {
                        name: 'Competitor Product',
                        url: 'https://producthunt.com/example',
                        tagline: 'A similar solution to your idea',
                        upvotes: 234,
                        launchDate: '2024-01-15',
                    },
                ],
                reddit: [
                    {
                        title: 'Discussion about similar concept',
                        url: 'https://reddit.com/r/startups/example',
                        subreddit: 'startups',
                        upvotes: 45,
                        comments: 23,
                    },
                ],
                github: [
                    {
                        name: 'open-source-alternative',
                        url: 'https://github.com/example/repo',
                        description: 'An open source implementation of a similar idea',
                        stars: 1234,
                        language: 'TypeScript',
                    },
                ],
                trends: {
                    keyword: idea.substring(0, 50),
                    interest: 65,
                    trend: 'rising',
                },
                trademark: {
                    found: false,
                    matches: [],
                },
            },
            analysis: {
                overallScore: 62,
                verdict: 'Opportunity',
                topCompetitors: [
                    {
                        name: 'Similar App 1',
                        url: 'https://apps.apple.com/example',
                        description: 'A mobile app that does something similar to your idea with 10K+ downloads',
                        source: 'App Store',
                    },
                    {
                        name: 'Competitor Product',
                        url: 'https://producthunt.com/example',
                        description: 'A Product Hunt launch from 2024 with 234 upvotes',
                        source: 'Product Hunt',
                    },
                    {
                        name: 'open-source-alternative',
                        url: 'https://github.com/example/repo',
                        description: 'An open source project with 1.2K stars on GitHub',
                        source: 'GitHub',
                    },
                ],
                keyRisks: [
                    'Several similar solutions already exist in the market',
                    'Competition from established apps with significant user bases',
                    'Open source alternatives may reduce willingness to pay',
                ],
                recommendation:
                    'While similar solutions exist, there appears to be room for innovation. Focus on a unique value proposition or underserved niche. Consider what makes your approach different from existing competitors.',
            },
        };

        return NextResponse.json(mockResult);
    } catch (error) {
        console.error('Error checking idea:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
