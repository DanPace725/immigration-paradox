import { neon } from "@neondatabase/serverless";

// Creates a SQL query function connected to Neon
// Returns null if DATABASE_URL is not configured (for local dev without DB)
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn("DATABASE_URL not configured - database operations will be skipped");
    return null;
  }
  
  return neon(databaseUrl);
}

// Types for database records
export interface ResponseRecord {
  id?: number;
  session_id: string;
  vignette_id: number;
  user_q1: string;
  user_q2: string;
  deportation_opinion: string;
  correct_q1: boolean;
  correct_q2: boolean;
  created_at?: Date;
}

export interface SessionRecord {
  id?: number;
  session_id: string;
  total_score: number;
  total_questions: number;
  deportation_yes_count: number;
  scale_impact_low: number;
  scale_impact_high: number;
  created_at?: Date;
}
