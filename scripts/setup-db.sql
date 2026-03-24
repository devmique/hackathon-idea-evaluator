-- Hackathon Idea Evaluator Database Schema

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  track VARCHAR(100),
  ai_suggestions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id SERIAL PRIMARY KEY,
  idea_id INT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  evaluator_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, evaluator_name)
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  evaluation_id INT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  criterion VARCHAR(100) NOT NULL,
  score INT NOT NULL CHECK (score >= 0 AND score <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS idx_evaluations_idea_id ON evaluations(idea_id);
CREATE INDEX IF NOT EXISTS idx_scores_evaluation_id ON scores(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_ideas_track ON ideas(track);

-- Insert seed data (optional - for testing)
-- INSERT INTO ideas (name, description, track) VALUES
-- ('AI Task Manager', 'Smart task management with AI prioritization', 'AI/ML'),
-- ('Green Commute', 'Carbon-neutral transportation tracking app', 'Sustainability'),
-- ('Health Hub', 'Unified health and fitness tracking platform', 'Health');
