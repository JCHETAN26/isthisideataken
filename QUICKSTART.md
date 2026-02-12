# Quick Start Guide

## ⚠️ Important: Node.js Version Requirement

This project requires **Node.js >= 20.9.0**. Your current version is **20.2.0**.

## 🔧 Upgrade Node.js

### Option 1: Using nvm (Recommended)

\`\`\`bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest Node.js 20.x
nvm install 20

# Use the new version
nvm use 20

# Verify
node --version  # Should show v20.x.x
\`\`\`

### Option 2: Download from nodejs.org

Visit https://nodejs.org/ and download the LTS version (20.x or higher)

## 🚀 Running the App

Once you have Node.js >= 20.9.0:

\`\`\`bash
# Navigate to the app directory
cd /Users/chetan/is-my-idea-taken/app

# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
\`\`\`

The app will be available at **http://localhost:3000**

## 🎯 What to Expect

### Homepage (/)
- Beautiful hero section with gradient text
- Search bar to enter your startup idea
- Example ideas to try
- Feature highlights
- How it works section

### Results Page (/results)
- Real-time source checking animation
- Viability score (0-100)
- Verdict badge (Wide Open, Opportunity, Crowded, Taken)
- Top competitors found
- Key risks identified
- AI-powered recommendations

## 🧪 Test the App

Try these example ideas:
1. "An app that tracks your water intake using AI"
2. "A platform for renting designer clothes"
3. "AI-powered meal planning based on your fridge contents"
4. "A marketplace for local home chefs"

## 📝 Current Status

The app is fully functional with **mock data**. It demonstrates:
- ✅ Complete UI/UX flow
- ✅ Search functionality
- ✅ Results display
- ✅ Loading states
- ✅ Error handling

## 🔌 Next: Real API Integration

To connect real APIs, update `/src/app/api/check-idea/route.ts`:

1. Get API keys from:
   - RapidAPI (for domain checks)
   - Product Hunt API
   - Reddit API
   - GitHub API
   - Google Trends
   - USPTO

2. Replace mock data with real API calls
3. Set up Supabase for caching
4. Add Claude API for AI analysis

## 💰 Environment Variables Needed

Create a `.env.local` file with:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Claude AI
ANTHROPIC_API_KEY=your_key

# Stripe (optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key

# RapidAPI
RAPID_API_KEY=your_key
\`\`\`

## 🎨 Customization

### Change Colors
Edit `/src/app/globals.css` and modify CSS variables:

\`\`\`css
:root {
  --primary: #6366f1;  /* Change primary color */
  --background: #0a0a0f;  /* Change background */
}
\`\`\`

### Modify Branding
Update metadata in `/src/app/layout.tsx`:

\`\`\`typescript
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your description",
};
\`\`\`

## 🐛 Troubleshooting

### Port Already in Use
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
\`\`\`

### Build Errors
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

## 🎉 You're Ready!

Once Node.js is upgraded, just run \`npm run dev\` and start validating ideas! 🚀
