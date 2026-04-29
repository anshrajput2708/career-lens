import { NextRequest } from "next/server";
import { hfChat } from "@/lib/services/huggingface";
import { buildRoadmapPrompt } from "@/lib/ai/prompts";
import type { RoadmapWeek } from "@/lib/utils/storage";

const isDemoMode = process.env.NODE_ENV === "development" && !process.env.HUGGINGFACE_API_KEY;

const DEMO_ROADMAP: RoadmapWeek[] = [
  {
    week: 1, title: "Foundation & Orientation",
    description: "Understand the fundamentals of your target role and set up your learning environment.",
    skills: ["Industry overview", "Role expectations", "Learning tools"],
    resources: [
      { title: "Google Career Certificates — Introduction", url: "https://grow.google/certificates/", type: "course" },
      { title: "What Does a Product Manager Actually Do? (YouTube)", url: "https://www.youtube.com/results?search_query=what+does+a+product+manager+do", type: "video" },
      { title: "Read: 'Inspired' by Marty Cagan — Ch. 1-3", url: "https://www.svpg.com/inspired-how-to-create-products-customers-love/", type: "article" },
    ],
    milestone: "Can articulate the role scope and daily tasks with confidence",
  },
  {
    week: 2, title: "Core Skill #1 — Deep Dive",
    description: "Build your first foundational skill from zero with structured practice.",
    skills: ["Skill fundamentals", "Hands-on practice"],
    resources: [
      { title: "Coursera: Skill Fundamentals (Week 1)", url: "https://www.coursera.org", type: "course" },
      { title: "Practice Project: Beginner Exercise", url: "https://www.kaggle.com", type: "project" },
    ],
    milestone: "Complete first mini-project demonstrating the skill",
  },
  {
    week: 3, title: "Core Skill #2 — Hands On",
    description: "Apply what you've learned in a more complex real-world context.",
    skills: ["Applied practice", "Portfolio foundation"],
    resources: [
      { title: "YouTube: 1-hour Deep Dive Tutorial", url: "https://youtube.com", type: "video" },
      { title: "Build: Your First Portfolio Piece", url: "https://github.com", type: "project" },
    ],
    milestone: "First portfolio piece ready to share",
  },
  {
    week: 4, title: "Industry Tools Mastery",
    description: "Get hands-on with the actual tools professionals use daily.",
    skills: ["Tool proficiency", "Workflow setup"],
    resources: [
      { title: "Official Tool Documentation & Tutorials", url: "https://www.notion.so", type: "article" },
      { title: "LinkedIn Learning: Tool Masterclass", url: "https://www.linkedin.com/learning/", type: "course" },
    ],
    milestone: "Completed tool certification or project using industry tools",
  },
  {
    week: 5, title: "Real-World Application",
    description: "Take on a realistic project that mimics actual work in your target role.",
    skills: ["Project execution", "Problem solving"],
    resources: [
      { title: "Case study: Analyze a real company's product/strategy", url: "https://www.producthunt.com", type: "project" },
      { title: "YouTube: How professionals actually work", url: "https://youtube.com", type: "video" },
    ],
    milestone: "Case study analysis complete and documented",
  },
  {
    week: 6, title: "Portfolio Sprint",
    description: "Build your second portfolio piece, more ambitious than the first.",
    skills: ["Portfolio building", "Presentation skills"],
    resources: [
      { title: "GitHub: Open source contribution or personal project", url: "https://github.com", type: "project" },
      { title: "Dribbble / Behance: Industry inspiration", url: "https://dribbble.com", type: "article" },
    ],
    milestone: "Two portfolio pieces complete, published online",
  },
  {
    week: 7, title: "Advanced Concepts",
    description: "Push into intermediate-level concepts that set you apart from other beginners.",
    skills: ["Advanced technique", "Depth of knowledge"],
    resources: [
      { title: "Udemy: Advanced Course (bestseller)", url: "https://www.udemy.com", type: "course" },
      { title: "Article: Advanced patterns and best practices", url: "https://medium.com", type: "article" },
    ],
    milestone: "Can discuss advanced topics in an interview setting",
  },
  {
    week: 8, title: "Network & Visibility",
    description: "Start building your presence in the community and connecting with people in your target role.",
    skills: ["Networking", "Personal branding"],
    resources: [
      { title: "LinkedIn profile optimization guide", url: "https://linkedin.com", type: "article" },
      { title: "Join 2 online communities in your target field", url: "https://discord.com", type: "article" },
    ],
    milestone: "LinkedIn updated, connected with 5 people in target role",
  },
  {
    week: 9, title: "Mock Projects & Feedback",
    description: "Get real feedback on your work from the community or a mentor.",
    skills: ["Iteration", "Learning from feedback"],
    resources: [
      { title: "Post your work on Reddit/Discord for critique", url: "https://reddit.com", type: "project" },
      { title: "Schedule an informational interview with someone in the role", url: "https://linkedin.com", type: "article" },
    ],
    milestone: "Feedback received and incorporated into portfolio",
  },
  {
    week: 10, title: "Certification Sprint",
    description: "Earn a recognized credential that validates your new skills.",
    skills: ["Certification", "Credential building"],
    resources: [
      { title: "Google / HubSpot / Meta certification exam prep", url: "https://grow.google/certificates/", type: "course" },
      { title: "Practice exams and mock tests", url: "https://www.coursera.org", type: "course" },
    ],
    milestone: "Certification exam passed and badge shared on LinkedIn",
  },
  {
    week: 11, title: "Interview Prep",
    description: "Prepare specifically for interviews in your target role — common questions, frameworks, and answers.",
    skills: ["Interview readiness", "Storytelling"],
    resources: [
      { title: "Glassdoor: Role-specific interview questions", url: "https://www.glassdoor.co.in", type: "article" },
      { title: "YouTube: Mock interview walkthroughs", url: "https://www.youtube.com", type: "video" },
    ],
    milestone: "Completed 3 mock interviews, answers polished",
  },
  {
    week: 12, title: "Launch Week",
    description: "Apply to your first 10 target roles. Your portfolio, resume, and profile are ready.",
    skills: ["Job search strategy", "Application execution"],
    resources: [
      { title: "Resume template for your target role", url: "https://www.canva.com/resumes/", type: "article" },
      { title: "LinkedIn Easy Apply + target company list", url: "https://linkedin.com/jobs", type: "article" },
    ],
    milestone: "10 applications submitted. You're officially in transition.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { career, missingSkills, currentSkills } = await req.json();

    if (isDemoMode) {
      return Response.json({ weeks: DEMO_ROADMAP, demo: true });
    }

    const prompt = buildRoadmapPrompt(career, missingSkills, currentSkills);
    const raw = await hfChat([
      { role: "system", content: "You are an expert learning path designer. Return valid JSON only." },
      { role: "user", content: prompt },
    ], { temperature: 0.2, maxTokens: 1200 });
    
    // clean json
    let cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) cleaned = cleaned.slice(start, end + 1);

    const parsed = JSON.parse(cleaned);
    return Response.json({ weeks: parsed.weeks || DEMO_ROADMAP });
  } catch (err) {
    console.error("[/api/roadmap]", err);
    return Response.json({ weeks: DEMO_ROADMAP, demo: true });
  }
}
