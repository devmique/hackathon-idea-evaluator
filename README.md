
# Hackathon Idea Evaluator

A full-stack application for submitting, evaluating, and ranking hackathon ideas with AI-powered improvement suggestions.

## Features

- Submit hackathon ideas with name, description, and track
- Evaluate ideas across 8 weighted criteria (Innovation, Feasibility, Impact, etc.)
- AI-generated improvement suggestions for each idea
- Real-time leaderboard with automatic ranking
- Duplicate evaluator prevention
- Responsive design for all devices

## Tech Stack

- Next.js 16, React 19, TypeScript
- PostgreSQL (Neon Serverless)
- Vercel AI SDK v6 with OpenAI GPT-4o-mini
- Tailwind CSS, React Hook Form, Zod

## Getting Started

### Install
```bash
npm install
```

### Environment Setup

Create `.env.development.local`:

```plaintext
DATABASE_URL=your_neon_connection_string
```

### Initialize Database

```shellscript
npm run setup-db
```

### Run Development Server

```shellscript
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```plaintext
app/
├── api/
│   ├── ideas/           # CRUD operations
│   ├── evaluations/     # Evaluation submission
│   └── suggestions/     # AI suggestions
├── submit/              # Submit idea page
├── evaluate/            # Evaluate page
├── ideas/[id]/          # Idea details
├── leaderboard/         # Rankings
└── page.tsx             # Home/dashboard

components/
├── header.tsx
├── idea-card.tsx
├── ai-suggestions.tsx
├── evaluation-form.tsx
├── submit-form.tsx
└── score-display.tsx

lib/
├── db.ts                # Database utilities
└── ai.ts                # AI utilities
```

## API Endpoints

- `GET /api/ideas` - Get all ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/[id]` - Get idea details
- `POST /api/evaluations` - Submit evaluation
- `POST /api/suggestions` - Generate AI suggestions


## Scoring Criteria

8 weighted criteria evaluated on 1-5 scale:

- Innovation & Creativity (weight: 2)
- Technical Feasibility (weight: 2)
- Market Impact (weight: 2)
- Market Potential (weight: 2)
- Team Capability (weight: 2)
- Scalability (weight: 2)
- User Experience (weight: 1)
- Business Model Viability (weight: 1)


## Database Tables

- `ideas` - Submitted ideas with AI suggestions
- `evaluations` - Evaluation records (unique by idea + evaluator)
- `scores` - Individual criterion scores


## Environment Variables

| Variable | Description
|-----|-----
| `DATABASE_URL` | Neon connection string (required)


