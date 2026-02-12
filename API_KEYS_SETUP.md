# 🔑 API Keys Setup Guide

This guide will help you get all the API keys needed for IdeaTaken.

## 📋 Required API Keys

| Service | Cost | Difficulty | Priority |
|---------|------|------------|----------|
| iTunes Search API | **FREE** | ⭐ Easy | ✅ High |
| Reddit API | **FREE** | ⭐ Easy | ✅ High |
| GitHub API | **FREE** | ⭐ Easy | ✅ High |
| Anthropic Claude | **Paid** ($) | ⭐⭐ Medium | ✅ High |
| WHOIS/Domain API | **Paid** ($) | ⭐⭐ Medium | ⭐⭐ Medium |
| Product Hunt | **FREE** | ⭐⭐⭐ Hard | ⭐⭐ Medium |
| SerpAPI (Trends) | **Paid** ($$) | ⭐⭐ Medium | ⭐ Low |
| USPTO/RapidAPI | **Paid** ($) | ⭐⭐ Medium | ⭐ Low |

---

## 🚀 Quick Start (Free APIs Only)

Start with these **100% free** APIs to get your app working:

### 1. ✅ iTunes Search API (FREE - No Key Needed!)
**Already works!** No setup required.

### 2. ✅ Reddit API (FREE - No Key Needed!)
**Already works!** No setup required.

### 3. ✅ GitHub API (FREE)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `IdeaTaken`
4. Select scopes: `public_repo` (read-only)
5. Click "Generate token"
6. Copy the token

**Add to `.env.local`:**
\`\`\`env
GITHUB_TOKEN=ghp_your_token_here
\`\`\`

### 4. ✅ Anthropic Claude API (Paid - $5 credit free)

1. Go to: https://console.anthropic.com/
2. Sign up for an account
3. Go to API Keys section
4. Create a new API key
5. You get $5 free credit!

**Add to `.env.local`:**
\`\`\`env
ANTHROPIC_API_KEY=sk-ant-your_key_here
\`\`\`

**Cost**: ~$0.003 per idea check (very cheap!)

---

## 💰 Paid APIs (Optional)

### 5. Domain Availability (WHOIS XML API)

**Option A: WHOIS XML API** (Recommended)
1. Go to: https://www.whoisxmlapi.com/
2. Sign up for free account
3. Get 500 free requests/month
4. Go to Dashboard → API Keys
5. Copy your API key

**Add to `.env.local`:**
\`\`\`env
WHOIS_API_KEY=your_key_here
\`\`\`

**Cost**: Free tier: 500 requests/month

**Option B: RapidAPI Domain Check**
1. Go to: https://rapidapi.com/
2. Search for "Domain Availability"
3. Subscribe to a plan
4. Copy your RapidAPI key

\`\`\`env
RAPID_API_KEY=your_rapidapi_key_here
\`\`\`

### 6. Product Hunt API

1. Go to: https://www.producthunt.com/v2/oauth/applications
2. Create a new application
3. Get your API token
4. Follow OAuth flow

**Add to `.env.local`:**
\`\`\`env
PRODUCT_HUNT_TOKEN=your_token_here
\`\`\`

**Note**: Product Hunt API is complex. Consider skipping initially.

### 7. Google Trends (SerpAPI)

1. Go to: https://serpapi.com/
2. Sign up for free account
3. Get 100 free searches/month
4. Copy your API key

**Add to `.env.local`:**
\`\`\`env
SERP_API_KEY=your_serpapi_key_here
\`\`\`

**Cost**: Free tier: 100 searches/month

### 8. USPTO Trademark Search

Use RapidAPI:
1. Go to: https://rapidapi.com/
2. Search for "USPTO Trademark"
3. Subscribe to a plan

**Add to `.env.local`:**
\`\`\`env
RAPID_API_KEY=your_rapidapi_key_here
\`\`\`

---

## 📝 Complete `.env.local` Template

Update your `backend/.env.local` file:

\`\`\`env
# ============================================================================
# FREE APIs (Start here!)
# ============================================================================

# GitHub API (FREE - Required)
GITHUB_TOKEN=ghp_your_github_token_here

# Anthropic Claude API (Paid but has $5 free credit - Required)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# ============================================================================
# PAID APIs (Optional - Add later)
# ============================================================================

# Domain Availability (500 free/month)
WHOIS_API_KEY=your_whois_api_key_here

# Product Hunt (Optional)
PRODUCT_HUNT_TOKEN=your_product_hunt_token_here

# Google Trends via SerpAPI (100 free/month)
SERP_API_KEY=your_serpapi_key_here

# RapidAPI for USPTO and other services
RAPID_API_KEY=your_rapidapi_key_here

# ============================================================================
# Supabase (For caching - Optional)
# ============================================================================

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
\`\`\`

---

## 🎯 Recommended Setup Order

### Phase 1: MVP (Free - 30 minutes)
1. ✅ GitHub Token (5 min)
2. ✅ Anthropic API Key (5 min)
3. ✅ Test with Reddit + iTunes (already working!)

**Result**: Working app with 4/7 data sources!

### Phase 2: Enhanced (Paid - 1 hour)
4. Domain API (WHOIS XML - 500 free/month)
5. Google Trends (SerpAPI - 100 free/month)

**Result**: 6/7 data sources working!

### Phase 3: Complete (Optional - 2 hours)
6. Product Hunt API (complex OAuth)
7. USPTO Trademark API

**Result**: All 7 data sources!

---

## 🧪 Testing Your Setup

After adding API keys, test each service:

\`\`\`bash
cd backend
npm run dev
\`\`\`

Then make a test request:

\`\`\`bash
curl -X POST http://localhost:3001/api/check-idea \\
  -H "Content-Type: application/json" \\
  -d '{"idea":"fitness tracking app"}'
\`\`\`

Check the console logs to see which APIs succeeded/failed.

---

## 💡 Cost Estimation

### Free Tier (Recommended Start)
- **GitHub**: Unlimited (free)
- **Reddit**: Unlimited (free)
- **iTunes**: Unlimited (free)
- **Anthropic**: $5 credit = ~1,600 idea checks
- **WHOIS**: 500 checks/month (free)
- **SerpAPI**: 100 checks/month (free)

**Total**: ~500 free idea checks per month!

### Paid (After Free Tier)
- **Anthropic**: $0.003 per check
- **WHOIS**: $0.002 per check
- **SerpAPI**: $0.05 per check

**Total**: ~$0.055 per idea check = $55 for 1,000 checks

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to Git (already in `.gitignore`)
2. **Use environment variables** in production (Vercel, Railway, etc.)
3. **Rotate keys** if exposed
4. **Set up rate limiting** to prevent abuse
5. **Monitor usage** in each service's dashboard

---

## 🐛 Troubleshooting

### "API key not found" error
- Check `.env.local` file exists in `backend/` folder
- Restart the backend server after adding keys
- Verify no extra spaces in the key values

### "Rate limit exceeded"
- Check your usage in the service dashboard
- Implement caching with Supabase
- Upgrade to paid tier if needed

### "CORS error"
- Already fixed in `next.config.ts`
- If still occurring, check browser console

---

## 📚 API Documentation Links

- **GitHub**: https://docs.github.com/en/rest
- **Anthropic**: https://docs.anthropic.com/
- **WHOIS XML**: https://www.whoisxmlapi.com/documentation/
- **SerpAPI**: https://serpapi.com/google-trends-api
- **Product Hunt**: https://api.producthunt.com/v2/docs
- **RapidAPI**: https://rapidapi.com/hub

---

## ✅ Next Steps

1. **Get GitHub + Anthropic keys** (5-10 minutes)
2. **Add to `.env.local`**
3. **Restart backend server**
4. **Test the app!**
5. **Add more APIs as needed**

---

**Ready to set up your APIs!** Start with the free ones and expand from there. 🚀
