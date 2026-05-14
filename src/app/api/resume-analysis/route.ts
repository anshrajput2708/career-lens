import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult, UserProfile } from "@/lib/utils/storage";
import { hfChat, isHfAvailable, hfVisionOcrFromDataUrl } from "@/lib/services/huggingface";
import { resourcesForSkills } from "@/lib/utils/resumeResources";

type ResumeSectionScore = {
  section: string;
  score: number;
  rationale: string;
};

type GapItem = {
  skill: string;
  importance: "high" | "medium" | "low";
  whyMissing: string;
};

type ResumeProjectReview = {
  title: string;
  impactScore: number;
  clarityScore: number;
  verdict: string;
  rewriteHint: string;
};

type AdvancedResumeAnalysisOutput = {
  overall_score: number;
  overall_summary: string;
  percentile_estimate: string;
  sections: {
    experience: { score: number; summary: string; positives: string[]; negatives: string[] };
    projects: { score: number; summary: string; projects_reviewed: { name: string; score: number; issue: string }[] };
    skills: { score: number; present_skills: string[]; missing_critical: string[]; missing_nicetohave: string[]; bonus_skills: string[] };
    impact_metrics: { score: number; metrics_found: string[]; missing_metric_locations: string[] };
    ats_readability: { score: number; issues: string[]; passed_checks: string[] };
    keyword_match: { score: number; matched: string[]; missing: string[] };
  };
  strengths: string[];
  ats_issues: string[];
  missing_skills: { skill: string; severity: "HIGH" | "MEDIUM" | "LOW"; reason: string }[];
  improvement_plan: { priority: number; action: string; impact: string }[];
  rewrite_suggestions: { original: string; improved: string }[];
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function cleanJSON(raw: string): string {
  const s = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) return s.slice(start, end + 1);
  return s;
}

function printableAscii(input: string): string {
  return input.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

async function extractResumeText(file: File): Promise<{ text: string; method: string; warning?: string }> {
  const mime = file.type || "";
  const bytes = Buffer.from(await file.arrayBuffer());

  if (mime.startsWith("text/") || file.name.toLowerCase().endsWith(".md")) {
    return { text: bytes.toString("utf8"), method: "direct_text" };
  }

  if (mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      const mod = await import("pdfjs-dist/legacy/build/pdf.js");
      const loadingTask = mod.getDocument({ data: new Uint8Array(bytes) });
      const doc = await loadingTask.promise;
      let text = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      if (text.trim().length > 30) return { text, method: "pdfjs_local" };
      return { text, method: "pdfjs_local_low_text", warning: "Local PDF extraction returned very little text." };
    } catch (e) {
      const fallback = printableAscii(bytes.toString("latin1"));
      if (fallback.length > 120) {
        return {
          text: fallback,
          method: "pdf_latin1_fallback",
          warning: `Local PDF parser failed (${(e as Error)?.message || "unknown"}), used fallback decode.`,
        };
      }
      return {
        text: fallback,
        method: "pdf_unreadable",
        warning: `Local PDF parser failed (${(e as Error)?.message || "unknown"}).`,
      };
    }
  }

  if (mime.startsWith("image/")) {
    try {
      const dataUrl = `data:${mime};base64,${bytes.toString("base64")}`;
      const text = await hfVisionOcrFromDataUrl(dataUrl, { maxTokens: 4500, timeoutMs: 55_000 });
      if (text.trim().length > 20) return { text, method: "vision_ocr" };
      return { text, method: "vision_ocr_low_text", warning: "OCR returned very little text." };
    } catch (e) {
      const fallback = printableAscii(bytes.toString("latin1"));
      return {
        text: fallback,
        method: "vision_ocr_failed",
        warning: `Vision OCR failed (${(e as Error)?.message || "unknown"}).`,
      };
    }
  }

  return { text: printableAscii(bytes.toString("utf8")), method: "fallback_utf8" };
}

function fallbackAnalysis(targetRole: string, text: string): AdvancedResumeAnalysisOutput {
  const lower = text.toLowerCase();
  const hasProjects = /project|built|developed|implemented/.test(lower);
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+\+/.test(lower);
  const hasSkills = /skills|typescript|python|sql|react|aws|docker/.test(lower);
  
  const lengthBonus = Math.min(15, Math.floor(text.length / 400));
  const base = 30 + (hasProjects ? 15 : 0) + (hasMetrics ? 18 : 0) + (hasSkills ? 12 : 0) + lengthBonus;
  const overall = clamp(base, 10, 95);

  return {
    overall_score: overall,
    overall_summary: "Fallback scoring used due to API failure or empty text. Needs more measurable outcomes and hard skills.",
    percentile_estimate: `Top ${Math.round(100 - overall)}% for this role`,
    sections: {
      experience: { score: hasProjects ? 70 : 45, summary: "Basic experience match.", positives: [], negatives: [] },
      projects: { score: hasProjects ? 74 : 40, summary: "Portfolio clarity unknown.", projects_reviewed: [] },
      skills: { score: hasSkills ? 68 : 42, present_skills: [], missing_critical: ["Quantified outcomes", "Role-specific tooling"], missing_nicetohave: [], bonus_skills: [] },
      impact_metrics: { score: hasMetrics ? 78 : 38, metrics_found: [], missing_metric_locations: ["Every bullet point"] },
      ats_readability: { score: 64, issues: ["Check headings"], passed_checks: [] },
      keyword_match: { score: 50, matched: [], missing: [] }
    },
    strengths: hasProjects ? ["Contains build evidence"] : ["Some context detected"],
    ats_issues: ["Ensure standard headings are used.", "Add specific metrics."],
    missing_skills: [
      { skill: "Quantified Data", severity: "HIGH", reason: "Fatal gap: no measurable impact." }
    ],
    improvement_plan: [
      { priority: 1, action: "Add 3-5 quantified metrics.", impact: "+20 points to metrics score" }
    ],
    rewrite_suggestions: []
  };
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("resume");
    const targetRole = String(form.get("targetRole") || "Software Engineer").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please upload a resume file." }, { status: 400 });
    }

    const extracted = await extractResumeText(file);
    const resumeText = extracted.text.replace(/\u0000/g, " ").trim().slice(0, 8000);

    if (resumeText.length < 30) {
      const output = fallbackAnalysis(targetRole, "");
      const resources = resourcesForSkills(["resume writing", "projects", "ats"], 6);
      return NextResponse.json({
        result: { ...output, targetRole },
        extractedTextPreview: resumeText,
        extractionMethod: extracted.method,
        extractionWarning: extracted.warning || "Insufficient readable text extracted from uploaded file.",
        trustedResources: resources,
      });
    }

    let output: AdvancedResumeAnalysisOutput;

    const prompt = `You are a brutally honest, deeply analytical Senior Technical Recruiter with 15 years of experience at FAANG companies. You are reviewing a candidate's resume for the role: "${targetRole}".

Your task: produce a DEEPLY SPECIFIC, EVIDENCE-BASED analysis. Every statement must cite exact content FROM the resume (project names, job titles, company names, specific skills mentioned). 

## ABSOLUTE RULES — VIOLATION = FAILURE:
1. NEVER use these phrases: "does not directly translate", "lacks exposure", "he lacks", "she lacks", "lacks experience in", "does not demonstrate". These are BANNED.
2. NEVER repeat the same sentence structure across different sections. Every section must have a DIFFERENT analytical angle.
3. ALWAYS cite specific resume elements by name. Do NOT say "the candidate's projects". Say "CropKart and Amaflip" (or whatever the actual project names are).
4. ALWAYS use mathematical evidence: "7 of the 15 required ${targetRole} keywords are present (47% match)", "0 quantified metrics found in 3 bullet points under LearnHyve internship".
5. summary fields must be 3-4 dense, specific sentences — NOT a paragraph of vague statements.
6. Each "reason" in missing_skills must explain the REAL BUSINESS/TECHNICAL CONSEQUENCE of the gap. Not what the candidate lacks — what will BREAK in production or interviews because of it.
7. improvement_plan actions must be ULTRA SPECIFIC to the ACTUAL resume text. Tell the candidate exactly which bullet to change, but you MUST base your suggestion strictly on the technologies and context present in their resume. DO NOT invent fake metrics or fake technologies (like "RepaintBoundary") unless they are heavily implied by the candidate's existing text.
8. rewrite_suggestions: pull the ACTUAL weak bullet text from the resume verbatim. Then rewrite it using the PAR format (Problem -> Action -> Result). If the candidate provided no numbers, tell them what KIND of number they need to find (e.g. "reduced load time by X%"). Do NOT invent fake hardcoded numbers like "34%". Use placeholders like [X]% or [Metric].

## STRICT SCORING METHODOLOGY (CRITICAL: DO NOT DEFAULT TO 70-80s, USE THE FULL 0-100 RANGE. BE BRUTAL AND EXACTING):

### EXPERIENCE (weight 30%):
- Start at 100. Deduct aggressively:
  - -20 if job titles/company domain is unrelated to "${targetRole}"
  - -15 if zero quantified achievements in experience section
  - -10 per year of experience gap vs. role seniority expectations
  - -5 if action verbs are weak (worked on, helped with, assisted)
- Write summary: "Score: X/100. [Job title] at [Company] is [related/unrelated] to ${targetRole} because [specific reason]. Experience spans [N] years in [domain], which [maps/does not map] to [specific required domain]. Deducted [X]pts for [specific reason]."

### PROJECTS (weight 20%):
- Start at 100. Deduct aggressively:
  - -10 per project with zero impact/outcome statement
  - -15 per project whose tech stack has zero overlap with ${targetRole} requirements
  - -20 if all projects are coursework/tutorials with no real users
- For each project found, create a projects_reviewed entry with: its actual name, a score, and a 2-sentence issue that cites what tech it used vs. what ${targetRole} needs.

### SKILLS (weight 25%):
- List EVERY skill word found in the resume verbatim.
- List the canonical required skills for ${targetRole}.
- Count matching skills. Score = (matches / required) * 100, capped at 100.
- present_skills: skills found verbatim in resume.
- missing_critical: top skills for ${targetRole} completely absent from resume.
- missing_nicetohave: secondary skills for ${targetRole} absent from resume.
- bonus_skills: skills in resume that are valuable but not required for ${targetRole}.

### IMPACT METRICS (weight 15%):
- Scan every bullet point. List every number, percentage, dollar amount, user count found.
- Score by count: 0=10pts, 1-2=30pts, 3-5=55pts, 6-9=75pts, 10+=90pts
- missing_metric_locations: name the EXACT section/company/project where metrics are absent. e.g. "LearnHyve internship — 3 bullets with zero numbers", "CropKart project — outcome section missing user count or performance data".

### ATS READABILITY (weight 10%):
- Check: standard headings (Education, Experience, Projects, Skills), no tables, no columns, readable fonts, keywords present.
- passed_checks: list what IS correct.
- issues: list what is wrong, with -15pt deduction per issue.

### KEYWORD MATCH:
- List the top 15 most important keywords for "${targetRole}".
- Check each one against the resume text (case-insensitive).
- matched: keywords found. missing: keywords not found.
- Score = (found / 15) * 100.

## OVERALL SCORE:
Formula: (experience * 0.30) + (skills * 0.25) + (projects * 0.20) + (impact_metrics * 0.15) + (ats_readability * 0.10)
Round to nearest integer.

## TONE RULES:
- overall_summary: Write like a senior recruiter talking to a hiring manager. Dense, specific, no filler.
- positives/negatives: Short, punchy, evidence-based. Cite names.
- strengths: Specific technical implementations found — cite the exact project/tool and what makes it impressive.
- ats_issues: State the exact problem and its ATS consequence (e.g., "Column-based layout detected — Workday ATS will parse skills into experience section, scrambling keyword positions").
- improvement_plan: Ordered by ROI. Priority 1 = biggest score gain per hour of work.

## RESPOND IN THIS EXACT JSON (no markdown, no text outside JSON):
{
  "overall_score": number,
  "overall_summary": "3-4 dense sentences citing specific resume evidence",
  "percentile_estimate": "Top X% among ${targetRole} applicants at this experience level",
  "sections": {
    "experience": {
      "score": number,
      "summary": "3 sentences: title/company relevance, years/domain match, specific deductions made",
      "positives": ["cite specific company/title/action that works"],
      "negatives": ["cite specific missing element with point deduction explained"]
    },
    "projects": {
      "score": number,
      "summary": "Name each project, its tech stack relevance, and what outcome data is missing",
      "projects_reviewed": [
        {"name": "exact project name from resume", "score": number, "issue": "2 sentences: Deeply analyze the ACTUAL technologies mentioned in this project against what a ${targetRole} needs. Do NOT use generic statements."}
      ]
    },
    "skills": {
      "score": number,
      "present_skills": ["skill1", "skill2"],
      "missing_critical": ["critical skill absent from resume"],
      "missing_nicetohave": ["nice-to-have skill absent"],
      "bonus_skills": ["valuable skill in resume but not required for ${targetRole}"]
    },
    "impact_metrics": {
      "score": number,
      "metrics_found": ["exact quoted metric from resume, e.g. '4.2 rating on Play Store'"],
      "missing_metric_locations": ["'LearnHyve — App Development Intern': 3 bullets, 0 numbers found"]
    },
    "ats_readability": {
      "score": number,
      "issues": ["specific ATS formatting problem and its consequence"],
      "passed_checks": ["specific thing that is correct and ATS-safe"]
    },
    "keyword_match": {
      "score": number,
      "matched": ["keyword found in resume"],
      "missing": ["important keyword for ${targetRole} not in resume"]
    }
  },
  "strengths": [
    "Specific technical achievement: cite project name + what exactly is impressive + why it signals competence",
    "Another specific strength with evidence"
  ],
  "ats_issues": [
    "Specific ATS issue: what it is, where it occurs in the resume, what the ATS consequence is",
    "Second ATS issue"
  ],
  "missing_skills": [
    {
      "skill": "Exact skill name",
      "severity": "HIGH",
      "reason": "In ${targetRole} interviews, you WILL be asked to [specific scenario]. Without [skill], the candidate cannot [specific technical thing], which means [concrete consequence in job/interviews]. This is not a nice-to-have — [company type] will screen out candidates without this in round 1."
    }
  ],
  "improvement_plan": [
    {
      "priority": 1,
      "action": "Ultra-specific action: explicitly name the project/bullet from the resume. Suggest a realistic technical improvement they can make to the text based ONLY on the context they provided.",
      "impact": "Explain how this fixes a critical ATS issue or aligns better with ${targetRole} requirements."
    }
  ],
  "rewrite_suggestions": [
    {
      "original": "exact weak bullet copied directly from the resume text",
      "improved": "Rewritten version using PAR framework. Do NOT hallucinate fake facts. Use placeholders like [Number]% or [Metric] to show the candidate where they need to insert their own data."
    }
  ]
}

RESUME TEXT TO ANALYZE:
---
${resumeText}
---`;

    try {
      const messages: any = [
        {
          role: "system",
          content: "You are a senior technical recruiter. Output ONLY valid JSON. No markdown fences. No text before or after the JSON object. Cite specific resume content by name in every field. Never repeat the same sentence structure twice."
        },
        { role: "user", content: prompt },
      ];
      
      const raw = await hfChat(messages, { temperature: 0.65, maxTokens: 8000 });
      const cleaned = cleanJSON(raw);
      output = JSON.parse(cleaned) as AdvancedResumeAnalysisOutput;
    } catch (err) {
      console.error("AI Evaluation failed:", err);
      throw new Error("Analysis model failed. Please retry in a moment.");
    }

    const resources = resourcesForSkills(output.missing_skills.map((g) => g.skill), 8);

    return NextResponse.json({
      result: {
        ...output,
        targetRole,
      },
      extractedTextPreview: resumeText.slice(0, 2400),
      extractionMethod: extracted.method,
      extractionWarning: extracted.warning || null,
      trustedResources: resources,
    });
  } catch (err) {
    console.error("[/api/resume-analysis]", err);
    return NextResponse.json(
      { error: `Resume analysis failed. ${(err as Error)?.message || "Please retry."}` },
      { status: 500 }
    );
  }
}
