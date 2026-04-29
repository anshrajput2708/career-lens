import { NextRequest } from "next/server";
import { hfChat } from "@/lib/services/huggingface";
import { buildSalaryPrompt } from "@/lib/ai/prompts";
import type { SalaryData } from "@/lib/utils/storage";

const isDemoMode = process.env.NODE_ENV === "development" && !process.env.HUGGINGFACE_API_KEY;

const SALARY_DEMOS: Record<string, SalaryData> = {
  default: {
    career: "Product Manager",
    city: "Bangalore",
    entry: { min: 800000, max: 1400000 },
    oneYear: { min: 1400000, max: 2200000 },
    threeYears: { min: 2500000, max: 4500000 },
    currency: "INR",
    insights: [
      "SaaS product managers command 20-30% higher salaries in Bangalore vs most other Indian cities",
      "Moving from associate PM to PM to Senior PM in 3 years is very achievable with strong delivery track record",
      "SQL + data fluency can push your salary offer 15-20% higher at Series B+ startups",
    ],
  },
};

function buildDemo(career: string, city: string): SalaryData {
  return {
    ...SALARY_DEMOS.default,
    career,
    city,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { career, city } = await req.json();

    if (isDemoMode) {
      return Response.json({ data: buildDemo(career, city), demo: true });
    }

    const prompt = buildSalaryPrompt(career, city || "Bangalore");
    const raw = await hfChat([
      { role: "system", content: "You are a salary intelligence expert for Indian job markets. Return valid JSON only. Do not use Markdown formatting like ```json." },
      { role: "user", content: prompt },
    ], { temperature: 0.3, maxTokens: 1000 });

    let cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) cleaned = cleaned.slice(start, end + 1);

    const parsed = JSON.parse(cleaned);
    return Response.json({ data: parsed });
  } catch (err) {
    console.error("[/api/salary]", err);
    return Response.json({ data: buildDemo("this role", "your city"), demo: true });
  }
}
