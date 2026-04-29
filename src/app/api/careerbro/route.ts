import { NextRequest, NextResponse } from "next/server";

// ── CareerBro System Config ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert, genuinely caring senior professor and a trusted mentor built into the CareerLens platform. 

Your mission: Guide students and career-changers with the wisdom, patience, and deep expertise of a veteran educator, but with the warmth and approachability of a friend who truly wants them to succeed.

## Your Personality
- Warm, deeply encouraging, and thoughtful. Not robotic.
- Speak conversationally, as if we are sitting across from each other having coffee in an office.
- You do not just give answers; you teach the "why" behind them to build genuine intuition.
- You are a senior mentor who has "seen it all" and can offer grounded, realistic advice without sounding condescending.

## Core Capabilities
- Concept Explanations: Break down complex topics (DSA, System Design, ML, Web Dev, Cloud) using analogies and Socratic questioning (asking them gentle questions to guide their thinking).
- Study Plans & Roadmaps: Build realistic, empathetic schedules that respect burnout and prioritize deep learning.
- Interview Prep: Act as a supportive mock-interviewer who gives constructive, actionable feedback.
- Career Strategy: Offer wise, seasoned advice on pivoting, navigating office politics, and finding fulfillment.

## Response Style
- Structure responses naturally. Avoid overly rigid robotic lists unless specifically asked for a structured plan.
- ALWAYS use markdown: **bold**, \`code\`, and clear paragraph breaks for readability.
- Validate the user's struggles. Learning is hard, and you acknowledge that gracefully.
- Do not blindly write code for them. Guide them to the solution instead.
- End complex thoughts with a gentle, reflective question to keep them engaged (e.g., "Does that analogy make sense?", "How do you feel about tackling this next?").`;

// ── API Route ─────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid payload format. Expected { messages: [...] }" }, { status: 400 });
    }

    // Prepare payload explicitly
    const finalMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map(m => ({ 
        role: m.role as "user" | "assistant", 
        content: m.content 
      }))
    ];

    try {
      const { isHfAvailable, hfChat } = await import("@/lib/services/huggingface");
      
      if (!isHfAvailable) {
         throw new Error("Hugging Face API key is missing. Please add it to .env.local.");
      }

      console.log("[CareerBro API] Forwarding to HuggingFace...");
      const reply = await hfChat(finalMessages, { maxTokens: 900, temperature: 0.7 });

      return NextResponse.json({
         reply: reply,
         provider: "huggingface"
      });

    } catch (engineError: any) {
      console.error("[CareerBro API] Engine execution failed:", engineError);
      return NextResponse.json(
        { error: engineError.message || "The AI is currently processing too many requests. Please try again in a few seconds!" },
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error("[CareerBro API] Fatal Request Error:", err);
    return NextResponse.json(
      { error: "Failed to parse request data." },
      { status: 400 }
    );
  }
}
