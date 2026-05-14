import { NextRequest, NextResponse } from "next/server";
import { type UserProfile, type AnalysisResult } from "@/lib/utils/storage";

function validateProfile(p: unknown): p is UserProfile {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return o.intent === "transition" || o.intent === "upskill";
}

const DASHBOARD_PROMPT_TEMPLATE = `You are an elite, highly analytical Career Strategist and Senior Professor at a top-tier technical university. Your task is to perform a deep, mathematically structured, and highly logical assessment of the user's career profile. 
Your tone must be authoritative, deeply explanatory, and profoundly insightful—no fluff, no gimmicks. Every recommendation must be strictly accurate, grounded in industry realities, and rigorously justified.

Output ONLY pure JSON, no markdown, no extra text, no emojis.
Return exactly this structure (fill with real data based on the user profile):
{"mode":"transition or upskill","user_summary":{"diagnosis":"Provide a brutal, highly accurate 3-sentence diagnostic of their current trajectory, highlighting critical architectural gaps in their learning.","target_role":"Optimal target role","keystoneSkill":"The singular highest-leverage skill they must master","targetRoleAnalysis":{"matchPercentage":75,"matchedSkills":["skill1"],"transferableSkills":["skill1"],"missingSkills":[{"skill":"skill1","gapSeverity":"Critical"}]}},"current_skills":[{"skill":"skill name","level":"Beginner","score":30,"gap_severity":"Medium","benchmark":"Strict industry standard expectation"}],"recommendations":[{"title":"Resource name","type":"Course","resource":"URL or platform","time":"4 weeks","difficulty":"Advanced","outcome":"Deep, logical explanation of what will be mastered","priority":"High"}],"transition_plan":[{"phase":"Phase 1","skills":"Key skills","resources":"Main resource","timeline":"Month 1-2","milestone":"Measurable output"}],"progress":{"overall_completion":0,"next_action":"Exact next step","estimated_job_ready_date":"Month YYYY"}}
Keep recommendations to 4 items. Keep transition_plan to 3 phases. Keep current_skills to 5 items.`;


export async function POST(req: NextRequest) {
  let profile: UserProfile | null = null;
  try {
    const body = await req.json();
    profile = body?.profile ?? null;
    if (!profile || !validateProfile(profile)) {
      return NextResponse.json({ error: "Invalid profile data format." }, { status: 400 });
    }

    const { isHfAvailable, hfChat } = await import("@/lib/services/huggingface");
    let jsonResult;

    if (isHfAvailable) {
      const mode = profile.intent;
      const userPrompt = "USER PROFILE DATA:\n" + JSON.stringify(profile, null, 2);
      try {
        console.log("[/api/analyze] Invoking HuggingFace inference for " + mode);
        let rawResponse = await hfChat(
          [
            { role: "system", content: DASHBOARD_PROMPT_TEMPLATE },
            { role: "user", content: userPrompt }
          ],
          { maxTokens: 5000, temperature: 0.6 }
        );
        rawResponse = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
        const startIdx = rawResponse.indexOf("{");
        const endIdx = rawResponse.lastIndexOf("}");
        if (startIdx !== -1 && endIdx !== -1) {
          rawResponse = rawResponse.substring(startIdx, endIdx + 1);
          jsonResult = JSON.parse(rawResponse);
        } else {
          throw new Error("No JSON object found in output");
        }
      } catch (hfErr: any) {
        console.error("[/api/analyze] HuggingFace execution failed:", hfErr.message);
      }
    }

    if (!jsonResult) {
      return NextResponse.json(
        { error: "AI Engine Failed to Generate Strategy. Please re-run the assessment." },
        { status: 500 }
      );
    }

    const resultPayload: AnalysisResult = {
      mode: profile.intent === "transition" ? "transition" : "upskill",
      analysisDate: new Date().toISOString(),
      user_summary: jsonResult.user_summary,
      current_skills: jsonResult.current_skills,
      recommendations: jsonResult.recommendations,
      transition_plan: jsonResult.transition_plan,
      progress: jsonResult.progress
    };

    return NextResponse.json({ result: resultPayload });

  } catch (error: any) {
    console.error("[/api/analyze] Fatal Error:", error);
    return NextResponse.json(
      { error: "Server API Failure: Execution Could Not Complete." },
      { status: 500 }
    );
  }
}