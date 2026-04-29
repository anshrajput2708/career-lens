import type { AnalysisResult, UserProfile } from "@/lib/utils/storage";

export type ResearchTrack =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "DevOps Engineer"
  | "UX Designer"
  | "Data Analyst"
  | "AI Engineer"
  | "Data Scientist"
  | "Data Engineer"
  | "Android Developer"
  | "iOS Developer"
  | "ML Engineer"
  | "QA Engineer"
  | "Cyber Security"
  | "Product Manager"
  | "Blockchain Developer"
  | "Game Developer"
  | "Technical Writer";

export type ResearchDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  track: ResearchTrack;
  difficulty: ResearchDifficulty;
  url: string;
  legacyTagline: string;
  whatItIntroduced: string;
  careerImpact: string;
  whyYouMustRead: string;
  hallOfFame?: boolean;
  hallOfFameLegacy?: string;
}

export const RESEARCH_TRACKS: ResearchTrack[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UX Designer",
  "Data Analyst",
  "AI Engineer",
  "Data Scientist",
  "Data Engineer",
  "Android Developer",
  "iOS Developer",
  "ML Engineer",
  "QA Engineer",
  "Cyber Security",
  "Product Manager",
  "Blockchain Developer",
  "Game Developer",
  "Technical Writer",
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  // ─── FRONTEND DEVELOPER ───────────────────────────────────────────────────
  {
    id: "fe-1",
    title: "A Comparative Study of Web Application Architectures",
    authors: "Various (SPA vs MPA research, 2013)",
    year: 2013,
    track: "Frontend Developer",
    difficulty: "Beginner",
    url: "https://dl.acm.org/doi/10.1145/2491411.2491418",
    legacyTagline: "The paper that forced the industry to choose between server and browser rendering.",
    whatItIntroduced:
      "Systematically compared Single-Page Applications and Multi-Page Applications across performance, SEO, and user experience dimensions. It formalised trade-offs that were previously argued by intuition. The analysis introduced metrics like Time-to-First-Paint and interaction latency as decision criteria. It laid the intellectual groundwork for Next.js, Nuxt, and every SSR framework that followed.",
    careerImpact:
      "Every modern frontend developer must make an architecture call on day one of a project: SPA, SSR, SSG, or ISR. Understanding the original academic comparison means you can defend that decision with benchmarks rather than hype. It directly shapes whether you reach for Vite, Next.js, or Astro and how you balance SEO requirements against interactivity.",
    whyYouMustRead:
      "Because your next job interview will ask 'why did you choose SPA over SSR?' and gut feeling is not an answer.",
  },
  {
    id: "fe-2",
    title: "React: Rethinking Best Practices (JSConf EU)",
    authors: "Pete Hunt, Facebook Engineering",
    year: 2013,
    track: "Frontend Developer",
    difficulty: "Beginner",
    url: "https://legacy.reactjs.org/blog/2013/06/05/why-react.html",
    legacyTagline: "The talk that killed template engines and invented the component model.",
    whatItIntroduced:
      "Introduced the concept of UI as a pure function of state: UI = f(state). It proposed the Virtual DOM as a diffing mechanism to efficiently update the real DOM. The component model replaced MVC's controller-view split with a single composable unit. It made re-rendering safe and predictable, ending the era of jQuery spaghetti.",
    careerImpact:
      "React now powers over 40% of the web. Every component you write, every useState and useEffect call, every JSX expression traces back to this paper's core insight. Understanding the original philosophy prevents cargo-culting — you'll know when to use local state versus a store, and why lifting state up is the right pattern rather than a workaround.",
    whyYouMustRead:
      "Because writing React without understanding its mental model is like driving without knowing why the steering wheel turns the wheels.",
  },
  {
    id: "fe-3",
    title: "CSS Flexible Box Layout Module Level 1",
    authors: "W3C CSS Working Group",
    year: 2009,
    track: "Frontend Developer",
    difficulty: "Beginner",
    url: "https://www.w3.org/TR/css-flexbox-1/",
    legacyTagline: "The spec that ended a decade of float hacks and table-based layouts.",
    whatItIntroduced:
      "Defined a one-dimensional layout model where items in a container can flex to fill available space or shrink to prevent overflow. Introduced the main axis and cross axis model with justify-content and align-items as mathematical alignment controls. Eliminated the need for clearfix hacks, float clearance, and inline-block spacing bugs that plagued CSS layouts for 15 years.",
    careerImpact:
      "Flexbox is the single most-used CSS feature in production today. Navbar layouts, card grids, centred modals, button groups — all flex. Reading the spec makes you understand why certain flex behaviours feel counterintuitive: flex-shrink, flex-basis, and the difference between align-content and align-items stop being mysteries and become deliberate design decisions.",
    whyYouMustRead:
      "Because every frontend developer uses flex every day and almost none can explain why flex-grow:1 does what it does.",
  },
  {
    id: "fe-4",
    title: "Progressive Web Apps: Escaping Tabs Without Losing Our Soul",
    authors: "Alex Russell, Frances Berriman — Google Chrome Team",
    year: 2015,
    track: "Frontend Developer",
    difficulty: "Intermediate",
    url: "https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/",
    legacyTagline: "The manifesto that made the web installable, offline-capable, and platform-competitive.",
    whatItIntroduced:
      "Coined the term Progressive Web App and defined its three criteria: reliable (loads offline), fast (responds instantly), and engaging (installable). Introduced Service Workers as the programmable network proxy that powers offline caching. Proposed the App Shell architecture separating UI skeleton from dynamic content for instant first paint.",
    careerImpact:
      "PWA skills are now table-stakes for senior frontend developers at companies targeting emerging markets or poor connectivity. If you build anything meant to run in India, Africa, or Southeast Asia and haven't implemented a Service Worker caching strategy, you've failed your users. Lighthouse's PWA audit directly scores your implementation of this paper's criteria.",
    whyYouMustRead:
      "Because a frontend developer who can't ship installable, offline-capable web experiences is leaving half the world's internet users behind.",
  },
  {
    id: "fe-5",
    title: "How Browsers Work: Behind the Scenes of Modern Web Browsers",
    authors: "Tali Garsiel, Paul Irish — Web.dev",
    year: 2011,
    track: "Frontend Developer",
    difficulty: "Intermediate",
    url: "https://web.dev/articles/howbrowserswork",
    legacyTagline: "The deep dive that revealed why animations jank and how to fix them at the engine level.",
    whatItIntroduced:
      "Documented the full browser rendering pipeline: HTML parsing, CSS cascade, layout, paint, and compositing. Explained the render tree construction and how style recalculations propagate through the DOM. Introduced the concept of the 16ms frame budget required for 60fps rendering and identified which CSS properties trigger layout, paint, or compositor-only changes.",
    careerImpact:
      "This paper is what separates a frontend developer from a frontend engineer. When a React list scrolls at 20fps you need to know whether it's layout thrash, paint storms, or main-thread JavaScript blocking the compositor. Reading this paper makes Chrome DevTools' Performance tab readable as a debugging tool rather than a wall of noise.",
    whyYouMustRead:
      "Because 'it's slow' is not a bug report, and this paper gives you the vocabulary to find the actual cause in 10 minutes.",
  },

  // ─── BACKEND DEVELOPER ────────────────────────────────────────────────────
  {
    id: "be-1",
    title: "A Relational Model of Data for Large Shared Data Banks",
    authors: "Edgar F. Codd — IBM Research",
    year: 1970,
    track: "Backend Developer",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/362384.362685",
    legacyTagline: "The 11-page paper that invented SQL, PostgreSQL, MySQL, and every database your app runs on.",
    whatItIntroduced:
      "Proposed organising data in relations (tables) with rows and columns and defined relational algebra — select, project, join — as a mathematical foundation for querying data. Introduced data independence, separating the physical storage layout from the logical data model so applications don't break when storage changes. Defined normal forms to eliminate redundancy and update anomalies.",
    careerImpact:
      "Every backend developer writes SQL. Every ORM — Prisma, SQLAlchemy, Hibernate — is a mapping layer over Codd's 1970 model. When you debate normalisation vs denormalisation, when you design a schema, when you optimise a JOIN query, you are working directly with the concepts this paper defined. Understanding the relational model makes you reason about indexes and query plans intuitively.",
    whyYouMustRead:
      "Because writing database code without understanding Codd's model is like building a house without knowing what load-bearing walls are.",
  },
  {
    id: "be-2",
    title: "The UNIX Time-Sharing System",
    authors: "Dennis Ritchie & Ken Thompson — Bell Labs",
    year: 1974,
    track: "Backend Developer",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/361011.361061",
    legacyTagline: "Linux, macOS, Android, and every server you deploy to — all built on these 17 pages.",
    whatItIntroduced:
      "Introduced 'everything is a file' as a universal abstraction making devices, sockets, and pipes indistinguishable from regular files. Defined the fork-exec process model still used by every Unix system today. Introduced pipes (|) enabling programs to compose into pipelines — the original microservice architecture. Created the hierarchical filesystem used by every modern OS.",
    careerImpact:
      "Backend developers live in the Unix environment: SSH sessions, process management, file permissions, signal handling, stdin/stdout piping. When a Node.js process crashes you read /proc. When a Docker container behaves unexpectedly you understand namespaces because you understand processes. The shell scripts that deploy your code are pure Unix philosophy 50 years later.",
    whyYouMustRead:
      "Because every backend developer operates in Unix every day, and the developers who understand it at this depth fix production incidents in 5 minutes instead of 5 hours.",
  },
  {
    id: "be-3",
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    authors: "Jeffrey Dean & Sanjay Ghemawat — Google",
    year: 2004,
    track: "Backend Developer",
    difficulty: "Intermediate",
    url: "https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/",
    legacyTagline: "The paper that showed backend engineers how to process terabytes with a two-function model.",
    whatItIntroduced:
      "Abstracted distributed computation into two functions: Map (transform each record independently) and Reduce (aggregate transformed records by key). Workers are stateless making failure recovery automatic — a crashed worker's tasks simply restart on a healthy machine. Introduced data locality as a principle: move compute to where data lives, not data to compute.",
    careerImpact:
      "Hadoop, Hive, Spark, Flink, and BigQuery are all intellectual descendants of this paper. Backend engineers building data pipelines, ETL systems, or batch processing jobs are implementing MapReduce patterns whether they know it or not. Understanding the paradigm explains why Spark partitions data the way it does and why certain transformations are expensive across network boundaries.",
    whyYouMustRead:
      "Because every backend system eventually needs to process more data than fits in memory, and this paper is still the clearest thinking on how to do it.",
  },
  {
    id: "be-4",
    title: "Dynamo: Amazon's Highly Available Key-Value Store",
    authors: "Giuseppe DeCandia et al. — Amazon",
    year: 2007,
    track: "Backend Developer",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1145/1323293.1294281",
    legacyTagline: "The paper that made eventual consistency a production engineering strategy, not a compromise.",
    whatItIntroduced:
      "Built an always-writable distributed database by prioritising availability over strong consistency — the AP side of CAP theorem. Used consistent hashing for data partitioning allowing node addition without full resharding. Invented vector clocks for tracking causality and detecting conflicting writes across replicas. Introduced gossip protocols for decentralised membership and failure detection.",
    careerImpact:
      "DynamoDB, Cassandra, and Riak are direct descendants of this paper. When a backend developer chooses a NoSQL database over PostgreSQL, this paper's trade-offs are what they're implicitly selecting. Understanding quorum reads and writes (N, R, W variables) lets you configure Cassandra or DynamoDB with evidence rather than defaults and explain consistency guarantees to your team.",
    whyYouMustRead:
      "Because the moment your backend runs on more than one server, you are making distributed systems decisions whether you realise it or not.",
  },
  {
    id: "be-5",
    title: "Architectural Styles and the Design of Network-Based Software Architectures",
    authors: "Roy Thomas Fielding — UC Irvine",
    year: 2000,
    track: "Backend Developer",
    difficulty: "Intermediate",
    url: "https://ics.uci.edu/~fielding/pubs/dissertation/top.htm",
    legacyTagline: "The dissertation that invented REST — which became the API design standard for the entire web.",
    whatItIntroduced:
      "Defined REST as an architectural style with six constraints: client-server, statelessness, cacheability, layered system, code on demand, and uniform interface. Argued that stateless design enables horizontal scaling trivially since any server can handle any request. Introduced HATEOAS (Hypermedia as the Engine of Application State) as the final constraint that most self-described REST APIs never implement.",
    careerImpact:
      "Every backend developer builds APIs. The entire concept of HTTP verbs having meaning (GET is safe, POST creates, DELETE removes), of URL design as resource modelling, of status codes conveying semantics — all comes from this dissertation. Reading it exposes how most 'REST APIs' are actually RPC over HTTP and gives you the vocabulary to design genuinely RESTful or intentionally non-REST interfaces.",
    whyYouMustRead:
      "Because every backend developer calls their API 'RESTful' but almost none have read the dissertation that defined what REST actually means.",
  },

  // ─── FULL STACK DEVELOPER ─────────────────────────────────────────────────
  {
    id: "fs-1",
    title: "The Twelve-Factor App",
    authors: "Adam Wiggins — Heroku",
    year: 2011,
    track: "Full Stack Developer",
    difficulty: "Beginner",
    url: "https://12factor.net/",
    legacyTagline: "The rulebook for what a production-ready web application actually looks like.",
    whatItIntroduced:
      "Defined 12 principles for building software-as-a-service apps: one codebase, explicit dependencies, config in environment variables, backing services as attached resources, separated build/release/run stages, stateless processes, port binding, concurrency via processes, disposability, dev/prod parity, logs as event streams, and admin processes as one-off tasks.",
    careerImpact:
      "Every cloud platform — Heroku, Vercel, Railway, Fly.io, AWS Elastic Beanstalk — rewards 12-factor apps. A full-stack developer who builds twelve-factor apps from day one ships to production without drama. Secrets in .env files, stateless API servers, logs going to stdout — these aren't best practices they're literal deployment requirements for modern PaaS platforms.",
    whyYouMustRead:
      "Because most junior full-stack developers discover these rules painfully at 2am during a production incident instead of learning them in 20 minutes by reading this document.",
  },
  {
    id: "fs-2",
    title: "Out of the Tar Pit",
    authors: "Ben Moseley & Peter Marks",
    year: 2006,
    track: "Full Stack Developer",
    difficulty: "Advanced",
    url: "https://curtclifton.net/papers/MoseleyMarks06a.pdf",
    legacyTagline: "The paper that identified state as the root cause of all software complexity.",
    whatItIntroduced:
      "Argued that complexity — not performance or features — is the primary enemy of software systems. Distinguished essential complexity (inherent in the problem domain) from accidental complexity (self-inflicted by poor design). Identified mutable state as the largest source of accidental complexity and proposed Functional Relational Programming as an ideal architecture.",
    careerImpact:
      "Redux, React's unidirectional data flow, Elm, and the rise of immutable state management all trace intellectual roots to this paper. Full-stack developers who understand this paper design state management architectures intentionally: minimal global state, derived data computed rather than stored, side effects isolated to the edges of the system. It's why React Query replaced Axios+useEffect+useState for so many teams.",
    whyYouMustRead:
      "Because every full-stack developer has a codebase where state got out of hand, and this paper explains exactly why it happened and how to prevent it.",
  },
  {
    id: "fs-3",
    title: "Node.js: Evented I/O for V8 JavaScript",
    authors: "Ryan Dahl",
    year: 2009,
    track: "Full Stack Developer",
    difficulty: "Intermediate",
    url: "https://www.youtube.com/watch?v=ztspvPYybIY",
    legacyTagline: "The talk that put JavaScript on the server and made full-stack development possible for one language.",
    whatItIntroduced:
      "Demonstrated that a single-threaded event loop with non-blocking I/O could handle thousands of concurrent connections without the thread-per-connection overhead of Apache. Built on V8's just-in-time compilation to bring JavaScript to server performance levels. Introduced the callback pattern as the programming model for asynchronous operations.",
    careerImpact:
      "Node.js enabled the explosion of full-stack JavaScript development: Next.js, Express, Fastify, NestJS, and Bun all run on the mental model Ryan Dahl presented in 2009. Understanding the event loop — why blocking the main thread kills your API's throughput, why Promise.all is faster than sequential await, when to use worker threads — makes you a significantly better full-stack engineer.",
    whyYouMustRead:
      "Because every full-stack dev writes async/await JavaScript on the server and almost none understand the event loop that makes it work.",
  },
  {
    id: "fs-4",
    title: "Architectural Styles and the Design of Network-Based Software Architectures (REST)",
    authors: "Roy Fielding — UC Irvine",
    year: 2000,
    track: "Full Stack Developer",
    difficulty: "Intermediate",
    url: "https://ics.uci.edu/~fielding/pubs/dissertation/top.htm",
    legacyTagline: "Why your frontend and backend can evolve independently — the theory behind every API you build.",
    whatItIntroduced:
      "Defined the REST architectural style with statelessness and a uniform interface as the core constraints that allow clients and servers to evolve independently. Described how HTTP caching headers (ETag, Cache-Control) are a first-class part of the REST system, not an afterthought. Argued that the URL represents a resource, not an action.",
    careerImpact:
      "Full-stack developers design the contract between their own frontend and backend every day. Understanding REST's statelessness constraint explains why JWTs in Authorization headers are more scalable than session cookies in a load-balanced environment. It explains when tRPC or GraphQL is a better choice than REST and why — not just as a trendy pick but as an informed architectural decision.",
    whyYouMustRead:
      "Because every full-stack developer is also an API designer, and designing good APIs requires understanding why REST's constraints exist.",
  },
  {
    id: "fs-5",
    title: "A Relational Model of Data for Large Shared Data Banks",
    authors: "Edgar F. Codd — IBM Research",
    year: 1970,
    track: "Full Stack Developer",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/362384.362685",
    legacyTagline: "The database foundation every full-stack developer uses daily without knowing its origin.",
    whatItIntroduced:
      "Proposed the relational model with mathematical foundations for querying data through relational algebra. Defined normal forms to structure data without redundancy. Distinguished logical data independence from physical storage, allowing application code to remain stable when storage changes.",
    careerImpact:
      "Every full-stack developer uses an ORM like Prisma or Drizzle whose schema design decisions trace directly to Codd's normal forms. When you add an index to fix a slow query, when you debate whether to embed or reference data, when you write a JOIN — these decisions are explained by the relational model. Understanding it at source makes Prisma schema design intuitive rather than trial-and-error.",
    whyYouMustRead:
      "Because full-stack developers who understand the relational model write schemas that grow cleanly with the product instead of requiring painful migrations every six months.",
  },

  // ─── DEVOPS ENGINEER ──────────────────────────────────────────────────────
  {
    id: "do-1",
    title: "Site Reliability Engineering: How Google Runs Production Systems",
    authors: "Beyer, Jones, Petoff, Murphy — Google",
    year: 2016,
    track: "DevOps Engineer",
    difficulty: "Intermediate",
    url: "https://sre.google/sre-book/table-of-contents/",
    legacyTagline: "The book that turned 'keep the lights on' into an engineering discipline with mathematics.",
    whatItIntroduced:
      "Defined Service Level Objectives (SLOs) as the primary tool for balancing reliability against feature velocity using error budgets. Introduced the concept of toil — repetitive, manual operational work — and made eliminating it through automation a core engineering mandate. Established blameless postmortems as a cultural practice for learning from outages without punishing individuals.",
    careerImpact:
      "SRE principles now define how every mature engineering organisation thinks about production. DevOps engineers who speak SLO, error budget, and toil vocabulary earn a seat in architectural discussions. Configuring Prometheus alerts without an SLO framework is guessing. Error budgets make the conversation between product and reliability quantitative rather than political.",
    whyYouMustRead:
      "Because a DevOps engineer who can't explain error budgets to their CTO is an infrastructure operator, not a reliability engineer.",
  },
  {
    id: "do-2",
    title: "Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation",
    authors: "Jez Humble & David Farley",
    year: 2010,
    track: "DevOps Engineer",
    difficulty: "Intermediate",
    url: "https://continuousdelivery.com/",
    legacyTagline: "The definitive text behind every CI/CD pipeline ever built.",
    whatItIntroduced:
      "Argued that every commit should be a potential release candidate and the deployment pipeline is the only path from developer laptop to production. Introduced the deployment pipeline as a multi-stage quality gate with automatic promotion. Defined feature flags to decouple deployment from release and blue-green deployments to eliminate downtime.",
    careerImpact:
      "Every GitHub Actions workflow, every Jenkins pipeline, every ArgoCD application is an implementation of the principles in this book. When a DevOps engineer designs a pipeline they make decisions about test stages, promotion criteria, and rollback triggers — all of which have better and worse answers that this book explains with evidence. Trunk-based development makes sense only once you've read this.",
    whyYouMustRead:
      "Because copy-pasting a GitHub Actions YAML from a tutorial is not the same as understanding why your pipeline is structured the way it is.",
  },
  {
    id: "do-3",
    title: "Large-Scale Cluster Management at Google with Borg",
    authors: "Verma, Pedrosa, Korupolu et al. — Google",
    year: 2015,
    track: "DevOps Engineer",
    difficulty: "Advanced",
    url: "https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/",
    legacyTagline: "The internal Google system that directly became Kubernetes — understand Borg, understand K8s.",
    whatItIntroduced:
      "Described how Google managed thousands of machines running tens of thousands of jobs using a centralised scheduler. Introduced the distinction between long-running services and batch jobs with different scheduling priority classes. Defined the alloc (resource allocation unit) that became the Kubernetes Pod. Kubernetes directly adopted Borg's label selectors, annotations, and declarative configuration model.",
    careerImpact:
      "Every Kubernetes concept — Pod, Deployment, resource requests and limits, health checks, node affinity — was designed in Borg first. DevOps engineers who read this paper understand why Kubernetes behaves the way it does when a node runs out of memory, why resource requests matter for scheduling, and why the scheduler sometimes refuses to place a pod. K8s docs make much more sense after reading this.",
    whyYouMustRead:
      "Because every DevOps engineer uses Kubernetes but the ones who understand its ancestry can debug scheduling issues the others file as 'weird k8s behaviour'.",
  },
  {
    id: "do-4",
    title: "The Log: What Every Software Engineer Should Know About Real-Time Data's Unifying Abstraction",
    authors: "Jay Kreps — LinkedIn Engineering",
    year: 2013,
    track: "DevOps Engineer",
    difficulty: "Intermediate",
    url: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying",
    legacyTagline: "The essay that revealed logs are not an output — they are the fundamental data structure of distributed systems.",
    whatItIntroduced:
      "Argued that the append-only, ordered log is the unifying abstraction behind database replication, distributed consensus, stream processing, and event sourcing. Showed that Postgres replication is just replicas following the primary's write-ahead log. Explained Kafka's design as a distributed commit log where consumers maintain their own offset.",
    careerImpact:
      "DevOps engineers who understand this essay see Kafka, Postgres WAL, and Elasticsearch's replication log as the same abstraction. Change Data Capture (CDC) pipelines, event-driven architectures, and audit trails all become design patterns rather than complex one-offs. When configuring Kafka retention or consumer lag alerts, the underlying model from this essay makes every decision clearer.",
    whyYouMustRead:
      "Because Kafka is intimidating until you understand that it's just a distributed append-only log, and this essay explains that in 45 minutes.",
  },
  {
    id: "do-5",
    title: "Dynamo: Amazon's Highly Available Key-Value Store",
    authors: "Giuseppe DeCandia et al. — Amazon",
    year: 2007,
    track: "DevOps Engineer",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1145/1323293.1294281",
    legacyTagline: "The paper that taught the industry how to design infrastructure that stays up even when parts fail.",
    whatItIntroduced:
      "Chose availability over consistency for shopping cart data: Amazon would rather show a slightly stale cart than show an error page. Used consistent hashing to allow node addition without full data reshuffling. Introduced gossip protocols for decentralised failure detection without a single coordinator.",
    careerImpact:
      "DevOps engineers choose between storage systems constantly — Postgres vs DynamoDB vs Cassandra vs Redis. Reading Dynamo gives you the theoretical framework for these decisions: consistency models, replication factors, partition tolerance. When you configure a multi-region DynamoDB table or a Cassandra replication factor, you are directly applying this paper's trade-off model.",
    whyYouMustRead:
      "Because choosing a database for production without understanding the CAP theorem's practical implications is guessing.",
  },

  // ─── UX DESIGNER ──────────────────────────────────────────────────────────
  {
    id: "ux-1",
    title: "The Information Capacity of the Human Motor System in Controlling Amplitude of Movement",
    authors: "Paul Fitts",
    year: 1954,
    track: "UX Designer",
    difficulty: "Beginner",
    url: "https://doi.org/10.1037/h0055392",
    legacyTagline: "The equation that determines the minimum size of every button, touch target, and clickable element.",
    whatItIntroduced:
      "Proved mathematically that the time to move and click a target is a logarithmic function of distance divided by target width. Larger and closer targets are faster to acquire — not by intuition but by formula. The law applies equally to mouse pointers, finger taps, and styluses. It quantified the cost of placing primary actions far from the user's current position.",
    careerImpact:
      "Apple's 44pt minimum touch target guideline and Google's 48dp rule are direct implementations of Fitts's Law. Every time a UX designer argues for larger buttons or closer action placements, this law is the scientific evidence. It explains why hamburger menus in the top-left corner of mobile apps are harder to use than bottom navigation bars — distance from thumb matters.",
    whyYouMustRead:
      "Because 'make the button bigger' is not a UX argument — Fitts's Law is, and it ends design debates in seconds.",
  },
  {
    id: "ux-2",
    title: "The Magical Number Seven, Plus or Minus Two",
    authors: "George A. Miller — Princeton",
    year: 1956,
    track: "UX Designer",
    difficulty: "Beginner",
    url: "https://doi.org/10.1037/h0043158",
    legacyTagline: "The cognitive science paper behind every '7 items max in a navigation menu' guideline.",
    whatItIntroduced:
      "Demonstrated through experiments that human working memory can hold approximately 7 ± 2 items simultaneously. Introduced chunking as a strategy to expand effective capacity by grouping related items into meaningful units. Showed that the limit applies across sensory modalities — visual, auditory, and tactile — not just visual information.",
    careerImpact:
      "Navigation menus with more than 7 items cause decision paralysis. Onboarding forms with more than 7 fields per screen have measurably higher abandonment rates. Error messages that explain too much are ignored. UX designers who understand Miller's Law apply progressive disclosure — reveal complexity only when needed — and design information architectures that respect working memory limits.",
    whyYouMustRead:
      "Because designing interfaces that overwhelm users is easy; designing ones that respect cognitive limits requires understanding this paper.",
  },
  {
    id: "ux-3",
    title: "Don't Make Me Think: A Common Sense Approach to Web Usability",
    authors: "Steve Krug",
    year: 2000,
    track: "UX Designer",
    difficulty: "Beginner",
    url: "https://www.sensible.com/dont-make-me-think/",
    legacyTagline: "The most impactful UX book ever written: users don't read, they scan — design accordingly.",
    whatItIntroduced:
      "Established that web users scan pages like highway billboards, clicking the first thing that looks reasonable rather than reading carefully. Argued that good UX is self-evident — the correct path should require no explanation. Introduced the hallway usability test: 5 users for 20 minutes each reveals 80% of critical usability problems, making formal testing accessible to any team.",
    careerImpact:
      "Every UX designer who runs usability tests, creates user flows, or argues for simpler navigation is applying Krug's principles. The 'happy path' trap — designing for ideal users who read everything — is what this book prevents. When you fight for 'the user shouldn't need to read this tooltip to understand what this button does', you're defending Krug's core principle.",
    whyYouMustRead:
      "Because this book takes 3 hours to read and fundamentally changes how you look at every interface you use afterwards.",
  },
  {
    id: "ux-4",
    title: "F-Shaped Pattern for Reading Web Content",
    authors: "Jakob Nielsen — Nielsen Norman Group",
    year: 2006,
    track: "UX Designer",
    difficulty: "Beginner",
    url: "https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/",
    legacyTagline: "Eye-tracking data from 232 users that revealed exactly where people look — and don't look — on a web page.",
    whatItIntroduced:
      "Used eye-tracking heatmaps to show that web users read content in an F-shaped pattern: two horizontal scans across the top content, then a vertical scan down the left side. The bottom-right area of most pages is almost entirely ignored. First sentences and first words of paragraphs receive dramatically more attention than the rest of the text.",
    careerImpact:
      "This study determines where UX designers place calls-to-action, headlines, and key information. It explains why landing page CTAs are top-left or top-centre rather than bottom-right. When a UX designer argues for putting key content 'above the fold' and in the first sentence of each section, this is the evidence. It directly informs content hierarchy decisions in every screen design.",
    whyYouMustRead:
      "Because designing layouts without knowing where users' eyes actually go is like designing a billboard without knowing people drive past it at 60mph.",
  },
  {
    id: "ux-5",
    title: "Material Design: A Unified System",
    authors: "Google Design Team",
    year: 2014,
    track: "UX Designer",
    difficulty: "Beginner",
    url: "https://m3.material.io/",
    legacyTagline: "The most widely deployed design system ever built — and the blueprint for how any design system should be constructed.",
    whatItIntroduced:
      "Proposed a design language where UI elements behave as if made from real paper and ink — with physical properties like elevation, shadow, and light response. Defined a systematic colour palette generated from a primary seed colour. Introduced a typography scale with named roles (Display, Headline, Body, Label) to create information hierarchy. Codified that motion must be responsive and meaningful, never decorative.",
    careerImpact:
      "Every UX designer who creates a design system, defines spacing tokens, or specifies component elevation is working within a framework that Material Design standardised. Android apps, Google products, and thousands of web applications implement Material. Understanding it teaches you how design tokens work, how colour systems are generated, and how to specify interactive states — all directly transferable to building or auditing any design system.",
    whyYouMustRead:
      "Because creating a design system without studying the most complete and widely deployed one is reinventing the wheel at significant cost to your team.",
  },

  // ─── DATA ANALYST ─────────────────────────────────────────────────────────
  {
    id: "da-1",
    title: "Exploratory Data Analysis",
    authors: "John W. Tukey — Princeton",
    year: 1977,
    track: "Data Analyst",
    difficulty: "Beginner",
    url: "https://www.worldcat.org/title/exploratory-data-analysis/oclc/3058187",
    legacyTagline: "The book that invented EDA, boxplots, and the principle of looking before you model.",
    whatItIntroduced:
      "Established Exploratory Data Analysis as a philosophy: before fitting any model, visualise and summarise the data to find patterns, anomalies, and generate hypotheses. Invented boxplots, stem-and-leaf plots, and resistant statistics (median, IQR) that are robust to outliers. Distinguished EDA from confirmatory analysis — detective work versus hypothesis testing.",
    careerImpact:
      "Every data analyst who runs df.describe(), plots a histogram before building a report, or checks for outliers before averaging is doing EDA. The specific tools Tukey invented — boxplots, quartiles, five-number summaries — are displayed in every BI tool from Tableau to Power BI. Reading this builds the discipline to understand data before drawing conclusions rather than after.",
    whyYouMustRead:
      "Because the most common data analyst mistake is building a dashboard on data they've never actually looked at, and Tukey wrote the cure.",
  },
  {
    id: "da-2",
    title: "The Grammar of Graphics",
    authors: "Leland Wilkinson",
    year: 1999,
    track: "Data Analyst",
    difficulty: "Intermediate",
    url: "https://link.springer.com/book/10.1007/0-387-28695-0",
    legacyTagline: "The theory behind ggplot2, Tableau, D3.js, Vega-Lite — every serious visualisation tool implements this.",
    whatItIntroduced:
      "Defined a compositional grammar for statistical graphics: any chart is a combination of data, aesthetic mappings, geometric objects, statistical transformations, scales, coordinate systems, and facets. Showed that separating these concerns enables constructing any visualisation type from first principles rather than memorising chart types. Established the hierarchy of visual encodings by perceptual accuracy: position > length > angle > area > colour.",
    careerImpact:
      "A data analyst who understands the Grammar of Graphics stops thinking in 'chart types' and starts thinking in 'data mappings'. This is precisely why ggplot2 produces better charts than Excel — it forces you to specify what each visual attribute encodes rather than picking a template. Tableau's pill-based interface, D3's enter-update-exit pattern, and Vega-Lite's JSON spec are all direct implementations.",
    whyYouMustRead:
      "Because choosing a chart type by intuition produces mediocre visualisations; understanding why position beats colour produces ones that communicate instantly.",
  },
  {
    id: "da-3",
    title: "A Few Useful Things to Know About Machine Learning",
    authors: "Pedro Domingos — University of Washington",
    year: 2012,
    track: "Data Analyst",
    difficulty: "Beginner",
    url: "https://dl.acm.org/doi/10.1145/2347736.2347755",
    legacyTagline: "12 ML lessons every data professional must know — without a single equation.",
    whatItIntroduced:
      "Distilled 12 hard-won truths about machine learning: the importance of features over algorithms, the bias-variance trade-off, the curse of dimensionality, overfitting as the central danger, and the No Free Lunch theorem proving no algorithm is universally best. Argued that more data almost always beats a better algorithm in real-world settings.",
    careerImpact:
      "Data analysts who add ML to their workflow — churn prediction, anomaly detection, forecasting — need this paper's mental models before touching any library. Understanding why a model performing perfectly on training data is a warning sign prevents the most common production ML failure. The insight that feature engineering matters more than algorithm choice saves months of futile hyperparameter searching.",
    whyYouMustRead:
      "Because every data analyst eventually gets asked to 'add some AI to that dashboard' and this paper is how you avoid making confident mistakes.",
  },
  {
    id: "da-4",
    title: "The Data Warehouse Toolkit",
    authors: "Ralph Kimball",
    year: 1996,
    track: "Data Analyst",
    difficulty: "Intermediate",
    url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/",
    legacyTagline: "Dimensional modelling: the star schema design that powers every BI tool and analytics warehouse.",
    whatItIntroduced:
      "Introduced dimensional modelling as the standard for analytics databases: fact tables containing numeric measures connected to dimension tables containing descriptive attributes in a star schema. Defined the concept of grain — what exactly one row in a fact table represents — as the first decision in schema design. Introduced Slowly Changing Dimensions for tracking historical data changes without losing analytical context.",
    careerImpact:
      "Every Snowflake, Redshift, and BigQuery analytics schema is built on Kimball's dimensional model whether the team knows it or not. A data analyst who understands star schemas can navigate any BI tool's data model, diagnose double-counting from incorrect JOIN logic, and explain to stakeholders why that SALES metric is different in two different reports.",
    whyYouMustRead:
      "Because data analysts who don't understand dimensional modelling spend their careers confused by discrepancies between numbers that should match.",
  },
  {
    id: "da-5",
    title: "Statistical Power Analysis for the Behavioral Sciences",
    authors: "Jacob Cohen",
    year: 1988,
    track: "Data Analyst",
    difficulty: "Intermediate",
    url: "https://www.taylorfrancis.com/books/mono/10.4324/9780203771587/statistical-power-analysis-behavioral-sciences-jacob-cohen",
    legacyTagline: "The mathematical foundation of A/B testing — the difference between a valid experiment and a waste of traffic.",
    whatItIntroduced:
      "Developed the mathematical framework for statistical power analysis: determining the minimum sample size required to detect an effect of a given magnitude with specified confidence. Defined four linked quantities — power, sample size, effect size, and alpha — showing that fixing three allows calculation of the fourth. Introduced standardised effect size measures (Cohen's d, h, f) for cross-study comparison.",
    careerImpact:
      "Every data analyst running A/B tests at a product company is applying Cohen's framework, usually through a sample size calculator without knowing the theory behind it. Understanding power analysis means you catch underpowered experiments before running them, correctly interpret non-significant results (absence of evidence vs evidence of absence), and stop declaring winners from experiments that ran for 3 days on 200 users.",
    whyYouMustRead:
      "Because most A/B tests at most companies are statistically underpowered and produce false confidence, and this paper is the cure.",
  },

  // ─── AI ENGINEER ──────────────────────────────────────────────────────────
  {
    id: "ai-1",
    title: "Attention Is All You Need",
    authors: "Vaswani, Shazeer, Parmar et al. — Google Brain",
    year: 2017,
    track: "AI Engineer",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/1706.03762",
    legacyTagline: "The 11-page paper that made GPT-4, Claude, and Gemini possible — the Transformer architecture.",
    whatItIntroduced:
      "Replaced recurrent neural networks with self-attention, enabling full parallelisation during training and capturing global context in a single layer. Multi-head attention learns multiple types of token relationships simultaneously — syntax, semantics, coreference. Positional encoding provides sequence ordering since attention is permutation-invariant. Scaling this architecture with more data and compute created every major LLM that exists.",
    careerImpact:
      "Every AI engineer working with LLMs, embedding models, or multimodal systems is building on this architecture. Understanding how attention weights are computed explains why prompt ordering matters, why context length limits exist, why RAG retrieval quality determines generation quality, and why fine-tuning works differently from prompting. It is the most essential paper in the current AI engineering stack.",
    whyYouMustRead:
      "Because an AI engineer who doesn't understand Transformers is like an electrician who doesn't understand circuits — they can follow diagrams but can't diagnose failures.",
  },
  {
    id: "ai-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin, Chang, Lee, Toutanova — Google AI",
    year: 2018,
    track: "AI Engineer",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/1810.04805",
    legacyTagline: "BERT redefined NLP: fine-tune once, win everywhere — the transfer learning blueprint.",
    whatItIntroduced:
      "Pre-trained a bidirectional Transformer on massive text using masked language modelling and next-sentence prediction. Bidirectional context (seeing both left and right simultaneously) dramatically improved representation quality over GPT's left-to-right approach. Established the fine-tune paradigm: a single pre-trained model adapted to 11 NLP benchmarks with minimal task-specific code.",
    careerImpact:
      "Semantic search, text classification, document similarity, question answering — these production use cases are powered by BERT variants (RoBERTa, DistilBERT, sentence-transformers). AI engineers who understand BERT's fine-tuning workflow know when to reach for a pre-trained embedding model versus training from scratch, which is the difference between a one-week project and a six-month one.",
    whyYouMustRead:
      "Because sentence embeddings power half of modern AI search and NLP features, and BERT is where embeddings became commoditised.",
  },
  {
    id: "ai-3",
    title: "Language Models are Few-Shot Learners (GPT-3)",
    authors: "Brown, Mann, Ryder et al. — OpenAI",
    year: 2020,
    track: "AI Engineer",
    difficulty: "Advanced",
    url: "https://arxiv.org/abs/2005.14165",
    legacyTagline: "Scaling to 175B parameters created emergent capabilities nobody predicted — and changed what AI products look like.",
    whatItIntroduced:
      "Scaled Transformers to 175 billion parameters and demonstrated few-shot learning: providing 2-10 examples in the prompt enables generalisation to new tasks without any gradient updates. Showed that scaling laws predict performance — more parameters plus more data produces better models reliably. Revealed emergent capabilities at scale: arithmetic, translation, and code generation that simply weren't present at smaller sizes.",
    careerImpact:
      "GPT-3 changed the AI product paradigm from 'train a specialised model' to 'engineer a prompt for a foundation model'. AI engineers who understand scaling laws and in-context learning make better choices about when to prompt engineer, when to fine-tune, and when to build a RAG system. It also explains why LLM outputs appear confident while being wrong: the model is pattern-completing, not reasoning.",
    whyYouMustRead:
      "Because understanding why LLMs work the way they do — and why they fail the way they fail — requires reading the paper that created the modern AI product landscape.",
  },
  {
    id: "ai-4",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: "Lewis, Perez, Piktus et al. — Facebook AI",
    year: 2020,
    track: "AI Engineer",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/2005.11401",
    legacyTagline: "The architecture behind every 'chat with your documents' AI product — RAG was formalised here.",
    whatItIntroduced:
      "Combined a dense retriever (vector search over a knowledge corpus) with a sequence-to-sequence generator to produce factual answers grounded in retrieved documents. Showed that retrieval dramatically reduces hallucination by providing the model with relevant context rather than relying solely on parametric memory. Enabled knowledge updates without model retraining — just update the document index.",
    careerImpact:
      "Every AI engineer building document Q&A, enterprise search, or customer support automation implements RAG. This paper gives you the original architecture to evaluate design choices: DPR vs BM25 vs hybrid retrieval, chunk size and overlap, reranking strategies, faithfulness versus relevance trade-offs. Understanding RAG from the original paper makes you a more effective evaluator of LangChain, LlamaIndex, and similar frameworks.",
    whyYouMustRead:
      "Because RAG is the most commercially important AI architecture of 2024 and this paper explains why it works from first principles.",
  },
  {
    id: "ai-5",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: "Bai, Jones, Ndousse et al. — Anthropic",
    year: 2022,
    track: "AI Engineer",
    difficulty: "Advanced",
    url: "https://arxiv.org/abs/2212.08073",
    legacyTagline: "The alignment technique behind Claude — how to make LLMs helpful and harmless without human labellers for every case.",
    whatItIntroduced:
      "Proposed Constitutional AI: training a model to critique and revise its own outputs based on a written set of principles (a constitution) before RLHF. Used AI-generated feedback to scale alignment beyond what human labelling can achieve. Introduced self-critique and revision as a two-stage process making the model's values explicit in a readable document rather than implicit RLHF preferences.",
    careerImpact:
      "AI engineers building production LLM applications must handle safety, guardrails, and alignment. Understanding Constitutional AI informs how system prompts should be written, why chain-of-thought reasoning improves model safety, and how to evaluate LLM outputs programmatically at scale. It's the foundation for red-teaming and evaluation frameworks every serious AI engineering team uses.",
    whyYouMustRead:
      "Because deploying LLMs in production without understanding alignment is shipping a system whose failure modes you haven't thought about.",
  },

  // ─── DATA SCIENTIST ───────────────────────────────────────────────────────
  {
    id: "ds-1",
    title: "A Few Useful Things to Know About Machine Learning",
    authors: "Pedro Domingos — University of Washington",
    year: 2012,
    track: "Data Scientist",
    difficulty: "Beginner",
    url: "https://dl.acm.org/doi/10.1145/2347736.2347755",
    legacyTagline: "The paper every data scientist should read before touching a single scikit-learn function.",
    whatItIntroduced:
      "Presented 12 key lessons about ML that practitioners learn after years of experience: that features matter more than algorithms, that overfitting is the core danger, that ensembles almost always outperform single models, and that there is no universally best algorithm. Written in plain language without equations, making it accessible to anyone.",
    careerImpact:
      "Data scientists who read this paper before building their first model avoid the most common production failures: overfit models, algorithm-shopping instead of feature engineering, and overconfident conclusions from underpowered experiments. The insight that 'more data beats better algorithms' changes how you prioritise data collection versus modelling time — which is the most impactful data science decision at most companies.",
    whyYouMustRead:
      "Because a data scientist who doesn't know these 12 things will discover them all painfully through production failures over the next few years.",
  },
  {
    id: "ds-2",
    title: "Random Forests",
    authors: "Leo Breiman — UC Berkeley",
    year: 2001,
    track: "Data Scientist",
    difficulty: "Beginner",
    url: "https://link.springer.com/article/10.1023/A:1010933404324",
    legacyTagline: "The ensemble algorithm that works well on virtually every tabular dataset — the data scientist's strongest baseline.",
    whatItIntroduced:
      "Combined bagging (bootstrap sampling) with random feature subsets at each split to create a forest of decorrelated trees. Proved mathematically that averaging decorrelated trees reduces variance without increasing bias — explaining why ensembles outperform their components. Introduced out-of-bag error as a free validation estimate and feature importance scores as a natural by-product of the training process.",
    careerImpact:
      "Random Forest is the first model every data scientist should try on a new tabular dataset. It almost never embarrassingly fails, provides feature importance for stakeholder explanations, handles missing values and mixed feature types, and requires minimal preprocessing. Understanding the paper means you know when Random Forest is the right answer (most times with tabular data) and when XGBoost or neural networks are worth the extra complexity.",
    whyYouMustRead:
      "Because 'I tried XGBoost' is not a scientific approach — understanding why Random Forest is your baseline requires reading the paper that invented it.",
  },
  {
    id: "ds-3",
    title: "XGBoost: A Scalable Tree Boosting System",
    authors: "Tianqi Chen & Carlos Guestrin — UW / CMU",
    year: 2016,
    track: "Data Scientist",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/1603.02754",
    legacyTagline: "The algorithm behind more Kaggle gold medals than any other — and the de facto standard for tabular prediction.",
    whatItIntroduced:
      "Introduced an efficient gradient boosting implementation with regularisation (L1 and L2 penalties on tree weights) preventing the overfitting that plagued naive gradient boosting. Added column subsampling borrowing the decorrelation idea from Random Forests. Designed a split-finding algorithm that handles sparse data (missing values) natively. Made the system scale to billions of examples on distributed systems.",
    careerImpact:
      "XGBoost powers fraud detection, churn prediction, credit scoring, and demand forecasting at thousands of companies. Data scientists who understand boosting — not just the API — can tune hyperparameters with insight rather than grid search, diagnose training instability, and know when LightGBM or CatBoost is a better tool. It remains the strongest non-neural model for tabular data in production.",
    whyYouMustRead:
      "Because most Kaggle competition winners used XGBoost for five years straight, and knowing why it wins makes you understand tree boosting at the algorithmic level.",
  },
  {
    id: "ds-4",
    title: "Deep Learning",
    authors: "Yann LeCun, Yoshua Bengio, Geoffrey Hinton — Nature",
    year: 2015,
    track: "Data Scientist",
    difficulty: "Intermediate",
    url: "https://www.nature.com/articles/nature14539",
    legacyTagline: "The landmark survey by the three Turing Award winners who built the field — the definitive overview of modern neural networks.",
    whatItIntroduced:
      "Surveyed the history and mathematical foundations of deep learning: backpropagation through deep networks, convolutional architectures for vision, recurrent architectures for sequences, and representation learning as the unified framework. Showed that depth allows networks to learn hierarchical representations, with each layer composing features from the previous one. Argued that representation learning subsumes both feature engineering and modelling into a single learned process.",
    careerImpact:
      "Data scientists who understand this survey can reason about when deep learning is the right tool versus when a gradient-boosted tree is better. The hierarchical representation framework explains why CNNs outperform hand-crafted features on images, why RNNs naturally model time series, and why Transformer attention generalised across modalities. It provides the conceptual anchoring for moving from classical ML to the deep learning stack.",
    whyYouMustRead:
      "Because it's written by the three people who invented deep learning, and no other survey matches its combination of depth and clarity.",
  },
  {
    id: "ds-5",
    title: "Statistical Learning Theory",
    authors: "Vladimir N. Vapnik",
    year: 1995,
    track: "Data Scientist",
    difficulty: "Advanced",
    url: "https://link.springer.com/book/10.1007/978-1-4757-3264-1",
    legacyTagline: "The mathematical proof of why generalisation works — and what determines the sample size you actually need.",
    whatItIntroduced:
      "Introduced VC (Vapnik-Chervonenkis) dimension as a measure of model class complexity — its capacity to memorise arbitrary labellings. Derived generalisation error bounds as a function of training error plus a complexity penalty proportional to VC dimension. Proved that Support Vector Machines, by maximising margin, minimise the VC dimension-related term and thus achieve better generalisation with theoretical guarantees.",
    careerImpact:
      "Data scientists with this theoretical background know why a model that achieves 99% training accuracy but 70% test accuracy has a VC complexity problem, not a data problem. The structural risk minimisation framework informs regularisation choices across every model type. It provides the vocabulary to have genuine conversations with ML researchers and to read papers that cite PAC learning or generalisation bounds.",
    whyYouMustRead:
      "Because every data scientist who tunes regularisation parameters is applying this theory blindly — reading it makes those decisions principled.",
  },

  // ─── DATA ENGINEER ────────────────────────────────────────────────────────
  {
    id: "de-1",
    title: "The Google File System",
    authors: "Ghemawat, Gobioff, Leung — Google",
    year: 2003,
    track: "Data Engineer",
    difficulty: "Intermediate",
    url: "https://research.google/pubs/the-google-file-system/",
    legacyTagline: "The distributed storage design that made Hadoop HDFS possible and changed how the world stores big data.",
    whatItIntroduced:
      "Designed a file system for thousands of commodity Linux machines storing petabytes of large files with fault tolerance through automatic 3x replication. Optimised for append-heavy workloads (log files, web crawl data) rather than random reads and writes. Introduced the master-chunkserver architecture where the master holds all metadata in memory for fast namespace operations while chunkservers store the actual data.",
    careerImpact:
      "Hadoop HDFS is a direct open-source implementation of GFS. Delta Lake, Apache Iceberg, and Apache Hudi (modern data lake table formats) all run on HDFS-compatible storage. A data engineer who understands GFS comprehends why Spark prefers to process data on the node that holds it, why small file problems kill HDFS performance, and how object stores (S3, GCS) differ from GFS in their consistency model.",
    whyYouMustRead:
      "Because every data lake, every Spark cluster, every HDFS deployment descends from this paper and understanding the ancestor explains the descendant's design choices.",
  },
  {
    id: "de-2",
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    authors: "Jeffrey Dean & Sanjay Ghemawat — Google",
    year: 2004,
    track: "Data Engineer",
    difficulty: "Beginner",
    url: "https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/",
    legacyTagline: "The paradigm that launched the entire big data industry. Hadoop came after this, then Spark, then everything else.",
    whatItIntroduced:
      "Abstracted distributed data processing into Map and Reduce phases that can run in parallel across thousands of machines. Automated partitioning, fault recovery, and data shuffling between phases. Introduced the combiner optimisation that pre-aggregates Map output before the shuffle to reduce network traffic — a pattern Spark also implements.",
    careerImpact:
      "Every ETL pipeline, every data transformation job, every batch processing system a data engineer builds implements some variant of MapReduce thinking: parallelise transformations, group and aggregate by key. Spark's RDD transformations (map, flatMap, reduceByKey) are direct implementations. Understanding the paradigm makes you reason about data skew, shuffle cost, and partition count with genuine insight.",
    whyYouMustRead:
      "Because understanding why Spark's groupByKey is slow and aggregateByKey is fast requires understanding the MapReduce shuffle phase.",
  },
  {
    id: "de-3",
    title: "Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing",
    authors: "Zaharia, Chowdhury, Das et al. — UC Berkeley",
    year: 2012,
    track: "Data Engineer",
    difficulty: "Intermediate",
    url: "https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf",
    legacyTagline: "The paper that invented Apache Spark — 10-100x faster than MapReduce and now the dominant distributed processing engine.",
    whatItIntroduced:
      "Proposed RDDs (Resilient Distributed Datasets): immutable, partitioned collections that record their lineage (the sequence of transformations that produced them) for fault recovery without expensive checkpointing. Demonstrated that in-memory computation between stages eliminates the MapReduce disk I/O overhead that dominated batch job execution time. Introduced lazy evaluation: transformations build a computation graph executed only when an action triggers it.",
    careerImpact:
      "Apache Spark is the primary distributed processing engine used by data engineers at mid-to-large scale companies. Understanding RDDs and lazy evaluation makes Spark Pipeline debugging tractable: you understand why lineage errors sometimes appear at action time, why .cache() is critical before reusing an expensive transformation, and why certain operations trigger expensive shuffles across partition boundaries.",
    whyYouMustRead:
      "Because debugging Spark jobs without understanding RDDs and lazy evaluation is like debugging SQL without understanding the query planner.",
  },
  {
    id: "de-4",
    title: "Kafka: A Distributed Messaging System for Log Processing",
    authors: "Kreps, Narkhede, Rao — LinkedIn",
    year: 2011,
    track: "Data Engineer",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/2213836.2213878",
    legacyTagline: "The messaging system that enabled real-time data pipelines at Uber, Netflix, Airbnb scale.",
    whatItIntroduced:
      "Designed a distributed commit log optimised for high-throughput persistent message delivery. Consumer groups allow horizontal scaling of message consumption without coordination overhead. Offset-based consumption means consumers independently control their read position, enabling time-travel replay and exactly-once processing semantics. Retention policies allow the same topic to serve both real-time and historical use cases.",
    careerImpact:
      "Kafka is the backbone of real-time data pipelines at thousands of companies. Data engineers who understand its commit log model design topics with correct partition counts for parallelism, configure retention for compliance requirements, implement consumer groups for scalable processing, and use compacted topics for CDC patterns. Kafka Connect and Kafka Streams extend its use into complete ETL frameworks.",
    whyYouMustRead:
      "Because Kafka is intimidating until you understand it's an append-only log with consumer offsets, and that realisation takes 10 minutes of reading this paper.",
  },
  {
    id: "de-5",
    title: "Dynamo: Amazon's Highly Available Key-Value Store",
    authors: "Giuseppe DeCandia et al. — Amazon",
    year: 2007,
    track: "Data Engineer",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1145/1323293.1294281",
    legacyTagline: "Why Cassandra was built, why DynamoDB works the way it does — the theory of always-available distributed databases.",
    whatItIntroduced:
      "Made the explicit trade-off choice to prioritise availability over consistency for business-critical data. Consistent hashing allowed adding capacity without reshuffling all data. Merkle trees enabled efficient anti-entropy repair between replicas. The architecture directly inspired Apache Cassandra which made these patterns available as open-source infrastructure.",
    careerImpact:
      "Data engineers choosing between relational and NoSQL storage for different parts of a data platform need to understand this trade-off model. High-throughput write sinks, time-series event stores, and session data stores warrant Dynamo-like systems. Understanding eventual consistency and quorum mechanics helps data engineers configure Cassandra or DynamoDB with appropriate read/write consistency levels for each use case.",
    whyYouMustRead:
      "Because every data engineer who configures a NoSQL database is implicitly choosing consistency models, and this paper makes that choice explicit and reasoned.",
  },

  // ─── ANDROID DEVELOPER ────────────────────────────────────────────────────
  {
    id: "and-1",
    title: "Android: Platform Architecture and Application Fundamentals",
    authors: "Google Android Engineering",
    year: 2007,
    track: "Android Developer",
    difficulty: "Beginner",
    url: "https://developer.android.com/guide/components/fundamentals",
    legacyTagline: "The platform model that every Android app is built on — components, lifecycles, and the Linux sandbox.",
    whatItIntroduced:
      "Defined Android's four application components: Activities, Services, Broadcast Receivers, and Content Providers — each with distinct lifecycles and system interactions. Established the Intent system as the decoupled messaging mechanism for both intra-app and inter-app communication. Defined the application sandbox model where each app runs as a unique Linux user with its own process and memory space.",
    careerImpact:
      "Understanding the component model prevents the most common Android bugs: Activity leaking resources across rotations, Services running indefinitely and draining battery, null pointer crashes from accessing a destroyed Activity's views. Every Android developer who correctly handles configuration changes, implements proper lifecycle callbacks, and uses ViewModel to survive rotation has internalised this architecture.",
    whyYouMustRead:
      "Because Activity lifecycle bugs are the most common cause of Android crashes and they all trace back to misunderstanding this foundational architecture document.",
  },
  {
    id: "and-2",
    title: "Dalvik VM Internals (Google I/O 2008)",
    authors: "Dan Bornstein — Google",
    year: 2008,
    track: "Android Developer",
    difficulty: "Intermediate",
    url: "https://sites.google.com/site/io/dalvik-vm-internals",
    legacyTagline: "Understanding the Android runtime explains every performance, size, and APK limit you'll hit in production.",
    whatItIntroduced:
      "Explained the Dalvik bytecode format (register-based versus JVM's stack-based), the DEX file format that merges multiple .class files into a single optimised archive, and the garbage collector that runs within tight mobile memory constraints. The 65,536 method reference limit stems directly from the DEX file format's 16-bit method index.",
    careerImpact:
      "Android developers who understand the runtime know why the 65k method limit exists and why multidex is the solution, why ProGuard/R8 shrinking reduces APK size and startup time by removing unused methods from the DEX, why ART's ahead-of-time compilation makes apps faster after the first install, and how to use the Android Profiler's memory and CPU views to find runtime performance problems.",
    whyYouMustRead:
      "Because hitting the 65k method limit without understanding why it exists means scrambling for a solution instead of confidently implementing multidex.",
  },
  {
    id: "and-3",
    title: "Material Design Specification",
    authors: "Google Design Team",
    year: 2014,
    track: "Android Developer",
    difficulty: "Beginner",
    url: "https://m3.material.io/",
    legacyTagline: "The visual language every Android user expects — implement it correctly and your app feels native instantly.",
    whatItIntroduced:
      "Defined Android's visual design language using physical metaphors of paper and ink with consistent elevation, shadow, colour, and motion. Introduced a systematic colour palette generation from a primary seed colour. Material You (Material 3) extended this with dynamic colour that adapts to the user's wallpaper — making theming a system capability rather than an app configuration.",
    careerImpact:
      "Android apps that don't follow Material Design feel foreign on Android devices and receive negative Play Store reviews. Jetpack Compose's MaterialTheme, the colorScheme tokens, shape definitions, and typography scale are all direct implementations of the M3 specification. Understanding the specification means you customise Compose components correctly rather than fighting the framework.",
    whyYouMustRead:
      "Because Android users have subconscious expectations of how apps should look and behave and Material Design is the definition of those expectations.",
  },
  {
    id: "and-4",
    title: "Efficient Background Processing on Android (WorkManager)",
    authors: "Google Android Team",
    year: 2018,
    track: "Android Developer",
    difficulty: "Intermediate",
    url: "https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started",
    legacyTagline: "How to make background tasks that actually run without getting killed by Doze, battery optimisation, or Android's own scheduler.",
    whatItIntroduced:
      "Introduced WorkManager as the recommended solution for guaranteed background work on Android, abstracting over JobScheduler, AlarmManager, and Firebase JobDispatcher based on API level. Defined constraint-based scheduling (network, battery, storage) to prevent unnecessary resource use. Explained periodic work intervals, work chaining for sequential and parallel task pipelines, and retry policies with exponential backoff.",
    careerImpact:
      "Android's Doze mode and App Standby collectively kill background tasks from apps that don't use WorkManager correctly. Developers who understand WorkManager's constraint model ship apps that sync data reliably without being restricted by the system or draining battery. Work chaining enables complex multi-step background workflows — image upload plus thumbnail generation plus database update — as a manageable dependency graph.",
    whyYouMustRead:
      "Because background work that silently fails in production while passing every local test is caused by not understanding the constraints WorkManager was built to handle.",
  },
  {
    id: "and-5",
    title: "Improving App Performance with Android Vitals",
    authors: "Google Play & Android Team",
    year: 2017,
    track: "Android Developer",
    difficulty: "Intermediate",
    url: "https://developer.android.com/topic/performance/vitals",
    legacyTagline: "Google's production quality bar for Android apps — and the metrics that determine your Play Store ranking.",
    whatItIntroduced:
      "Defined the Android Vitals dashboard metrics: ANR rate, crash rate, excessive wakeups, and stuck partial wakelocks that Google uses to identify misbehaving apps. Set targets: cold start under 5 seconds, warm start under 2 seconds, hot start under 1.5 seconds. Introduced the Play Console Android Vitals dashboard giving developers production performance data from real user devices.",
    careerImpact:
      "Apps with bad Vitals scores are actively penalised in Play Store search rankings. Android developers who monitor ANR traces from the console, fix slow main-thread operations causing Application Not Responding errors, and profile startup time with Macrobenchmark library ship apps that rank higher and keep users. Understanding each metric — what causes it and how to fix it — is the difference between a rejected app and a featured one.",
    whyYouMustRead:
      "Because Play Store ranking algorithms use your app's Vitals scores, and a beautiful app that crashes 5% of the time will never get organic discovery.",
  },

  // ─── IOS DEVELOPER ────────────────────────────────────────────────────────
  {
    id: "ios-1",
    title: "The Swift Programming Language",
    authors: "Apple Inc.",
    year: 2014,
    track: "iOS Developer",
    difficulty: "Beginner",
    url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/",
    legacyTagline: "The language reference that defines modern iOS development — optionals, value types, and Swift concurrency.",
    whatItIntroduced:
      "Introduced optionals as a compile-time mechanism to safely handle the absence of values, eliminating the most common class of Objective-C crashes (nil message send). Defined value types (struct, enum) with copy-on-assign semantics preventing accidental shared mutable state. Swift Concurrency (async/await and actors) brought structured concurrency with data race elimination enforced by the compiler.",
    careerImpact:
      "Swift's type system and concurrency model are what make high-quality iOS code possible. Developers who understand the difference between value and reference semantics write code without subtle sharing bugs. Actors prevent data races that previously required manual locking and unlock synchronisation. Protocol-oriented design with protocol extensions replaces inheritance hierarchies with composable, testable units.",
    whyYouMustRead:
      "Because most iOS interview mistakes trace back to not understanding optionals, value types, or Swift concurrency at the language level.",
  },
  {
    id: "ios-2",
    title: "Objective-C Runtime Programming Guide",
    authors: "Apple Inc.",
    year: 2009,
    track: "iOS Developer",
    difficulty: "Advanced",
    url: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html",
    legacyTagline: "Understanding the ObjC runtime reveals how KVO, method swizzling, and Swift's @objc interop actually work.",
    whatItIntroduced:
      "Explained that Objective-C sends messages (objc_msgSend) rather than calling methods directly — resolved at runtime through the method table. Described method swizzling: replacing a method's implementation at runtime, used by analytics SDKs, crash reporters, and testing frameworks. Introduced isa-swizzling: the mechanism behind KVO that creates observer subclasses dynamically without the observed class's knowledge.",
    careerImpact:
      "iOS developers who understand the runtime can debug mysterious crash logs that reference objc_msgSend, understand why @objc and dynamic are required for certain Swift features, implement method swizzling safely for analytics instrumentation, and read the Mach-O binary format in crash reports. It also explains why Swift's performance advantage over Objective-C exists: fewer dynamic dispatch calls.",
    whyYouMustRead:
      "Because the hardest-to-debug iOS crashes involve the Objective-C runtime and developers who've read this paper recognise them immediately.",
  },
  {
    id: "ios-3",
    title: "iOS App Performance: Responsiveness (WWDC 2012)",
    authors: "Apple Engineering",
    year: 2012,
    track: "iOS Developer",
    difficulty: "Intermediate",
    url: "https://developer.apple.com/videos/play/wwdc2012/235/",
    legacyTagline: "The session that defined what 60fps iOS apps look like and what breaks them.",
    whatItIntroduced:
      "Explained that iOS's Core Animation render server runs in a separate process — UIKit operations submit commands to the render server rather than directly accessing hardware. Identified off-screen rendering (cornerRadius + masksToBounds naively applied) as a common cause of GPU overload. Showed that image decoding happens synchronously on the main thread using UIImage imageNamed: — the source of list scroll jank.",
    careerImpact:
      "iOS developers who've watched this session understand why smooth scrolling requires cell height pre-calculation, image decoding on background threads, and layer geometry changes minimised during scroll. Instruments' Core Animation template becomes readable — you can identify off-screen rendering passes, dropped frames, and GPU overdraw rather than seeing only unexplained performance numbers.",
    whyYouMustRead:
      "Because the gap between a UITableView that scrolls at 60fps and one that stutters at 30fps is explained entirely by this session.",
  },
  {
    id: "ios-4",
    title: "Energy Efficiency Guide for iOS Apps",
    authors: "Apple Inc.",
    year: 2015,
    track: "iOS Developer",
    difficulty: "Intermediate",
    url: "https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/",
    legacyTagline: "Battery drain is the most complained-about issue in App Store reviews — this guide explains every cause.",
    whatItIntroduced:
      "Categorised iOS energy use into CPU, GPU, and radio (networking/GPS) components with different power profiles. Showed that location accuracy (kCLLocationAccuracyBest vs kCLLocationAccuracyHundredMeters) has a 10x energy impact. Explained NSURLSession background sessions for large transfers that continue after app backgrounding without keeping the app alive. Quantified background app refresh energy cost.",
    careerImpact:
      "iOS apps that drain battery disproportionately receive negative reviews and get restricted by iOS Background App Refresh throttling. Developers who profile energy usage with Instruments' Energy Log view and implement batched network requests, appropriate location accuracy, and minimal background fetch schedules ship apps that users trust to leave installed. The Energy Organiser in Xcode shows production battery impact from real user devices.",
    whyYouMustRead:
      "Because 'your app drains my battery' is the fastest way to uninstall and a one-star review, and this guide is the complete prevention manual.",
  },
  {
    id: "ios-5",
    title: "Core Data Programming Guide",
    authors: "Apple Inc.",
    year: 2004,
    track: "iOS Developer",
    difficulty: "Intermediate",
    url: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreData/index.html",
    legacyTagline: "Apple's persistence framework — the foundation of offline-first iOS apps and the infrastructure behind SwiftData.",
    whatItIntroduced:
      "Defined the Core Data stack: persistent store coordinator managing storage format, managed object context tracking in-memory object graph, and managed objects as Swift/ObjC representations of persisted data. Introduced faulting (lazy loading of relationships) to avoid loading entire object graphs into memory. Defined lightweight and custom migration paths for schema evolution without data loss.",
    careerImpact:
      "Core Data powers most iOS apps that store user data locally — notes apps, health apps, and any offline-first product. SwiftData (@Model, @Query) is Core Data with a Swift-native API and the same underlying architecture. Understanding background context patterns prevents UI thread blocking from heavy read operations. Understanding migration prevents data loss when schema changes ship in updates.",
    whyYouMustRead:
      "Because offline-first is the expectation for quality iOS apps and Core Data is still the mechanism that makes it possible, even if SwiftData is now the API.",
  },

  // ─── ML ENGINEER ──────────────────────────────────────────────────────────
  {
    id: "ml-1",
    title: "Attention Is All You Need",
    authors: "Vaswani, Shazeer, Parmar et al. — Google Brain",
    year: 2017,
    track: "ML Engineer",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/1706.03762",
    legacyTagline: "The architecture every ML engineer must implement from scratch at least once.",
    whatItIntroduced:
      "Replaced sequential recurrence with parallel self-attention enabling transformers to be trained on orders-of-magnitude more data than RNNs allowed. Multi-head attention applies multiple attention heads in parallel, each learning different token relationships. The encoder-decoder structure with cross-attention enables sequence-to-sequence tasks from translation to code generation.",
    careerImpact:
      "ML engineers building, fine-tuning, or serving language models, vision transformers, or multimodal systems must understand the attention mechanism at the matrix multiplication level. This knowledge makes debugging training instability tractable, informs decisions about context length vs memory trade-offs, explains why attention heads can be pruned for inference speed, and is required for reading any modern ML paper.",
    whyYouMustRead:
      "Because implementing a Transformer from scratch — attention, positional encoding, and all — is the single highest-return reading exercise for any ML engineer.",
  },
  {
    id: "ml-2",
    title: "Deep Residual Learning for Image Recognition",
    authors: "He, Zhang, Ren, Sun — Microsoft Research",
    year: 2015,
    track: "ML Engineer",
    difficulty: "Beginner",
    url: "https://arxiv.org/abs/1512.03385",
    legacyTagline: "Skip connections: the single architectural insight that made 1000-layer networks trainable.",
    whatItIntroduced:
      "Demonstrated that networks deeper than 20 layers suffered from degradation — not overfitting but training error actually increasing. Solved it with residual connections (skip connections) that allow gradients to flow directly through layers, bypassing the vanishing gradient problem for arbitrarily deep networks. ResNet-152 achieved lower training error than shallower networks for the first time.",
    careerImpact:
      "ResNet variants are still the backbone of production computer vision systems: object detection (Faster R-CNN, YOLO), segmentation, and multimodal models all use ResNet feature extractors. Residual connections were subsequently adopted by every major architecture including Transformers — the layer-norm + residual pattern in GPT is a direct descendant. ML engineers who understand why residuals work design their own custom architectures with principled depth.",
    whyYouMustRead:
      "Because the skip connection is the most important single idea in deep learning architecture and this paper introduces it with experimental clarity.",
  },
  {
    id: "ml-3",
    title: "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift",
    authors: "Ioffe & Szegedy — Google",
    year: 2015,
    track: "ML Engineer",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/1502.03167",
    legacyTagline: "The technique that allowed 10x higher learning rates and made deep networks trainable without careful initialisation.",
    whatItIntroduced:
      "Normalised each layer's input distribution to zero mean and unit variance across the mini-batch, eliminating internal covariate shift. Learnable scale and shift parameters (gamma, beta) allow the network to undo normalisation when beneficial. Demonstrated that BatchNorm eliminates the need for careful weight initialisation and acts as implicit regularisation similar to Dropout.",
    careerImpact:
      "ML engineers who understand BatchNorm's failure modes (tiny batch sizes, online inference) know when to use LayerNorm (Transformers), GroupNorm (small batch detection), or InstanceNorm (style transfer) instead. Understanding that batch statistics during training differ from running statistics during inference explains a class of model bugs where training accuracy is high but inference accuracy is degraded.",
    whyYouMustRead:
      "Because every deep learning architecture uses some normalisation layer and choosing the wrong type causes persistent training instability that's hard to diagnose without this paper.",
  },
  {
    id: "ml-4",
    title: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",
    authors: "Srivastava, Hinton, Krizhevsky, Sutskever, Salakhutdinov",
    year: 2014,
    track: "ML Engineer",
    difficulty: "Beginner",
    url: "https://jmlr.org/papers/v15/srivastava14a.html",
    legacyTagline: "Randomly deleting neurons during training — the deceptively simple regularisation trick that transformed deep learning.",
    whatItIntroduced:
      "Randomly set neuron activations to zero with probability p during each training forward pass, independently sampled each time. Proved this approximates training an exponential ensemble of different network architectures sharing weights. At test time, weights are scaled by (1-p) to account for more active neurons. Showed dramatic reduction in overfitting across vision, speech, and document classification tasks.",
    careerImpact:
      "ML engineers use Dropout in training architectures routinely but its effectiveness diminishes with Batch Normalisation. Understanding why enables principled choices: Dropout still helps with fully-connected layers and at architecture bottlenecks, Stochastic Depth (dropping entire residual blocks) works better for deep convolutional nets. Test-time Dropout (MC Dropout) enables uncertainty estimation from a deterministic model — a production ML use case.",
    whyYouMustRead:
      "Because Dropout is used in nearly every training recipe but its interaction with inference, BatchNorm, and uncertainty estimation is subtle enough to cause real production bugs without this grounding.",
  },
  {
    id: "ml-5",
    title: "MLflow: A Machine Learning Lifecycle Platform",
    authors: "Zaharia, Chen, Davidson et al. — Databricks",
    year: 2018,
    track: "ML Engineer",
    difficulty: "Beginner",
    url: "https://arxiv.org/abs/1807.09813",
    legacyTagline: "The framework that introduced software engineering discipline — versioning, reproducibility — to the chaotic world of ML experiments.",
    whatItIntroduced:
      "Defined four components of the ML lifecycle: Tracking (logging parameters, metrics, and artefacts per run), Projects (packaging ML code for reproducible execution), Models (standardising model serialisation across frameworks), and Registry (staging, versioning, and promoting models to production). Argued that without systematic tracking, ML experiments are not reproducible and production deployments are not auditable.",
    careerImpact:
      "ML engineers who use MLflow tracking from day one can compare 50 experiment runs, reproduce any model exactly, and roll back production models when performance degrades. The Model Registry provides a formal promotion workflow — staging to production — that makes ML deployment as structured as software deployment. This is what separates notebook ML from production ML engineering.",
    whyYouMustRead:
      "Because ML engineering without experiment tracking is amateur hour — this paper defines the professional standard.",
  },

  // ─── QA ENGINEER ──────────────────────────────────────────────────────────
  {
    id: "qa-1",
    title: "The Art of Software Testing",
    authors: "Glenford J. Myers",
    year: 1979,
    track: "QA Engineer",
    difficulty: "Beginner",
    url: "https://www.wiley.com/en-us/The+Art+of+Software+Testing-p-9781118031964",
    legacyTagline: "The foundational text of software testing — every test case design technique used today originated here.",
    whatItIntroduced:
      "Established the counterintuitive philosophy that testing's goal is to find defects, not to prove software works — a mindset shift foundational to the discipline. Introduced equivalence partitioning (test one representative value per class of inputs), boundary value analysis (bugs concentrate at edges), and decision table testing (covering combinations of conditions). Proved that exhaustive testing is impossible, making testing a risk management activity.",
    careerImpact:
      "QA engineers who apply equivalence partitioning design dramatically fewer test cases that cover dramatically more ground. Boundary value analysis alone catches a disproportionate share of real-world bugs because off-by-one errors concentrate at input range boundaries. The discipline of characterising test completeness through class coverage rather than counting test scripts starts with this book.",
    whyYouMustRead:
      "Because a QA engineer who hasn't read Myers tests by instinct; one who has tests by design — a meaningful difference in coverage and efficiency.",
  },
  {
    id: "qa-2",
    title: "A Practical Guide to Testing Object-Oriented Software",
    authors: "McGregor & Sykes",
    year: 2001,
    track: "QA Engineer",
    difficulty: "Intermediate",
    url: "https://www.pearson.com/en-us/subject-catalog/p/practical-guide-to-testing-object-oriented-software-a/P200000003290",
    legacyTagline: "Testing inheritance hierarchies, mock objects, and contracts — the bridge from academic testing theory to OOP production code.",
    whatItIntroduced:
      "Addressed the unique testing challenges of object-oriented code: state-based testing of classes, contract testing of interfaces, testing inheritance hierarchies through the Liskov Substitution Principle (subtypes must pass all supertype tests), and mock objects for isolating units from their collaborators.",
    careerImpact:
      "QA engineers who understand this book design unit tests that genuinely isolate behaviour rather than integration tests masquerading as unit tests. Mock object design — knowing what to mock and what to leave real — is the most important skill for writing fast, reliable unit test suites. The book's contract testing approach is the basis for modern consumer-driven contract testing with Pact.",
    whyYouMustRead:
      "Because most developers who write 'unit tests' are writing integration tests with mocks they don't understand, and this book corrects that misunderstanding.",
  },
  {
    id: "qa-3",
    title: "Continuous Delivery",
    authors: "Jez Humble & David Farley",
    year: 2010,
    track: "QA Engineer",
    difficulty: "Intermediate",
    url: "https://continuousdelivery.com/",
    legacyTagline: "The book that moved QA from gate-keeper to pipeline-owner — automated quality as continuous deployment's foundation.",
    whatItIntroduced:
      "Defined the test pyramid: many unit tests (fast, isolated), fewer integration tests, very few end-to-end tests — with each layer having a specific role in the quality gate. Argued that every commit triggers the pipeline and automated tests are the gatekeeper to production. Introduced smoke tests (fast production validation post-deploy) and acceptance test suites (business requirements as executable specification).",
    careerImpact:
      "QA engineers who operate in modern CI/CD environments own the test pyramid architecture — they design which tests live at which layer, set failure thresholds, and maintain test execution time SLOs. Understanding why the pyramid is shaped the way it is — speed vs confidence at each layer — makes pipeline design principled. Non-functional test automation (performance regression, security scanning) as pipeline stages comes from this book.",
    whyYouMustRead:
      "Because manual QA that runs once per sprint is waterfall QA, and this book defines what QA looks like in a team that ships every day.",
  },
  {
    id: "qa-4",
    title: "Why Programs Fail: A Guide to Systematic Debugging",
    authors: "Andreas Zeller",
    year: 2005,
    track: "QA Engineer",
    difficulty: "Intermediate",
    url: "https://www.whyprogramsfail.com/",
    legacyTagline: "Turning debugging from guesswork into a scientific process — delta debugging and cause-effect chains.",
    whatItIntroduced:
      "Introduced the scientific debugging model: observe failure, hypothesise cause, design experiment, test hypothesis — applied rigorously to software. Defined delta debugging: binary search through input or code changes to isolate the minimal failing case. Described cause-effect chains: the defect in code causes an infection in program state that propagates to an observable failure.",
    careerImpact:
      "QA engineers who apply delta debugging reduce a complex failing test to a minimal reproduction in minutes rather than hours — making root cause analysis tractable for developers. The cause-effect chain vocabulary improves bug reports dramatically: instead of 'the button doesn't work', a QA engineer traces which state variable holds the wrong value and when. Automated test case minimisation tools like creduce implement this theory.",
    whyYouMustRead:
      "Because systematic debugging reduces hours of flailing to a reproducible 15-minute process and this book teaches the system.",
  },
  {
    id: "qa-5",
    title: "Hints on Test Data Selection: Mutation Testing",
    authors: "DeMillo, Lipton, Sayward",
    year: 1978,
    track: "QA Engineer",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1109/C-M.1978.218115",
    legacyTagline: "Measure the quality of your tests by injecting bugs — the only metric that actually tells you if your tests work.",
    whatItIntroduced:
      "Proposed mutation testing: systematically introducing small syntactic mutations into source code (change + to -, change > to >=, delete a line) and checking whether the test suite detects each mutation. A killed mutant means tests detected the change. A surviving mutant reveals a gap in test coverage. Mutation score (killed/total) provides a genuine measure of test suite effectiveness beyond line coverage.",
    careerImpact:
      "QA engineers who use mutation testing (Stryker for JavaScript, PIT for Java) discover that high line coverage is compatible with terrible test quality — tests that exercise code without asserting outputs. Mutation scores expose exactly which behaviours are untested. Running Stryker on a codebase for the first time and seeing surviving mutants on critical business logic is a transformative experience for any QA team.",
    whyYouMustRead:
      "Because 90% line coverage with 40% mutation score means your tests watch code execute but don't actually verify it does the right thing.",
  },

  // ─── CYBER SECURITY ───────────────────────────────────────────────────────
  {
    id: "sec-1",
    title: "Communication Theory of Secrecy Systems",
    authors: "Claude E. Shannon — Bell System Technical Journal",
    year: 1949,
    track: "Cyber Security",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1145/584091.584093",
    legacyTagline: "The mathematical definition of secrecy — every encryption algorithm in use today is measured against this paper.",
    whatItIntroduced:
      "Defined perfect secrecy mathematically: a cipher is perfectly secret if observing ciphertext provides zero information about plaintext, regardless of the adversary's computing power. Proved that the one-time pad achieves perfect secrecy and is the only cipher that does so. Introduced entropy (H) as the measure of uncertainty in a message and unicity distance as the minimum ciphertext length needed to uniquely determine a key.",
    careerImpact:
      "Security engineers who understand Shannon's framework know the difference between information-theoretic security (perfect secrecy, impossible to crack with unlimited compute) and computational security (AES, which is breakable in theory but not in practice). This distinction determines algorithm choices, key length requirements, and the limits of what cryptography can guarantee. It is the evaluation framework for every new cipher proposal.",
    whyYouMustRead:
      "Because understanding what cryptography can and cannot guarantee requires Shannon's mathematical framework — without it you're trusting algorithms by reputation rather than proof.",
  },
  {
    id: "sec-2",
    title: "The Protection of Information in Computer Systems",
    authors: "Jerome Saltzer & Michael Schroeder — MIT",
    year: 1975,
    track: "Cyber Security",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1109/PROC.1975.9939",
    legacyTagline: "The eight design principles that prevent most real-world security breaches — still 100% applicable today.",
    whatItIntroduced:
      "Defined eight principles of secure system design: least privilege (minimal access needed), fail-safe defaults (deny by default), complete mediation (check every access), open design (security not through obscurity), separation of privilege (require multiple conditions for critical operations), least common mechanism, psychological acceptability, and work factor.",
    careerImpact:
      "Security engineers who internalise these eight principles evaluate every system design decision through a security lens. Least privilege is why IAM roles in AWS should be as narrow as possible. Fail-safe defaults explain why deny-all firewall rules with explicit allows are more secure than allow-all with explicit denies. Multi-factor authentication is the software implementation of separation of privilege. These principles explain 90% of security architectural decisions.",
    whyYouMustRead:
      "Because every major breach in the last decade violated at least one of these eight 1975 principles — the field has not changed at the fundamental level.",
  },
  {
    id: "sec-3",
    title: "Smashing the Stack for Fun and Profit",
    authors: "Aleph One — Phrack Magazine",
    year: 1996,
    track: "Cyber Security",
    difficulty: "Advanced",
    url: "https://www.phrack.org/issues/49/14.html",
    legacyTagline: "The paper that taught a generation how buffer overflows work — and forced the industry to build ASLR, DEP, and stack canaries.",
    whatItIntroduced:
      "Explained the x86 call stack layout (return address, frame pointer, local variables, parameters) and demonstrated how writing past a buffer's end overwrites the return address with an attacker-controlled value. Introduced the NOP sled technique and hand-crafted shellcode payload. Made stack-based buffer overflow exploitation accessible and understandable for the first time.",
    careerImpact:
      "Security engineers who understand this paper comprehend why ASLR (randomising memory layout), NX/DEP (non-executable stack), and stack canaries (detecting overwrites before return) were developed — they are direct responses to this exact exploit class. CTF binary exploitation challenges, penetration testing engagements, and secure C/C++ code review all require internalising the stack frame model this paper teaches.",
    whyYouMustRead:
      "Because understanding how the most historically impactful class of memory corruption exploits works is prerequisite knowledge for every offensive and defensive security engineer.",
  },
  {
    id: "sec-4",
    title: "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems",
    authors: "Rivest, Shamir, Adleman — MIT",
    year: 1978,
    track: "Cyber Security",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/359340.359342",
    legacyTagline: "RSA: the algorithm behind HTTPS, SSH, email encryption, and code signing — the mathematics of public-key cryptography.",
    whatItIntroduced:
      "Proposed using the computational difficulty of factoring the product of two large primes as the basis for a public-key cryptosystem. Defined key generation (choose primes p,q; n=pq; find e and d satisfying ed ≡ 1 mod φ(n)), encryption (c = m^e mod n), decryption (m = c^d mod n), and digital signatures (sign with private key, verify with public key). Made secure key exchange over insecure channels mathematically feasible.",
    careerImpact:
      "Every TLS handshake, every SSH connection, every X.509 certificate, every code signing operation uses RSA or an elliptic curve variant of its principle. Security engineers who understand RSA key generation can reason about key length requirements (RSA-512 broken in 1999, RSA-2048 currently safe), why OAEP padding is essential (textbook RSA is malleable), and what makes RSA different from symmetric-key cryptography.",
    whyYouMustRead:
      "Because HTTPS, SSH, and digital signatures are the infrastructure of internet security and RSA is the mathematical foundation — understanding it makes you a better security engineer by default.",
  },
  {
    id: "sec-5",
    title: "The Web Application Hacker's Handbook",
    authors: "Dafydd Stuttard & Marcus Pinto",
    year: 2011,
    track: "Cyber Security",
    difficulty: "Intermediate",
    url: "https://www.wiley.com/en-us/The+Web+Application+Hacker%27s+Handbook-p-9781118026472",
    legacyTagline: "The complete atlas of web vulnerabilities — the OWASP Top 10 with technique-level exploitation details.",
    whatItIntroduced:
      "Systematically documented every major web vulnerability class: SQL injection, XSS (stored, reflected, DOM-based), CSRF, IDOR, SSRF, XXE, authentication bypass, session management flaws, and business logic vulnerabilities. Provided exploitation techniques, detection methods, and remediation for each class. Served as the practical foundation for the OWASP Web Security Testing Guide.",
    careerImpact:
      "Security engineers doing web application penetration testing, bug bounty hunting, or code review use this book as their attack vocabulary. Understanding SQLi at the technique level means you recognise it in code review even when it's hidden behind abstraction layers. IDOR identification, SSRF via file upload, and stored XSS through user-controlled markdown are skills built from this kind of structured vulnerability knowledge.",
    whyYouMustRead:
      "Because web security engineers who don't know how attacks work cannot reliably find or fix them — this book builds the attacker mental model that makes defensive work effective.",
  },

  // ─── PRODUCT MANAGER ──────────────────────────────────────────────────────
  {
    id: "pm-1",
    title: "Crossing the Chasm",
    authors: "Geoffrey A. Moore",
    year: 1991,
    track: "Product Manager",
    difficulty: "Beginner",
    url: "https://www.harpercollins.com/products/crossing-the-chasm-3rd-edition-geoffrey-a-moore",
    legacyTagline: "Why most products fail after their initial traction — the chasm between early adopters and the majority market.",
    whatItIntroduced:
      "Identified a 'chasm' between technology early adopters (who tolerate rough edges and incomplete solutions in exchange for competitive advantage) and the early majority (who need a complete, reliable solution before adopting). Argued that crossing requires focusing on a single beachhead market — dominating it completely before expanding. Introduced the 'whole product' concept: the complete solution ecosystem, not just the core technology.",
    careerImpact:
      "Product managers who understand the chasm avoid the most common go-to-market failure: scaling marketing spend after initial PMF traction, discovering the early majority has completely different requirements than early adopters, and running out of runway before finding the right positioning. The bowling pin strategy — which market niche wins first, then which adjacent niche does that success unlock — is a direct tool from this framework.",
    whyYouMustRead:
      "Because confusing early adopter enthusiasm with mainstream product-market fit has killed more well-funded products than any technical failure.",
  },
  {
    id: "pm-2",
    title: "The Lean Startup",
    authors: "Eric Ries",
    year: 2011,
    track: "Product Manager",
    difficulty: "Beginner",
    url: "https://theleanstartup.com/",
    legacyTagline: "Build-Measure-Learn: the scientific method applied to product development.",
    whatItIntroduced:
      "Framed product development as hypothesis testing: every feature is an assumption about user behaviour that must be validated with real data before committing engineering resources. Introduced the Minimum Viable Product not as a cheap version of the product but as the fastest experiment to test a specific hypothesis. Distinguished actionable metrics (that change behaviour) from vanity metrics (that only feel good).",
    careerImpact:
      "Product managers who practise validated learning run experiments before writing PRDs, use cohort retention curves rather than total signups as success metrics, and define pivot vs persevere decisions with explicit evidence criteria. The MVP discipline prevents the most expensive product mistake: building for 6 months based on assumptions that 2 user interviews in week 1 would have invalidated.",
    whyYouMustRead:
      "Because most product roadmaps are lists of guesses, and this book provides the framework for replacing guesses with evidence before the engineering clock starts.",
  },
  {
    id: "pm-3",
    title: "Inspired: How to Create Tech Products Customers Love",
    authors: "Marty Cagan — SVPG",
    year: 2008,
    track: "Product Manager",
    difficulty: "Beginner",
    url: "https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/",
    legacyTagline: "The PM bible — every PM interview question about discovery, delivery, and empowered teams traces to this book.",
    whatItIntroduced:
      "Defined product discovery (finding problems worth solving) as separate from and prior to product delivery (building solutions). Argued for the product trio — PM, designer, and engineer — as co-equal partners in discovery rather than a sequential waterfall. Introduced continuous discovery: weekly customer touchpoints replacing quarterly research sprints. Defined outcome-based roadmaps over feature-based roadmaps.",
    careerImpact:
      "PMs who have internalised this book run discovery sprints before sprint planning, define success metrics for every feature before writing requirements, and push back on feature factory culture by naming it explicitly. The distinction between 'mission-driven product team' and 'feature factory' is a vocabulary choice from this book that has entered mainstream product discourse.",
    whyYouMustRead:
      "Because this book defines what good product management looks like in practice — and most PM interviews are evaluating you against its framework whether they know it or not.",
  },
  {
    id: "pm-4",
    title: "Competing Against Luck: The Story of Innovation and Customer Choice",
    authors: "Clayton M. Christensen",
    year: 2016,
    track: "Product Manager",
    difficulty: "Intermediate",
    url: "https://www.harpercollins.com/products/competing-against-luck-clayton-m-christensenkaren-dillontaddy-halljames-allworth",
    legacyTagline: "Jobs To Be Done: people don't buy products, they hire them to make progress — the framework that reframes every user interview.",
    whatItIntroduced:
      "Proposed that customers make purchase decisions to 'hire' a product to do a specific 'job' — to make progress in their lives. The job has functional, social, and emotional dimensions that must all be addressed by the hired product. Jobs are stable over time even as solutions change — understanding the job reveals non-obvious competition and non-obvious opportunities.",
    careerImpact:
      "PMs who apply JTBD conduct user interviews that uncover underlying motivations rather than surface preferences. The milkshake story (McDonald's milkshakes were hired for the morning commute job, not the lunch job — completely different requirements) illustrates how job framing reveals product decisions that user personas cannot. Job stories ('When I... I want to... So I can...') replace user stories for discovery work.",
    whyYouMustRead:
      "Because understanding why users buy your product is more valuable than understanding who buys it, and this book provides the framework for finding out.",
  },
  {
    id: "pm-5",
    title: "No Silver Bullet: Essence and Accidents of Software Engineering",
    authors: "Fred Brooks — Chapel Hill",
    year: 1986,
    track: "Product Manager",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/321605.321610",
    legacyTagline: "Why software is always late, always over budget, and why no tool or process will ever fully fix that.",
    whatItIntroduced:
      "Distinguished essential complexity (inherent in the problem domain, cannot be eliminated) from accidental complexity (introduced by tools, languages, and processes, can be reduced). Argued there is no single technique that reduces software effort by an order of magnitude — no silver bullet. Introduced Brooks' Law: adding people to a late software project makes it later due to training and communication overhead.",
    careerImpact:
      "PMs who have read this paper can have honest conversations with engineering teams about estimates, scope, and schedule. Brooks' Law gives vocabulary to argue against the 'just add more engineers' response to schedule slip. The essential vs accidental complexity framework helps PMs distinguish product problems (need a simpler design) from technology problems (need better tooling). It resets unrealistic expectations about software development speed.",
    whyYouMustRead:
      "Because every PM who has never read this paper has at some point demanded an estimate be cut in half or promised a stakeholder something engineering couldn't deliver.",
  },

  // ─── BLOCKCHAIN DEVELOPER ─────────────────────────────────────────────────
  {
    id: "bc-1",
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    authors: "Satoshi Nakamoto",
    year: 2008,
    track: "Blockchain Developer",
    difficulty: "Intermediate",
    url: "https://bitcoin.org/bitcoin.pdf",
    legacyTagline: "Nine pages that created the blockchain, peer-to-peer consensus, and a trillion-dollar industry.",
    whatItIntroduced:
      "Proposed a peer-to-peer electronic cash system removing the need for a trusted third party (bank) by using a cryptographic chain of blocks as an immutable ledger. Proof of Work creates the computational cost that makes rewriting history prohibitively expensive. The UTXO (Unspent Transaction Output) model tracks ownership without accounts. Nakamoto consensus: the longest chain (most accumulated work) is the canonical truth.",
    careerImpact:
      "Every blockchain developer must understand Bitcoin's design choices before working with any other blockchain system. The blockchain data structure (hash-chaining), Merkle trees in transaction inclusion proofs, the mining incentive mechanism, and the mempool model all appear in modified forms in Ethereum, Solana, and every other chain. Reading this 9-page paper gives you the intellectual foundation for the entire field.",
    whyYouMustRead:
      "Because building on blockchain technology without reading the paper that invented it is building on a foundation you haven't inspected.",
  },
  {
    id: "bc-2",
    title: "Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform",
    authors: "Vitalik Buterin",
    year: 2014,
    track: "Blockchain Developer",
    difficulty: "Intermediate",
    url: "https://ethereum.org/en/whitepaper/",
    legacyTagline: "Programmable blockchain: smart contracts, DeFi, NFTs, and the entire Web3 ecosystem came from this whitepaper.",
    whatItIntroduced:
      "Extended Bitcoin's limited scripting with a Turing-complete virtual machine (EVM) allowing arbitrary computation on the blockchain. Smart contracts are code deployed at an address that execute deterministically across all nodes. Gas pricing prevents infinite loops by making every EVM operation cost computation credits. The account model (vs Bitcoin's UTXO) maintains global state of balances and contract code.",
    careerImpact:
      "Solidity development, DeFi protocol design, NFT standards (ERC-721, ERC-1155), and DAO governance all build directly on the EVM model Buterin proposed. Blockchain developers who understand the whitepaper comprehend why gas optimisation matters, how contract storage costs are structured, what makes a reentrancy attack possible (the EVM execution model), and why Layer 2 solutions scale Ethereum without changing its base layer.",
    whyYouMustRead:
      "Because smart contract development without understanding the EVM execution model produces code with gas inefficiencies and security vulnerabilities you can't diagnose.",
  },
  {
    id: "bc-3",
    title: "The Byzantine Generals Problem",
    authors: "Lamport, Shostak, Pease — Microsoft Research",
    year: 1982,
    track: "Blockchain Developer",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1145/357172.357176",
    legacyTagline: "The mathematical problem that consensus algorithms solve — the foundation of every blockchain's security model.",
    whatItIntroduced:
      "Formalised the problem of reaching consensus in a distributed system where participants may send contradictory or malicious messages (Byzantine failures). Proved that consensus is impossible with 3f+1 or fewer nodes when f are Byzantine — requiring at least 3f+1 nodes to tolerate f malicious actors. Showed that oral message protocols cannot solve Byzantine agreement with 3 nodes when one is traitor.",
    careerImpact:
      "Blockchain developers who understand Byzantine Fault Tolerance can reason about the security assumptions of every consensus mechanism: PoW provides probabilistic BFT with economic incentives, pBFT provides deterministic BFT for permissioned chains, PoS provides BFT if ≤ 33% of stake is malicious. This framework enables rigorous evaluation of security claims made by new blockchain protocols.",
    whyYouMustRead:
      "Because every blockchain consensus mechanism is either solving Byzantine agreement or making explicit trade-offs about when it can't — and you need to know which.",
  },
  {
    id: "bc-4",
    title: "Hashcash — A Denial of Service Counter-Measure",
    authors: "Adam Back",
    year: 2002,
    track: "Blockchain Developer",
    difficulty: "Intermediate",
    url: "https://hashcash.org/papers/hashcash.pdf",
    legacyTagline: "Proof of Work existed six years before Bitcoin — Satoshi Nakamoto cited this paper directly.",
    whatItIntroduced:
      "Designed a computational puzzle system for email spam prevention: require message senders to compute a hash with a specified number of leading zeros before sending. Finding the nonce requires exponential work proportional to difficulty; verifying it requires exactly one hash computation. This asymmetry — hard to produce, trivial to verify — is the cryptographic primitive Bitcoin uses for mining.",
    careerImpact:
      "Blockchain developers who understand Hashcash understand why Bitcoin mining is a lottery (finding a nonce is random, no shortcut exists), how difficulty adjustment maintains approximately 10-minute block times regardless of total hashrate, and why Proof of Work's energy consumption is not a bug but a deliberate anti-Sybil mechanism. This is required background for reasoning about mining economics and alternative consensus mechanisms.",
    whyYouMustRead:
      "Because Bitcoin's proof-of-work mechanism is inherited directly from this paper and understanding the inheritance explains the design choices Nakamoto made.",
  },
  {
    id: "bc-5",
    title: "Solidity Documentation and Smart Contract Design Patterns",
    authors: "Ethereum Foundation",
    year: 2017,
    track: "Blockchain Developer",
    difficulty: "Intermediate",
    url: "https://docs.soliditylang.org/",
    legacyTagline: "Smart contracts are immutable — the patterns that prevent the next DAO hack.",
    whatItIntroduced:
      "Defined Solidity as a staticaly-typed, Turing-complete language for the EVM with explicit storage (persistent, expensive), memory (transient, cheap), and stack layout. Documented the reentrancy vulnerability pattern (external call before state update), the checks-effects-interactions pattern as its prevention, access control through modifiers, and proxy patterns for upgradeable contract deployment.",
    careerImpact:
      "Blockchain developers who master these patterns write contracts that resist the attacks that have drained hundreds of millions of dollars from DeFi protocols. Understanding reentrancy at the EVM level (the call stack can re-enter before storage is updated) explains why OpenZeppelin's ReentrancyGuard exists. Proxy patterns (Transparent, UUPS, Diamond) enable upgradeability in supposedly immutable contracts — a critical production pattern.",
    whyYouMustRead:
      "Because a smart contract bug with $50M TVL locked in it is not a pull request problem — it's immutable, and this documentation is how you write it right the first time.",
  },

  // ─── GAME DEVELOPER ───────────────────────────────────────────────────────
  {
    id: "gd-1",
    title: "Real-Time Rendering, 4th Edition",
    authors: "Akenine-Möller, Haines, Hoffman, Pesce, Iwanicki, Hillaire",
    year: 2018,
    track: "Game Developer",
    difficulty: "Advanced",
    url: "https://www.realtimerendering.com/",
    legacyTagline: "The GPU rendering bible — every game engine graphics programmer keeps this on their desk.",
    whatItIntroduced:
      "Comprehensively documented the real-time rendering pipeline from vertex shading through rasterisation to fragment shading and compositing. Covered physically based rendering (PBR) with real-world material properties enabling realistic lighting at any viewing angle. Introduced shadow mapping algorithms, deferred shading for handling thousands of lights, and modern ray-tracing integration techniques.",
    careerImpact:
      "Game developers writing custom shaders, optimising draw calls, implementing post-processing effects, or debugging rendering artefacts in Unreal or Unity need the mental model this book provides. Understanding the difference between deferred and forward rendering determines your lighting architecture. Knowing why PBR requires metallic/roughness maps makes material authoring intuitive rather than trial-and-error.",
    whyYouMustRead:
      "Because the graphics programmer who doesn't understand the rendering pipeline is debugging rendering artefacts by guessing which property to change.",
  },
  {
    id: "gd-2",
    title: "Game Engine Architecture",
    authors: "Jason Gregory — Naughty Dog",
    year: 2009,
    track: "Game Developer",
    difficulty: "Intermediate",
    url: "https://www.gameenginebook.com/",
    legacyTagline: "The internals of Unreal, Unity, and every production game engine — documented and explained.",
    whatItIntroduced:
      "Documented the complete architecture of a professional game engine: the game loop (process input, update world, render), Entity-Component Systems for flexible game object composition, the asset pipeline from source to runtime format, physics integration with fixed timestep decoupled from render frame rate, and spatial data structures (BVH, Octree) for collision culling.",
    careerImpact:
      "Game developers who understand engine architecture write code that works with the engine rather than against it. Understanding the fixed physics timestep explains why objects tunnel through walls at low frame rates and how to prevent it. Understanding the ECS architecture explains Unity DOTS's design philosophy and why data-oriented design enables better cache performance. It makes Unity and Unreal documentation make sense at a deeper level.",
    whyYouMustRead:
      "Because Unity tutorials teach you to drag components in the editor; this book teaches you why components, entities, and systems are the right abstraction for game objects.",
  },
  {
    id: "gd-3",
    title: "A Formal Basis for the Heuristic Determination of Minimum Cost Paths (A*)",
    authors: "Hart, Nilsson, Raphael — Stanford Research Institute",
    year: 1968,
    track: "Game Developer",
    difficulty: "Intermediate",
    url: "https://ieeexplore.ieee.org/document/4082128",
    legacyTagline: "A* pathfinding: in virtually every strategy game, RPG, and simulation — one of the most deployed algorithms in software history.",
    whatItIntroduced:
      "Proved that combining actual cost from start (g) with an admissible heuristic estimate of remaining cost to goal (h) produces an algorithm f = g + h that always finds the optimal path. Defined admissibility: a heuristic that never overestimates guarantees optimal path discovery. Introduced the open and closed sets as the search frontier management mechanism.",
    careerImpact:
      "Every strategy game NPC, every navigation mesh pathfinding system, every robot motion planner uses A*. Game developers who understand the paper know why Manhattan distance works on grids, why Euclidean distance works in continuous space, and why Jump Point Search reduces explored nodes by 100x on uniform grids. Debugging why an NPC takes a suboptimal path requires understanding heuristic admissibility violations.",
    whyYouMustRead:
      "Because A* has been implemented millions of times and the developers who understand the original proof can tune its heuristic for their specific game world.",
  },
  {
    id: "gd-4",
    title: "Physics-Based Animation (SIGGRAPH Course)",
    authors: "Kenny Erleben, Jon Sporring, Knud Henriksen, Henrik Dohlmann",
    year: 2005,
    track: "Game Developer",
    difficulty: "Advanced",
    url: "https://dl.acm.org/doi/10.1145/1198555.1198731",
    legacyTagline: "Rigid body dynamics, collision detection, and constraint solving — the physics behind every game engine.",
    whatItIntroduced:
      "Systematically covered numerical integration methods for rigid body motion (Euler, Verlet, RK4) with energy conservation analysis. Described the two-phase collision detection pipeline: broadphase (AABB-based culling eliminating obviously non-intersecting pairs) and narrowphase (GJK, SAT algorithms for exact contact point computation). Introduced impulse-based collision resolution for stable, real-time physics simulation.",
    careerImpact:
      "Game developers implementing custom physics, modifying physics engine parameters, or debugging physics instability need this theoretical grounding. Understanding why Verlet integration is more stable than Euler for game physics prevents energy accumulation artifacts. Understanding broadphase vs narrowphase collision explains why physics performance degrades with object count and how spatial hashing fixes it.",
    whyYouMustRead:
      "Because physics bugs in games — tunneling, jitter, explosions — are caused by misapplying integration or collision resolution, and this course teaches the correct approach.",
  },
  {
    id: "gd-5",
    title: "Procedural Content Generation in Games",
    authors: "Shaker, Togelius, Nelson",
    year: 2016,
    track: "Game Developer",
    difficulty: "Intermediate",
    url: "http://pcgbook.com/",
    legacyTagline: "Minecraft's terrain, Spelunky's dungeons, No Man's Sky's galaxies — procedural generation powers them all.",
    whatItIntroduced:
      "Systematically surveyed algorithms for generating game content algorithmically: Perlin/Simplex noise for terrain generation, Binary Space Partitioning for dungeon rooms, cellular automata for organic cave systems, L-systems for plant and structure generation, and Wave Function Collapse for tile map generation through local constraint propagation.",
    careerImpact:
      "Game developers who understand PCG can create games with effectively infinite content variation without proportionate art asset budgets. Perlin noise usage in Unity/Unreal becomes principled — you understand frequency, amplitude, and octave parameters. BSP dungeon generation becomes a composable building block rather than a black-box package. WFC tile map generation enables complex content that respects local consistency rules.",
    whyYouMustRead:
      "Because procedural generation is the superpower that lets indie game developers build infinite worlds, and this book is the complete reference for all its major techniques.",
  },

  // ─── TECHNICAL WRITER ─────────────────────────────────────────────────────
  {
    id: "tw-1",
    title: "The Elements of Style",
    authors: "William Strunk Jr. & E.B. White",
    year: 1920,
    track: "Technical Writer",
    difficulty: "Beginner",
    url: "https://en.wikisource.org/wiki/The_Elements_of_Style",
    legacyTagline: "The shortest, densest writing guide ever published — every sentence in this book models what it preaches.",
    whatItIntroduced:
      "Established core rules of English composition: omit needless words, use active voice, prefer specific to vague language, place emphatic words at the end of a sentence, use definite assertions. Each rule is illustrated by the rule itself violating or following it. Made clarity, brevity, and vigor the measurable standards of good writing.",
    careerImpact:
      "Technical writers who have absorbed The Elements of Style write API documentation that developers actually read, error messages that solve problems rather than confuse them, and release notes that communicate rather than observe. 'The fact that' (delete it), 'due to the fact that' (replace with 'because'), 'utilize' (replace with 'use') — these are first principles that remain applicable to every technical document.",
    whyYouMustRead:
      "Because technical documentation that violates Strunk and White's rules is documentation that nobody reads twice.",
  },
  {
    id: "tw-2",
    title: "Every Page is Page One: Topic-Based Writing for Technical Communication",
    authors: "Mark Baker",
    year: 2013,
    track: "Technical Writer",
    difficulty: "Intermediate",
    url: "https://everypageispageone.com/the-book/",
    legacyTagline: "In the web era, users land on any documentation page from Google — design for that, not for sequential reading.",
    whatItIntroduced:
      "Argued that traditional documentation written as books fails on the web because users enter from search engines at any page, not at the beginning. EPPO principles: every topic must be self-contained (establish context without assuming previous reading), have a specific purpose, link richly to related topics, and be discoverable through search. Replaced chapter-based organisation with topic-based documentation.",
    careerImpact:
      "Technical writers who apply EPPO create documentation that users actually navigate rather than documentation that technically covers the material but fails users arriving from Google. Every documentation page should be able to answer 'What is this page about? Who is it for? What will I know after reading it?' without requiring any other page first. This principle is why Stripe, Twilio, and the best developer documentation experiences feel immediately useful.",
    whyYouMustRead:
      "Because most technical documentation is written like a book that users are expected to read front-to-back — and this book explains why that model fails every real documentation user.",
  },
  {
    id: "tw-3",
    title: "Don't Make Me Think",
    authors: "Steve Krug",
    year: 2000,
    track: "Technical Writer",
    difficulty: "Beginner",
    url: "https://www.sensible.com/dont-make-me-think/",
    legacyTagline: "UX principles applied to documentation: users scan, not read — design documentation for that behaviour.",
    whatItIntroduced:
      "Established that web users scan pages in search of the specific thing they need rather than reading comprehensively. Navigation must make current position and available paths clear instantly. Content should be self-evident: the correct path forward should not require explanation. Hallway tests with 5 real users reveal the majority of navigation and comprehension problems within 20 minutes.",
    careerImpact:
      "Technical writers who apply Krug's principles structure documentation pages so the most important information appears in the first line, code examples are the first visual element on how-to pages, step lists are numbered with bold action verbs, and complex procedures are chunked into stages. Testing documentation with real users — watching where they get lost — is the single highest-return improvement activity any documentation team can do.",
    whyYouMustRead:
      "Because documentation that users cannot navigate without help is not documentation — it is a liability that creates support tickets instead of preventing them.",
  },
  {
    id: "tw-4",
    title: "The Chicago Manual of Style, 17th Edition",
    authors: "University of Chicago Press",
    year: 2017,
    track: "Technical Writer",
    difficulty: "Beginner",
    url: "https://www.chicagomanualofstyle.org/",
    legacyTagline: "The authoritative style reference for technical publishing — covers citation, grammar, and formatting decisions technical writers face daily.",
    whatItIntroduced:
      "Provided the comprehensive, authoritative reference on English grammar, usage, punctuation, citation formats, and publishing conventions. Defined when to use em-dash versus en-dash, serial (Oxford) comma requirements, how to present code and technical terms, and the Author-Date citation system used in scientific and technical writing.",
    careerImpact:
      "Technical writers at companies with multiple contributors face constant style inconsistency that erodes reader trust and professionalism. CMOS provides the authoritative arbitration for contested style decisions. Most mature technical writing teams maintain a localized style guide derived from CMOS, and knowing the source material makes those derivation decisions defensible. Vale, the documentation linter, can enforce CMOS rules automatically.",
    whyYouMustRead:
      "Because consistent style in a documentation set is a trust signal to technical readers, and inconsistent style signals carelessness that undermines confidence in the documentation's accuracy.",
  },
  {
    id: "tw-5",
    title: "Developing Quality Technical Information",
    authors: "Gretchen Hargis et al. — IBM",
    year: 2004,
    track: "Technical Writer",
    difficulty: "Intermediate",
    url: "https://www.pearson.com/en-us/subject-catalog/p/developing-quality-technical-information-a-handbook-for-writers-and-editors/P200000003416",
    legacyTagline: "IBM's documentation quality standard — the nine criteria that separate excellent technical information from adequate technical information.",
    whatItIntroduced:
      "Defined nine qualities of excellent technical information: easy to use (task-oriented), easy to understand (clear and concrete), easy to find (well-organised, retrievable), accurate, complete, consistent (in style and terminology), appropriate for audience, unambiguous, and visually effective. Introduced minimalism as a documentation principle: include only what users need to accomplish their tasks.",
    careerImpact:
      "Technical writers who apply IBM's nine criteria can evaluate any documentation systematically rather than subjectively. Task orientation — organising around what users do rather than what the product is — is the highest-impact structural change most documentation sets need. API documentation written with these nine criteria produces reference material that developers keep open during integration rather than closing after their first use.",
    whyYouMustRead:
      "Because 'this documentation isn't very good' is not actionable feedback — IBM's nine criteria provide a specific, measurable rubric for improvement.",
  },
];

// ─── HALL OF FAME ─────────────────────────────────────────────────────────────
export const HALL_OF_FAME_PAPERS: ResearchPaper[] = [
  {
    id: "hof-1",
    title: "Attention Is All You Need",
    authors: "Vaswani, Shazeer, Parmar et al. — Google Brain",
    year: 2017,
    track: "AI Engineer",
    difficulty: "Intermediate",
    url: "https://arxiv.org/abs/1706.03762",
    legacyTagline: "The paper that made GPT, Claude, Gemini, and the entire AI industry possible.",
    whatItIntroduced:
      "11 pages that replaced recurrence with self-attention and created the Transformer architecture. Multi-head attention learns multiple relationship types simultaneously. The architecture enabled training on orders of magnitude more data by being fully parallelisable.",
    careerImpact:
      "Every tech professional in 2024 works in an environment shaped by this paper. The AI copilots, the LLM APIs, the embedding-based search — all Transformers.",
    whyYouMustRead:
      "Because the paper that created the dominant technology of our era deserves to be read, not just referenced.",
    hallOfFame: true,
    hallOfFameLegacy:
      "Published in May 2017. Changed everything by November 2018 (BERT) and November 2022 (ChatGPT). This paper replaced a decade of sequential recurrent network research with a single architectural insight: self-attention captures global context between any two tokens in a sequence in a single parallel operation. What it killed: LSTM and GRU dominated NLP from 2015-2017 — after this paper, recurrent architectures became legacy systems practically overnight. What it created: BERT (Google, 2018), GPT-2 (OpenAI, 2019), GPT-3 (OpenAI, 2020), PaLM, LLaMA, Gemini, Claude — every significant language model of the modern era is a Transformer. The ideas live today in: every product with autocomplete, every AI coding assistant, every document chat tool, every enterprise search system built after 2019. With 100,000+ citations, it is the most cited computer science paper written since 2000. The title — 'Attention Is All You Need' — turned out to be precisely and literally true.",
  },
  {
    id: "hof-2",
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    authors: "Jeffrey Dean & Sanjay Ghemawat — Google",
    year: 2004,
    track: "Data Engineer",
    difficulty: "Intermediate",
    url: "https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/",
    legacyTagline: "The paradigm that launched the entire big data industry — Hadoop, Spark, BigQuery all descend from here.",
    whatItIntroduced:
      "Showed that virtually any large-scale data computation can be expressed as a Map phase (transform each record) and a Reduce phase (aggregate by key), with fault tolerance, distributed execution, and data locality handled automatically by the framework.",
    careerImpact:
      "Every data pipeline, ETL job, and batch processing system implements this paradigm. Knowing the original changes how you think about Spark partitions, shuffle cost, and distributed architecture.",
    whyYouMustRead:
      "Because the mental model this paper introduces is still the correct way to think about large-scale data problems 20 years later.",
    hallOfFame: true,
    hallOfFameLegacy:
      "Published in 2004. Within 4 years it had spawned Hadoop (Doug Cutting, 2006), which became the first big data platform adopted by every major internet company. What it killed: custom distributed processing scripts, ad-hoc data pipeline code that lived on single machines, and the assumption that data analysis required proprietary parallel database systems affordable only by a few large organisations. What it created: Hadoop (2006), Hive (2008), Pig (2008), Apache Spark (2012, designed explicitly to address MapReduce's limitations), Google BigQuery (2010), Amazon EMR. The big data industry — with its billions in annual cloud revenue — is built on this 13-page paper. The ideas live today in: every Spark job, every dbt transformation, every BigQuery SQL query, every Flink streaming pipeline. The specific Map-Reduce function pattern appears in Python's built-in functools, JavaScript's Array.map and Array.reduce, and functional programming languages worldwide. Two engineers, one paper, the data industry as we know it.",
  },
  {
    id: "hof-3",
    title: "A Relational Model of Data for Large Shared Data Banks",
    authors: "Edgar F. Codd — IBM Research",
    year: 1970,
    track: "Backend Developer",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/362384.362685",
    legacyTagline: "Every database your application has ever touched runs on the mathematics defined in these 11 pages.",
    whatItIntroduced:
      "Proposed organising data in tables with rows and columns, defined relational algebra as the mathematical query language, introduced normal forms to eliminate redundancy, and argued for data independence separating application logic from physical storage.",
    careerImpact:
      "SQL, ORMs, schemas, migrations, indexes, joins — Codd invented all the conceptual foundations in 1970. Every line of database code ever written implements his model.",
    whyYouMustRead:
      "Because developers who understand the relational model write better schemas, better queries, and better data models than developers who treat databases as black boxes.",
    hallOfFame: true,
    hallOfFameLegacy:
      "Published in 1970. Won Edgar Codd the Turing Award in 1981. Changed computing more permanently than almost any other single paper. What it killed: navigational databases (CODASYL, IMS) where programs had to explicitly traverse data connections like a linked list — a style of data access that made code tightly coupled to data structure. Codd proposed that programs should ask for what data they want, not how to find it. What it created: INGRES (1974), Oracle (1979), IBM DB2 (1983), MySQL (1995), PostgreSQL (1996), SQLite (2000) — every relational database that powers every web application. The ideas live today in: every Prisma schema, every SQLAlchemy model, every Hibernate entity, every Rails migration, every Django ORM query — all of them are mapping layer abstractions over the relational model Codd defined more than 50 years ago. There is virtually no software that handles persistent data that doesn't implement this paper's core ideas.",
  },
  {
    id: "hof-4",
    title: "No Silver Bullet: Essence and Accidents of Software Engineering",
    authors: "Fred Brooks — University of North Carolina",
    year: 1986,
    track: "Product Manager",
    difficulty: "Intermediate",
    url: "https://dl.acm.org/doi/10.1145/321605.321610",
    legacyTagline: "Why software is inherently hard, why estimates are always wrong, and why no tool will fully fix either problem.",
    whatItIntroduced:
      "Distinguished essential complexity (the irreducible difficulty of the thing being built) from accidental complexity (the mess added by our tools and processes). Argued that essential complexity cannot be eliminated — only managed. Brooks' Law: adding people to a late software project makes it later.",
    careerImpact:
      "Every developer who defends a realistic estimate, every PM who understands why schedule compression is not free, every engineering manager who resists adding headcount to a slipping project has been helped by the vocabulary this paper provides.",
    whyYouMustRead:
      "Because the hardest conversations in software engineering — about estimates, complexity, and what is actually possible — become more manageable with this framework.",
    hallOfFame: true,
    hallOfFameLegacy:
      "Published in 1986, nearly 40 years ago. Still cited constantly, still proven right. What it predicted: that object-oriented programming, AI programming assistants, automatic programming, and graphical programming environments would each provide incremental but not transformational productivity improvements. OOP happened. 4GL languages happened. Visual programming tools happened. CASE tools happened. Today LLM-powered coding assistants are happening. Each provided incremental improvement. None provided an order-of-magnitude improvement in the sense Brooks defined. What it changed: the conversation about software productivity. Brooks gave the industry vocabulary to resist silver bullet thinking — the recurring belief that this new technology will finally make software easy. What lives on: the essential/accidental complexity distinction is the clearest framework available for product and engineering discussions about where to invest. Agile, lean startup, and continuous delivery address accidental complexity. The essential complexity of the problem domain remains, exactly as Brooks said it would.",
  },
  {
    id: "hof-5",
    title: "The Google File System",
    authors: "Ghemawat, Gobioff, Leung — Google",
    year: 2003,
    track: "Data Engineer",
    difficulty: "Intermediate",
    url: "https://research.google/pubs/the-google-file-system/",
    legacyTagline: "The distributed storage system that made big data storage possible — and spawned Hadoop HDFS directly.",
    whatItIntroduced:
      "Designed a fault-tolerant distributed file system optimised for commodity hardware failures, large files, and append-heavy workloads. Automatic 3x replication, master-coordinated metadata, 64MB chunk storage, and record append semantics for concurrent writers without coordination.",
    careerImpact:
      "Every data engineer using HDFS, S3, Lake Formation, or any distributed storage system works with a technology shaped by this design. Understanding it explains why large files outperform many small files, why MapReduce achieves data locality, and how replication enables fault tolerance.",
    whyYouMustRead:
      "Because distributed storage is the foundation of the entire big data stack, and this paper built that foundation.",
    hallOfFame: true,
    hallOfFameLegacy:
      "Published in 2003 alongside MapReduce. Together these two papers from two Google engineers defined the technical foundation of the big data era. What it killed: the assumption that reliable storage required expensive dedicated storage hardware (SAN, NAS). GFS demonstrated that commodity Linux machines with local disks, combined with software-level replication management, could provide more storage reliability at lower cost. What it created: HDFS (Hadoop Distributed File System, 2006) is a direct open-source reimplementation. Amazon S3 (2006) implemented the same principles as a managed service. Google Cloud Storage, Azure Blob Storage, and the entire object storage industry follows the same design. The ideas live today in: Apache Iceberg and Delta Lake table formats built on S3 and GCS, petabyte-scale data lakes running every modern analytics workload, the data warehouse architectures inside every tech company from startup to Fortune 500. Data engineering as a professional discipline was made possible by the infrastructure these two papers described.",
  },
];

export interface CareerResearchJourney {
  career: string;
  track: ResearchTrack;
  whyRead: string[];
  readOrderReason: string;
  paperIds: string[];
}

export const CAREER_RESEARCH_JOURNEYS: CareerResearchJourney[] = [
  { career: "Frontend Developer", track: "Frontend Developer", whyRead: ["Build architecture decisions on evidence, not framework hype.", "Debug rendering and performance issues from engine-level understanding.", "Design for real user behaviour — scanning, connectivity gaps, browser diversity."], readOrderReason: "Architecture first, then the dominant framework model, then CSS layout, then progressive enhancement, then rendering pipeline performance.", paperIds: ["fe-1", "fe-2", "fe-3", "fe-4", "fe-5"] },
  { career: "Backend Developer", track: "Backend Developer", whyRead: ["Design databases that scale with the product instead of requiring rewrites.", "Reason about distributed system trade-offs with vocabulary and evidence.", "Understand REST at the design level, not just as a convention to follow."], readOrderReason: "Data foundation → OS model → distributed processing → high availability → API design.", paperIds: ["be-1", "be-2", "be-3", "be-4", "be-5"] },
  { career: "Full Stack Developer", track: "Full Stack Developer", whyRead: ["Build production-ready applications from day one using proven principles.", "Design APIs and data models that remain coherent as the product grows.", "Understand the event loop and request lifecycle at a level that accelerates debugging."], readOrderReason: "Production architecture → state management theory → server runtime → API design → database foundation.", paperIds: ["fs-1", "fs-2", "fs-3", "fs-4", "fs-5"] },
  { career: "DevOps Engineer", track: "DevOps Engineer", whyRead: ["Design reliability with SLOs and error budgets rather than best-effort monitoring.", "Build CI/CD pipelines from principle rather than by copying YAML templates.", "Reason about distributed infrastructure trade-offs including database and storage choices."], readOrderReason: "Reliability philosophy → delivery automation → cluster management → data infrastructure → NoSQL fundamentals.", paperIds: ["do-1", "do-2", "do-3", "do-4", "do-5"] },
  { career: "UX Designer", track: "UX Designer", whyRead: ["Design with cognitive science backing rather than subjective opinion.", "Win stakeholder debates with quantitative evidence about user behaviour.", "Build design systems with the depth that comes from understanding the canonical reference."], readOrderReason: "Motor interaction science → working memory limits → usability principles → scanning behaviour → design systems.", paperIds: ["ux-1", "ux-2", "ux-3", "ux-4", "ux-5"] },
  { career: "Data Analyst", track: "Data Analyst", whyRead: ["Develop the discipline of understanding data before drawing conclusions.", "Design visualisations from first principles rather than template selection.", "Run experiments with statistical rigour that produces trustworthy results."], readOrderReason: "EDA philosophy → visualisation theory → ML intuition → dimensional modelling → statistical power.", paperIds: ["da-1", "da-2", "da-3", "da-4", "da-5"] },
  { career: "AI Engineer", track: "AI Engineer", whyRead: ["Understand the architecture of every LLM and embedding model you deploy.", "Design RAG systems with genuine architectural depth rather than framework magic.", "Apply alignment thinking to production AI systems that interact with real users."], readOrderReason: "Transformer architecture → transfer learning → scaling and prompting → retrieval augmentation → alignment.", paperIds: ["ai-1", "ai-2", "ai-3", "ai-4", "ai-5"] },
  { career: "Data Scientist", track: "Data Scientist", whyRead: ["Build models that work in production using validated mental models about ML.", "Select algorithms with principled reasoning rather than popularity.", "Understand the theoretical foundations that make ML generalization possible."], readOrderReason: "ML meta-lessons → ensemble fundamentals → boosting production model → deep learning overview → theoretical grounding.", paperIds: ["ds-1", "ds-2", "ds-3", "ds-4", "ds-5"] },
  { career: "Data Engineer", track: "Data Engineer", whyRead: ["Understand the intellectual ancestry of every data infrastructure tool you use.", "Design data pipelines with genuine architectural understanding of distributed systems.", "Choose storage systems with the trade-off model that produced the tools you're choosing between."], readOrderReason: "Distributed storage → batch processing paradigm → in-memory distributed computing → streaming → NoSQL consistency.", paperIds: ["de-1", "de-2", "de-3", "de-4", "de-5"] },
  { career: "Android Developer", track: "Android Developer", whyRead: ["Understand why the Android platform behaves the way it does at the component level.", "Design for battery life and background constraints the way Android expects.", "Ship apps that meet Google's production quality standards."], readOrderReason: "Platform architecture → runtime internals → design system → background processing → production quality metrics.", paperIds: ["and-1", "and-2", "and-3", "and-4", "and-5"] },
  { career: "iOS Developer", track: "iOS Developer", whyRead: ["Write Swift that uses the type system and concurrency model the way Apple intended.", "Debug the hardest iOS crashes using runtime knowledge that documentation doesn't explain.", "Ship apps that users rate 5 stars for feeling fast and not draining battery."], readOrderReason: "Swift language model → ObjC runtime → rendering performance → energy efficiency → persistence.", paperIds: ["ios-1", "ios-2", "ios-3", "ios-4", "ios-5"] },
  { career: "ML Engineer", track: "ML Engineer", whyRead: ["Design production ML systems with the architectural depth the field requires.", "Debug training instability with theoretical understanding rather than hyperparameter guessing.", "Move from notebook experiments to reproducible, auditable production pipelines."], readOrderReason: "Transformer architecture → residual connections → normalisation → regularisation → experiment tracking.", paperIds: ["ml-1", "ml-2", "ml-3", "ml-4", "ml-5"] },
  { career: "QA Engineer", track: "QA Engineer", whyRead: ["Design test cases using proven methodology rather than intuition.", "Build CI/CD pipeline quality gates that actually catch what matters.", "Measure test suite quality quantitatively rather than by counting test scripts."], readOrderReason: "Testing philosophy and design techniques → OOP test strategy → pipeline design → systematic debugging → test quality measurement.", paperIds: ["qa-1", "qa-2", "qa-3", "qa-4", "qa-5"] },
  { career: "Cyber Security", track: "Cyber Security", whyRead: ["Understand cryptography from mathematical foundations, not trust in the algorithm's reputation.", "Design secure systems using first principles rather than checklist compliance.", "Develop the attacker mental model required to find vulnerabilities before attackers do."], readOrderReason: "Cryptographic theory → secure design principles → memory exploitation → public key cryptography → web vulnerability taxonomy.", paperIds: ["sec-1", "sec-2", "sec-3", "sec-4", "sec-5"] },
  { career: "Product Manager", track: "Product Manager", whyRead: ["Make go-to-market decisions backed by the adoption lifecycle framework.", "Run discovery and validation with the discipline of validated learning.", "Have honest, evidence-based conversations with engineering teams about complexity and estimates."], readOrderReason: "Market adoption → lean iteration → product discovery framework → user motivation → engineering reality.", paperIds: ["pm-1", "pm-2", "pm-3", "pm-4", "pm-5"] },
  { career: "Blockchain Developer", track: "Blockchain Developer", whyRead: ["Build on the genuine intellectual foundation of the technology, not just the API.", "Write smart contracts that resist the attacks that have drained hundreds of millions of dollars.", "Evaluate consensus mechanism security claims with the Byzantine Fault Tolerance framework."], readOrderReason: "Bitcoin genesis → Ethereum programmability → consensus mathematics → Proof of Work cryptography → Solidity security patterns.", paperIds: ["bc-1", "bc-2", "bc-3", "bc-4", "bc-5"] },
  { career: "Game Developer", track: "Game Developer", whyRead: ["Write rendering code with the GPU pipeline knowledge to diagnose performance problems.", "Understand engine architecture deeply enough to use Unity and Unreal intentionally.", "Implement fundamental game algorithms from proven theory rather than copied code."], readOrderReason: "GPU rendering pipeline → engine architecture → pathfinding algorithms → physics simulation → procedural generation.", paperIds: ["gd-1", "gd-2", "gd-3", "gd-4", "gd-5"] },
  { career: "Technical Writer", track: "Technical Writer", whyRead: ["Write documentation that developers actually read and follow.", "Structure content for how real users navigate rather than how authors prefer to organise.", "Apply professional quality standards that produce documentation teams trust."], readOrderReason: "Writing clarity fundamentals → web-era topic design → documentation UX → style authority → quality framework.", paperIds: ["tw-1", "tw-2", "tw-3", "tw-4", "tw-5"] },
];

export function inferRecommendedTrack(profile: UserProfile | null, analysis: AnalysisResult | null): ResearchTrack {
  if (analysis?.mode === "transition" && analysis.transitionResult?.top5Matches?.[0]?.career) {
    const c = analysis.transitionResult.top5Matches[0].career as ResearchTrack;
    if (RESEARCH_TRACKS.includes(c)) return c;
  }
  if (analysis?.mode === "upskill" && analysis.upskillResult?.keystoneSkill) {
    const c = analysis.upskillResult.keystoneSkill as ResearchTrack;
    if (RESEARCH_TRACKS.includes(c)) return c;
  }
  if (profile?.t_abstraction?.includes("Frontend")) return "Frontend Developer";
  if (profile?.t_abstraction?.includes("Backend")) return "Backend Developer";
  if (profile?.t_abstraction?.includes("Models")) return "AI Engineer";
  if (profile?.t_abstraction?.includes("Infrastructure")) return "DevOps Engineer";
  return "AI Engineer";
}

export function inferRecommendedCareer(profile: UserProfile | null, analysis: AnalysisResult | null): string {
  if (analysis?.mode === "transition" && analysis.transitionResult?.top5Matches?.[0]?.career) {
    return analysis.transitionResult.top5Matches[0].career;
  }
  if (analysis?.mode === "upskill" && analysis.upskillResult?.keystoneSkill) {
    return analysis.upskillResult.keystoneSkill;
  }
  const haystack = [profile?.u_goal, profile?.u_role].filter(Boolean).join(" ").toLowerCase();
  const direct = CAREER_RESEARCH_JOURNEYS.find((j) => haystack.includes(j.career.toLowerCase()));
  if (direct) return direct.career;
  return "AI Engineer";
}
