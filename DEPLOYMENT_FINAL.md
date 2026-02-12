# 🚀 Deployment Guide: Taking It Live!

We've built a full-stack application with:
- **Frontend**: React (Vite) + Shadcn UI + Supabase Auth
- **Backend**: Next.js API + AI Analysis + Caching
- **Database**: Supabase PostgreSQL

Here is the step-by-step guide to deploy everything to production.

---

## 1. Deploy Backend (API)

We'll deploy the backend first to get the API URL.

### 1. Push Code to GitHub
Ensure all your code is pushed to your GitHub repository.

### 2. Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** -> **"Project"**
3. Import your repository `is-my-idea-taken`
4. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Click "Edit" and select `backend` folder
   - **Environment Variables**:
     Add all variables from `backend/.env.local`
     - `Github_Token`
     - `ANTHROPIC_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - ...and any others you have.
5. Click **Deploy**

**Result**: You'll get a URL like `https://ideataken-backend.vercel.app`.
Save this URL!

---

## 2. Deploy Frontend (App)

Now update the frontend to point to your live backend.

### 1. Update Production Config (Vercel)
You don't need to change code. We'll set the API URL via environment variables in Vercel.

### 2. Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** -> **"Project"**
3. Import the **SAME** repository `is-my-idea-taken` again.
4. **Project Name**: `is-this-idea-taken` (or similar)
5. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: Click "Edit" and select `frontend` folder
   - **Environment Variables**:
     - `VITE_API_URL`: `https://ideataken-backend.vercel.app` (YOUR BACKEND URL)
     - `VITE_SUPABASE_URL`: `https://vxnetnyaopmmqtfhkhff.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: (Your public anon key)
6. Click **Deploy**

**Result**: You'll get `https://is-this-idea-taken.vercel.app`.

---

## 3. Connect Custom Domain

1. Go to your **Frontend** project on Vercel.
2. Go to **Settings** -> **Domains**.
3. Add `isthisideataken.com`.
4. Follow the DNS instructions (add A record or CNAME).

---

## 4. Final Checks

1. **Test Login**: Ensure you can sign in on the live site.
   - *Note: You might need to add your production URL to Supabase -> Auth -> URL Configuration -> Site URL and Redirect URLs.*
2. **Test Search**: Try checking an idea.
3. **Test Blog**: Visit `/blog` to see your content.

---

## 📝 Bonus: Add Blog Content

Your blog is empty by default. Run this SQL in Supabase SQL Editor to add a sample post:

```sql
INSERT INTO public.blog_posts (slug, title, description, content, published, published_at, meta_title, meta_description)
VALUES 
(
  'how-to-validate-startup-idea',
  'How to Validate Your Startup Idea in 24 Hours',
  'Stop guessing and start knowing. Learn the proven framework.',
  '## The Problem with Building First... (your markdown content)',
  true,
  NOW(),
  'Validate Startup Ideas Guide',
  'Learn the step-by-step process.'
)
ON CONFLICT (slug) DO NOTHING;
```

---

**Congratulations! You are ready to launch! 🚀**
