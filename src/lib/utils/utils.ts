export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatSalary(amount: number, currency = "₹"): string {
  if (amount >= 100000) {
    return `${currency}${(amount / 100000).toFixed(1)}L`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 60) return "var(--accent-amber)";
  return "var(--primary)";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent fit";
  if (score >= 60) return "Strong match";
  if (score >= 40) return "Solid foundation";
  return "Emerging path";
}

export function getTransitionLabel(months: number): string {
  if (months <= 3) return "as little as 3 months";
  if (months <= 6) return `${months} months`;
  if (months <= 12) return `${months} months`;
  return `${Math.ceil(months / 12)} year${months > 12 ? "s" : ""}`;
}
