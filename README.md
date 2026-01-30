# Immigration Paradox

An interactive tool exploring the gap between legal status and rule compliance in U.S. immigration. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **6 Case Study Vignettes** — Real scenarios based on actual immigration pathways
- **Knowledge Assessment** — Tests understanding of legal status vs. compliance
- **Opinion Tracking** — Records deportation opinions with scale impact calculations
- **Source Citations** — Links to government sources and research
- **Anonymous Data Collection** — Stores aggregate response data (optional)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Setup (Optional)

The app works without a database—responses are simply logged to the console. To enable persistent storage:

### 1. Create a Neon Database

1. Sign up at [neon.tech](https://neon.tech) (free tier available)
2. Create a new project
3. Copy your connection string

### 2. Set Environment Variable

Create a `.env.local` file in the project root:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 3. Run the Schema

In your Neon dashboard SQL editor, run the contents of `schema.sql` to create the tables.

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add `DATABASE_URL` as an environment variable in Vercel project settings
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── api/responses/    # API routes for data collection
│   ├── page.tsx          # Main quiz interface
│   ├── layout.tsx        # App metadata
│   └── globals.css       # Styling
├── data/
│   ├── vignettes.ts      # Scenario data with sources
│   └── pushback.ts       # Anticipated criticism responses
└── lib/
    ├── types.ts          # TypeScript interfaces
    └── db.ts             # Database connection
```

## API Endpoints

### POST `/api/responses`
Saves quiz completion data.

```json
{
  "sessionId": "uuid",
  "score": 4.5,
  "totalQuestions": 6,
  "answerHistory": [...],
  "scaleImpact": { "low": 100000, "high": 500000 }
}
```

### GET `/api/responses`
Returns aggregate statistics (if database is configured).

## Data Sources

All statistics and legal information are sourced from:
- U.S. Citizenship and Immigration Services (USCIS)
- Department of Homeland Security (DHS)
- Department of State Visa Bulletin
- American Immigration Council
- TRAC Immigration (Syracuse University)

See `immigration_vignette_stats_and_sources.md` in the parent directory for full citations.

## License

MIT
