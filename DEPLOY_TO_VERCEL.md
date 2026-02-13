# 🚀 Deploying to Vercel

Since this is a monorepo with separate `frontend` and `backend` folders, you will need to create **two separate projects** in Vercel.

---

## 1. Deploy the Backend (API)

1.  **Go to Vercel Dashboard** > **"Add New..."** > **"Project"**
2.  Import your GitHub repository: `isthisideataken`
3.  **Project Name:** `ideataken-backend` (or similar)
4.  **Framework Preset:** Next.js (should be auto-detected)
5.  **Root Directory:**
    *   Click **Edit** next to Root Directory
    *   Select `backend` folder
6.  **Environment Variables:**
    *   Copy the contents of `backend/.env.local`
    *   Add each variable (e.g., `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, etc.)
7.  **Click Deploy**

**Once deployed:**
*   Copy the domain URL (e.g., `https://ideataken-backend.vercel.app`)
*   You will need this for the frontend configuration.

---

## 2. Deploy the Frontend (UI)

1.  **Go to Vercel Dashboard** > **"Add New..."** > **"Project"**
2.  Import the SAME GitHub repository: `isthisideataken`
3.  **Project Name:** `ideataken-frontend`
4.  **Framework Preset:** Vite (should be auto-detected)
5.  **Root Directory:**
    *   Click **Edit** next to Root Directory
    *   Select `frontend` folder
6.  **Environment Variables:**
    *   `VITE_API_URL`: Set this to your **Backend URL** from step 1 (e.g., `https://ideataken-backend.vercel.app`)
    *   `VITE_SUPABASE_URL`: Your Supabase URL
    *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
7.  **Click Deploy**

---

## ✅ Post-Deployment Checks

1.  Open your **Frontend URL** (e.g., `https://ideataken-frontend.vercel.app`).
2.  Try searching for an idea.
3.  If it works, you're live! 🎉
4.  If you get an error, check:
    *   Did you set `VITE_API_URL` correctly in the frontend project?
    *   Did you verify the backend deployment logs for any errors?
