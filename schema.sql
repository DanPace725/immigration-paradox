-- Immigration Reality Check Database Schema
-- Run this in your Neon dashboard to create the tables

-- ============================================
-- STATUS QUIZ TABLES (Immigration Paradox)
-- ============================================

-- Sessions table: stores overall status quiz completion data
CREATE TABLE IF NOT EXISTS status_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) UNIQUE NOT NULL,
  total_score DECIMAL(3,1) NOT NULL,
  total_questions INTEGER NOT NULL,
  deportation_yes_count INTEGER NOT NULL DEFAULT 0,
  scale_impact_low INTEGER NOT NULL DEFAULT 0,
  scale_impact_high INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status responses table: stores individual vignette responses
CREATE TABLE IF NOT EXISTS status_responses (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL REFERENCES status_sessions(session_id),
  vignette_id INTEGER NOT NULL,
  user_q1 VARCHAR(10) NOT NULL,
  user_q2 VARCHAR(10) NOT NULL,
  deportation_opinion VARCHAR(10) NOT NULL,
  correct_q1 BOOLEAN NOT NULL,
  correct_q2 BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for status quiz
CREATE INDEX IF NOT EXISTS idx_status_responses_vignette ON status_responses(vignette_id);
CREATE INDEX IF NOT EXISTS idx_status_responses_deportation ON status_responses(deportation_opinion);
CREATE INDEX IF NOT EXISTS idx_status_sessions_created ON status_sessions(created_at);

-- Status quiz aggregate view
CREATE OR REPLACE VIEW status_vignette_stats AS
SELECT 
  vignette_id,
  COUNT(*) as total_responses,
  SUM(CASE WHEN correct_q1 THEN 1 ELSE 0 END) as q1_correct_count,
  SUM(CASE WHEN correct_q2 THEN 1 ELSE 0 END) as q2_correct_count,
  SUM(CASE WHEN deportation_opinion = 'Yes' THEN 1 ELSE 0 END) as deport_yes_count,
  SUM(CASE WHEN deportation_opinion = 'No' THEN 1 ELSE 0 END) as deport_no_count,
  SUM(CASE WHEN deportation_opinion = 'Unsure' THEN 1 ELSE 0 END) as deport_unsure_count
FROM status_responses
GROUP BY vignette_id;


-- ============================================
-- CRIME QUIZ TABLES (Crime Statistics)
-- ============================================

-- Crime sessions table: stores overall crime quiz completion data
CREATE TABLE IF NOT EXISTS crime_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) UNIQUE NOT NULL,
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  perception_gap_percent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crime responses table: stores individual question responses
CREATE TABLE IF NOT EXISTS crime_responses (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL REFERENCES crime_sessions(session_id),
  question_id INTEGER NOT NULL,
  user_answer VARCHAR(50) NOT NULL,
  was_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for crime quiz
CREATE INDEX IF NOT EXISTS idx_crime_responses_question ON crime_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_crime_responses_correct ON crime_responses(was_correct);
CREATE INDEX IF NOT EXISTS idx_crime_sessions_created ON crime_sessions(created_at);

-- Crime quiz aggregate view
CREATE OR REPLACE VIEW crime_question_stats AS
SELECT 
  question_id,
  COUNT(*) as total_responses,
  SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct_count,
  ROUND(AVG(CASE WHEN was_correct THEN 1.0 ELSE 0.0 END) * 100, 1) as correct_percentage
FROM crime_responses
GROUP BY question_id;

-- Overall perception gap stats
CREATE OR REPLACE VIEW crime_perception_stats AS
SELECT 
  COUNT(*) as total_sessions,
  ROUND(AVG(perception_gap_percent), 1) as avg_perception_gap,
  ROUND(AVG(correct_count::DECIMAL / total_questions * 100), 1) as avg_accuracy
FROM crime_sessions;


-- ============================================
-- MIGRATION: Rename old tables if they exist
-- ============================================
-- Run these only if you have existing data in the old table names

-- ALTER TABLE IF EXISTS sessions RENAME TO status_sessions;
-- ALTER TABLE IF EXISTS responses RENAME TO status_responses;
