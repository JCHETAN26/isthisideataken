import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// CACHING FUNCTIONS
// ============================================================================

/**
 * Generate a hash for an idea (for cache lookup)
 */
export function generateIdeaHash(idea: string): string {
    return crypto
        .createHash('sha256')
        .update(idea.toLowerCase().trim())
        .digest('hex');
}

/**
 * Check if an idea has been analyzed before (cache lookup)
 */
export async function getCachedIdeaCheck(idea: string) {
    try {
        const ideaHash = generateIdeaHash(idea);

        const { data, error } = await supabase
            .from('idea_checks')
            .select('*')
            .eq('idea_hash', ideaHash)
            .single();

        if (error) {
            console.log('No cached result found');
            return null;
        }

        // Update times_requested and last_requested_at
        await supabase
            .from('idea_checks')
            .update({
                times_requested: (data.times_requested || 0) + 1,
                last_requested_at: new Date().toISOString(),
            })
            .eq('id', data.id);

        return data;
    } catch (error) {
        console.error('Error checking cache:', error);
        return null;
    }
}

/**
 * Save idea check results to cache
 */
export async function cacheIdeaCheck(idea: string, result: any, userId?: string) {
    try {
        const ideaHash = generateIdeaHash(idea);

        const { data, error } = await supabase
            .from('idea_checks')
            .insert({
                idea,
                idea_hash: ideaHash,
                user_id: userId || null,
                overall_score: result.analysis.overallScore,
                verdict: result.analysis.verdict,
                recommendation: result.analysis.recommendation,
                sources: result.sources,
                analysis: result.analysis,
                cached: true,
            })
            .select()
            .single();

        if (error) {
            console.error('Error caching result:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error saving to cache:', error);
        return null;
    }
}

// ============================================================================
// USER SEARCH HISTORY
// ============================================================================

/**
 * Save a search to user's history
 */
export async function saveUserSearch(
    userId: string,
    idea: string,
    ideaCheckId: string,
    score: number,
    verdict: string
) {
    try {
        const { data, error } = await supabase
            .from('user_searches')
            .insert({
                user_id: userId,
                idea_check_id: ideaCheckId,
                idea,
                overall_score: score,
                verdict,
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving search:', error);
            return null;
        }

        // Update user profile stats
        await updateUserSearchStats(userId);

        return data;
    } catch (error) {
        console.error('Error saving user search:', error);
        return null;
    }
}

/**
 * Get user's search history
 */
export async function getUserSearchHistory(userId: string, limit = 20) {
    try {
        const { data, error } = await supabase
            .from('user_searches')
            .select('*, idea_checks(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching history:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error getting user history:', error);
        return [];
    }
}

// ============================================================================
// USER PROFILE MANAGEMENT
// ============================================================================

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error getting profile:', error);
        return null;
    }
}

/**
 * Update user search statistics
 */
export async function updateUserSearchStats(userId: string) {
    try {
        const profile = await getUserProfile(userId);
        if (!profile) return;

        await supabase
            .from('profiles')
            .update({
                searches_today: (profile.searches_today || 0) + 1,
                searches_this_month: (profile.searches_this_month || 0) + 1,
                total_searches: (profile.total_searches || 0) + 1,
                last_search_at: new Date().toISOString(),
            })
            .eq('id', userId);
    } catch (error) {
        console.error('Error updating search stats:', error);
    }
}

/**
 * Check if user has exceeded free tier limits
 */
export async function checkUserLimits(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    searchesRemaining?: number;
}> {
    try {
        const profile = await getUserProfile(userId);
        if (!profile) {
            return { allowed: true }; // Allow if no profile (shouldn't happen)
        }

        // Pro users have unlimited searches
        if (profile.plan === 'pro') {
            return { allowed: true };
        }

        // Free tier: 3 searches per day
        const FREE_TIER_DAILY_LIMIT = 3;

        if (profile.searches_today >= FREE_TIER_DAILY_LIMIT) {
            return {
                allowed: false,
                reason: 'Daily limit reached. Upgrade to Pro for unlimited searches.',
                searchesRemaining: 0,
            };
        }

        return {
            allowed: true,
            searchesRemaining: FREE_TIER_DAILY_LIMIT - profile.searches_today,
        };
    } catch (error) {
        console.error('Error checking limits:', error);
        return { allowed: true }; // Allow on error
    }
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Track an analytics event
 */
export async function trackEvent(
    eventName: string,
    eventData?: any,
    userId?: string,
    sessionId?: string
) {
    try {
        await supabase.from('analytics_events').insert({
            user_id: userId || null,
            event_name: eventName,
            event_data: eventData || {},
            session_id: sessionId || null,
        });
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

// ============================================================================
// EMAIL SUBSCRIBERS
// ============================================================================

/**
 * Add email subscriber
 */
export async function addEmailSubscriber(email: string, source?: string) {
    try {
        const { data, error } = await supabase
            .from('email_subscribers')
            .insert({
                email,
                source: source || 'unknown',
            })
            .select()
            .single();

        if (error) {
            // Check if already subscribed
            if (error.code === '23505') {
                return { success: true, message: 'Already subscribed!' };
            }
            console.error('Error adding subscriber:', error);
            return { success: false, message: 'Failed to subscribe' };
        }

        return { success: true, message: 'Successfully subscribed!', data };
    } catch (error) {
        console.error('Error adding subscriber:', error);
        return { success: false, message: 'Failed to subscribe' };
    }
}

// ============================================================================
// BLOG FUNCTIONS
// ============================================================================

/**
 * Get published blog posts
 */
export async function getBlogPosts(limit = 10) {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error getting blog posts:', error);
        return [];
    }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string) {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error) {
            console.error('Error fetching blog post:', error);
            return null;
        }

        // Increment view count
        await supabase
            .from('blog_posts')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id);

        return data;
    } catch (error) {
        console.error('Error getting blog post:', error);
        return null;
    }
}

// ============================================================================
// POPULAR IDEAS
// ============================================================================

/**
 * Get popular/trending ideas
 */
export async function getPopularIdeas(limit = 10) {
    try {
        const { data, error } = await supabase
            .from('idea_checks')
            .select('idea, overall_score, verdict, times_requested')
            .gt('times_requested', 1)
            .order('times_requested', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching popular ideas:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error getting popular ideas:', error);
        return [];
    }
}
