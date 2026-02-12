# 🚀 Deployment Guide - isthisideataken.com

Congratulations on your domain! Let's get your app deployed.

## 🎯 Recommended Deployment Stack

### **Frontend + Backend: Vercel** (Recommended)
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy domain connection
- ✅ Built for Next.js
- ✅ Automatic deployments from Git

---

## 📋 Pre-Deployment Checklist

### ✅ What You Have
- [x] Domain: `isthisideataken.com`
- [x] Frontend: Vite + React app
- [x] Backend: Next.js API
- [x] GitHub repo (optional but recommended)

### ⏳ What You Need
- [ ] GitHub account
- [ ] Vercel account
- [ ] API keys (GitHub + Anthropic minimum)
- [ ] Domain DNS access

---

## 🚀 Deployment Steps

### **Step 1: Push to GitHub** (15 minutes)

1. **Initialize Git** (if not already done)
\`\`\`bash
cd /Users/chetan/is-my-idea-taken
git init
git add .
git commit -m "Initial commit - IdeaTaken app"
\`\`\`

2. **Create GitHub Repository**
- Go to: https://github.com/new
- Name: `isthisideataken`
- Description: "Validate startup ideas instantly"
- Make it **Private** (recommended)
- Don't initialize with README (you already have code)

3. **Push to GitHub**
\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/isthisideataken.git
git branch -M main
git push -u origin main
\`\`\`

---

### **Step 2: Deploy Backend to Vercel** (10 minutes)

1. **Go to Vercel**
- Visit: https://vercel.com
- Sign up with GitHub

2. **Import Project**
- Click "Add New" → "Project"
- Import your GitHub repo
- Select the `backend` folder as root directory

3. **Configure Build Settings**
```
Framework Preset: Next.js
Root Directory: backend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

4. **Add Environment Variables**
Click "Environment Variables" and add:
```
GITHUB_TOKEN=your_github_token
ANTHROPIC_API_KEY=your_anthropic_key
WHOIS_API_KEY=your_whois_key (optional)
SERP_API_KEY=your_serp_key (optional)
PRODUCT_HUNT_TOKEN=your_ph_token (optional)
RAPID_API_KEY=your_rapid_key (optional)
```

5. **Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- You'll get a URL like: `your-backend.vercel.app`

---

### **Step 3: Deploy Frontend to Vercel** (10 minutes)

1. **Import Project Again**
- Click "Add New" → "Project"
- Import same GitHub repo
- Select the `frontend` folder as root directory

2. **Configure Build Settings**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

3. **Add Environment Variables**
```
VITE_API_URL=https://your-backend.vercel.app
```
(Use the backend URL from Step 2)

4. **Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- You'll get a URL like: `your-frontend.vercel.app`

---

### **Step 4: Connect Your Domain** (15 minutes)

#### **Option A: Use Vercel DNS** (Easiest)

1. **In Vercel Frontend Project**
- Go to Settings → Domains
- Add domain: `isthisideataken.com`
- Add www subdomain: `www.isthisideataken.com`

2. **Update Domain Registrar**
- Go to where you bought the domain
- Update nameservers to Vercel's:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```
- Wait 24-48 hours for DNS propagation

#### **Option B: Use CNAME** (Faster)

1. **In Vercel Frontend Project**
- Go to Settings → Domains
- Add domain: `isthisideataken.com`

2. **In Your Domain Registrar**
- Add CNAME record:
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```
- Add A record for root domain:
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  ```

3. **Verify**
- Wait 5-10 minutes
- Vercel will auto-verify and issue SSL certificate

---

### **Step 5: Configure Backend Domain** (Optional)

For a custom API domain like `api.isthisideataken.com`:

1. **In Vercel Backend Project**
- Go to Settings → Domains
- Add: `api.isthisideataken.com`

2. **In Domain Registrar**
- Add CNAME:
  ```
  Type: CNAME
  Name: api
  Value: cname.vercel-dns.com
  ```

3. **Update Frontend Environment**
- In Vercel Frontend project
- Update `VITE_API_URL` to: `https://api.isthisideataken.com`
- Redeploy frontend

---

## 🔧 Post-Deployment Configuration

### **Update CORS** (if using custom API domain)

In `backend/next.config.ts`:
\`\`\`typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: 'https://isthisideataken.com' 
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET, POST, PUT, DELETE, OPTIONS' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'Content-Type, Authorization' 
          },
        ],
      },
    ];
  },
};
\`\`\`

### **Set Up Analytics** (Optional)

Add Vercel Analytics:
\`\`\`bash
cd frontend
npm install @vercel/analytics
\`\`\`

In `frontend/src/main.tsx`:
\`\`\`typescript
import { Analytics } from '@vercel/analytics/react';

// Add to your app
<Analytics />
\`\`\`

---

## 🧪 Testing Your Deployment

1. **Visit your domain**: https://isthisideataken.com
2. **Test the flow**:
   - Enter an idea
   - Check loading page
   - Verify results appear
3. **Check browser console** for any errors
4. **Test on mobile** (responsive design)

---

## 📊 Deployment URLs

After deployment, you'll have:

- **Production**: https://isthisideataken.com
- **API**: https://your-backend.vercel.app (or api.isthisideataken.com)
- **Preview**: Automatic preview URLs for each Git push

---

## 🔒 Security Checklist

- [x] HTTPS enabled (automatic with Vercel)
- [x] Environment variables secured
- [x] API keys not in code
- [x] CORS configured
- [ ] Rate limiting (add later)
- [ ] Authentication (add later)

---

## 💰 Costs

### **Vercel Free Tier**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions

**Perfect for starting!** Upgrade to Pro ($20/mo) when you need more.

### **Domain**
- ~$10-15/year (already purchased!)

### **API Costs**
- See `API_KEYS_SETUP.md` for details
- ~500 free checks/month with free tiers

---

## 🐛 Troubleshooting

### **"Domain not verified"**
- Wait 5-10 minutes after adding DNS records
- Check DNS propagation: https://dnschecker.org

### **"API calls failing"**
- Verify environment variables in Vercel
- Check backend logs in Vercel dashboard
- Ensure CORS is configured correctly

### **"Build failed"**
- Check build logs in Vercel
- Ensure all dependencies are in package.json
- Test build locally first: `npm run build`

---

## 📈 Monitoring

### **Vercel Dashboard**
- Real-time analytics
- Error tracking
- Performance metrics
- Deployment history

### **Set Up Alerts**
- Go to Vercel project settings
- Enable deployment notifications
- Add Slack/Discord webhooks (optional)

---

## 🚀 Continuous Deployment

Once set up, every Git push will:
1. Trigger automatic deployment
2. Run build process
3. Deploy to preview URL
4. Auto-deploy to production (main branch)

**Workflow:**
\`\`\`bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys!
# Check preview URL in GitHub PR
\`\`\`

---

## 🎯 Next Steps After Deployment

1. **Test thoroughly** on production
2. **Add Google Analytics** (optional)
3. **Set up monitoring** (Sentry, LogRocket)
4. **Add rate limiting** to prevent abuse
5. **Implement caching** with Supabase
6. **Add authentication** for Pro features
7. **Set up Stripe** for payments

---

## 📚 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Custom Domains**: https://vercel.com/docs/concepts/projects/domains
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **DNS Checker**: https://dnschecker.org

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables added
- [ ] Domain connected
- [ ] DNS configured
- [ ] SSL certificate issued
- [ ] CORS configured
- [ ] Production tested
- [ ] Analytics added (optional)

---

**Ready to deploy isthisideataken.com!** 🚀

Start with Step 1 (GitHub) and you'll be live in ~1 hour!
