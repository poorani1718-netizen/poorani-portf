// All content comes from Poorani K's resume. No invented metrics.

export type Channel = {
  path: string;
  slug: string;
  ch: string;
  name: string;
  blurb: string;
  bg: string;
  fg: string;
};

export const CHANNELS: Channel[] = [
  { path: "/", slug: "home", ch: "01", name: "Home", blurb: "The campaign launch", bg: "#0C0A12", fg: "#F3EEE6" },
  { path: "/about", slug: "about", ch: "02", name: "About", blurb: "The brand behind the brand", bg: "#2433FF", fg: "#F3EEE6" },
  { path: "/skills", slug: "skills", ch: "03", name: "Skills", blurb: "The full-funnel toolkit", bg: "#07070B", fg: "#F3EEE6" },
  { path: "/projects", slug: "projects", ch: "04", name: "Projects", blurb: "Campaigns, case by case", bg: "#FF2E7E", fg: "#0C0A12" },
  { path: "/experience", slug: "experience", ch: "05", name: "Experience", blurb: "The media plan, 2021–26", bg: "#FF4A1C", fg: "#0C0A12" },
  { path: "/contact", slug: "contact", ch: "06", name: "Contact", blurb: "Let's launch something", bg: "#0C0A12", fg: "#F3EEE6" },
];

export const channelFor = (path: string) =>
  CHANNELS.find((c) => c.path === path) ?? CHANNELS[0];

export const CONTACT = {
  email: "poorani1718@gmail.com",
  phone: "+91 63808 52606",
  linkedin: "https://www.linkedin.com/in/poorani-karthikeyan-797a912a6",
  linkedinShort: "in/poorani-karthikeyan",
  city: "Bengaluru, India",
  whatsapp: "916380852606", // country code + number, digits only (wa.me format)
};

export const ENQUIRY = {
  whatsapp: "Hi Poorani, I saw your portfolio and I'd like to enquire about your digital marketing services.",
  subject: "Digital marketing enquiry",
  body: "Hi Poorani,\n\nI saw your portfolio and I'd like to enquire about your digital marketing services.\n\nName:\nCompany:\nWhat I need:\n\nThanks,",
};

/** WhatsApp chat with the message pre-filled (opens the app on phones, WhatsApp Web on desktop). */
export const whatsappLink = (text: string = ENQUIRY.whatsapp) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

/** Gmail compose window with recipient, subject and body pre-filled. */
export const gmailLink = (subject: string = ENQUIRY.subject, body: string = ENQUIRY.body) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const STATS = [
  { n: 20, suffix: "+", tag: "Training", label: "learners trained per batch", src: "Qtree Technologies" },
  { n: 95, suffix: "%+", tag: "Service quality", label: "SLA compliance held", src: "Red Taxi CRM" },
  { n: 60, suffix: "+", tag: "Volume", label: "partner queries handled daily", src: "Red Taxi CRM" },
  { n: 30, suffix: "%", tag: "Onboarding", label: "faster ramp-up for new hires", src: "Domino's Pizza" },
  { n: 15, suffix: "+", tag: "Leadership", label: "team members supervised", src: "Domino's Pizza" },
];

export const FUNNEL = [
  {
    stage: "Awareness",
    line: "Get found. Get noticed.",
    color: "#FF2E7E",
    skills: ["SEO & Keyword Research", "Social Media Marketing", "Brand Management", "Competitor Analysis"],
  },
  {
    stage: "Engagement",
    line: "Earn the scroll-stop.",
    color: "#FFB21C",
    skills: ["Content Strategy", "Copywriting", "Email Campaigns", "ChatGPT for Content"],
  },
  {
    stage: "Conversion",
    line: "Turn attention into leads.",
    color: "#E3FF3B",
    skills: ["Meta Ads", "Google Ads / PPC", "Lead Generation & Nurturing", "Marketing Automation"],
  },
  {
    stage: "Measurement",
    line: "Read it. Report it. Repeat.",
    color: "#4FE3D0",
    skills: ["Google Analytics (IQ)", "Search Console", "KPI Tracking", "Data Analysis & Reporting"],
  },
];

// Each skill with the place it was actually used ("receipts")
export const RECEIPTS = [
  { skill: "SEO", where: ["Taught at Qtree Technologies", "Search Console + SEMrush in the toolkit"] },
  { skill: "Social Media", where: ["Ran the Bhuvan Nritya Instagram channel", "Manages social content at Pumo"] },
  { skill: "Paid Ads", where: ["Performance campaigns for Design Phoenix", "Social ad campaigns at Pumo"] },
  { skill: "Analytics", where: ["Google Analytics IQ certified", "Hands-on GA projects for learners"] },
  { skill: "Content", where: ["Content calendars for Instagram", "AI prompting for content in training"] },
  { skill: "Training", where: ["20+ learners per batch at Qtree", "Trains students at Pumo today"] },
  { skill: "CRM", where: ["60+ partner queries a day at Red Taxi", "95%+ SLA compliance"] },
];

export const TOOLS = [
  "Google Analytics", "Search Console", "SEMrush", "Meta Ads Manager", "Google Ads",
  "Mailchimp", "Canva", "ChatGPT", "CRM Platforms",
];

export type Project = {
  id: string;
  client: string;
  kind: string;
  year: string;
  color: string;
  ink: string;
  headline: string;
  brief: string;
  audience: string;
  strategy: string[];
  execution: string[];
  measurement: string[];
  tags: string[];
  visual: "instagram" | "youtube" | "ads" | "brand" | "classroom";
  link?: { href: string; label: string };
};

export const PROJECTS: Project[] = [
  {
    id: "bhuvan-nritya",
    client: "Bhuvan Nritya",
    kind: "Instagram channel management",
    year: "Channel handling",
    color: "#FF2E7E",
    ink: "#0C0A12",
    headline: "A dance brand that shows up every week.",
    brief: "Grow the visibility, reach and engagement of Bhuvan Nritya's Instagram channel.",
    audience: "Instagram followers and dance enthusiasts discovering the channel.",
    strategy: [
      "Built content strategies aimed at brand visibility, reach and engagement",
      "Kept a consistent content calendar so the channel never went quiet",
    ],
    execution: [
      "Planned, scheduled and published content",
      "Managed audience engagement on the channel",
      "Supported overall Instagram channel management",
    ],
    measurement: [
      "Monitored social analytics and performance metrics per post",
      "Analysed audience behaviour and engagement trends to find growth opportunities",
    ],
    tags: ["Content calendar", "Community", "Instagram Insights"],
    visual: "instagram",
  },
  {
    id: "viswakesh-youtube",
    client: "Viswakesh",
    kind: "YouTube channel management",
    year: "Channel handling",
    color: "#4FE3D0",
    ink: "#0C0A12",
    headline: "Original music and podcasts, made for the feed.",
    brief: "Support the growth of the Viswakesh YouTube channel: original Tamil songs, podcasts and personal stories where art meets activism.",
    audience: "Tamil-speaking listeners who follow independent music, podcasts and conversations on culture and identity.",
    strategy: [
      "Planned uploads across songs, albums and podcast episodes so the channel keeps a steady rhythm",
      "Shaped titles, thumbnails and descriptions to help each video get found",
    ],
    execution: [
      "Scheduled and published videos and supporting posts",
      "Managed audience engagement in comments and the community",
    ],
    measurement: [
      "Tracked views, watch time and subscriber trends in YouTube analytics",
      "Used the numbers to decide what to publish next",
    ],
    tags: ["YouTube", "Music", "Podcasts"],
    visual: "youtube",
    link: { href: "https://youtube.com/@viswakesh", label: "Visit the channel" },
  },
  {
    id: "design-phoenix",
    client: "Design Phoenix",
    kind: "Performance marketing · E-Tech",
    year: "Channel handling",
    color: "#E3FF3B",
    ink: "#0C0A12",
    headline: "Paid media, built around the lead.",
    brief: "Run performance campaigns across digital channels to support lead generation and brand growth.",
    audience: "Target audiences defined per campaign objective.",
    strategy: [
      "Planned campaigns from objectives and target audiences",
      "Coordinated activity to lift reach, engagement and conversions",
    ],
    execution: [
      "Executed digital advertising campaigns across channels",
      "Optimised campaigns based on performance analysis",
    ],
    measurement: [
      "Tracked engagement, conversions and lead generation",
      "Prepared performance reports and insights for data-driven decisions",
    ],
    tags: ["Paid ads", "Lead gen", "Conversion tracking"],
    visual: "ads",
  },
  {
    id: "pumo",
    client: "Pumo Technovation",
    kind: "Brand awareness & lead campaigns",
    year: "2026 — now",
    color: "#2433FF",
    ink: "#F3EEE6",
    headline: "In-house campaigns for a growing training brand.",
    brief: "Increase brand awareness and generate leads for Pumo Technovation in Bengaluru.",
    audience: "Prospective students and career-switchers looking for practical tech and marketing training.",
    strategy: [
      "Market and competitor analysis to sharpen the marketing strategy",
      "Social media advertising designed for awareness and lead capture",
    ],
    execution: [
      "Plans and executes digital marketing campaigns",
      "Manages social media content, campaigns and audience engagement",
      "Creates and optimises social ad campaigns",
    ],
    measurement: [
      "Monitors campaign performance with digital marketing tools",
      "Prepares regular performance reports",
    ],
    tags: ["Social ads", "Competitor research", "Reporting"],
    visual: "brand",
  },
  {
    id: "qtree",
    client: "Qtree Technologies",
    kind: "Digital marketing training programme",
    year: "2024 — 2025",
    color: "#FF4A1C",
    ink: "#0C0A12",
    headline: "Turning learners into working marketers.",
    brief: "Design and deliver an end-to-end digital marketing programme that makes learners job-ready.",
    audience: "Batches of 20+ learners starting careers in digital marketing.",
    strategy: [
      "Structured curricula covering SEO, SEM, Google Analytics, social, content and lead generation",
      "Curriculum kept current with industry trends and Google algorithm changes",
    ],
    execution: [
      "Assignments, case studies and mock interview coaching",
      "Introduced ChatGPT prompting for content and hands-on GA projects",
      "Coordinated batch scheduling and content calendar planning",
    ],
    measurement: [
      "Tracked individual learner KPIs on progress dashboards",
      "Personalised feedback and career mentoring to improve placement outcomes",
    ],
    tags: ["Curriculum design", "Mentoring", "Learner KPIs"],
    visual: "classroom",
  },
];

export type Role = {
  title: string;
  org: string;
  place: string;
  start: number; // fractional year
  end: number;
  label: string;
  type: "Marketing" | "Training" | "Operations" | "CRM";
  points: string[];
};

export const ROLES: Role[] = [
  {
    title: "Operational Executive",
    org: "Blue Dart Express",
    place: "Coimbatore",
    start: 2021 + 5 / 12,
    end: 2022 + 10 / 12,
    label: "Jun 2021 – Oct 2022",
    type: "Operations",
    points: [
      "End-to-end shipment tracking and backend data documentation",
      "Customer query resolution with first-contact accuracy",
    ],
  },
  {
    title: "Senior Team Member – Operations Lead",
    org: "Domino's Pizza",
    place: "Coimbatore",
    start: 2022 + 10 / 12,
    end: 2025 + 4 / 12,
    label: "Nov 2022 – Apr 2025",
    type: "Operations",
    points: [
      "Supervised a 15+ member team against CSAT benchmarks",
      "Onboarded 10+ hires and cut ramp-up time by 30% with training docs",
      "Data-driven root cause analysis on customer complaints",
    ],
  },
  {
    title: "Digital Marketing Mentor & Team Coordinator",
    org: "Qtree Technologies",
    place: "Coimbatore · part-time",
    start: 2024,
    end: 2025.99,
    label: "2024 – 2025",
    type: "Training",
    points: [
      "Trained 20+ learners per batch across SEO, SEM, GA, social and content",
      "Built curricula, case studies and mock interview sessions",
      "Tracked learner KPIs and mentored for placements",
    ],
  },
  {
    title: "CRM Executive",
    org: "Red Taxi",
    place: "Coimbatore",
    start: 2025 + 7 / 12,
    end: 2026 + 3 / 12,
    label: "Aug 2025 – Mar 2026",
    type: "CRM",
    points: [
      "Handled 60+ vendor and partner queries daily over email and chat",
      "Held 95%+ SLA compliance; weekly reports and dashboards for leadership",
    ],
  },
  {
    title: "Digital Marketing Analyst & Trainer",
    org: "Pumo Technovation",
    place: "Bengaluru",
    start: 2026 + 5 / 12,
    end: 2026 + 10 / 12,
    label: "Jun 2026 – Present",
    type: "Marketing",
    points: [
      "Plans and runs campaigns for brand awareness and leads",
      "Creates and optimises social ad campaigns; reports on performance",
      "Trains students with live projects and real-world campaigns",
    ],
  },
];

export const TYPE_COLOR: Record<Role["type"], string> = {
  Marketing: "#2433FF",
  Training: "#0C0A12",
  Operations: "#F3EEE6",
  CRM: "#E3FF3B",
};

export const CERTS = [
  "Google Analytics Individual Qualification (IQ) — Google",
  "Digital Marketing Certification",
  "Brand Management Certification",
  "ChatGPT for Excel & Content Marketing",
];

export const EDUCATION = [
  { what: "MBA", where: "Bharathiar University" },
  { what: "B.Com Corporate Secretaryship", where: "Sri Jeyendra Saraswathi College" },
];
