# The Lone Screen

A one-night-only film premiere platform with live streaming, ticketing, and community features.

## Tech Stack

- **Framework:** Next.js 16
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Video Streaming:** Dacast
- **Email:** Resend
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Dacast account
- Resend account

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/lone-screen.git
cd lone-screen/lone-screen-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

4. Run database migrations
- Go to Supabase Dashboard → SQL Editor
- Run all SQL files in the `supabase/` directory in order

5. Start development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

See `DEPLOYMENT_STEPS.md` for detailed deployment instructions.

Quick version:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## Project Structure

```
lone-screen-app/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   └── ...
├── components/         # React components
├── lib/               # Utility libraries
├── supabase/          # Database migrations
└── types/            # TypeScript types
```

## Environment Variables

See `ENV_VARIABLES_CHECKLIST.md` for a complete list of required environment variables.

## Documentation

- [Deployment Guide](./docs/deployment-guide.md)
- [Testing Guide](./docs/testing_guide.md)
- [API Documentation](./docs/frontend-backend-explained.md)

## License

Private - All rights reserved
