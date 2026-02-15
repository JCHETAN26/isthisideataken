import { NextRequest, NextResponse } from 'next/server';
import { analyzeChallengeWithAI } from '@/lib/api-services';
import { trackEvent } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { idea, sources, userChallenge, previousAnalysis, userId } = await request.json();

        if (!userChallenge || typeof userChallenge !== 'string') {
            return NextResponse.json(
                { error: 'Challenge text is required' },
                { status: 400 }
            );
        }

        console.log(`🤖 Processing AI Challenge for idea: "${idea}"`);

        const updatedAnalysis = await analyzeChallengeWithAI(idea, sources, userChallenge, previousAnalysis);

        // Track the challenge event
        await trackEvent('idea_search_challenged', {
            idea,
            challengeLength: userChallenge.length
        }, userId);

        return NextResponse.json({
            analysis: updatedAnalysis
        });
    } catch (error) {
        console.error('Error in challenge route:', error);
        return NextResponse.json(
            { error: 'Failed to process challenge' },
            { status: 500 }
        );
    }
}
