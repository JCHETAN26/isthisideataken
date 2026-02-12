# IdeaTaken Backend API

Backend API for the IdeaTaken startup validation platform.

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

The API will be available at `http://localhost:3001`

## 📋 API Endpoints

### POST /api/check-idea

Validates a startup idea by checking multiple sources.

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
  "cached": false,
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

## 📁 Structure

\`\`\`
backend/
├── src/
│   ├── api/
│   │   └── check-idea/
│   │       └── route.ts       # Main API endpoint
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── lib/
│       └── supabase.ts        # Database client
├── package.json
├── tsconfig.json
└── .env.local
\`\`\`

## 🔧 Environment Variables

Create a `.env.local` file:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_key

# API Keys
RAPID_API_KEY=your_rapid_api_key
PRODUCT_HUNT_TOKEN=your_product_hunt_token
GITHUB_TOKEN=your_github_token
\`\`\`

## 🔌 Current Status

**Mock Data Mode**: The API currently returns mock data for demonstration.

To integrate real APIs, update `/src/api/check-idea/route.ts` following the integration guide in the root `API_INTEGRATION.md`.

## 🎯 Integration with Frontend

Your frontend should make POST requests to `/api/check-idea`:

\`\`\`typescript
const response = await fetch('http://localhost:3001/api/check-idea', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idea: userInput })
});

const result = await response.json();
\`\`\`

## 📚 Type Definitions

All TypeScript types are available in `/src/types/index.ts`:
- `IdeaCheckRequest`
- `IdeaCheckResult`
- `DomainCheckResult`
- `AppStoreResult`
- `ProductHuntResult`
- And more...

## 🚀 Deployment

This backend can be deployed to:
- Vercel (recommended)
- Railway
- Render
- Any Node.js hosting

## 📝 Next Steps

1. Integrate real APIs (see `API_INTEGRATION.md`)
2. Set up Supabase for caching
3. Add rate limiting
4. Implement authentication
5. Deploy to production
