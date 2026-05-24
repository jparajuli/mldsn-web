import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Mission", href: "#mission" },
  { label: "Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { value: "2018", label: "Founded", suffix: "" },
  { value: "5", label: "Day Annual Workshop", suffix: "+" },
  { value: "6", label: "Years Active", suffix: "+" },
  { value: "100", label: "Members & Growing", suffix: "s" },
];

const MISSION_ITEMS = [
  {
    icon: "◈",
    title: "Networking Platform",
    desc: "Build connections between ML and Data Science enthusiasts across Nepal and the world.",
  },
  {
    icon: "◉",
    title: "Workshops & Events",
    desc: "Organise workshops, guest lectures, seminars, conferences and major events related to ML & DS.",
  },
  {
    icon: "◎",
    title: "Research & Publications",
    desc: "Publish blog posts, articles and peer-reviewed papers. Fund and support student research for international publication.",
  },
  {
    icon: "◐",
    title: "Digital Nepal",
    desc: "Promote IT and digitalisation for the rural development of Nepal — bridging the urban-rural knowledge divide.",
  },
];

const TEAM = [
  {
    name: "Dr. Jhanak Parajuli",
    role: "Data Scientist & Global Program Manager",
    location: "Germany",
    url: "https://www.databigyan.com/about-me",
    initials: "JP",
    color: "#4f9cf9",
  },
  {
    name: "Dr. Sarbagya Ratna Shakya",
    role: "Asst. Professor",
    location: "Eastern New Mexico University, USA",
    url: "https://www.linkedin.com/in/sarbagya-ratna-shakya-b2a30716a/",
    initials: "SR",
    color: "#a78bfa",
  },
  {
    name: "Mr. Tej Bahadur Shahi",
    role: "PhD Student",
    location: "CQUniversity, Australia",
    url: "https://tejshahi.github.io/",
    initials: "TS",
    color: "#34d399",
  },
  {
    name: "Mr. Surya Bahadur Basnet",
    role: "Head of Department",
    location: "KIST College, Nepal",
    url: "https://www.linkedin.com/in/surya-basnet-554859172/",
    initials: "SB",
    color: "#fb923c",
  },
  {
    name: "Mr. Ashok Pant",
    role: "CTO & Co-founder",
    location: "Treeleaf, Nepal",
    url: "https://treeleaf.ai/about.html",
    initials: "AP",
    color: "#f472b6",
  },
  {
    name: "Mr. Dilip Yogi",
    role: "Application Architect",
    location: "ABC Fitness Solution, USA",
    url: "https://www.linkedin.com/in/yogidilip/",
    initials: "DY",
    color: "#facc15",
  },
];

const ADVISORS = [
  {
    name: "Prof. Dr. Manish Pokharel",
    role: "Dean, School of Engineering",
    location: "Kathmandu University, Nepal",
    url: "https://ku.edu.np/contact-detail/18",
    initials: "MP",
    color: "#60a5fa",
  },
  {
    name: "Reg Bhandari",
    role: "Registrar",
    location: "Lumbini Technological University",
    initials: "RB",
    color: "#c084fc",
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "Foundation",
    desc: "Launched with a 3-day National Workshop on Machine Learning and Data Science (May 9–11). Overwhelming participation confirmed Nepal's appetite for AI/ML education.",
  },
  {
    year: "2019+",
    title: "Global Webinars",
    desc: "Invited world leaders and experts in data science to share insights on the evolving field and opportunities for Nepal's growing tech community.",
  },
  {
    year: "Annual",
    title: "NWMLDS",
    desc: "National Workshop on Machine Learning and Data Science — Nepal's only flagship 5-day ML/DS workshop — held every year since 2018 for students, researchers and startup founders.",
  },
  {
    year: "2021",
    title: "Symposium at LTU",
    desc: "Organized a one-day symposium at Lumbini Technological University, expanding MLDSN's reach into western Nepal.",
  },
];

const BLOGS = [
  {
    title: "Kaggle: Place to Learn ML and DS",
    excerpt: "Discover how Kaggle can be your go-to platform for hands-on machine learning practice, competitions, and datasets.",
    tag: "Learning",
    url: "https://www.mldsnnepal.org/blog/kaggle_i",
    color: "#4f9cf9",
  },
  {
    title: "Linear Algebra for Machine Learning (Part I)",
    excerpt: "Understanding vectors, matrices and transformations — the mathematical backbone of every ML algorithm.",
    tag: "Mathematics",
    url: "https://www.mldsnnepal.org/blog/linear_algebra_i",
    color: "#a78bfa",
  },
  {
    title: "Probability for Machine Learning (Part I)",
    excerpt: "From Bayes' theorem to probability distributions — mastering the statistical thinking required for ML.",
    tag: "Mathematics",
    url: "https://www.mldsnnepal.org/blog/probability_i",
    color: "#34d399",
  },
];

// ─── Styles injected once ─────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #080c10;
    --surface: #0d1117;
    --card:    #111620;
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --accent:  #4f9cf9;
    --accent2: #a78bfa;
    --green:   #34d399;
    --text:    #e2e8f0;
    --muted:   #64748b;
    --sub:     #94a3b8;
    --ff-head: 'Fraunces', Georgia, serif;
    --ff-body: 'Outfit', sans-serif;
    --ff-mono: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--ff-body);
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
  }

  ::selection { background: rgba(79,156,249,0.25); color: #fff; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform: scale(1); }
    50%      { opacity:.5; transform: scale(.7); }
  }
  @keyframes drift {
    0%,100% { transform: translateY(0) translateX(0); }
    33%     { transform: translateY(-14px) translateX(6px); }
    66%     { transform: translateY(8px) translateX(-8px); }
  }
  @keyframes line-grow {
    from { scaleX(0); }
    to   { scaleX(1); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }

  .fade-up   { animation: fade-up  0.6s ease both; }
  .fade-in   { animation: fade-in  0.5s ease both; }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: var(--ff-body); }

  /* Mountain grid bg */
  .mountain-grid {
    background-image:
      linear-gradient(rgba(79,156,249,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79,156,249,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
`;

// ─── Components ──────────────────────────────────────────────────────────────

function Tag({ children, color = "var(--accent)" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 4,
      fontSize: 11, fontFamily: "var(--ff-mono)", letterSpacing: ".08em",
      fontWeight: 500, textTransform: "uppercase",
      background: `${color}18`, border: `1px solid ${color}44`, color,
    }}>{children}</span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
    }}>
      <div style={{ width: 24, height: 1, background: "var(--accent)" }} />
      <span style={{
        fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".14em",
        textTransform: "uppercase", color: "var(--accent)",
      }}>{children}</span>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 clamp(20px,5vw,60px)",
      background: scrolled ? "rgba(8,12,16,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all .3s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 68,
    }}>
      {/* Logo */}
      <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--ff-body)", fontWeight: 700, fontSize: 13, color: "#fff",
          letterSpacing: ".04em",
        }}>ML</div>
        <div>
          <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 15, lineHeight: 1.1 }}>MLDSN Nepal</div>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em" }}>Machine Learning & Data Science Network</div>
        </div>
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}
        className="desktop-nav">
        {NAV_LINKS.map(l => (
          <a key={l.label} href={l.href}
            onClick={() => setActive(l.label.toLowerCase())}
            style={{
              padding: "7px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              color: active === l.label.toLowerCase() ? "var(--accent)" : "var(--sub)",
              background: active === l.label.toLowerCase() ? "rgba(79,156,249,0.08)" : "transparent",
              transition: "all .2s",
            }}
            onMouseEnter={e => { if (active !== l.label.toLowerCase()) { e.currentTarget.style.color = "var(--text)"; } }}
            onMouseLeave={e => { if (active !== l.label.toLowerCase()) { e.currentTarget.style.color = "var(--sub)"; } }}
          >{l.label}</a>
        ))}
        <a href="https://www.mldsnnepal.org/become-a-member" target="_blank"
          style={{
            marginLeft: 8, padding: "8px 18px", borderRadius: 8,
            background: "var(--accent)", color: "#fff",
            fontSize: 13, fontWeight: 600,
            boxShadow: "0 0 20px rgba(79,156,249,0.3)",
            transition: "all .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(79,156,249,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(79,156,249,0.3)"; e.currentTarget.style.transform = "none"; }}
        >Join Network</a>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(v => !v)}
        style={{ background: "none", border: "none", color: "var(--text)", fontSize: 22, display: "none" }}
        className="hamburger">☰</button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 68, left: 0, right: 0, bottom: 0,
          background: "rgba(8,12,16,0.98)", backdropFilter: "blur(20px)",
          padding: 32, display: "flex", flexDirection: "column", gap: 4,
          zIndex: 99,
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ padding: "14px 0", fontSize: 18, fontFamily: "var(--ff-body)", fontWeight: 600,
                color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
              {l.label}
            </a>
          ))}
          <a href="https://www.mldsnnepal.org/become-a-member"
            style={{ marginTop: 24, padding: "14px 24px", borderRadius: 10, background: "var(--accent)",
              color: "#fff", fontSize: 15, fontWeight: 600, textAlign: "center" }}>
            Join Network
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" className="mountain-grid" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px clamp(20px,6vw,80px) 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: "15%", right: "8%",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,156,249,0.09) 0%, transparent 70%)",
        animation: "drift 12s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "5%",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
        animation: "drift 16s ease-in-out infinite reverse",
        pointerEvents: "none",
      }} />

      {/* Mountain silhouette hint */}
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", opacity: .04, pointerEvents: "none" }}
        viewBox="0 0 1440 220" preserveAspectRatio="none">
        <polygon points="0,220 180,80 320,160 480,40 620,130 760,20 900,110 1080,50 1260,120 1440,60 1440,220" fill="white" />
      </svg>

      <div style={{ maxWidth: 860, position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "6px 14px", borderRadius: 20,
          background: "rgba(79,156,249,0.08)", border: "1px solid rgba(79,156,249,0.25)",
          animation: "fade-up .5s ease both",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".12em", color: "var(--accent)", textTransform: "uppercase" }}>
            Est. 2018 · Kathmandu, Nepal
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--ff-head)", fontWeight: 700,
          fontSize: "clamp(2.2rem,4.5vw,3.8rem)", lineHeight: 1.1,
          letterSpacing: "-0.02em", fontOpticalSizing: "auto",
          marginBottom: 24, animation: "fade-up .6s .1s ease both",
          maxWidth: 720,
        }}>
          Machine Learning &{" "}
          <span style={{ background: "linear-gradient(90deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Data Science
          </span>
          {" "}Network Nepal
        </h1>

        <p style={{
          fontSize: "clamp(.95rem,1.8vw,1.15rem)", color: "var(--sub)", maxWidth: 620, lineHeight: 1.75,
          marginBottom: 40, animation: "fade-up .6s .2s ease both",
        }}>
          A non-profit community dedicated to advancing AI, machine learning and data science in Nepal — through education, research, networking and rural digital inclusion.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fade-up .6s .3s ease both" }}>
          <a href="https://www.mldsnnepal.org/become-a-member" target="_blank"
            style={{
              padding: "13px 28px", borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), #2563eb)",
              color: "#fff", fontSize: 15, fontWeight: 600,
              boxShadow: "0 8px 32px rgba(79,156,249,0.3)", transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(79,156,249,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(79,156,249,0.3)"; }}
          >Become a Member</a>
          <a href="#about"
            style={{
              padding: "13px 28px", borderRadius: 10,
              background: "transparent", border: "1px solid var(--border2)",
              color: "var(--text)", fontSize: 15, fontWeight: 500, transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,0.4)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
          >Learn More ↓</a>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ticker ─────────────────────────────────────────────────────────────
function StatsTicker() {
  return (
    <div style={{
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      background: "var(--surface)", padding: "0 clamp(20px,5vw,60px)",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: 0,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: "28px 24px", textAlign: "center",
            borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              fontFamily: "var(--ff-head)", fontWeight: 700,
              fontSize: "clamp(1.6rem,2.8vw,2.2rem)",
              letterSpacing: "-0.02em",
              color: i % 2 === 0 ? "var(--accent)" : "var(--accent2)",
              lineHeight: 1,
            }}>
              {s.value}<span style={{ fontSize: "60%" }}>{s.suffix}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, letterSpacing: ".04em" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "100px clamp(20px,6vw,80px)", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center" }}>
        {/* Left text */}
        <div>
          <SectionLabel>Who We Are</SectionLabel>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.55rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Nepal's leading community for <span style={{ color: "var(--accent)" }}>AI & Data Science</span>
          </h2>
          <p style={{ color: "var(--sub)", lineHeight: 1.8, marginBottom: 16, fontSize: ".97rem" }}>
            Though machine learning and artificial intelligence existed from the 1960s, data science wasn't widely known until 2012. Within a decade it became one of the most demanded skillsets in industry and academia worldwide.
          </p>
          <p style={{ color: "var(--sub)", lineHeight: 1.8, fontSize: ".97rem" }}>
            Understanding this growing demand, we founded MLDSN Nepal in 2018 — a non-profit community where students, entrepreneurs, researchers and digital experts share knowledge, organise events, write blogs and collectively advance the field across Nepal.
          </p>
        </div>

        {/* Right visual card */}
        <div style={{ position: "relative" }}>
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
          }}>
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--accent), var(--accent2))" }} />

            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)", marginBottom: 20, letterSpacing: ".08em" }}>// community.profile</div>

            {[
              ["Founded", "2018"],
              ["Type", "Non-Profit Community"],
              ["Focus", "ML · DS · AI"],
              ["Location", "Nepal (Global Network)"],
              ["Contact", "aimldsn@gmail.com"],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid var(--border)",
                fontSize: ".9rem",
              }}>
                <span style={{ color: "var(--muted)", fontFamily: "var(--ff-mono)", fontSize: 12 }}>{k}</span>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>{v}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
              <a href="https://www.facebook.com/groups/217595548832685" target="_blank"
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, textAlign: "center",
                  background: "rgba(79,156,249,0.08)", border: "1px solid rgba(79,156,249,0.2)",
                  color: "var(--accent)", fontSize: 13, fontWeight: 600, transition: "all .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(79,156,249,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(79,156,249,0.08)"}
              >Facebook Group</a>
              <a href="https://www.mldsnnepal.org/research-career" target="_blank"
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, textAlign: "center",
                  background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
                  color: "var(--accent2)", fontSize: 13, fontWeight: 600, transition: "all .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(167,139,250,0.08)"}
              >Research & Career</a>
            </div>
          </div>
          {/* Floating decoration */}
          <div style={{
            position: "absolute", top: -20, right: -20, width: 80, height: 80,
            borderRadius: "50%", border: "1px solid rgba(79,156,249,0.2)",
            animation: "spin-slow 20s linear infinite",
          }} />
        </div>
      </div>

      <style>{`@media(max-width:720px){ #about .grid { grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}

// ─── Mission ─────────────────────────────────────────────────────────────────
function Mission() {
  return (
    <section id="mission" style={{
      padding: "100px clamp(20px,6vw,80px)",
      background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Our Mission</SectionLabel>
        <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.55rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 480 }}>
          Four pillars driving AI in Nepal
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {MISSION_ITEMS.map((item, i) => (
            <div key={i} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px", position: "relative",
              overflow: "hidden", transition: "border-color .25s, transform .25s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, marginBottom: 16,
                background: `linear-gradient(135deg, ${["rgba(79,156,249,.15)","rgba(167,139,250,.15)","rgba(52,211,153,.15)","rgba(251,146,60,.15)"][i]}, transparent)`,
                border: `1px solid ${["rgba(79,156,249,.25)","rgba(167,139,250,.25)","rgba(52,211,153,.25)","rgba(251,146,60,.25)"][i]}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, color: ["var(--accent)","var(--accent2)","var(--green)","#fb923c"][i],
              }}>{item.icon}</div>
              <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "var(--sub)", fontSize: ".88rem", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline / History ──────────────────────────────────────────────────────
function History() {
  return (
    <section style={{ padding: "100px clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>A Bit of History</SectionLabel>
        <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.55rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 56 }}>
          Our journey since 2018
        </h2>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 16, top: 0, bottom: 0, width: 1,
            background: "linear-gradient(180deg, var(--accent), var(--accent2), transparent)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 32, paddingBottom: i < TIMELINE.length - 1 ? 48 : 0 }}>
                {/* Dot */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "var(--bg)", border: `2px solid ${["var(--accent)","var(--accent2)","var(--green)","#fb923c"][i]}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["var(--accent)","var(--accent2)","var(--green)","#fb923c"][i] }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingTop: 4 }}>
                  <Tag color={["var(--accent)","var(--accent2)","var(--green)","#fb923c"][i]}>{item.year}</Tag>
                  <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.1rem", margin: "10px 0 8px" }}>{item.title}</h3>
                  <p style={{ color: "var(--sub)", fontSize: ".92rem", lineHeight: 1.75, maxWidth: 560 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" style={{
      padding: "100px clamp(20px,6vw,80px)",
      background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>The People</SectionLabel>
        <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.55rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Core Team
        </h2>
        <p style={{ color: "var(--sub)", marginBottom: 48, maxWidth: 500, fontSize: ".95rem" }}>
          Volunteers from academia, industry, and research — united by the mission to grow Nepal's AI ecosystem.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 56 }}>
          {TEAM.map((m, i) => (
            <a key={i} href={m.url || "#"} target="_blank"
              style={{
                display: "block", background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "22px 20px",
                transition: "all .25s", textDecoration: "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${m.color}14`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${m.color}33, ${m.color}11)`,
                  border: `1.5px solid ${m.color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 14, color: m.color,
                }}>{m.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".92rem", color: "var(--text)", lineHeight: 1.3 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.role}</div>
                </div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, color: m.color, fontFamily: "var(--ff-mono)",
                background: `${m.color}12`, border: `1px solid ${m.color}30`,
                padding: "3px 8px", borderRadius: 4,
              }}>
                📍 {m.location}
              </div>
            </a>
          ))}
        </div>

        {/* Advisors */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 48 }}>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 600, fontSize: "1.1rem", marginBottom: 24, color: "var(--accent2)", letterSpacing: "-0.01em" }}>
            Advisory Board
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {ADVISORS.map((m, i) => (
              <a key={i} href={m.url || "#"} target="_blank"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "16px 18px",
                  transition: "all .2s", textDecoration: "none",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: `${m.color}20`, border: `1.5px solid ${m.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 13, color: m.color,
                }}>{m.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--text)" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.role} · {m.location}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Events ──────────────────────────────────────────────────────────────────
function Events() {
  const events = [
    { year: "Annual", title: "NWMLDS — National Workshop on ML & DS", type: "Workshop", desc: "Nepal's only flagship 5-day ML/DS workshop. Held every year since 2018 for students, researchers and startup founders.", accent: "var(--accent)" },
    { year: "2021", title: "1-Day Symposium at LTU", type: "Symposium", desc: "A focused one-day symposium at Lumbini Technological University, Nepalganj — bringing ML/DS education to western Nepal.", accent: "var(--accent2)" },
    { year: "Ongoing", title: "International Webinar Series", type: "Webinar", desc: "Global experts in data science and ML share their views on how the field is evolving and the opportunities for Nepal's tech community.", accent: "var(--green)" },
  ];

  return (
    <section id="events" style={{ padding: "100px clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Events</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.55rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            News & Events
          </h2>
          <a href="https://www.mldsnnepal.org/news-and-events/events" target="_blank"
            style={{
              padding: "9px 20px", borderRadius: 8, border: "1px solid var(--border2)",
              color: "var(--sub)", fontSize: 13, fontWeight: 500, transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
          >All Events →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {events.map((ev, i) => (
            <div key={i} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 16, overflow: "hidden", transition: "all .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${ev.accent}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ height: 4, background: `linear-gradient(90deg, ${ev.accent}, transparent)` }} />
              <div style={{ padding: "24px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Tag color={ev.accent}>{ev.type}</Tag>
                  <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)" }}>{ev.year}</span>
                </div>
                <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1rem", marginBottom: 10, lineHeight: 1.35 }}>{ev.title}</h3>
                <p style={{ color: "var(--sub)", fontSize: ".87rem", lineHeight: 1.7 }}>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
function Blog() {
  return (
    <section id="blog" style={{
      padding: "100px clamp(20px,6vw,80px)",
      background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Knowledge Hub</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.55rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            Recent Blog Posts
          </h2>
          <a href="https://www.mldsnnepal.org/blog" target="_blank"
            style={{
              padding: "9px 20px", borderRadius: 8, border: "1px solid var(--border2)",
              color: "var(--sub)", fontSize: 13, fontWeight: 500, transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
          >All Posts →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {BLOGS.map((b, i) => (
            <a key={i} href={b.url} target="_blank"
              style={{
                display: "block", background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "26px 22px", textDecoration: "none",
                transition: "all .25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${b.color}44`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${b.color}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ marginBottom: 14 }}><Tag color={b.color}>{b.tag}</Tag></div>
              <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1rem", marginBottom: 10, lineHeight: 1.4, color: "var(--text)" }}>{b.title}</h3>
              <p style={{ color: "var(--sub)", fontSize: ".87rem", lineHeight: 1.7, marginBottom: 20 }}>{b.excerpt}</p>
              <span style={{ color: b.color, fontSize: 13, fontWeight: 600 }}>Read post →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Join CTA ─────────────────────────────────────────────────────────────────
function JoinCTA() {
  return (
    <section style={{ padding: "100px clamp(20px,6vw,80px)" }}>
      <div style={{
        maxWidth: 780, margin: "0 auto", textAlign: "center",
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 24, padding: "clamp(40px,6vw,72px) clamp(24px,5vw,64px)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(79,156,249,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Tag>Community</Tag>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.6rem,2.8vw,2.4rem)", margin: "20px 0 16px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Become a Member of<br />
            <span style={{ color: "var(--accent)" }}>MLDSN Nepal</span>
          </h2>
          <p style={{ color: "var(--sub)", fontSize: ".97rem", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 36px" }}>
            Join the network to receive updates on events, workshops, research opportunities and connect with Nepal's growing ML & DS community.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.mldsnnepal.org/become-a-member" target="_blank"
              style={{
                padding: "14px 32px", borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent), #2563eb)",
                color: "#fff", fontSize: 15, fontWeight: 700,
                boxShadow: "0 8px 32px rgba(79,156,249,0.35)", transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            >Register Now — It's Free</a>
            <a href="https://www.facebook.com/groups/217595548832685" target="_blank"
              style={{
                padding: "14px 28px", borderRadius: 10,
                background: "transparent", border: "1px solid var(--border2)",
                color: "var(--text)", fontSize: 15, fontWeight: 600, transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,.35)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
            >Facebook Group</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact / Footer ─────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" style={{
      background: "var(--surface)", borderTop: "1px solid var(--border)",
      padding: "64px clamp(20px,6vw,80px) 32px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--ff-body)", fontWeight: 700, fontSize: 13, color: "#fff",
                letterSpacing: ".04em",
              }}>ML</div>
              <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 15 }}>MLDSN Nepal</div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: ".87rem", lineHeight: 1.75, maxWidth: 260, marginBottom: 20 }}>
              A non-profit community advancing machine learning and data science education across Nepal since 2018.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="mailto:aimldsn@gmail.com" style={{ color: "var(--sub)", fontSize: ".85rem", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--sub)"}
              >✉ aimldsn@gmail.com</a>
              <span style={{ color: "var(--sub)", fontSize: ".85rem" }}>📞 +977 9851158281</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 16, color: "var(--text)", letterSpacing: ".02em" }}>Quick Links</div>
            {[["NWMLDS 2021","https://www.mldsnnepal.org/news-and-events/events/nwmlds-2021"],
              ["NWMLDS 2020","https://www.mldsnnepal.org/news-and-events/events/nwmlds-2020"],
              ["Research & Career","https://www.mldsnnepal.org/research-career"],
              ["Become a Member","https://www.mldsnnepal.org/become-a-member"],
            ].map(([l, h]) => (
              <a key={l} href={h} target="_blank"
                style={{ display: "block", color: "var(--muted)", fontSize: ".85rem", marginBottom: 10, transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
              >{l}</a>
            ))}
          </div>

          {/* Recent Blogs */}
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 16, color: "var(--text)", letterSpacing: ".02em" }}>Recent Blogs</div>
            {BLOGS.map(b => (
              <a key={b.title} href={b.url} target="_blank"
                style={{ display: "block", color: "var(--muted)", fontSize: ".83rem", marginBottom: 10, lineHeight: 1.4, transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
              >{b.title}</a>
            ))}
          </div>

          {/* Community */}
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 16, color: "var(--text)", letterSpacing: ".02em" }}>Community</div>
            <a href="https://www.facebook.com/groups/217595548832685" target="_blank"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", borderRadius: 8, marginBottom: 10,
                background: "rgba(79,156,249,0.07)", border: "1px solid rgba(79,156,249,0.18)",
                color: "var(--accent)", fontSize: ".85rem", fontWeight: 600, transition: "all .2s",
                textDecoration: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(79,156,249,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(79,156,249,0.07)"}
            >👥 Facebook Group</a>
            <a href="https://www.mldsnnepal.org/news-and-events" target="_blank"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", borderRadius: 8,
                background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.18)",
                color: "var(--accent2)", fontSize: ".85rem", fontWeight: 600, transition: "all .2s",
                textDecoration: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(167,139,250,0.07)"}
            >📅 Events</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ color: "var(--muted)", fontSize: ".82rem" }}>© 2024 MLDSN Nepal. Non-profit community.</span>
          <span style={{ color: "var(--muted)", fontSize: ".82rem", fontFamily: "var(--ff-mono)" }}>mldsnnepal.org</span>
        </div>
      </div>

      <style>{`
        @media(max-width:720px){
          footer .grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px){
          footer .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <StatsTicker />
      <About />
      <Mission />
      <History />
      <Team />
      <Events />
      <Blog />
      <JoinCTA />
      <Footer />
    </div>
  );
}
