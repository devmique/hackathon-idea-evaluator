import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('[v0] Starting database setup...');

    // Create ideas table
    await sql`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        track VARCHAR(100) NOT NULL,
        ai_suggestions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('[v0] Created ideas table');

    // Create evaluations table
    await sql`
      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
        evaluator_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('[v0] Created evaluations table');

    // Create scores table
    await sql`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        evaluation_id INTEGER NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
        criterion VARCHAR(100) NOT NULL,
        score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('[v0] Created scores table');

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_evaluations_idea_id ON evaluations(idea_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scores_evaluation_id ON scores(evaluation_id);`;
    console.log('[v0] Created indexes');

    console.log('[v0] Database setup completed successfully!');
  } catch (error) {
    console.error('[v0] Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
