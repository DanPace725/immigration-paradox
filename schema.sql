-- Immigration Paradox Database Schema
-- Run this in your Neon dashboard to create the tables

-- Sessions table: stores overall quiz completion data
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) UNIQUE NOT NULL,
  total_score DECIMAL(3,1) NOT NULL,
  total_questions INTEGER NOT NULL,
  deportation_yes_count INTEGER NOT NULL DEFAULT 0,
  scale_impact_low INTEGER NOT NULL DEFAULT 0,
  scale_impact_high INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Responses table: stores individual vignette responses
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL REFERENCES sessions(session_id),
  vignette_id INTEGER NOT NULL,
  user_q1 VARCHAR(10) NOT NULL,
  user_q2 VARCHAR(10) NOT NULL,
  deportation_opinion VARCHAR(10) NOT NULL,
  correct_q1 BOOLEAN NOT NULL,
  correct_q2 BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster aggregation queries
CREATE INDEX IF NOT EXISTS idx_responses_vignette ON responses(vignette_id);
CREATE INDEX IF NOT EXISTS idx_responses_deportation ON responses(deportation_opinion);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at);

-- Useful aggregate view (optional)
CREATE OR REPLACE VIEW vignette_stats AS
SELECT 
  vignette_id,
  COUNT(*) as total_responses,
  SUM(CASE WHEN correct_q1 THEN 1 ELSE 0 END) as q1_correct_count,
  SUM(CASE WHEN correct_q2 THEN 1 ELSE 0 END) as q2_correct_count,
  SUM(CASE WHEN deportation_opinion = 'Yes' THEN 1 ELSE 0 END) as deport_yes_count,
  SUM(CASE WHEN deportation_opinion = 'No' THEN 1 ELSE 0 END) as deport_no_count,
  SUM(CASE WHEN deportation_opinion = 'Unsure' THEN 1 ELSE 0 END) as deport_unsure_count
FROM responses
GROUP BY vignette_id;
