import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST - Save crime quiz responses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, answerHistory, correctCount, totalQuestions, perceptionGapPercent } = body;

    // Validate required fields
    if (!sessionId || !answerHistory || !Array.isArray(answerHistory)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sql = getDb();
    
    // If no database configured, just acknowledge receipt
    if (!sql) {
      console.log("DB not configured - would have saved crime quiz:", {
        sessionId,
        correctCount,
        totalQuestions,
        perceptionGapPercent,
      });
      return NextResponse.json({ 
        success: true, 
        message: "Response logged (no database configured)" 
      });
    }

    // Insert session record
    await sql`
      INSERT INTO crime_sessions (
        session_id, 
        correct_count, 
        total_questions, 
        perception_gap_percent
      ) VALUES (
        ${sessionId},
        ${correctCount},
        ${totalQuestions},
        ${perceptionGapPercent}
      )
    `;

    // Insert individual responses
    for (const answer of answerHistory) {
      await sql`
        INSERT INTO crime_responses (
          session_id,
          question_id,
          user_answer,
          was_correct
        ) VALUES (
          ${sessionId},
          ${answer.questionId},
          ${answer.userAnswer},
          ${answer.wasCorrect}
        )
      `;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Responses saved successfully" 
    });

  } catch (error) {
    console.error("Error saving crime responses:", error);
    return NextResponse.json(
      { error: "Failed to save responses" },
      { status: 500 }
    );
  }
}

// GET - Retrieve aggregate statistics for crime quiz
export async function GET() {
  try {
    const sql = getDb();
    
    if (!sql) {
      return NextResponse.json({ 
        configured: false,
        message: "Database not configured" 
      });
    }

    // Get overall stats
    const sessionStats = await sql`
      SELECT 
        COUNT(*) as total_sessions,
        ROUND(AVG(perception_gap_percent), 1) as avg_perception_gap,
        ROUND(AVG(correct_count::DECIMAL / total_questions * 100), 1) as avg_accuracy
      FROM crime_sessions
    `;

    // Get per-question stats
    const questionStats = await sql`
      SELECT 
        question_id,
        COUNT(*) as total_responses,
        SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct_count,
        ROUND(AVG(CASE WHEN was_correct THEN 1.0 ELSE 0.0 END) * 100, 1) as correct_percentage
      FROM crime_responses
      GROUP BY question_id
      ORDER BY question_id
    `;

    return NextResponse.json({
      configured: true,
      sessionStats: sessionStats[0],
      questionStats,
    });

  } catch (error) {
    console.error("Error fetching crime stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
