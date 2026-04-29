"use client";

import React from "react";
import { ArrowRight, Terminal } from "lucide-react";

// Same comprehensive 26 career paths
const careers = [
  { title: "Frontend Developer", category: "Web", tags: ["UI", "React", "CSS"] },
  { title: "Backend Developer", category: "Web", tags: ["APIs", "Node", "DBs"] },
  { title: "Full Stack", category: "Web", tags: ["Next.js", "Systems"] },
  { title: "DevOps Engineer", category: "Infra", tags: ["CI/CD", "AWS", "Docker"] },
  { title: "DevSecOps", category: "Infra", tags: ["Security", "Pipelines"] },
  { title: "Data Analyst", category: "Data", tags: ["SQL", "Dashboards"] },
  { title: "AI Engineer", category: "AI", tags: ["LLMs", "RAG"] },
  { title: "AI & Data Scientist", category: "AI", tags: ["Models", "Stats"] },
  { title: "Data Engineer", category: "Data", tags: ["ETL", "Hadoop"] },
  { title: "Android", category: "Mobile", tags: ["Kotlin", "Jetpack"] },
  { title: "Machine Learning", category: "AI", tags: ["PyTorch", "Serving"] },
  { title: "PostgreSQL", category: "Data", tags: ["Database", "SQL"] },
  { title: "iOS", category: "Mobile", tags: ["Swift", "SwiftUI"] },
  { title: "Blockchain", category: "Emerging", tags: ["Web3", "EVM"] },
  { title: "QA", category: "Web", tags: ["Testing", "Cypress"] },
  { title: "Software Architect", category: "Infra", tags: ["Design", "Scale"] },
  { title: "Cyber Security", category: "Infra", tags: ["Defense", "Networks"] },
  { title: "UX Design", category: "Design", tags: ["Wireframes", "Research"] },
  { title: "Technical Writer", category: "Product", tags: ["Docs", "Markdown"] },
  { title: "Game Developer", category: "Emerging", tags: ["Unity", "C#"] },
  { title: "Server Side Game Dev", category: "Emerging", tags: ["Multiplayer", "C++"] },
  { title: "MLOps", category: "AI", tags: ["Deploy", "Monitor"] },
  { title: "Product Manager", category: "Product", tags: ["Strategy", "Roadmap"] },
  { title: "Engineering Manager", category: "Management", tags: ["Leadership", "Agile"] },
  { title: "Developer Relations", category: "Product", tags: ["Community", "Content"] },
  { title: "BI Analyst", category: "Data", tags: ["Business", "Insights"] }
];

function getSlug(title: string) {
  return title.toLowerCase().replace(/ /g, "-").replace(/&-/g, "").replace(/and-/g, "");
}

// Maps category strings to our native badge classes
function getBadgeClass(category: string) {
  if (category === "AI" || category === "Infra") return "badge-primary"; // purple/indigo
  if (category === "Data" || category === "Web") return "badge-green";
  if (category === "Mobile" || category === "Emerging") return "badge-amber";
  return "badge-primary"; // fallback
}

export default function CareerRoadmapLinks() {
  return (
    <section className="section relative overflow-hidden" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Background Orbs leveraging native globals.css variables */}
      <div className="orb orb-purple opacity-40 blur-[100px] top-[-10%]" style={{ width: '600px', height: '600px', left: '-10%' }} />
      <div className="orb orb-blue opacity-30 blur-[100px] bottom-[10%]" style={{ width: '500px', height: '500px', right: '-10%' }} />
      <div className="noise-overlay" />
      <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />

      <div className="container relative z-10 pt-16">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Explore <span className="gradient-text">Role-based</span> Roadmaps
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
            Dive straight into comprehensive curriculum mapped for specific industry tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {careers.map((career, index) => (
            <a
              key={career.title}
              href={`https://roadmap.sh/${getSlug(career.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group flex flex-col items-start p-6 cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards`,
                animationDelay: `${index * 0.03}s`,
                opacity: 0,
                transform: 'translateY(24px)'
              }}
            >
              {/* Native skill badge mapping */}
              <div className={`badge ${getBadgeClass(career.category)} mb-6 group-hover:shadow-[0_0_15px_var(--primary-soft)] transition-all`}>
                 <Terminal size={12} className="opacity-70" /> {career.category}
              </div>

              {/* Native font-display mapped implicitly via heading classes or explicitly inline */}
              <h3 className="text-xl font-bold mb-3 transition-colors duration-300" 
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {career.title}
              </h3>

              {/* Native tags mapping */}
              <div className="flex flex-wrap gap-2 mt-auto pt-6 w-full relative">
                {career.tags.map(tag => (
                  <span key={tag} className="skill-tag text-[11px] px-2 py-1 bg-[var(--bg-overlay)] border-[var(--border)] rounded-md">
                    {tag}
                  </span>
                ))}

                {/* Animated native arrow interaction */}
                <span className="absolute right-0 bottom-0 p-2 rounded-full bg-[var(--border-bright)] opacity-0 group-hover:opacity-100 group-hover:bg-[var(--primary)] transition-all duration-300 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 shadow-lg">
                  <ArrowRight size={16} color="white" />
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
