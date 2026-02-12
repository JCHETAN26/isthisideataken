-- ============================================================================
-- SUPABASE DATABASE SCHEMA FOR ISTHISIDEATAKEN
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (Managed by Supabase Auth)
-- ============================================================================
-- This is automatically created by Supabase Auth
-- We'll reference auth.users in our tables

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    searches_today INTEGER DEFAULT 0,
    searches_this_month INTEGER DEFAULT 0,
    total_searches INTEGER DEFAULT 0,
    last_search_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- IDEA CHECKS TABLE (Caching)
-- ============================================================================
CREATE TABLE public.idea_checks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    idea TEXT NOT NULL,
    idea_hash TEXT NOT NULL UNIQUE, -- Hash of the idea for quick lookup
    user_id UUID REFERENCES auth.users(id),
    
    -- Results
    overall_score INTEGER,
    verdict TEXT,
    recommendation TEXT,
    
    -- Sources data (JSONB for flexibility)
    sources JSONB,
    analysis JSONB,
    
    -- Metadata
    cached BOOLEAN DEFAULT true,
    times_requested INTEGER DEFAULT 1,
    last_requested_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.idea_checks ENABLE ROW LEVEL SECURITY;

-- Policies for idea_checks
CREATE POLICY "Anyone can view cached checks"
    ON public.idea_checks FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert checks"
    ON public.idea_checks FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Indexes for performance
CREATE INDEX idx_idea_checks_hash ON public.idea_checks(idea_hash);
CREATE INDEX idx_idea_checks_user ON public.idea_checks(user_id);
CREATE INDEX idx_idea_checks_created ON public.idea_checks(created_at DESC);

-- ============================================================================
-- USER SEARCHES TABLE (History)
-- ============================================================================
CREATE TABLE public.user_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    idea_check_id UUID REFERENCES public.idea_checks(id),
    idea TEXT NOT NULL,
    
    -- Quick access to results
    overall_score INTEGER,
    verdict TEXT,
    
    -- Metadata
    saved BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;

-- Policies for user_searches
CREATE POLICY "Users can view own searches"
    ON public.user_searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches"
    ON public.user_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches"
    ON public.user_searches FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches"
    ON public.user_searches FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_searches_user ON public.user_searches(user_id);
CREATE INDEX idx_user_searches_created ON public.user_searches(created_at DESC);

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================
CREATE TABLE public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- MDX content
    author_id UUID REFERENCES auth.users(id),
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    og_image TEXT,
    
    -- Status
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    
    -- Stats
    views INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
    ON public.blog_posts FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can manage posts"
    ON public.blog_posts FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE plan = 'admin'
        )
    );

-- Indexes
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);

-- ============================================================================
-- EMAIL SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE public.email_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed BOOLEAN DEFAULT true,
    source TEXT, -- 'homepage', 'blog', 'results', etc.
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for email_subscribers
CREATE POLICY "Anyone can subscribe"
    ON public.email_subscribers FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- ============================================================================
CREATE TABLE public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    event_name TEXT NOT NULL,
    event_data JSONB,
    
    -- Session info
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events
CREATE POLICY "Anyone can insert events"
    ON public.analytics_events FOR INSERT
    WITH CHECK (true);

-- Indexes
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_idea_checks_updated_at
    BEFORE UPDATE ON public.idea_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset daily search count
CREATE OR REPLACE FUNCTION reset_daily_searches()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles SET searches_today = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for popular ideas
CREATE OR REPLACE VIEW public.popular_ideas AS
SELECT 
    idea,
    overall_score,
    verdict,
    times_requested,
    last_requested_at
FROM public.idea_checks
WHERE times_requested > 1
ORDER BY times_requested DESC, last_requested_at DESC
LIMIT 100;

-- View for recent checks
CREATE OR REPLACE VIEW public.recent_checks AS
SELECT 
    id,
    idea,
    overall_score,
    verdict,
    created_at
FROM public.idea_checks
ORDER BY created_at DESC
LIMIT 50;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- You can add some sample blog posts here if needed

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- To run this schema:
-- 1. Go to Supabase Dashboard
-- 2. SQL Editor
-- 3. Paste this entire file
-- 4. Run
-- 
-- This will create:
-- - User profiles with plan tracking
-- - Idea checks caching (saves API costs!)
-- - User search history
-- - Blog system
-- - Email subscribers
-- - Analytics events
-- 
-- All tables have Row Level Security enabled for data protection
--
