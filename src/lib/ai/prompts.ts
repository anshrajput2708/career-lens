
export function buildRoadmapPrompt(career: string, missingSkills: string[], currentSkills: string[]): string {
  return `You are Career Lens roadmap engine, acting as a highly technical, rigorous industry professor and mentor. Create a detailed 12-week learning roadmap for someone transitioning to become a ${clean(career)}.

Their current skills: ${currentSkills.map(clean).join(", ")}
Skills they need to build: ${missingSkills.map(clean).join(", ")}

Create 12 weekly modules. Each week MUST be highly specific and deeply technical. Act like a professor guiding a student through advanced engineering concepts. DO NOT give generic "watch tutorials" advice. You must explain the underlying systemic concepts they need to master, the exact architectural paradigms, and the specific industry terminology.

Return ONLY valid JSON matching this exact schema:
{
  "weeks": [
    {
      "week": 1,
      "title": "Week title (e.g., State Management & Context API Architecture)",
      "description": "A deeply technical, profoundly dense 1-2 sentence explanation of EXACTLY what algorithmic paradigms and system architectures they will learn this week. DO NOT exceed 2 sentences.",
      "skills": ["specific technical skill 1", "specific architecture skill 2"],
      "resources": [
        {"title": "Specific Course or Book Name", "url": "https://...", "type": "video|course|article|project"},
        {"title": "Specific Architecture Documentation", "url": "https://...", "type": "video|course|article|project"}
      ],
      "milestone": "A highly specific, rigorous engineering milestone (e.g., 'Deploy a Redis and PostgreSQL backed microservice to AWS EC2 using Terraform')"
    }
  ]
}`;
}

// ── Input sanitizer ──────────────────────────────────────────────────────────
function clean(text: string | undefined | null): string {
  if (!text) return "Not specified";
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")  // strip control chars
    .replace(/[`{}]/g, "")                             // strip template-injection chars
    .trim()
    .slice(0, 200) || "Not specified";
}

export function buildSalaryPrompt(career: string, city: string): string {
  return `You are Career Lens salary intelligence. Provide realistic, current salary data for a ${clean(career)} in ${clean(city)}, India (in INR).
Be specific and realistic based on the actual market. Entry level = 0-1yr experience. 

Return ONLY valid JSON matching this exact schema:
{
  "career": "${clean(career)}",
  "city": "${clean(city)}",
  "entry": {"min": 500000, "max": 800000},
  "oneYear": {"min": 800000, "max": 1400000},
  "threeYears": {"min": 1400000, "max": 2500000},
  "currency": "INR",
  "insights": [
    "Specific insight about this role in this city",
    "Growth trajectory insight",
    "Skills that command a premium"
  ]
}`;
}
