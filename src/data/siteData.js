// ─── SITE DATA ────────────────────────────────────────────────────────────────
// Edit this file to update stats, mission cards, team members,
// timeline entries, and events without touching any component code.
// ─────────────────────────────────────────────────────────────────────────────

export const STATS = [
  { value: "2018", label: "Founded",             suffix: ""  },
  { value: "8",    label: "Workshops & Seminars",  suffix: "+" },
  { value: "7",    label: "Years Active",         suffix: "+" },
  { value: "1000",  label: "Members & Growing",    suffix: "+" },
];

export const MISSION_ITEMS = [
  {
    icon: "◉",
    title: "Community & Events",
    desc: "Build a strong networking platform for AI, ML, and Data Science enthusiasts across Nepal and globally, while organizing impactful workshops, seminars, guest lectures, hackathons, and conferences.",
  },
  {
    icon: "◎",
    title: "Research & Innovation",
    desc: "Drive research excellence through publications, blogs, and peer-reviewed papers. Bridge the gap between industry and academia by supporting students and researchers.",
  },
  {
    icon: "◐",
    title: "Digital Nepal",
    desc: "Bridge the urban-rural divide by promoting AI, digital literacy, and technology-driven solutions for the inclusive development of rural Nepal.",
  },
  {
    icon: "◆",
    title: "Skill & Talent Development",
    desc: "Equip the next generation with industry-relevant skills through bootcamps, structured training programs, mentorship, and certification pathways in AI and Data Science.",
  },
];

export const TEAM = [
  { name: "Mr. Surya Bahadur Basnet",  role: "Principal",                               location: "Sankalpa College, Nepal",            url: "https://www.linkedin.com/in/surya-bdr-basnet-554859172/", initials: "SB", color: "#fb923c" },
  { name: "Dr. Tej Bahadur Shahi",     role: "Researcher",                              location: "CQUniversity, Australia",            url: "https://scholar.google.com/citations?user=t7kVlfIAAAAJ",  initials: "TS", color: "#34d399" },
  { name: "Dr. Sarbagya Ratna Shakya", role: "Asst. Professor",                         location: "Eastern New Mexico University, USA", url: "https://sites.google.com/view/sarbagyashakya/home",       initials: "SR", color: "#a78bfa" },
  { name: "Mr. Ashok Kumar Pant",      role: "CTO & Co-founder",                        location: "Treeleaf, Nepal",                    url: "https://www.linkedin.com/in/asokpant/",                   initials: "AP", color: "#f472b6" },
  { name: "Mr. Dilip Yogi",            role: "Application Architect",                   location: "USA",                                url: "https://www.linkedin.com/in/yogidilip/",                  initials: "DY", color: "#facc15" },
  { name: "Dr. Jhanak Parajuli",       role: "Sr. Data Scientist & Manager",            location: "Germany",                            url: "https://www.linkedin.com/in/jhanak-parajuli-41a29635/",   initials: "JP", color: "#4f9cf9" },
];

export const TIMELINE = [
  { year: "2018",   title: "Foundation",       colors: 0, desc: "Launched with a 3-day National Workshop on Machine Learning and Data Science (May 9–11). Overwhelming participation confirmed Nepal's appetite for AI/ML education." },
  { year: "2019+",  title: "Global Webinars",  colors: 1, desc: "Invited world leaders and experts in data science to share insights on the evolving field and opportunities for Nepal's growing tech community." },
  { year: "Annual", title: "NWMLDS",           colors: 2, desc: "National Workshop on Machine Learning and Data Science — Nepal's only flagship 5-day ML/DS workshop — held every year since 2018 for students, researchers and startup founders." },
  { year: "2021",   title: "Symposium at LTU", colors: 3, desc: "Organized a one-day symposium at Lumbini Technological University, expanding MLDSN's reach into western Nepal." },
];

export const TIMELINE_COLORS = ["var(--accent)", "var(--accent2)", "var(--green)", "var(--orange)"];

// ─── EVENTS DATA ──────────────────────────────────────────────────────────────
// Each event is shown on the home section AND the full Events page.
// Add new events at the TOP of this array so the latest appears first.
//
// Fields:
//   id       – unique slug, no spaces
//   year     – display year / label  (e.g. "2024", "Annual", "Ongoing")
//   title    – event name
//   type     – badge label           (e.g. "Workshop", "Webinar", "Symposium")
//   accent   – CSS colour variable or hex for the badge & top bar
//   location – venue / city / online
//   desc     – short description shown on cards
//   details  – longer description shown on the events page (supports plain text)
//   url      – registration / info link  (use "#" if none)
// ─────────────────────────────────────────────────────────────────────────────
export const EVENTS_DATA = [
  {
    id: "nwmlds-2025",
    year: "2025",
    title: "NWMLDS 2025 — National Workshop on ML & Data Science",
    type: "Workshop",
    accent: "var(--accent)",
    location: "Kathmandu, Nepal",
    desc: "The 7th edition of Nepal's flagship 5-day ML/DS workshop for students, researchers and startup founders.",
    details: "The National Workshop on Machine Learning and Data Science (NWMLDS) returned for its 7th edition in 2025. Over five intensive days, participants worked through hands-on sessions covering supervised and unsupervised learning, deep learning, natural language processing, and real-world project deployment. Keynote speakers included researchers from international universities and practitioners from Nepal's leading tech firms. The workshop continues to be the premier annual gathering for Nepal's AI and data science community.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events",
  },
  {
    id: "webinar-series-2024",
    year: "2024",
    title: "International Webinar Series — AI Frontiers",
    type: "Webinar",
    accent: "var(--green)",
    location: "Online (Global)",
    desc: "A series of live webinars with global data science and AI experts sharing research, career insights and opportunities for Nepal.",
    details: "Throughout 2024, MLDSN Nepal hosted a series of live online webinars featuring researchers, engineers, and practitioners from institutions and companies across the US, Europe, Australia and Asia. Topics ranged from large language models and computer vision to career pathways in global data science. Each session was followed by an open Q&A, and recordings were made available to the community. The series attracted participants from over 15 countries.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events",
  },
  {
    id: "nwmlds-2023",
    year: "2023",
    title: "NWMLDS 2023 — National Workshop on ML & Data Science",
    type: "Workshop",
    accent: "var(--accent)",
    location: "Kathmandu, Nepal",
    desc: "The 5th annual edition with expanded tracks on NLP, computer vision, and ML for social good.",
    details: "NWMLDS 2023 expanded its curriculum to include dedicated tracks on natural language processing, computer vision, and applications of machine learning for social impact in Nepal — including agriculture, healthcare, and education. The workshop hosted over 200 participants from universities and organisations across the country, with sessions led by a mix of Nepali researchers based locally and abroad.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events",
  },
  {
    id: "nwmlds-2022",
    year: "2022",
    title: "NWMLDS 2022 — National Workshop on ML & Data Science",
    type: "Workshop",
    accent: "var(--accent)",
    location: "Kathmandu, Nepal",
    desc: "Fourth edition of the flagship workshop, featuring a dedicated session on MLOps and model deployment in production.",
    details: "The 2022 edition of NWMLDS introduced a new focus on MLOps — the practice of deploying and maintaining machine learning models in production environments. Participants learned to use tools such as Docker, Kubernetes, and MLflow alongside core ML concepts. Guest lectures from industry practitioners bridged the gap between academic research and real-world implementation.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events",
  },
  {
    id: "ltu-symposium-2021",
    year: "2021",
    title: "1-Day Symposium at Lumbini Technological University",
    type: "Symposium",
    accent: "var(--accent2)",
    location: "Lumbini Technological University, Nepalganj",
    desc: "A focused one-day symposium bringing ML/DS education to western Nepal for the first time.",
    details: "In 2021, MLDSN Nepal organised a dedicated one-day symposium at Lumbini Technological University in Nepalganj — marking the first time the network's educational events reached western Nepal. The symposium covered ML fundamentals, data science career pathways, and opportunities in the global remote economy. It was attended by students and faculty from LTU and neighbouring institutions.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events",
  },
  {
    id: "nwmlds-2021",
    year: "2021",
    title: "NWMLDS 2021 — National Workshop on ML & Data Science",
    type: "Workshop",
    accent: "var(--accent)",
    location: "Online (COVID-19 Edition)",
    desc: "The third annual workshop, delivered fully online for the first time due to the pandemic, reaching a global audience.",
    details: "NWMLDS 2021 was held entirely online in response to the COVID-19 pandemic — and in doing so reached a far larger and more geographically diverse audience than any previous edition. Participants joined from Nepal, India, the US, Europe, and Australia. The online format allowed the network to invite international speakers who would not otherwise have been able to travel to Kathmandu, significantly raising the quality of the programme.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2021",
  },
  {
    id: "nwmlds-2020",
    year: "2020",
    title: "NWMLDS 2020 — National Workshop on ML & Data Science",
    type: "Workshop",
    accent: "var(--accent)",
    location: "Kathmandu, Nepal",
    desc: "Second edition of the flagship workshop, expanding to five full days with new tracks on deep learning and data engineering.",
    details: "Building on the success of the 2018 founding workshop, NWMLDS 2020 expanded to a full five-day format with parallel tracks covering deep learning, data engineering, and applied ML case studies from Nepal's private sector. The workshop attracted participants from 40+ institutions across Nepal.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2020",
  },
  {
    id: "nwmlds-2018",
    year: "2018",
    title: "NWMLDS 2018 — Founding Workshop",
    type: "Workshop",
    accent: "var(--orange)",
    location: "Kathmandu, Nepal",
    desc: "The founding event that launched MLDSN Nepal — a 3-day National Workshop on ML and Data Science that proved Nepal's appetite for AI education.",
    details: "The first National Workshop on Machine Learning and Data Science was held over three days in May 2018, and was the founding event of MLDSN Nepal. The overwhelming response — with participants travelling from across the country — confirmed that there was a genuine and underserved appetite for hands-on ML and data science education in Nepal. This workshop became the model for everything that followed.",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2018",
  },
];
