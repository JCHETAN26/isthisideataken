# IdeaTaken - Startup Idea Validation Platform

![IdeaTaken Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=IdeaTaken)

## 🚀 Overview

**IdeaTaken** is a powerful web application that helps entrepreneurs validate their startup ideas instantly by searching across multiple sources including domains, app stores, Product Hunt, GitHub, Reddit, Google Trends, and USPTO trademarks. Get AI-powered insights and a comprehensive viability score in seconds.

## ✨ Features

- **Multi-Source Analysis**: Simultaneously checks 7+ sources for existing solutions
- **AI-Powered Insights**: Claude AI analyzes all findings and provides actionable recommendations
- **Viability Score**: Get a 0-100 score indicating how "taken" your idea is
- **Competitor Discovery**: Automatically finds and lists top competitors
- **Risk Assessment**: Identifies key risks and market challenges
- **Beautiful UI**: Premium dark mode design with smooth animations
- **Lightning Fast**: Parallel processing with intelligent caching
- **Freemium Model**: 3 free searches per day, unlimited with Pro tier

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Deployment**: Vercel
- **Payments**: Stripe (for Pro tier)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 20.9.0 (required for Next.js 14)
- **npm** or **yarn** or **pnpm**
- **Supabase account** (for database and auth)
- **Anthropic API key** (for AI analysis)
- **RapidAPI account** (for various API checks)

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
cd /Users/chetan/is-my-idea-taken/app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Copy the \`.env.local\` file and fill in your API keys:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Stripe (for monetization)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# API Keys for various checks
RAPID_API_KEY=your_rapid_api_key_here
\`\`\`

### 4. Set Up Supabase Database

Create the following tables in your Supabase project:

#### `idea_checks` table
\`\`\`sql
CREATE TABLE idea_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  idea TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cached BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_idea_checks_user_id ON idea_checks(user_id);
CREATE INDEX idx_idea_checks_created_at ON idea_checks(created_at);
\`\`\`

#### `user_profiles` table
\`\`\`sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  searches_today INTEGER DEFAULT 0,
  last_search_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── check-idea/
│   │   │       └── route.ts          # Main API endpoint
│   │   ├── results/
│   │   │   └── page.tsx              # Results page
│   │   ├── globals.css               # Global styles & design system
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Homepage
│   ├── lib/
│   │   └── supabase.ts               # Supabase client
│   └── types/
│       └── index.ts                  # TypeScript types
├── .env.local                        # Environment variables
├── package.json
└── README.md
\`\`\`

## 🎨 Design System

The app uses a premium dark mode design system with:

- **Color Palette**: Purple/indigo primary colors with semantic colors for success, warning, and danger
- **Typography**: Inter font for clean, modern text
- **Components**: Reusable card, button, input, and badge components
- **Animations**: Smooth fade-in, slide-in, and pulse effects
- **Responsive**: Mobile-first design that works on all devices

## 🔌 API Integration

### Current Status
The app currently uses **mock data** for demonstration. To integrate real APIs:

1. **Domain Availability**: Use RapidAPI's Domain Availability API
2. **App Store Search**: Use Apple App Store API or scraping
3. **Google Play Search**: Use Google Play API or scraping
4. **Product Hunt**: Use Product Hunt API
5. **Reddit**: Use Reddit API
6. **GitHub**: Use GitHub Search API
7. **Google Trends**: Use Google Trends API or unofficial libraries
8. **USPTO Trademarks**: Use USPTO TESS API

### Implementing Real API Calls

Update `/src/app/api/check-idea/route.ts` to replace mock data with real API calls:

\`\`\`typescript
// Example: Domain check
async function checkDomains(idea: string) {
  const domains = ['.com', '.io', '.ai', '.co'];
  const results = await Promise.all(
    domains.map(async (ext) => {
      const response = await fetch(\`https://domain-api.com/check?domain=\${idea}\${ext}\`);
      const data = await response.json();
      return { domain: \`\${idea}\${ext}\`, available: data.available, extension: ext };
    })
  );
  return results;
}
\`\`\`

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

\`\`\`bash
npm run build  # Test production build locally
\`\`\`

## 💰 Monetization

The app includes a freemium model:

- **Free Tier**: 3 searches per day
- **Pro Tier**: $9/month for unlimited searches, detailed reports, and PDF exports

Integrate Stripe for payments by:
1. Creating products in Stripe Dashboard
2. Implementing checkout flow
3. Setting up webhooks for subscription management

## 🔒 Security Considerations

- Rate limiting implemented for free users
- API keys stored in environment variables
- CORS configured for API routes
- Input validation on all endpoints
- SQL injection protection via Supabase

## 📈 Future Enhancements

- [ ] User authentication and dashboard
- [ ] Search history and saved results
- [ ] PDF export functionality
- [ ] Social sharing with generated images
- [ ] Email notifications for saved searches
- [ ] Advanced filtering and sorting
- [ ] Comparison mode for multiple ideas
- [ ] Integration with more data sources

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the IdeaTaken team

---

**Note**: This is currently a demonstration with mock data. Real API integrations require appropriate API keys and subscriptions to various services.
