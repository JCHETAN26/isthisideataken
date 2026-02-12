# 🗄️ Supabase Setup Guide

Complete guide to setting up Supabase for IsThisIdeaTaken.

## 🎯 What Supabase Provides

- ✅ **Database** - PostgreSQL for caching and user data
- ✅ **Authentication** - User signup/login
- ✅ **Row Level Security** - Data protection
- ✅ **Real-time** - Live updates (optional)
- ✅ **Storage** - File uploads (for avatars, etc.)

---

## 📋 Step 1: Create Supabase Project (5 minutes)

### 1. Sign Up
- Go to: https://supabase.com/
- Click "Start your project"
- Sign up with GitHub (recommended)

### 2. Create New Project
- Click "New Project"
- **Organization**: Create new or select existing
- **Name**: `isthisideataken`
- **Database Password**: Generate a strong password (save it!)
- **Region**: Choose closest to your users
- **Pricing Plan**: Free tier (perfect to start!)

### 3. Wait for Setup
- Takes ~2 minutes to provision
- You'll see a progress indicator

---

## 📋 Step 2: Run Database Schema (5 minutes)

### 1. Open SQL Editor
- In Supabase dashboard, go to **SQL Editor**
- Click "New query"

### 2. Copy Schema
- Open `backend/supabase-schema.sql` in your project
- Copy the entire file

### 3. Run Schema
- Paste into SQL Editor
- Click "Run" (or Cmd/Ctrl + Enter)
- You should see "Success. No rows returned"

### 4. Verify Tables
- Go to **Table Editor** in sidebar
- You should see these tables:
  - ✅ profiles
  - ✅ idea_checks
  - ✅ user_searches
  - ✅ blog_posts
  - ✅ email_subscribers
  - ✅ analytics_events

---

## 📋 Step 3: Get API Keys (2 minutes)

### 1. Go to Settings
- Click **Settings** (gear icon)
- Go to **API** section

### 2. Copy Keys
You'll need two keys:

**Project URL:**
\`\`\`
https://xxxxxxxxxxxxx.supabase.co
\`\`\`

**Anon/Public Key:**
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 3. Add to Environment Variables

**Backend** (`backend/.env.local`):
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Frontend** (`frontend/.env`):
\`\`\`env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

---

## 📋 Step 4: Configure Authentication (5 minutes)

### 1. Go to Authentication Settings
- Click **Authentication** in sidebar
- Go to **Providers**

### 2. Enable Email Provider
- **Email** should be enabled by default
- Configure:
  - ✅ Enable email confirmations (recommended)
  - ✅ Enable email change confirmations
  - Set **Site URL**: `http://localhost:8080` (for dev)

### 3. Enable Social Providers (Optional)
You can enable:
- **Google** - Easy signup
- **GitHub** - Developer-friendly
- **Twitter** - Quick auth

For each:
1. Click provider
2. Enable it
3. Add Client ID and Secret (from provider's developer console)

### 4. Configure Email Templates
- Go to **Email Templates**
- Customize:
  - Confirmation email
  - Magic link email
  - Password reset email

---

## 📋 Step 5: Set Up Row Level Security Policies

The schema already includes RLS policies, but verify:

### 1. Check Policies
- Go to **Authentication** → **Policies**
- You should see policies for each table

### 2. Test Policies
- Go to **Table Editor**
- Try to view data (should work)
- Try to edit without auth (should fail)

---

## 🧪 Step 6: Test the Setup

### 1. Restart Backend
\`\`\`bash
cd backend
# Backend should auto-restart when .env.local changes
\`\`\`

### 2. Test Caching
Make a search request:
\`\`\`bash
curl -X POST http://localhost:3001/api/check-idea \\
  -H "Content-Type: application/json" \\
  -d '{"idea":"test idea"}'
\`\`\`

### 3. Check Database
- Go to **Table Editor** → **idea_checks**
- You should see your test idea cached!

### 4. Test Cache Hit
Make the same request again:
- Should return faster
- Response header: `X-Cache: HIT`

---

## 📊 What's Now Working

### ✅ **Caching**
- Ideas are cached in Supabase
- Saves API costs
- Faster responses for popular ideas

### ✅ **Rate Limiting**
- 10 requests per minute per IP
- Prevents abuse
- Protects your API costs

### ✅ **User Limits**
- Free tier: 3 searches/day
- Pro tier: Unlimited
- Tracked in database

### ✅ **Analytics**
- Track every search
- Monitor API usage
- Understand user behavior

### ✅ **Search History**
- Users can see past searches
- Save favorite ideas
- Add notes

---

## 🔧 Advanced Configuration

### Scheduled Functions (Reset Daily Limits)

1. Go to **Database** → **Functions**
2. Create new function:

\`\`\`sql
-- Run daily at midnight
SELECT cron.schedule(
  'reset-daily-searches',
  '0 0 * * *',
  $$
  UPDATE profiles SET searches_today = 0;
  $$
);
\`\`\`

### Webhooks (Optional)

Set up webhooks for:
- New user signups
- Payment events (Stripe)
- Database changes

### Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups (7 days retention)
- **Pro tier**: Point-in-time recovery

---

## 📈 Monitoring

### 1. Database Usage
- Go to **Settings** → **Usage**
- Monitor:
  - Database size
  - API requests
  - Bandwidth

### 2. Logs
- Go to **Logs**
- View:
  - API logs
  - Database logs
  - Auth logs

### 3. Performance
- Go to **Reports**
- Check:
  - Query performance
  - Slow queries
  - Cache hit rate

---

## 💰 Costs

### Free Tier (Perfect for Starting)
- ✅ 500 MB database
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ 7-day backups

### When to Upgrade to Pro ($25/month)
- Database > 500 MB
- Need more bandwidth
- Want point-in-time recovery
- Need dedicated resources

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use different projects for dev/prod
- ✅ Rotate keys if exposed

### 2. Row Level Security
- ✅ Always enable RLS
- ✅ Test policies thoroughly
- ✅ Use service role key only in backend

### 3. API Keys
- ✅ Use anon key in frontend (safe)
- ✅ Use service role key in backend (secret)
- ✅ Never expose service role key

---

## 🐛 Troubleshooting

### "relation does not exist"
- Schema not run correctly
- Re-run `supabase-schema.sql`

### "permission denied"
- RLS policies blocking access
- Check policies in dashboard

### "Invalid API key"
- Wrong key in `.env.local`
- Copy fresh keys from dashboard

### Caching not working
- Check Supabase URL is correct
- Verify schema was run
- Check backend logs for errors

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database schema run successfully
- [ ] API keys added to `.env.local`
- [ ] Backend restarted
- [ ] Test search cached in database
- [ ] Cache hit working on second request
- [ ] Authentication configured
- [ ] RLS policies verified

---

## 🎯 Next Steps

Once Supabase is set up:

1. **Add user authentication to frontend**
2. **Build user dashboard** (search history)
3. **Implement Pro tier** (unlimited searches)
4. **Set up email notifications**
5. **Add blog functionality**

---

**Your database is now ready!** 🎉

Caching will save you money on API costs and make your app faster!
