// ─── SITE DATA ────────────────────────────────────────────────────────────────
// Edit this file to update stats, mission cards, team members,
// timeline entries, and events without touching any component code.
// ─────────────────────────────────────────────────────────────────────────────

export const STATS = [
  { value: "2018", label: "Founded",             suffix: ""  },
  { value: "8",    label: "Workshops & seminars",  suffix: "+" },
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
  { name: "Mr. Dilip Yogi",            role: "Application Architect",                   location: " USA",                               url: "https://www.linkedin.com/in/yogidilip/",                  initials: "DY", color: "#facc15" },
  { name: "Dr. Jhanak Parajuli",       role: "Senior Data Scientist/Manager",            location: "Germany",                           url: "https://www.linkedin.com/in/jhanak-parajuli-41a29635/",   initials: "JP", color: "#4f9cf9" },
];

export const TIMELINE = [
  { year: "2018",   title: "Foundation",       colors: 0, desc: "Launched with a 3-day National Workshop on Machine Learning and Data Science (May 9–11). Overwhelming participation confirmed Nepal's appetite for AI/ML education." },
  { year: "2019+",  title: "Global Webinars",  colors: 1, desc: "Invited world leaders and experts in data science to share insights on the evolving field and opportunities for Nepal's growing tech community." },
  { year: "Annual", title: "NWMLDS",           colors: 2, desc: "National Workshop on Machine Learning and Data Science — Nepal's only flagship 5-day ML/DS workshop — held every year since 2018 for students, researchers and startup founders." },
  { year: "2021",   title: "Symposium at LTU", colors: 3, desc: "Organized a one-day symposium at Lumbini Technological University, expanding MLDSN's reach into western Nepal." },
];

export const TIMELINE_COLORS = ["var(--accent)", "var(--accent2)", "var(--green)", "var(--orange)"];

export const EVENTS_DATA = [
  { year: "Annual",  title: "NWMLDS — National Workshop on ML & DS", type: "Workshop",  accent: "var(--accent)",  desc: "Nepal's only flagship 5-day ML/DS workshop. Held every year since 2018 for students, researchers and startup founders." },
  { year: "2021",    title: "1-Day Symposium at LTU",                type: "Symposium", accent: "var(--accent2)", desc: "A focused one-day symposium at Lumbini Technological University, Nepalganj — bringing ML/DS education to western Nepal." },
  { year: "Ongoing", title: "International Webinar Series",          type: "Webinar",   accent: "var(--green)",   desc: "Global experts in data science and ML share their views on how the field is evolving and opportunities for Nepal's tech community." },
];
