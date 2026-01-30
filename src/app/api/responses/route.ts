import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST - Save quiz responses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, score, totalQuestions, answerHistory, scaleImpact } = body;

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
      console.log("DB not configured - would have saved:", {
        sessionId,
        score,
        responseCount: answerHistory.length,
      });
      return NextResponse.json({ 
        success: true, 
        message: "Response logged (no database configured)" 
      });
    }

    // Calculate deportation stats
    const deportYesCount = answerHistory.filter(
      (a: { deportationOpinion: string }) => a.deportationOpinion === "Yes"
    ).length;

    // Insert session record
    await sql`
      INSERT INTO sessions (
        session_id, 
        total_score, 
        total_questions, 
        deportation_yes_count,
        scale_impact_low,
        scale_impact_high
      ) VALUES (
        ${sessionId},
        ${score},
        ${totalQuestions},
        ${deportYesCount},
        ${scaleImpact?.low || 0},
        ${scaleImpact?.high || 0}
      )
    `;

    // Insert individual responses
    for (const answer of answerHistory) {
      await sql`
        INSERT INTO responses (
          session_id,
          vignette_id,
          user_q1,
          user_q2,
          deportation_opinion,
          correct_q1,
          correct_q2
        ) VALUES (
          ${sessionId},
          ${answer.id},
          ${answer.userQ1 || ""},
          ${answer.userQ2 || ""},
          ${answer.deportationOpinion || ""},
          ${answer.userQ1 === answer.q1.answer},
          ${answer.userQ2 === answer.q2.answer}
        )
      `;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Responses saved successfully" 
    });

  } catch (error) {
    console.error("Error saving responses:", error);
    return NextResponse.json(
      { error: "Failed to save responses" },
      { status: 500 }
    );
  }
}

// GET - Retrieve aggregate statistics
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
        AVG(total_score) as avg_score,
        AVG(deportation_yes_count) as avg_deport_yes,
        SUM(deportation_yes_count) as total_deport_yes
      FROM sessions
    `;

    // Get per-vignette stats
    const vignetteStats = await sql`
      SELECT 
        vignette_id,
        COUNT(*) as total_responses,
        SUM(CASE WHEN correct_q1 THEN 1 ELSE 0 END) as q1_correct,
        SUM(CASE WHEN correct_q2 THEN 1 ELSE 0 END) as q2_correct,
        SUM(CASE WHEN deportation_opinion = 'Yes' THEN 1 ELSE 0 END) as deport_yes,
        SUM(CASE WHEN deportation_opinion = 'No' THEN 1 ELSE 0 END) as deport_no,
        SUM(CASE WHEN deportation_opinion = 'Unsure' THEN 1 ELSE 0 END) as deport_unsure
      FROM responses
      GROUP BY vignette_id
      ORDER BY vignette_id
    `;

    return NextResponse.json({
      configured: true,
      sessionStats: sessionStats[0],
      vignetteStats,
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
