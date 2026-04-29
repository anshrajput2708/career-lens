export interface ResumeLearningResource {
  title: string;
  provider: string;
  url: string;
  tags: string[];
}

export const TRUSTED_RESOURCES: ResumeLearningResource[] = [
  {
    title: "Google Tech Dev Guide",
    provider: "Google",
    url: "https://techdevguide.withgoogle.com/",
    tags: ["algorithms", "data structures", "coding interviews", "problem solving"],
  },
  {
    title: "AWS Skill Builder",
    provider: "AWS",
    url: "https://explore.skillbuilder.aws/learn",
    tags: ["cloud", "aws", "system design", "devops"],
  },
  {
    title: "Kubernetes Documentation",
    provider: "Kubernetes",
    url: "https://kubernetes.io/docs/home/",
    tags: ["kubernetes", "containers", "devops", "cloud"],
  },
  {
    title: "React Official Docs",
    provider: "React",
    url: "https://react.dev/learn",
    tags: ["react", "frontend", "javascript", "typescript", "web"],
  },
  {
    title: "TypeScript Handbook",
    provider: "TypeScript",
    url: "https://www.typescriptlang.org/docs/",
    tags: ["typescript", "javascript", "frontend", "backend"],
  },
  {
    title: "MDN Web Docs",
    provider: "MDN",
    url: "https://developer.mozilla.org/",
    tags: ["javascript", "css", "html", "frontend", "web"],
  },
  {
    title: "PostgreSQL Documentation",
    provider: "PostgreSQL",
    url: "https://www.postgresql.org/docs/",
    tags: ["sql", "databases", "backend", "data"],
  },
  {
    title: "Pandas User Guide",
    provider: "Pandas",
    url: "https://pandas.pydata.org/docs/user_guide/index.html",
    tags: ["python", "data analysis", "data", "analytics"],
  },
  {
    title: "Hugging Face Course",
    provider: "Hugging Face",
    url: "https://huggingface.co/learn",
    tags: ["nlp", "llm", "machine learning", "ai"],
  },
  {
    title: "PyTorch Tutorials",
    provider: "PyTorch",
    url: "https://pytorch.org/tutorials/",
    tags: ["deep learning", "machine learning", "ai", "python"],
  },
  {
    title: "Designing Data-Intensive Applications (overview)",
    provider: "DDIA",
    url: "https://dataintensive.net/",
    tags: ["system design", "distributed systems", "backend", "architecture"],
  },
  {
    title: "OWASP Top 10",
    provider: "OWASP",
    url: "https://owasp.org/www-project-top-ten/",
    tags: ["security", "appsec", "backend", "web"],
  },
  {
    title: "Roadmap.sh",
    provider: "roadmap.sh",
    url: "https://roadmap.sh/",
    tags: ["frontend", "backend", "devops", "security", "data", "architecture"],
  },
];

export function resourcesForSkills(skills: string[], limit = 6): ResumeLearningResource[] {
  const wanted = skills
    .flatMap((s) => s.toLowerCase().split(/[^a-z0-9+.#-]+/g))
    .filter((t) => t.length > 2);

  const scored = TRUSTED_RESOURCES.map((r) => {
    const score = r.tags.reduce((acc, tag) => {
      const t = tag.toLowerCase();
      return acc + (wanted.some((w) => t.includes(w) || w.includes(t)) ? 1 : 0);
    }, 0);
    return { r, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, limit).map((x) => x.r);
  if (picked.length >= Math.min(limit, 3)) return picked;

  // Backfill with broad, trusted resources.
  const seen = new Set(picked.map((p) => p.url));
  for (const r of TRUSTED_RESOURCES) {
    if (!seen.has(r.url)) picked.push(r);
    if (picked.length >= limit) break;
  }
  return picked;
}
