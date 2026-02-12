# IsThisIdeaTaken - Startup Idea Validation Platform

**Live at: [isthisideataken.com](https://isthisideataken.com)** 🚀


Validate your startup ideas instantly by checking multiple sources including domains, app stores, Product Hunt, GitHub, and more. Get AI-powered insights in seconds.

## 📁 Project Structure

\`\`\`
is-my-idea-taken/
├── backend/              # Backend API (Next.js API routes)
│   ├── src/
│   │   ├── api/
│   │   │   └── check-idea/
│   │   │       └── route.ts    # Main API endpoint
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript types
│   │   ├── lib/
│   │   │   └── supabase.ts     # Database client
│   │   └── app/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local
│   └── README.md
│
├── frontend/             # Frontend (Add your Lovable UI here)
│   └── (to be added)
│
├── API_INTEGRATION.md    # Guide for integrating real APIs
├── PROJECT_SUMMARY.md    # Project overview
└── README.md            # This file
\`\`\`

## 🚀 Getting Started

### Backend Setup

1. Navigate to backend:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.local` and fill in your API keys
   - See `backend/README.md` for required variables

4. Run the backend:
   \`\`\`bash
   npm run dev
   \`\`\`
   
   Backend will run on **http://localhost:3001**

### Frontend Setup

Add your Lovable-generated frontend in the `frontend/` folder.

Configure it to call the backend API at `http://localhost:3001/api/check-idea`

## 🔌 API Integration

### Backend API Endpoint

**POST** `http://localhost:3001/api/check-idea`

**Request:**
\`\`\`json
{
  "idea": "your startup idea description"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "check_1234567890",
  "idea": "your startup idea",
  "timestamp": "2026-02-11T...",
  "sources": {
    "domains": [...],
    "appStore": [...],
    "productHunt": [...],
    "reddit": [...],
    "github": [...],
    "trends": {...},
    "trademark": {...}
  },
  "analysis": {
    "overallScore": 62,
    "verdict": "Opportunity",
    "topCompetitors": [...],
    "keyRisks": [...],
    "recommendation": "..."
  }
}
\`\`\`

### Frontend Integration Example

\`\`\`typescript
// In your Lovable frontend
const checkIdea = async (idea: string) => {
  const response = await fetch('http://localhost:3001/api/check-idea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea })
  });
  
  const result = await response.json();
  return result;
};
\`\`\`

## 📊 Data Sources

The platform checks these sources:

1. **Domain Availability** - .com, .io, .ai, .co
2. **App Store** - iOS apps
3. **Google Play** - Android apps
4. **Product Hunt** - Launched products
5. **Reddit** - Discussions and mentions
6. **GitHub** - Open source projects
7. **Google Trends** - Search interest
8. **USPTO** - Trademark search

## 🔧 Current Status

### ✅ Complete
- Backend API structure
- TypeScript types
- Mock data for testing
- API documentation

### ⏳ To Do
1. **Frontend**: Add Lovable-generated UI
2. **Real APIs**: Integrate actual data sources (see `API_INTEGRATION.md`)
3. **Database**: Set up Supabase for caching
4. **Auth**: Add user authentication
5. **Deployment**: Deploy to production

## 📚 Documentation

- **`backend/README.md`** - Backend API documentation
- **`API_INTEGRATION.md`** - Guide for integrating real APIs
- **`PROJECT_SUMMARY.md`** - Detailed project overview

## 🎯 Next Steps

1. **Add Frontend**:
   - Generate UI with Lovable
   - Place in `frontend/` folder
   - Connect to backend API

2. **Integrate Real APIs**:
   - Follow `API_INTEGRATION.md`
   - Get API keys from various services
   - Update `backend/src/api/check-idea/route.ts`

3. **Deploy**:
   - Backend: Vercel, Railway, or Render
   - Frontend: Vercel, Netlify, or Cloudflare Pages

## 💡 Features

- **Multi-Source Analysis**: Checks 7+ sources simultaneously
- **AI-Powered Insights**: Claude AI analyzes findings
- **Fast Results**: Parallel processing with caching
- **Freemium Model**: 3 free searches/day, unlimited Pro tier

## 🔒 Environment Variables

Required in `backend/.env.local`:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_key

# API Keys
RAPID_API_KEY=your_key
PRODUCT_HUNT_TOKEN=your_token
GITHUB_TOKEN=your_token
\`\`\`

## 📝 License

MIT

---

**Ready to validate startup ideas!** 🚀
# isthisideataken
