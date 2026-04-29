"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ExternalLink, ArrowLeft, Check, Filter,
  Code2, Server, Layers, GitBranch, Palette, BarChart2,
  Brain, Cpu, Database, Smartphone, Zap, TestTube2,
  Shield, Target, Bitcoin, Gamepad2, FileText, Trophy, Star,
} from "lucide-react";
import { getCareerProgress, toggleResourceDone, getProgress } from "@/lib/utils/progress";

// ── Types ─────────────────────────────────────────────────────────────────────
type ResourceType = "free" | "premium" | "book" | "youtube";

interface Resource {
  name: string;
  desc: string;
  type: ResourceType;
  url: string;
  stage?: "foundation" | "core" | "advanced" | "production" | "mastery";
  timeEstimate?: string;
  whyNow?: string;
}

interface CareerResources {
  career: string;
  domain: string;
  icon: React.ReactNode;
  topics: string[];
  difficulty: "Beginner Friendly" | "Intermediate" | "Advanced First";
  resources: Resource[];
}

// ── Stage Config ──────────────────────────────────────────────────────────────
const STAGES = ["foundation", "core", "advanced", "production", "mastery"] as const;
const STAGE_LABELS: Record<string, string> = {
  foundation: "Foundation",
  core: "Core Skills",
  advanced: "Advanced",
  production: "Production",
  mastery: "Mastery",
};

// ── Badge config ──────────────────────────────────────────────────────────────
const TYPE_META: Record<ResourceType, { label: string; color: string }> = {
  free: { label: "Free", color: "var(--accent-green)" },
  premium: { label: "Course", color: "var(--primary)" },
  book: { label: "Book", color: "var(--accent-amber)" },
  youtube: { label: "Video", color: "#c0392b" },
};

// ── Career Data ───────────────────────────────────────────────────────────────
const CAREERS: CareerResources[] = [
  {
    career: "Frontend Developer", domain: "Product & Design",
    icon: <Code2 size={20} />, topics: ["React", "CSS", "Performance"],
    difficulty: "Beginner Friendly",
    resources: [
      { name: "The Odin Project", desc: "Full free curriculum, HTML to React", type: "free", url: "https://www.theodinproject.com", stage: "foundation", timeEstimate: "3 months", whyNow: "Build fundamentals from scratch with real projects" },
      { name: "JavaScript.info", desc: "Modern JS from basics to advanced", type: "free", url: "https://javascript.info", stage: "foundation", timeEstimate: "2 months", whyNow: "Deep JS understanding is non-negotiable" },
      { name: "CSS Tricks", desc: "Best CSS reference & tutorials", type: "free", url: "https://css-tricks.com", stage: "core", timeEstimate: "Ongoing", whyNow: "Master layout, grid, and modern CSS techniques" },
      { name: "Frontend Masters", desc: "Premium deep-dive video courses", type: "premium", url: "https://frontendmasters.com", stage: "advanced", timeEstimate: "6 months", whyNow: "Expert-level courses from industry practitioners" },
      { name: "Traversy Media", desc: "YouTube — practical project tutorials", type: "youtube", url: "https://youtube.com/@TraversyMedia", stage: "core", timeEstimate: "Ongoing", whyNow: "Build real projects alongside explanations" },
      { name: "You Don't Know JS", desc: "Kyle Simpson's free book series on GitHub", type: "book", url: "https://github.com/getify/You-Dont-Know-JS", stage: "advanced", timeEstimate: "2 months", whyNow: "Understand JS engine internals and closures" },
    ],
  },
  {
    career: "Backend Developer", domain: "Systems & Infrastructure",
    icon: <Server size={20} />, topics: ["Node.js", "APIs", "Databases"],
    difficulty: "Intermediate",
    resources: [
      { name: "roadmap.sh/backend", desc: "Structured backend learning path", type: "free", url: "https://roadmap.sh/backend", stage: "foundation", timeEstimate: "1 week", whyNow: "Map out the entire learning journey first" },
      { name: "freeCodeCamp Backend", desc: "Free certification with projects", type: "free", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", stage: "foundation", timeEstimate: "2 months", whyNow: "Hands-on API building from day one" },
      { name: "The Net Ninja", desc: "YouTube — Node, Express, MongoDB", type: "youtube", url: "https://youtube.com/@NetNinja", stage: "core", timeEstimate: "1 month", whyNow: "Visual learner? This is the fastest path" },
      { name: "Udemy — NodeJS by Jonas", desc: "Most thorough backend course", type: "premium", url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/", stage: "advanced", timeEstimate: "4 weeks", whyNow: "Production patterns, auth, payments, deployment" },
      { name: "Node.js Design Patterns", desc: "Best book for production-level Node", type: "book", url: "https://www.nodejsdesignpatterns.com", stage: "production", timeEstimate: "3 months", whyNow: "Write maintainable, scalable server code" },
    ],
  },
  {
    career: "Full Stack Developer", domain: "Product & Design",
    icon: <Layers size={20} />, topics: ["MERN", "Deployment", "Auth"],
    difficulty: "Intermediate",
    resources: [
      { name: "Full Stack Open", desc: "Helsinki Uni — best free full stack course", type: "free", url: "https://fullstackopen.com", stage: "foundation", timeEstimate: "4 months", whyNow: "The single best free full-stack curriculum" },
      { name: "Fireship.io", desc: "YouTube — fast-paced modern web dev", type: "youtube", url: "https://youtube.com/@Fireship", stage: "core", timeEstimate: "Ongoing", whyNow: "Stay current with the latest tools & frameworks" },
      { name: "Udemy — MERN by Colt Steele", desc: "MongoDB, Express, React, Node", type: "premium", url: "https://www.udemy.com/course/the-web-developer-bootcamp/", stage: "core", timeEstimate: "2 months", whyNow: "Build a complete project end-to-end" },
      { name: "Full Stack for Front-End Devs", desc: "Frontend Masters — deep & practical", type: "premium", url: "https://frontendmasters.com/courses/fullstack-v3/", stage: "advanced", timeEstimate: "2 weeks", whyNow: "Bridge the gap from frontend to backend" },
    ],
  },
  {
    career: "DevOps Engineer", domain: "Systems & Infrastructure",
    icon: <GitBranch size={20} />, topics: ["Docker", "CI/CD", "K8s"],
    difficulty: "Advanced First",
    resources: [
      { name: "Play with Docker", desc: "Free browser-based Docker playground", type: "free", url: "https://labs.play-with-docker.com", stage: "foundation", timeEstimate: "1 week", whyNow: "Instant Docker environment, zero setup" },
      { name: "Linux Foundation Courses", desc: "Free & paid, official certifications", type: "free", url: "https://training.linuxfoundation.org", stage: "foundation", timeEstimate: "2 months", whyNow: "Linux mastery is the foundation of DevOps" },
      { name: "TechWorld with Nana", desc: "YouTube — Docker, K8s, CI/CD explained", type: "youtube", url: "https://youtube.com/@TechWorldwithNana", stage: "core", timeEstimate: "Ongoing", whyNow: "Best visual explanations of DevOps concepts" },
      { name: "KodeKloud", desc: "Best hands-on DevOps labs & courses", type: "premium", url: "https://kodekloud.com", stage: "advanced", timeEstimate: "6 months", whyNow: "Actual labs with real infrastructure" },
      { name: "The Phoenix Project", desc: "Must-read DevOps novel/book", type: "book", url: "https://itrevolution.com/product/the-phoenix-project/", stage: "production", timeEstimate: "2 weeks", whyNow: "Understand DevOps culture and philosophy" },
    ],
  },
  {
    career: "UX Designer", domain: "Product & Design",
    icon: <Palette size={20} />, topics: ["Figma", "Research", "Systems"],
    difficulty: "Beginner Friendly",
    resources: [
      { name: "Figma Learn", desc: "Official free Figma tutorials", type: "free", url: "https://help.figma.com/hc/en-us/categories/360002051613", stage: "foundation", timeEstimate: "2 weeks", whyNow: "Tool mastery comes first in UX" },
      { name: "Laws of UX", desc: "Free reference — design principles", type: "free", url: "https://lawsofux.com", stage: "foundation", timeEstimate: "1 day", whyNow: "Internalize the psychological foundations" },
      { name: "NN/g Articles", desc: "Nielsen Norman Group — research-backed UX", type: "free", url: "https://www.nngroup.com/articles/", stage: "core", timeEstimate: "Ongoing", whyNow: "Evidence-based design decisions" },
      { name: "AJ&Smart", desc: "YouTube — design sprints, UX career", type: "youtube", url: "https://youtube.com/@AJSmart", stage: "core", timeEstimate: "Ongoing", whyNow: "Learn design sprint methodology" },
      { name: "Google UX Design Certificate", desc: "Coursera — most recognized UX cert", type: "premium", url: "https://www.coursera.org/professional-certificates/google-ux-design", stage: "advanced", timeEstimate: "6 months", whyNow: "Industry-recognized credential" },
      { name: "Don't Make Me Think", desc: "Steve Krug's classic UX book", type: "book", url: "https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515", stage: "production", timeEstimate: "1 week", whyNow: "The bible of web usability" },
    ],
  },
  {
    career: "Data Analyst", domain: "Data & AI",
    icon: <BarChart2 size={20} />, topics: ["SQL", "Python", "Viz"],
    difficulty: "Beginner Friendly",
    resources: [
      { name: "Mode SQL Tutorial", desc: "Free interactive SQL for analysts", type: "free", url: "https://mode.com/sql-tutorial/", stage: "foundation", timeEstimate: "2 weeks", whyNow: "SQL is the daily language of every analyst" },
      { name: "Kaggle Learn", desc: "Free micro-courses — SQL, pandas, viz", type: "free", url: "https://www.kaggle.com/learn", stage: "core", timeEstimate: "1 month", whyNow: "Hands-on practice with real datasets" },
      { name: "Luke Barousse", desc: "YouTube — SQL, Python, Excel for data", type: "youtube", url: "https://youtube.com/@LukeBarousse", stage: "core", timeEstimate: "Ongoing", whyNow: "Practical, career-focused tutorials" },
      { name: "Google Data Analytics Certificate", desc: "Coursera — best entry-level cert", type: "premium", url: "https://www.coursera.org/professional-certificates/google-data-analytics", stage: "advanced", timeEstimate: "6 months", whyNow: "Structured pathway with portfolio projects" },
      { name: "Storytelling with Data", desc: "Best book on data visualization", type: "book", url: "https://www.storytellingwithdata.com/books", stage: "production", timeEstimate: "2 weeks", whyNow: "Transform data into compelling narratives" },
    ],
  },
  {
    career: "AI Engineer", domain: "Data & AI",
    icon: <Brain size={20} />, topics: ["LLMs", "RAG", "Fine-tuning"],
    difficulty: "Advanced First",
    resources: [
      { name: "DeepLearning.AI Short Courses", desc: "Free short courses by Andrew Ng", type: "free", url: "https://www.deeplearning.ai/short-courses/", stage: "foundation", timeEstimate: "2 weeks", whyNow: "The fastest on-ramp to modern AI" },
      { name: "fast.ai", desc: "Best free practical deep learning course", type: "free", url: "https://www.fast.ai", stage: "core", timeEstimate: "3 months", whyNow: "Top-down approach: build first, theory later" },
      { name: "Andrej Karpathy", desc: "YouTube — build GPT from scratch", type: "youtube", url: "https://youtube.com/@AndrejKarpathy", stage: "advanced", timeEstimate: "2 months", whyNow: "Understand transformers at the deepest level" },
      { name: "LangChain Docs", desc: "Free official docs & tutorials", type: "free", url: "https://python.langchain.com/docs/", stage: "production", timeEstimate: "Ongoing", whyNow: "The standard framework for LLM applications" },
      { name: "Hands-On LLMs Book", desc: "O'Reilly — production LLM engineering", type: "book", url: "https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/", stage: "mastery", timeEstimate: "3 months", whyNow: "Ship LLMs to production at scale" },
    ],
  },
  {
    career: "Data Scientist", domain: "Data & AI",
    icon: <Cpu size={20} />, topics: ["ML", "Stats", "Kaggle"],
    difficulty: "Intermediate",
    resources: [
      { name: "Kaggle Competitions", desc: "Free real-world data science practice", type: "free", url: "https://www.kaggle.com/competitions", stage: "foundation", timeEstimate: "Ongoing", whyNow: "Learn by competing on real problems" },
      { name: "StatQuest with Josh Starmer", desc: "YouTube — ML & stats made simple", type: "youtube", url: "https://youtube.com/@statquest", stage: "core", timeEstimate: "Ongoing", whyNow: "Statistics explained visually, brilliantly" },
      { name: "fast.ai ML Course", desc: "Free top-down practical ML", type: "free", url: "https://course.fast.ai", stage: "core", timeEstimate: "3 months", whyNow: "Build models before memorizing equations" },
      { name: "Udemy — ML by Kirill Eremenko", desc: "Most popular ML course on Udemy", type: "premium", url: "https://www.udemy.com/course/machinelearning/", stage: "advanced", timeEstimate: "2 months", whyNow: "Comprehensive coverage of all ML algorithms" },
      { name: "Hands-On ML with Scikit-Learn", desc: "Aurélien Géron — the definitive book", type: "book", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/", stage: "mastery", timeEstimate: "4 months", whyNow: "The definitive reference for ML practitioners" },
    ],
  },
  {
    career: "Data Engineer", domain: "Data & AI",
    icon: <Database size={20} />, topics: ["Spark", "Kafka", "dbt"],
    difficulty: "Advanced First",
    resources: [
      { name: "DataTalks.Club DE Zoomcamp", desc: "Free 9-week data engineering bootcamp", type: "free", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", stage: "foundation", timeEstimate: "9 weeks", whyNow: "The best structured DE learning path, period" },
      { name: "dbt Learn", desc: "Free official dbt courses", type: "free", url: "https://courses.getdbt.com", stage: "core", timeEstimate: "2 weeks", whyNow: "dbt is the standard for analytics engineering" },
      { name: "Databricks Academy", desc: "Free Spark & lakehouse training", type: "free", url: "https://www.databricks.com/learn/training/catalog", stage: "core", timeEstimate: "1 month", whyNow: "Spark is the engine behind big data" },
      { name: "Andreas Kretz", desc: "YouTube — data pipelines, Spark, Kafka", type: "youtube", url: "https://youtube.com/@andreaskayy", stage: "advanced", timeEstimate: "Ongoing", whyNow: "Real-world pipeline architecture walkthroughs" },
      { name: "Fundamentals of DE", desc: "Joe Reis — the standard DE book", type: "book", url: "https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/", stage: "production", timeEstimate: "2 months", whyNow: "Understand the full data engineering lifecycle" },
    ],
  },
  {
    career: "Android Developer", domain: "Platforms & Emerging",
    icon: <Smartphone size={20} />, topics: ["Kotlin", "Compose", "MVVM"],
    difficulty: "Intermediate",
    resources: [
      { name: "Android Developers Official", desc: "Google's free official Kotlin & Android docs", type: "free", url: "https://developer.android.com/courses", stage: "foundation", timeEstimate: "2 months", whyNow: "Official source, always up to date" },
      { name: "Philipp Lackner", desc: "YouTube — best Kotlin & Compose tutorials", type: "youtube", url: "https://youtube.com/@PhilippLackner", stage: "core", timeEstimate: "Ongoing", whyNow: "The most practical Android channel on YouTube" },
      { name: "Udemy — Android by Denis Panjuta", desc: "Complete Android development course", type: "premium", url: "https://www.udemy.com/course/android-development-with-kotlin/", stage: "advanced", timeEstimate: "2 months", whyNow: "Structured end-to-end app building" },
      { name: "Kotlin in Action", desc: "Best book for Kotlin language mastery", type: "book", url: "https://www.manning.com/books/kotlin-in-action", stage: "production", timeEstimate: "2 months", whyNow: "Master the language at a deeper level" },
    ],
  },
  {
    career: "iOS Developer", domain: "Platforms & Emerging",
    icon: <Smartphone size={20} />, topics: ["Swift", "SwiftUI", "UIKit"],
    difficulty: "Intermediate",
    resources: [
      { name: "100 Days of SwiftUI", desc: "Paul Hudson's free structured course", type: "free", url: "https://www.hackingwithswift.com/100/swiftui", stage: "foundation", timeEstimate: "100 days", whyNow: "Structured daily learning that actually works" },
      { name: "Apple Developer Tutorials", desc: "Official free SwiftUI tutorials", type: "free", url: "https://developer.apple.com/tutorials/swiftui", stage: "foundation", timeEstimate: "2 weeks", whyNow: "Learn from Apple's own documentation" },
      { name: "Sean Allen", desc: "YouTube — Swift, SwiftUI, iOS career", type: "youtube", url: "https://youtube.com/@SeanAllen", stage: "core", timeEstimate: "Ongoing", whyNow: "Career advice + practical Swift tutorials" },
      { name: "Stanford CS193p", desc: "Free iOS course on YouTube", type: "free", url: "https://cs193p.sites.stanford.edu", stage: "advanced", timeEstimate: "3 months", whyNow: "Stanford-quality CS education, completely free" },
      { name: "Udemy — iOS by Angela Yu", desc: "Most popular iOS bootcamp", type: "premium", url: "https://www.udemy.com/course/ios-13-app-development-bootcamp/", stage: "production", timeEstimate: "2 months", whyNow: "Build 25+ apps with step-by-step guidance" },
    ],
  },
  {
    career: "ML Engineer", domain: "Data & AI",
    icon: <Zap size={20} />, topics: ["MLOps", "Pipelines", "Deploy"],
    difficulty: "Advanced First",
    resources: [
      { name: "Made With ML", desc: "Free MLOps & production ML guide", type: "free", url: "https://madewithml.com", stage: "foundation", timeEstimate: "1 month", whyNow: "The best organized MLOps curriculum" },
      { name: "MLOps Zoomcamp", desc: "Free end-to-end ML in production course", type: "free", url: "https://github.com/DataTalksClub/mlops-zoomcamp", stage: "core", timeEstimate: "9 weeks", whyNow: "Hands-on pipeline building from scratch" },
      { name: "Weights & Biases Courses", desc: "Free ML experiment tracking courses", type: "free", url: "https://www.wandb.courses", stage: "advanced", timeEstimate: "2 weeks", whyNow: "Industry-standard experiment tracking" },
      { name: "Designing ML Systems", desc: "Chip Huyen — best book for ML engineers", type: "book", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/", stage: "production", timeEstimate: "2 months", whyNow: "Think architecturally about ML systems" },
    ],
  },
  {
    career: "QA Engineer", domain: "Systems & Infrastructure",
    icon: <TestTube2 size={20} />, topics: ["Playwright", "CI", "TDD"],
    difficulty: "Beginner Friendly",
    resources: [
      { name: "Software Testing Help", desc: "Free tutorials — manual & automation", type: "free", url: "https://www.softwaretestinghelp.com", stage: "foundation", timeEstimate: "2 weeks", whyNow: "Understand testing fundamentals first" },
      { name: "Test Automation University", desc: "Free Applitools QA courses", type: "free", url: "https://testautomationu.applitools.com", stage: "core", timeEstimate: "1 month", whyNow: "Free structured automation curriculum" },
      { name: "Playwright Docs", desc: "Free official browser testing framework", type: "free", url: "https://playwright.dev", stage: "advanced", timeEstimate: "2 weeks", whyNow: "The modern standard for E2E testing" },
      { name: "Agile Testing", desc: "Lisa Crispin — standard QA book", type: "book", url: "https://agiletesting.blogspot.com", stage: "production", timeEstimate: "1 month", whyNow: "Testing strategy in agile teams" },
    ],
  },
  {
    career: "Cyber Security", domain: "Systems & Infrastructure",
    icon: <Shield size={20} />, topics: ["Pen Testing", "Networks", "OWASP"],
    difficulty: "Intermediate",
    resources: [
      { name: "TryHackMe", desc: "Free gamified cybersecurity learning", type: "free", url: "https://tryhackme.com", stage: "foundation", timeEstimate: "2 months", whyNow: "Gamified learning makes security fun" },
      { name: "OWASP", desc: "Free web security standards & guides", type: "free", url: "https://owasp.org", stage: "core", timeEstimate: "Ongoing", whyNow: "The industry reference for web security" },
      { name: "Professor Messer", desc: "YouTube — free CompTIA Security+ prep", type: "youtube", url: "https://youtube.com/@professormesser", stage: "core", timeEstimate: "3 months", whyNow: "Best free Security+ preparation available" },
      { name: "HackTheBox Academy", desc: "Hands-on hacking labs & courses", type: "premium", url: "https://academy.hackthebox.com", stage: "advanced", timeEstimate: "6 months", whyNow: "Real penetration testing environments" },
      { name: "Web Application Hacker's Handbook", desc: "Classic penetration testing book", type: "book", url: "https://www.wiley.com/en-us/9781118026472", stage: "production", timeEstimate: "3 months", whyNow: "The definitive web hacking reference" },
    ],
  },
  {
    career: "Product Manager", domain: "Product & Design",
    icon: <Target size={20} />, topics: ["Strategy", "Analytics", "UX"],
    difficulty: "Beginner Friendly",
    resources: [
      { name: "Lenny's Newsletter", desc: "Best free PM newsletter & resources", type: "free", url: "https://www.lennysnewsletter.com", stage: "foundation", timeEstimate: "Ongoing", whyNow: "Stay connected to PM thinking from day one" },
      { name: "PM Exercises", desc: "Free PM interview practice problems", type: "free", url: "https://www.productmanagementexercises.com", stage: "core", timeEstimate: "Ongoing", whyNow: "Sharpen PM thinking through practice" },
      { name: "Product School", desc: "YouTube — PM skills & interviews", type: "youtube", url: "https://youtube.com/@ProductSchool", stage: "core", timeEstimate: "Ongoing", whyNow: "Learn from practicing product leaders" },
      { name: "Inspired by Marty Cagan", desc: "The definitive PM book", type: "book", url: "https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/", stage: "advanced", timeEstimate: "2 weeks", whyNow: "The bible of product management" },
      { name: "Reforge", desc: "Premium advanced PM programs", type: "premium", url: "https://www.reforge.com", stage: "mastery", timeEstimate: "3 months", whyNow: "Advanced strategy for senior PMs" },
    ],
  },
  {
    career: "Blockchain Developer", domain: "Platforms & Emerging",
    icon: <Bitcoin size={20} />, topics: ["Solidity", "Web3", "DeFi"],
    difficulty: "Advanced First",
    resources: [
      { name: "CryptoZombies", desc: "Free gamified Solidity learning", type: "free", url: "https://cryptozombies.io", stage: "foundation", timeEstimate: "1 week", whyNow: "The most fun way to learn Solidity" },
      { name: "Ethereum.org Docs", desc: "Official free Ethereum developer docs", type: "free", url: "https://ethereum.org/en/developers/", stage: "foundation", timeEstimate: "2 weeks", whyNow: "Authoritative reference for all things Ethereum" },
      { name: "Patrick Collins", desc: "YouTube — best free Solidity & Web3 course", type: "youtube", url: "https://youtube.com/@PatrickAlphaC", stage: "core", timeEstimate: "4 months", whyNow: "The most comprehensive free Web3 course" },
      { name: "Alchemy University", desc: "Free Web3 developer bootcamp", type: "free", url: "https://www.alchemy.com/university", stage: "advanced", timeEstimate: "2 months", whyNow: "Build and deploy real dApps" },
      { name: "Mastering Ethereum", desc: "Free book by Andreas Antonopoulos", type: "book", url: "https://github.com/ethereumbook/ethereumbook", stage: "production", timeEstimate: "3 months", whyNow: "Understand Ethereum at the protocol level" },
    ],
  },
  {
    career: "Game Developer", domain: "Platforms & Emerging",
    icon: <Gamepad2 size={20} />, topics: ["Unity", "C#", "Shaders"],
    difficulty: "Intermediate",
    resources: [
      { name: "Unity Learn", desc: "Official free Unity tutorials & courses", type: "free", url: "https://learn.unity.com", stage: "foundation", timeEstimate: "2 months", whyNow: "Start with the official curriculum" },
      { name: "Brackeys", desc: "YouTube — legendary Unity tutorials", type: "youtube", url: "https://youtube.com/@Brackeys", stage: "core", timeEstimate: "Ongoing", whyNow: "The GOAT of Unity YouTube tutorials" },
      { name: "GDQuest", desc: "Free & premium Godot/game dev lessons", type: "free", url: "https://www.gdquest.com", stage: "core", timeEstimate: "Ongoing", whyNow: "Open-source game dev education" },
      { name: "Udemy — Unreal by Ben Tristem", desc: "Most popular Unreal Engine course", type: "premium", url: "https://www.udemy.com/course/unrealcourse/", stage: "advanced", timeEstimate: "3 months", whyNow: "AAA game development with Unreal Engine" },
      { name: "Game Programming Patterns", desc: "Free online book — essential patterns", type: "book", url: "https://gameprogrammingpatterns.com", stage: "production", timeEstimate: "1 month", whyNow: "Write clean, maintainable game code" },
    ],
  },
  {
    career: "Technical Writer", domain: "Product & Design",
    icon: <FileText size={20} />, topics: ["Docs", "API Refs", "Style"],
    difficulty: "Beginner Friendly",
    resources: [
      { name: "Google Technical Writing Course", desc: "Free official writing fundamentals", type: "free", url: "https://developers.google.com/tech-writing", stage: "foundation", timeEstimate: "2 days", whyNow: "Google's own writing standards" },
      { name: "Write the Docs", desc: "Free community guides & resources", type: "free", url: "https://www.writethedocs.org/guide/", stage: "core", timeEstimate: "Ongoing", whyNow: "The largest tech writing community" },
      { name: "Divio Documentation System", desc: "Free — best-known docs framework", type: "free", url: "https://documentation.divio.com", stage: "advanced", timeEstimate: "1 day", whyNow: "The mental model for great documentation" },
      { name: "Docs for Developers", desc: "Best practical technical writing book", type: "book", url: "https://docsfordevelopers.com", stage: "production", timeEstimate: "2 weeks", whyNow: "End-to-end guide to docs that work" },
    ],
  },
];

// ── Hall of Fame ──────────────────────────────────────────────────────────────
const HALL_OF_FAME: Resource[] = [
  { name: "Attention Is All You Need", desc: "Vaswani et al. — The Transformer paper. Changed everything.", type: "free", url: "https://arxiv.org/abs/1706.03762", stage: "mastery", timeEstimate: "1 week", whyNow: "The foundation of every modern AI system" },
  { name: "MapReduce", desc: "Dean & Ghemawat — How Google processes the internet.", type: "free", url: "https://research.google/pubs/pub62/", stage: "mastery", timeEstimate: "3 days", whyNow: "The blueprint for distributed computing" },
  { name: "Bitcoin: A P2P Electronic Cash System", desc: "Satoshi Nakamoto — The whitepaper that started crypto.", type: "free", url: "https://bitcoin.org/bitcoin.pdf", stage: "mastery", timeEstimate: "2 hours", whyNow: "9 pages that created a trillion-dollar industry" },
  { name: "The Google File System", desc: "Ghemawat et al. — How to store data at planet scale.", type: "free", url: "https://research.google/pubs/pub51/", stage: "mastery", timeEstimate: "3 days", whyNow: "The architecture behind cloud storage" },
  { name: "Design Patterns: Gang of Four", desc: "Gamma et al. — The 23 patterns every dev must know.", type: "book", url: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/", stage: "mastery", timeEstimate: "3 months", whyNow: "Still the lingua franca of software architecture" },
];

// ── Domain Groupings ─────────────────────────────────────────────────────────
const DOMAINS = ["Systems & Infrastructure", "Data & AI", "Product & Design", "Platforms & Emerging"];

// ── Filter Types ──────────────────────────────────────────────────────────────
type NodeFilter = "all" | ResourceType;

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

// ── Career Card (Bento Grid) ─────────────────────────────────────────────────
function CareerCard({
  career, onClick, index, progress,
}: {
  career: CareerResources;
  onClick: () => void;
  index: number;
  progress: string[];
}) {
  const total = career.resources.length;
  const done = progress.length;
  const diffColor = career.difficulty === "Beginner Friendly" ? "var(--accent-green)" : career.difficulty === "Intermediate" ? "var(--accent-amber)" : "var(--accent-red)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "24px 24px 20px",
        cursor: "pointer",
        transition: "transform 0.2s, border-color 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-bright)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "var(--primary-soft)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--primary)",
        }}>
          {career.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
            {career.career}
          </h3>
          <span style={{ fontSize: 12, color: diffColor, fontWeight: 600 }}>{career.difficulty}</span>
        </div>
      </div>

      {/* Resource count */}
      <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
        {total} resources
      </span>

      {/* Topic pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {career.topics.map(t => (
          <span key={t} style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
            background: "var(--primary-soft)", color: "var(--primary)",
            letterSpacing: "0.02em",
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      {done > 0 && (
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>
              {done} of {total} complete
            </span>
          </div>
          <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(done / total) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ height: "100%", background: "var(--accent-green)", borderRadius: 999 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── SVG Connection Lines ──────────────────────────────────────────────────────
function ConnectionLines({ nodes, completed }: { nodes: { x: number; y: number }[]; completed: string[] }) {
  if (nodes.length < 2) return null;
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1];
        const midX = (node.x + next.x) / 2;
        const isDone = i < completed.length;
        return (
          <motion.path
            key={i}
            d={`M ${node.x} ${node.y} C ${midX} ${node.y}, ${midX} ${next.y}, ${next.x} ${next.y}`}
            fill="none"
            stroke={isDone ? "var(--accent-green)" : "var(--border)"}
            strokeWidth={isDone ? 2 : 1.5}
            strokeDasharray={isDone ? "none" : "6 4"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
}

// ── Resource Node ─────────────────────────────────────────────────────────────
function ResourceNode({
  resource, index, isDone, onToggleDone, onOpenDetail, totalInStage,
}: {
  resource: Resource;
  index: number;
  isDone: boolean;
  onToggleDone: () => void;
  onOpenDetail: () => void;
  totalInStage: number;
}) {
  const meta = TYPE_META[resource.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: isDone ? "rgba(4, 120, 87, 0.04)" : "var(--bg-surface)",
        border: `1.5px solid ${isDone ? "var(--accent-green)" : "var(--border)"}`,
        borderRadius: 14,
        padding: "18px 20px",
        width: 260,
        flexShrink: 0,
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s",
        position: "relative",
      }}
      onClick={onOpenDetail}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.borderColor = isDone ? "var(--accent-green)" : "var(--primary)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.borderColor = isDone ? "var(--accent-green)" : "var(--border)";
      }}
    >
      {/* Done toggle */}
      <button
        onClick={e => { e.stopPropagation(); onToggleDone(); }}
        style={{
          position: "absolute", top: 12, right: 12,
          width: 22, height: 22, borderRadius: 6,
          border: `1.5px solid ${isDone ? "var(--accent-green)" : "var(--border-bright)"}`,
          background: isDone ? "var(--accent-green)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        {isDone && <Check size={12} color="#fff" strokeWidth={3} />}
      </button>

      {/* Type badge */}
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
        color: meta.color, marginBottom: 8, display: "block",
      }}>
        {meta.label}
      </span>

      {/* Resource name */}
      <h4 style={{
        fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px",
        lineHeight: 1.3, paddingRight: 24,
        textDecoration: isDone ? "line-through" : "none",
        opacity: isDone ? 0.6 : 1,
      }}>
        {resource.name}
      </h4>

      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
        {resource.desc}
      </p>

      {/* Time estimate */}
      {resource.timeEstimate && (
        <span style={{
          display: "inline-block", marginTop: 10,
          fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
          padding: "2px 8px", borderRadius: 999,
          background: "var(--primary-soft)",
        }}>
          ⏱ {resource.timeEstimate}
        </span>
      )}
    </motion.div>
  );
}

// ── Node Detail Drawer ────────────────────────────────────────────────────────
function NodeDetailDrawer({
  resource, isDone, onToggleDone, onClose,
}: {
  resource: Resource;
  isDone: boolean;
  onToggleDone: () => void;
  onClose: () => void;
}) {
  const meta = TYPE_META[resource.type];

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderRadius: "20px 20px 0 0",
        padding: "28px 32px 32px",
        maxHeight: "50vh",
        overflowY: "auto",
        boxShadow: "0 -12px 48px rgba(0,0,0,0.08)",
      }}
    >
      {/* Handle bar */}
      <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--border)", margin: "0 auto 20px" }} />

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Type + Title */}
        <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>
          {meta.label}
        </span>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>
          {resource.name}
        </h3>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
          {resource.desc}
        </p>

        {/* Why now */}
        {resource.whyNow && (
          <div style={{
            background: "var(--primary-soft)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "14px 18px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Why at this stage
            </span>
            <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>
              {resource.whyNow}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <a
            href={resource.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: "var(--primary)", color: "#fff",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              cursor: "pointer", transition: "opacity 0.15s",
            }}
          >
            <ExternalLink size={14} />
            Open Resource
          </a>
          <button
            onClick={onToggleDone}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 22px", borderRadius: 12,
              border: `1.5px solid ${isDone ? "var(--accent-green)" : "var(--border-bright)"}`,
              background: isDone ? "var(--accent-green-soft)" : "transparent",
              color: isDone ? "var(--accent-green)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Check size={14} />
            {isDone ? "Completed" : "Mark as Done"}
          </button>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto", padding: "11px 22px", borderRadius: 12,
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-muted)", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function ResourcesPage() {
  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const [nodeFilter, setNodeFilter] = useState<NodeFilter>("all");
  const [progressData, setProgressData] = useState<Record<string, string[]>>({});
  const [detailResource, setDetailResource] = useState<Resource | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load progress on mount
  useEffect(() => {
    setProgressData(getProgress());
  }, []);

  const activeCareerData = useMemo(() => CAREERS.find(c => c.career === activeCareer), [activeCareer]);

  const handleToggleDone = useCallback((career: string, resourceName: string) => {
    const updated = toggleResourceDone(career, resourceName);
    setProgressData(updated);
  }, []);

  // Group resources by stage for active career
  const stageGroups = useMemo(() => {
    if (!activeCareerData) return {};
    const groups: Record<string, Resource[]> = {};
    for (const stage of STAGES) {
      const resources = activeCareerData.resources.filter(r => {
        const stageMatch = r.stage === stage;
        const filterMatch = nodeFilter === "all" || r.type === nodeFilter;
        return stageMatch && filterMatch;
      });
      if (resources.length > 0) groups[stage] = resources;
    }
    return groups;
  }, [activeCareerData, nodeFilter]);

  // Calculate total stats
  const totalResources = CAREERS.reduce((a, c) => a + c.resources.length, 0);
  const totalDone = Object.values(progressData).reduce((a, b) => a + b.length, 0);

  const careerProgress = (career: string) => progressData[career] || [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      fontFamily: "var(--font-body), sans-serif",
      paddingTop: 88,
      position: "relative",
      overflow: "hidden",
    }}>
      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════════════
            GRID VIEW
        ═══════════════════════════════════════════════════════════════════ */}
        {!activeCareer && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96,  filter: "blur(8px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: 40 }}
            >
              <h1 style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 400,
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}>
                The best learning resources,<br />
                for every career path.
              </h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 500 }}>
                {CAREERS.length} careers · {totalResources} hand-picked resources.
                {totalDone > 0 && <span style={{ color: "var(--accent-green)", fontWeight: 600 }}> · {totalDone} explored</span>}
              </p>
            </motion.div>

            {/* ── Hall of Fame Banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              onClick={() => setActiveCareer("__hall_of_fame__")}
              style={{
                background: "linear-gradient(135deg, rgba(180,83,9,0.06), rgba(180,83,9,0.02))",
                border: "1px solid rgba(180,83,9,0.15)",
                borderRadius: 18,
                padding: "24px 28px",
                marginBottom: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 18,
                transition: "transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(180,83,9,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(180,83,9,0.15)";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "rgba(180,83,9,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                <Trophy size={24} color="var(--accent-amber)" />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.01em" }}>
                  Essential Reading — Every Tech Learner
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                  5 legendary papers that defined the entire industry. Read these regardless of your career path.
                </p>
              </div>
              <Star size={18} color="var(--accent-amber)" />
            </motion.div>

            {/* ── Domain Sections ── */}
            {DOMAINS.map(domain => {
              const domainCareers = CAREERS.filter(c => c.domain === domain);
              if (domainCareers.length === 0) return null;

              return (
                <div key={domain} style={{ marginBottom: 36 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--text-muted)",
                    display: "block", marginBottom: 14, paddingLeft: 4,
                  }}>
                    {domain}
                  </span>
                  <div className="resources-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                    gap: 14,
                  }}>
                    {domainCareers.map((c, i) => (
                      <CareerCard
                        key={c.career}
                        career={c}
                        onClick={() => setActiveCareer(c.career)}
                        index={i}
                        progress={careerProgress(c.career)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            NODE MAP VIEW
        ═══════════════════════════════════════════════════════════════════ */}
        {activeCareer && (
          <motion.div
            key="nodemap"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              minHeight: "calc(100vh - 88px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 32px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg-base)",
              position: "sticky", top: 88, zIndex: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  onClick={() => { setActiveCareer(null); setNodeFilter("all"); setDetailResource(null); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 10,
                    border: "1px solid var(--border)", background: "transparent",
                    color: "var(--text-secondary)", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-bright)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <ArrowLeft size={14} /> Back
                </button>

                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
                    {activeCareer === "__hall_of_fame__" ? "Essential Reading" : activeCareer}
                  </h2>
                  {activeCareer !== "__hall_of_fame__" && activeCareerData && (
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {careerProgress(activeCareer).length} of {activeCareerData.resources.length} complete
                    </span>
                  )}
                </div>
              </div>

              {/* Filters */}
              {activeCareer !== "__hall_of_fame__" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Filter size={14} color="var(--text-muted)" style={{ marginRight: 4, marginTop: 8 }} />
                  {(["all", "free", "premium", "book", "youtube"] as NodeFilter[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setNodeFilter(f)}
                      style={{
                        padding: "6px 14px", borderRadius: 999,
                        border: `1.5px solid ${nodeFilter === f ? "var(--primary)" : "var(--border)"}`,
                        background: nodeFilter === f ? "var(--primary)" : "transparent",
                        color: nodeFilter === f ? "#fff" : "var(--text-secondary)",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        transition: "all 0.15s", textTransform: "capitalize",
                      }}
                    >
                      {f === "all" ? "All" : TYPE_META[f].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Horizontal Swimlanes ── */}
            <div
              ref={scrollContainerRef}
              style={{
                flex: 1,
                overflowX: "auto",
                overflowY: "auto",
                padding: "40px 32px 120px",
              }}
            >
              {activeCareer === "__hall_of_fame__" ? (
                /* Hall of Fame — single horizontal path */
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", minWidth: "max-content" }}>
                  {HALL_OF_FAME.map((paper, i) => (
                    <React.Fragment key={paper.name}>
                      <ResourceNode
                        resource={paper}
                        index={i}
                        isDone={careerProgress("__hall_of_fame__").includes(paper.name)}
                        onToggleDone={() => handleToggleDone("__hall_of_fame__", paper.name)}
                        onOpenDetail={() => setDetailResource(paper)}
                        totalInStage={HALL_OF_FAME.length}
                      />
                      {i < HALL_OF_FAME.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                          style={{
                            width: 40, height: 2, marginTop: 50,
                            background: careerProgress("__hall_of_fame__").includes(paper.name) ? "var(--accent-green)" : "var(--border)",
                            borderRadius: 999, flexShrink: 0, transformOrigin: "left",
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                /* Career Node Map — stage-based swimlanes */
                <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                  {Object.entries(stageGroups).map(([stage, resources], stageIdx) => (
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: stageIdx * 0.1, duration: 0.3 }}
                    >
                      {/* Stage label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: resources.every(r => careerProgress(activeCareer!).includes(r.name))
                            ? "var(--accent-green)"
                            : "var(--border-bright)",
                          border: "2px solid var(--bg-base)",
                          boxShadow: `0 0 0 2px ${resources.every(r => careerProgress(activeCareer!).includes(r.name)) ? "var(--accent-green)" : "var(--border)"}`,
                        }} />
                        <span style={{
                          fontSize: 13, fontWeight: 700, color: "var(--text-muted)",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>
                          {STAGE_LABELS[stage]}
                        </span>
                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                      </div>

                      {/* Nodes row */}
                      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
                        {resources.map((r, i) => (
                          <React.Fragment key={r.name}>
                            <ResourceNode
                              resource={r}
                              index={i + stageIdx * 3}
                              isDone={careerProgress(activeCareer!).includes(r.name)}
                              onToggleDone={() => handleToggleDone(activeCareer!, r.name)}
                              onOpenDetail={() => setDetailResource(r)}
                              totalInStage={resources.length}
                            />
                            {i < resources.length - 1 && (
                              <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: (i + stageIdx * 3) * 0.08 + 0.2, duration: 0.25 }}
                                style={{
                                  width: 24, height: 2, marginTop: 50,
                                  background: careerProgress(activeCareer!).includes(r.name)
                                    ? "var(--accent-green)" : "var(--border)",
                                  borderRadius: 999, flexShrink: 0, transformOrigin: "left",
                                }}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {Object.keys(stageGroups).length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                      <p style={{ fontSize: 15 }}>No resources match the current filter.</p>
                      <button
                        onClick={() => setNodeFilter("all")}
                        style={{
                          marginTop: 12, padding: "10px 24px", borderRadius: 10,
                          background: "var(--primary)", color: "#fff", border: "none",
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Show All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Detail Drawer ── */}
            <AnimatePresence>
              {detailResource && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDetailResource(null)}
                    style={{
                      position: "fixed", inset: 0, zIndex: 90,
                      background: "rgba(0,0,0,0.2)",
                    }}
                  />
                  <NodeDetailDrawer
                    resource={detailResource}
                    isDone={careerProgress(activeCareer!).includes(detailResource.name)}
                    onToggleDone={() => handleToggleDone(activeCareer!, detailResource.name)}
                    onClose={() => setDetailResource(null)}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
