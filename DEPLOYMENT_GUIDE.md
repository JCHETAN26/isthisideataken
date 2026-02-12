# 🚀 Deployment Guide: Connect Your Namecheap Domain

This guide will help you deploy your IdeaTaken app to production and connect it to your Namecheap domain.

## 📋 Overview

We'll deploy:
- **Frontend** (React + Vite) → Vercel
- **Backend** (Next.js API) → Vercel
- **Domain** (Namecheap) → Point to Vercel

---

## Step 1: Prepare Your Project for Deployment

### 1.1 Create Production Environment Variables

**Frontend (.env.production):**
```bash
cd frontend
cat > .env.production << 'EOF'
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
```

**Backend (.env.production):**
```bash
cd backend
# Copy your .env.local to .env.production
cp .env.local .env.production
```

### 1.2 Update Frontend API URL

The frontend needs to know where your backend is deployed. We'll configure this after deployment.

---

## Step 2: Deploy Backend to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy Backend
```bash
cd backend
vercel login  # Login with your account
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? is-my-idea-taken-backend
# - Directory? ./
# - Override settings? No
```

### 2.3 Note Your Backend URL
After deployment, Vercel will give you a URL like:
```
https://is-my-idea-taken-backend.vercel.app
```

**Save this URL** - you'll need it!

### 2.4 Set Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click your backend project
3. Go to "Settings" → "Environment Variables"
4. Add all your API keys from `.env.local`:
   - `ANTHROPIC_API_KEY`
   - `GITHUB_TOKEN`
   - `WHOIS_API_KEY`
   - `RAPID_API_KEY`
   - `SERP_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Set each for **Production**, **Preview**, and **Development**
6. Click "Save"

### 2.5 Set Up Custom API Subdomain

1. In Vercel Dashboard → Your backend project → "Settings" → "Domains"
2. Click "Add"
3. Enter: `api.yourdomain.com` (replace with your actual domain)
4. Vercel will show you DNS records to add - **save these!**

---

## Step 3: Configure Namecheap DNS

### 3.1 Get Vercel DNS Records

From Vercel, you should have records like:
```
Type: A
Name: @ (or api)
Value: 76.76.21.21

Type: CNAME
Name: www (or api)
Value: cname.vercel-dns.com
```

### 3.2 Add DNS Records in Namecheap

1. Login to Namecheap: https://www.namecheap.com
2. Go to "Domain List"
3. Click "Manage" next to your domain
4. Go to "Advanced DNS" tab
5. Click "Add New Record"

**For API subdomain (api.yourdomain.com):**
- Type: `CNAME Record`
- Host: `api`
- Value: `cname.vercel-dns.com.` (from Vercel)
- TTL: `Automatic`

**For main domain (yourdomain.com):**
- Type: `A Record`
- Host: `@`
- Value: `76.76.21.21` (Vercel IP)
- TTL: `Automatic`

**For www subdomain:**
- Type: `CNAME Record`
- Host: `www`
- Value: `cname.vercel-dns.com.`
- TTL: `Automatic`

6. Click "Save All Changes"

⏰ **Wait 5-30 minutes** for DNS propagation

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment

```bash
cd frontend
```

Edit `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4.2 Deploy Frontend
```bash
vercel --prod

# Follow prompts:
# - Project name? is-my-idea-taken-frontend
# - Directory? ./
```

### 4.3 Add Custom Domain

1. Vercel Dashboard → Your frontend project → "Settings" → "Domains"
2. Add both:
   - `yourdomain.com`
   - `www.yourdomain.com`

3. Vercel will verify DNS automatically

---

## Step 5: Configure Supabase for Production

1. Go to Supabase Dashboard
2. Go to "Settings" → "API"
3. Add your production URLs to allowed origins:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`
   - `https://api.yourdomain.com`

4. Update RLS policies if needed

---

## Step 6: Test Your Deployment

### 6.1 Check DNS Propagation
```bash
# Test API subdomain
nslookup api.yourdomain.com

# Test main domain
nslookup yourdomain.com
```

### 6.2 Test Backend API
```bash
curl https://api.yourdomain.com/api/check-idea \
  -H "Content-Type: application/json" \
  -d '{"idea": "test"}' \
  | jq '.analysis.verdict'
```

Should return: `"Taken"` or similar

### 6.3 Test Frontend
Open browser: `https://yourdomain.com`

Test the search functionality!

---

## 🎯 Quick Reference

**Your URLs:**
- Frontend: `https://yourdomain.com`
- Backend API: `https://api.yourdomain.com`
- Vercel Dashboard: https://vercel.com/dashboard

**What Domain to Use:**
Replace `yourdomain.com` with your actual Namecheap domain!

---

## 🔧 Troubleshooting

### DNS Not Resolving?
- Wait up to 48 hours (usually 5-30 minutes)
- Check Namecheap DNS propagation: https://dnschecker.org
- Verify DNS records are correct in Namecheap

### API Calls Failing?
- Check Vercel logs: Dashboard → Backend Project → "Logs"
- Verify environment variables are set
- Check CORS settings in backend

### Frontend Not Loading?
- Check browser console for errors
- Verify `VITE_API_URL` in production build
- Check Vercel deployment logs

### SSL Certificate Issues?
- Vercel automatically provides SSL
- Wait 24 hours for certificate provisioning
- Check Vercel Dashboard → Domains → SSL status

---

## 🌟 Alternative: Deploy with Custom Vercel Deployment

If you want more control, you can use `vercel.json` config files:

**Backend vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "GITHUB_TOKEN": "@github-token"
  }
}
```

**Frontend vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] DNS records added to Namecheap
- [ ] Custom domains configured in Vercel
- [ ] Environment variables set in Vercel
- [ ] Supabase allowed origins updated
- [ ] SSL certificates active
- [ ] Test search functionality works
- [ ] Check backend logs for errors

---

## 🎉 You're Live!

Once everything is configured, your app will be accessible at:
- **Main Site**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com

Share it with the world! 🚀
