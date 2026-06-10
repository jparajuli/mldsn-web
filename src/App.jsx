import { useState, useEffect, useCallback } from "react";

// ==============================================================================
// CONFIGURATION: PASTE YOUR APP SCRIPT WEB APP URL HERE
// ==============================================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyIe2O-zXZ4ogWxqZ7EdiU9G560etqzpkN6LSI4wPBGPU8aI4u1J1AvL99sXRbMIjX8g/exec";

// ─── CRITICAL ASSET RESOLUTION ZONE ───────────────────────────────────────────
import groupPhoto from "./assets/images/group-2026.jpeg";

// ─── STYLES & DATA WILDCARDS ──────────────────────────────────────────────────
import "./styles/global.css";
import * as logoModule  from "./data/logo.js";
import * as postsModule from "./data/posts.js";
import * as siteModule  from "./data/siteData.js";

// ─── DATA RESOLUTION AND REGISTRY FROM OFFICIAL ENTRY HUB ─────────────────────
const SCRAPED_EVENTS = [
  {
    title: "5th National Workshop on Machine Learning and Data Science (NWMLDS - 2026)",
    desc: "Nepal's flagship annual multi-day intensive workshop track. Bringing together global researchers, deep learning engineers, and computational scholars to share insights, lead masterclasses, and mentor local taskforce projects.",
    year: "2026 (TBD)",
    type: "Workshop",
    accent: "var(--accent)",
    url: "#"
  },
  {
    title: "1-Day National Workshop on AI and Emerging Technologies",
    desc: "An advanced technical intensive focus track held on April 20, 2024. Delved deep into Generative AI implementations, deployment architectures, large scale text structures, and local engineering pipeline operations.",
    year: "2024",
    type: "Workshop",
    accent: "var(--green)",
    url: "#"
  },
  {
    title: "1-Day International Symposium on AI, Machine Learning and Data Science",
    desc: "A high-level international knowledge-exchange summit launched on June 8, 2023. Bridged collaborative efforts between regional infrastructure founders, international research labs, and academic engineering heads.",
    year: "2023",
    type: "Symposium",
    accent: "var(--accent2)",
    url: "#"
  },
  {
    title: "4th National Workshop on Machine Learning and Data Science (NWMLDS - 2021)",
    desc: "A massive 5-day specialized virtual event held from September 15-19, 2021. Featured elite panels covering Computer Vision, NLP architecture, Deep Reinforcement Learning, and practical systems deployment in Healthcare and Financial spaces.",
    year: "2021",
    type: "Workshop",
    accent: "var(--accent)",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2021"
  },
  {
    title: "3rd National Workshop on Machine Learning and Data Science (NWMLDS - 2020)",
    desc: "Launched virtually from July 30 to August 3, 2020, to adapt to global constraints. This 5-day event centralized on Big Data architecture pipelines, real-time PySpark parsing workflows, cloud services setup, and live group hack projects.",
    year: "2020",
    type: "Workshop",
    accent: "var(--orange)",
    url: "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2020"
  },
  {
    title: "2nd National Workshop on Machine Learning and Data Science (NWMLDS - 2019)",
    desc: "An intensive in-person project-oriented training and abstract presentation forum held from July 10-14, 2019, at KIST College, Kathmandu. Promoted collaborative student team networks and industry alignment.",
    year: "2019",
    type: "Workshop",
    accent: "var(--accent2)",
    url: "#"
  },
  {
    title: "1st National Workshop on Machine Learning and Data Science (NWMLDS - 2018)",
    desc: "The historic founding event held from May 9-11, 2018, at KIST College. This inaugural 3-day workshop initialized the framework for the entire MLDSN community pipeline, establishing initial academic ties across the Kathmandu valley.",
    year: "2018",
    type: "Workshop",
    accent: "var(--green)",
    url: "#"
  }
];

// ─── UNIVERSAL INTERFACE FAULT-TOLERANT RESOLVER LAYER ────────────────────────
const extractArray = (moduleObj, key) => {
  if (!moduleObj) return [];
  if (Array.isArray(moduleObj[key])) return moduleObj[key];
  if (moduleObj.default && Array.isArray(moduleObj.default[key])) return moduleObj.default[key];
  return [];
};

const extractString = (moduleObj, key) => {
  if (!moduleObj) return "";
  if (typeof moduleObj[key] === "string") return moduleObj[key];
  if (moduleObj.default && typeof moduleObj.default[key] === "string") return moduleObj.default[key];
  return "";
};

const rawPosts    = extractArray(postsModule, "POSTS");
const rawEvents   = extractArray(siteModule, "ALL_EVENTS").length ? extractArray(siteModule, "ALL_EVENTS") : extractArray(siteModule, "EVENTS");
const rawTeam     = extractArray(siteModule, "TEAM");
const rawStats    = extractArray(siteModule, "STATS");
const rawMission  = extractArray(siteModule, "MISSION_ITEMS").length ? extractArray(siteModule, "MISSION_ITEMS") : extractArray(siteModule, "MISSION");
const rawTimeline = extractArray(siteModule, "TIMELINE");
const LOGO_URL    = extractString(logoModule, "LOGO_URL");

// Normalize incoming site entries and load scraped dataset as standard fallback
const safeEvents = rawEvents.length 
  ? rawEvents.map(ev => ({
      title:  ev.title || ev.name || "Untitled Event",
      desc:   ev.desc || ev.description || ev.details || "No details provided.",
      year:   ev.year || ev.date || ev.time || "2026",
      type:   ev.type || ev.category || ev.tag || "Event",
      accent: ev.accent || ev.color || "var(--accent)",
      url:    ev.url || ev.link || ev.href || ""
    }))
  : SCRAPED_EVENTS;

// LLM Post Image Fault-Tolerant Transit Fallback Layer
const safePosts = rawPosts.map(p => {
  let hero = p.heroImage;
  const isLLM = p.title?.toLowerCase().includes("llm") || p.excerpt?.toLowerCase().includes("llm") || p.tag?.toLowerCase().includes("llm");
  if (isLLM && (!hero || hero === "#" || typeof hero !== "string" || hero.startsWith("undefined") || hero.includes("placeholder"))) {
    hero = "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800";
  }
  return {
    ...p,
    title:    p.title || "Untitled Post",
    excerpt:  p.excerpt || p.summary || "",
    tag:      p.tag || p.category || "General",
    tagColor: p.tagColor || p.color || "var(--accent)",
    heroImage: hero
  };
});

const safeTeam     = rawTeam;
const safeStats    = rawStats;
const safeMission  = rawMission;
const safeColors   = extractArray(siteModule, "TIMELINE_COLORS").length ? extractArray(siteModule, "TIMELINE_COLORS") : ["var(--accent)", "var(--accent2)", "var(--green)", "var(--orange)"];

// Journey Timeline Sync
const baseTimeline = Array.isArray(rawTimeline) ? [...rawTimeline] : [];
if (!baseTimeline.some(t => String(t?.year).includes("2024"))) {
  baseTimeline.push({
    year: "2024",
    title: "1-Day National Workshop on AI and Emerging Technologies",
    desc: "An advanced technical intensive focus track held on April 20, 2024. Delved deep into Generative AI implementations, deployment architectures, large scale text structures, and local engineering pipeline operations.",
    colors: 2
  });
}

const safeTimeline = baseTimeline.map((item, idx) => ({
  year: item.year || "2026",
  title: item.title || "Milestone Event",
  desc: item.desc || item.description || "",
  colors: typeof item.colors === "number" ? item.colors : idx
})).sort((a, b) => {
  const yA = parseInt(a.year.replace(/\D/g, "")) || 0;
  const yB = parseInt(b.year.replace(/\D/g, "")) || 0;
  return yB - yA;
});

// ─── Logo Component ───────────────────────────────────────────────────────────
function Logo({ size = 36 }) {
  if (LOGO_URL) {
    const w = Math.round(size * 2.2);
    const h = Math.round(size * 0.72);
    return (
      <img
        src={LOGO_URL}
        alt="MLDSN Nepal"
        style={{ width: w, height: h, objectFit: "contain", flexShrink: 0, borderRadius: 3 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: "linear-gradient(135deg,var(--accent),var(--accent2))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--ff-body)", fontWeight: 700,
      fontSize: Math.round(size * 0.36), color: "#fff", letterSpacing: ".04em",
    }}>ML</div>
  );
}

// ─── Shared UI Elements ───────────────────────────────────────────────────────
function Tag({ children, color = "var(--accent)" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 4,
      fontSize: 11, fontFamily: "var(--ff-mono)", letterSpacing: ".08em",
      fontWeight: 500, textTransform: "uppercase",
      background: `${color}18`, border: `1px solid ${color}44`, color,
    }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ width: 24, height: 1, background: "var(--accent)" }} />
      <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>
        {children}
      </span>
    </div>
  );
}

function Btn({ children, href, onClick, primary, small, style: extra = {} }) {
  const base = {
    display: "inline-block", borderRadius: 10, fontWeight: 600, transition: "all .2s",
    fontSize: small ? 13 : 15, padding: small ? "8px 18px" : "13px 28px",
    cursor: "pointer", border: "none", fontFamily: "var(--ff-body)", textDecoration: "none",
    textAlign: "center",
    ...(primary
      ? { background: "linear-gradient(135deg,var(--accent),#2563eb)", color: "#fff", boxShadow: "0 8px 32px rgba(79,156,249,0.3)" }
      : { background: "transparent", border: "1px solid var(--border2)", color: "var(--text)" }),
    ...extra,
  };
  const enter = e => { e.currentTarget.style.transform = "translateY(-2px)"; if (primary) e.currentTarget.style.boxShadow = "0 12px 40px rgba(79,156,249,0.45)"; else e.currentTarget.style.borderColor = "rgba(79,156,249,0.4)"; };
  const leave = e => { e.currentTarget.style.transform = "none"; if (primary) e.currentTarget.style.boxShadow = "0 8px 32px rgba(79,156,249,0.3)"; else e.currentTarget.style.borderColor = "var(--border2)"; };
  if (href) return <a href={href} target="_blank" rel="noreferrer" style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</a>;
  return <button onClick={onClick} style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</button>;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToSection = useCallback((id) => {
    if (page === "home") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [page, navigate]);

  const links = [
    { label: "Home",    action: () => { navigate("home"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    { label: "About",   action: () => scrollToSection("about") },
    { label: "Mission", action: () => scrollToSection("mission") },
    { label: "Team",    action: () => navigate("team") },
    { label: "Events",  action: () => navigate("events") },
    { label: "Blog",    action: () => navigate("blog") },
    { label: "Contact", action: () => scrollToSection("contact") },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 64,
      padding: "0 clamp(16px,4vw,60px)", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(8,12,16,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all .3s ease",
    }}>
      <button onClick={() => { navigate("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 10, padding: 0, flexShrink: 0, cursor: "pointer" }} >
        <Logo size={36} />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 15, color: "var(--text)", lineHeight: 1.1 }}>MLDSN Nepal</div>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".05em" }}>ML & Data Science Network</div>
        </div>
      </button>

      <div className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {links.map(l => (
          <button key={l.label} onClick={l.action}
            style={{ padding: "7px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500, border: "none", fontFamily: "var(--ff-body)", transition: "color .2s", cursor: "pointer",
              background: (page === l.label.toLowerCase()) ? "rgba(79,156,249,0.08)" : "transparent",
              color:      (page === l.label.toLowerCase()) ? "var(--accent)" : "var(--sub)",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = (page === l.label.toLowerCase()) ? "var(--accent)" : "var(--sub)"}
          >{l.label}</button>
        ))}
        <Btn onClick={() => navigate("join")} primary small style={{ marginLeft: 8 }}>Join Network</Btn>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(v => !v)}
        style={{ background: "none", border: "none", color: "var(--text)", fontSize: 22, display: "none", padding: "6px 8px", lineHeight: 1, cursor: "pointer" }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, bottom: 0, background: "rgba(8,12,16,0.98)", backdropFilter: "blur(20px)", padding: "20px 24px 40px", display: "flex", flexDirection: "column", zIndex: 199, overflowY: "auto" }}>
          {links.map(l => (
            <button key={l.label} onClick={() => { l.action(); setMenuOpen(false); }}
              style={{ padding: "16px 0", fontSize: 17, fontFamily: "var(--ff-body)", fontWeight: 600, color: "var(--text)", background: "none", border: "none", borderBottom: "1px solid var(--border)", textAlign: "left", cursor: "pointer" }}>
              {l.label}
            </button>
          ))}
          <div style={{ marginTop: 28 }}>
            <Btn onClick={() => { navigate("join"); setMenuOpen(false); }} primary style={{ width: "100%", display: "block", textAlign: "center" }}>
              Join Network — It's Free
            </Btn>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section id="home" className="mountain-grid sec" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px clamp(16px,6vw,80px) 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,156,249,0.09) 0%,transparent 70%)", animation: "drift 12s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%)", animation: "drift 16s ease-in-out infinite reverse", pointerEvents: "none" }} />
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", opacity: .04, pointerEvents: "none" }} viewBox="0 0 1440 220" preserveAspectRatio="none">
        <polygon points="0,220 180,80 320,160 480,40 620,130 760,20 900,110 1080,50 1260,120 1440,60 1440,220" fill="white" />
      </svg>
      <div style={{ maxWidth: 860, position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "6px 14px", borderRadius: 20, background: "rgba(79,156,249,0.08)", border: "1px solid rgba(79,156,249,0.25)", animation: "fade-up .5s ease both" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse-dot 2s ease-in-out infinite", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".12em", color: "var(--accent)", textTransform: "uppercase" }}>Est. 2018 · Kathmandu, Nepal</span>
        </div>
        <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(2rem,5vw,3.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, animation: "fade-up .6s .1s ease both" }}>
          Machine Learning &{" "}
          <span style={{ background: "linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Data Science</span>
          {" "}Network Nepal
        </h1>
        <p style={{ fontSize: "clamp(.9rem,1.8vw,1.15rem)", color: "var(--sub)", maxWidth: 620, lineHeight: 1.75, marginBottom: 40, animation: "fade-up .6s .2s ease both" }}>
          A non-profit community dedicated to advancing AI, machine learning and data science in Nepal — through education, research, networking and rural digital inclusion.
        </p>
        <div className="hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fade-up .6s .3s ease both" }}>
          <Btn onClick={() => navigate("join")} primary>Become a Member</Btn>
          <Btn onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>Learn More ↓</Btn>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Ticker ─────────────────────────────────────────────────────────────
function StatsTicker() {
  return (
    <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 clamp(16px,5vw,60px)" }}>
      <div className="stats-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {safeStats.map((s, i) => (
          <div key={i} className="stat-cell" style={{ padding: "24px 16px", textAlign: "center", borderRight: i < safeStats.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.5rem,2.8vw,2.2rem)", letterSpacing: "-0.02em", color: i % 2 === 0 ? "var(--accent)" : "var(--accent2)", lineHeight: 1 }}>
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
    <section id="about" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)" }}>
      <div className="about-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,6vw,80px)", alignItems: "center" }}>
        <div>
          <SectionLabel>Who We Are</SectionLabel>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Nepal's leading community for <span style={{ color: "var(--accent)" }}>AI & Data Science</span>
          </h2>
          <p style={{ color: "var(--sub)", lineHeight: 1.8, marginBottom: 16, fontSize: ".97rem" }}>
            Though machine learning and artificial intelligence existed from the 1960s, data science wasn't widely known until 2012. Within a decade it became one of the most demanded skillsets in industry and academia worldwide.
          </p>
          <p style={{ color: "var(--sub)", lineHeight: 1.8, fontSize: ".97rem" }}>
            Understanding this growing demand, we founded MLDSN Nepal in 2018 — a non-profit community where students, entrepreneurs, researchers and digital experts share knowledge, organise events, write blogs and collectively advance the field across Nepal.
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--accent),var(--accent2))" }} />
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)", marginBottom: 20, letterSpacing: ".08em" }}>// community.profile</div>
            {[["Founded","2018"],["Type","Non-Profit Community"],["Focus","ML · DS · AI"],["Location","Nepal (Global Network)"],["Contact","aimldsn@gmail.com"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: ".9rem", gap: 8 }}>
                <span style={{ color: "var(--muted)", fontFamily: "var(--ff-mono)", fontSize: 12, flexShrink: 0 }}>{k}</span>
                <span style={{ color: "var(--text)", fontWeight: 500, textAlign: "right", wordBreak: "break-all" }}>{v}</span>
              </div>
            ))}
            <div className="about-card-actions" style={{ marginTop: 20, display: "flex", gap: 8 }}>
              {[
                ["Facebook Group",    "https://www.facebook.com/groups/217595548832685",         "var(--accent)",  "rgba(79,156,249,0.08)",  "rgba(79,156,249,0.2)"],
                ["Research & Career","https://sites.google.com/view/mldsnorg/research-career", "var(--accent2)", "rgba(167,139,250,0.08)", "rgba(167,139,250,0.2)"],
              ].map(([l, h, c, bg, bd]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer"
                  style={{ flex: "1 1 110px", padding: "10px 8px", borderRadius: 8, textAlign: "center", background: bg, border: `1px solid ${bd}`, color: c, fontSize: 13, fontWeight: 600, transition: "opacity .2s", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(79,156,249,0.2)", animation: "spin-slow 20s linear infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────
function Mission() {
  const accents = ["rgba(79,156,249,.15)","rgba(167,139,250,.15)","rgba(52,211,153,.15)","rgba(251,146,60,.15)"];
  const borders = ["rgba(79,156,249,.25)","rgba(167,139,250,.25)","rgba(52,211,153,.25)","rgba(251,146,60,.25)"];
  const colors  = ["var(--accent)","var(--accent2)","var(--green)","var(--orange)"];
  return (
    <section id="mission" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Our Mission</SectionLabel>
        <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 40, maxWidth: 480 }}>
          Connecting Minds, Empowering Nepal Through AI, ML and DS
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
          {safeMission.map((item, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", transition: "border-color .25s,transform .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 16, background: `linear-gradient(135deg,${accents[i % accents.length]},transparent)`, border: `1px solid ${borders[i % borders.length]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: colors[i % colors.length] }}>{item.icon}</div>
              <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "var(--sub)", fontSize: ".88rem", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────
function History() {
  return (
    <section className="sec" style={{ padding: "100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>A Bit of History</SectionLabel>
        <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 48 }}>Our journey since 2018</h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg,var(--accent),var(--accent2),transparent)" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {safeTimeline.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "clamp(16px,4vw,32px)", paddingBottom: i < safeTimeline.length - 1 ? 40 : 0 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", border: `2px solid ${safeColors[item.colors % safeColors.length]}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: safeColors[item.colors % safeColors.length] }} />
                  </div>
                </div>
                <div style={{ paddingTop: 4 }}>
                  <Tag color={safeColors[item.colors % safeColors.length]}>{item.year}</Tag>
                  <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.05rem", margin: "10px 0 8px" }}>{item.title}</h3>
                  <p style={{ color: "var(--sub)", fontSize: ".9rem", lineHeight: 1.75, maxWidth: 560 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Home Events Preview ──────────────────────────────────────────────────────
function HomeEventsPreview({ navigate }) {
  return (
    <section id="events" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Events</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 14 }}>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>News & Events</h2>
          <button onClick={() => navigate("events")}
            style={{ background: "none", padding: "9px 20px", borderRadius: 8, border: "1px solid var(--border2)", color: "var(--sub)", fontSize: 13, fontWeight: 500, transition: "all .2s", whiteSpace: "nowrap", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>All Events →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {safeEvents.slice(0, 4).map((ev, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${ev.accent}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ height: 4, background: `linear-gradient(90deg,${ev.accent},transparent)` }} />
              <div style={{ padding: "22px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
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

// ─── DEDICATED FULL EVENTS CHRONOLOGY PAGE ────────────────────────────────────
function DedicatedEventsPage({ navigate }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  return (
    <div style={{ paddingTop: 64 }}>
      <div className="mountain-grid" style={{ padding: "72px clamp(16px,6vw,80px) 64px", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <SectionLabel>Chronology</SectionLabel>
          <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.8rem,4vw,3.2rem)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            News & <span style={{ background: "linear-gradient(90deg,var(--accent2),var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Events Log</span>
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "1rem", maxWidth: 560, lineHeight: 1.75 }}>
            A complete historical repository of our National Workshops, symposiums, and scientific forums held in partnership with global academic bodies.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(16px,6vw,80px) 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {safeEvents.map((ev, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "28px clamp(16px,4vw,32px)", transition: "all .25s", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${ev.accent}55`; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Tag color={ev.accent}>{ev.type}</Tag>
                  <span style={{ fontFamily: "var(--ff-mono)", fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Timeline: {ev.year}</span>
                </div>
                <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.1rem,1.8vw,1.35rem)", lineHeight: 1.3, marginBottom: 10, color: "var(--text)" }}>{ev.title}</h3>
                <p style={{ color: "var(--sub)", fontSize: ".92rem", lineHeight: 1.7, maxWidth: 780, margin: 0 }}>{ev.desc}</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <a href={ev.url && ev.url !== "#" ? ev.url : "https://sites.google.com/view/mldsnorg/news-and-events/events"} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: `1px solid ${ev.accent}44`, background: `${ev.accent}08`, color: ev.accent, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = ev.accent; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${ev.accent}08`; e.currentTarget.style.color = ev.accent; }}>
                  {ev.url && ev.url !== "#" ? "View Materials ↗" : "Event details ↗"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dedicated Team Page ──────────────────────────────────────────────────────
function DedicatedTeamPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      <div className="mountain-grid" style={{ padding: "72px clamp(16px,6vw,80px) 64px", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,156,249,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <SectionLabel>The Collective</SectionLabel>
          <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.8rem,4vw,3.2rem)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Meet the <span style={{ background: "linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Core Team</span>
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "1.02rem", maxWidth: 640, lineHeight: 1.8 }}>
            MLDSN Nepal is driven by an agile community of domain researchers, data architects, academic lecturers, and technology consultants. Operating on a fully voluntary model, our taskforces build computational pipelines, launch workshops, and accelerate local talent tracks.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px clamp(16px,6vw,80px) 100px" }}>
        
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--ff-mono)", color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>👤 Profile Directory</div>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
            {safeTeam.map((m, i) => (
              <a key={i} href={m.url || "#"} target="_blank" rel="noreferrer"
                style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", transition: "all .25s", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}50`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 36px ${m.color}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                
                <div style={{
                  width: "100%", aspectRatio: "1/1",
                  background: `linear-gradient(135deg, ${m.color}15 0%, rgba(15,23,42,0.8) 100%)`,
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", width: "150%", height: "150%", border: "1px solid rgba(255,255,255,0.02)", transform: "rotate(45deg)" }} />
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${m.color}33, ${m.color}11)`,
                    border: `2px solid ${m.color}66`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--ff-body)", fontWeight: 700, fontSize: 20, color: m.color,
                    boxShadow: `0 8px 24px ${m.color}20`, zIndex: 1
                  }}>
                    {m.initials || (m.name ? m.name.split(" ").map(w => w[0]).join("").slice(0,2) : "ML")}
                  </div>
                </div>

                <div style={{ padding: "20px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", lineHeight: 1.3, marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, fontWeight: 500 }}>{m.role}</div>
                  </div>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: m.color, fontFamily: "var(--ff-mono)", background: `${m.color}12`, border: `1px solid ${m.color}25`, padding: "4px 10px", borderRadius: 6 }}>
                      📍 {m.location || "Nepal"}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Home Blog ────────────────────────────────────────────────────────────────
function HomeBlog({ navigate }) {
  return (
    <section id="blog" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Knowledge Hub</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 14 }}>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>Recent Blog Posts</h2>
          <button onClick={() => navigate("blog")} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid var(--border2)", color: "var(--sub)", fontSize: 13, fontWeight: 500, transition: "all .2s", background: "none", whiteSpace: "nowrap", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>All Posts →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {safePosts.slice(0, 4).map((p, i) => (
            <div key={i} onClick={() => navigate("article", p)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.tagColor}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              
              <div style={{ width: "100%", height: 140, background: "rgba(255,255,255,0.02)", overflow: "hidden", position: "relative", borderBottom: "1px solid var(--border)" }}>
                {p.heroImage ? (
                  <img src={p.heroImage} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${p.tagColor}15, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-mono)", fontSize: 14, color: p.tagColor }}>{p.tag}</div>
                )}
              </div>

              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ marginBottom: 10 }}><Tag color={p.tagColor}>{p.tag}</Tag></div>
                  <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1rem", marginBottom: 8, lineHeight: 1.4, color: "var(--text)" }}>{p.title}</h3>
                  <p style={{ color: "var(--sub)", fontSize: ".87rem", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</p>
                </div>
                <span style={{ color: p.tagColor, fontSize: 13, fontWeight: 600 }}>Read post →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Join CTA ─────────────────────────────────────────────────────────────────
function JoinCTA({ navigate }) {
  return (
    <section className="sec" style={{ padding: "100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: "clamp(36px,6vw,72px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(79,156,249,0.08) 0%,transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Tag>Community</Tag>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.5rem,2.8vw,2.4rem)", margin: "20px 0 16px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Become a Member of<br /><span style={{ color: "var(--accent)" }}>MLDSN Nepal</span>
          </h2>
          <p style={{ color: "var(--sub)", fontSize: ".97rem", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 36px" }}>
            Join the network to receive updates on events, workshops, research opportunities and connect with Nepal's growing ML & DS community.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => navigate("join")} primary>Register Now — It's Free</Btn>
            <Btn href="https://www.facebook.com/groups/217595548832685">Facebook Group</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer (INTERNAL EVENTS NAVIGATION CHIP APPLIED HERE) ────────────────────
function Footer({ navigate }) {
  return (
    <footer id="contact" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "56px clamp(16px,6vw,80px) 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "clamp(24px,4vw,40px)", marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Logo size={36} />
              <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 15 }}>MLDSN Nepal</div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: ".87rem", lineHeight: 1.75, maxWidth: 260, marginBottom: 20 }}>A non-profit community advancing machine learning and data science education across Nepal since 2018.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="mailto:aimldsn@gmail.com" style={{ color: "var(--sub)", fontSize: ".85rem", transition: "color .2s", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--sub)"}>✉ aimldsn@gmail.com</a>
              <span style={{ color: "var(--sub)", fontSize: ".85rem" }}>📞 +977 9851158281</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 14, color: "var(--text)" }}>Quick Links</div>
            <a href="https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2021" target="_blank" rel="noreferrer" style={{ display: "block", color: "var(--muted)", fontSize: ".85rem", marginBottom: 10, transition: "color .2s", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>NWMLDS 2021</a>
            <a href="https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2020" target="_blank" rel="noreferrer" style={{ display: "block", color: "var(--muted)", fontSize: ".85rem", marginBottom: 10, transition: "color .2s", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>NWMLDS 2020</a>
            <a href="https://sites.google.com/view/mldsnorg/research-career" target="_blank" rel="noreferrer" style={{ display: "block", color: "var(--muted)", fontSize: ".85rem", marginBottom: 10, transition: "color .2s", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>Research & Career</a>
            <button onClick={() => navigate("join")} style={{ display: "block", background: "none", border: "none", padding: 0, color: "var(--muted)", fontSize: ".85rem", marginBottom: 10, transition: "color .2s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>Become a Member</button>
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 14, color: "var(--text)" }}>Recent Blogs</div>
            {safePosts.slice(0, 4).map((p) => (
              <button key={p.id} onClick={() => navigate("article", p)}
                style={{ display: "block", background: "none", border: "none", textAlign: "left", color: "var(--muted)", fontSize: ".83rem", marginBottom: 10, lineHeight: 1.4, transition: "color .2s", cursor: "pointer", padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}>{p.title}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 14, color: "var(--text)" }}>Community</div>
            <a href="https://www.facebook.com/groups/217595548832685" target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, marginBottom: 10, background: "rgba(79,156,249,0.07)", border: "1px solid rgba(79,156,249,0.18)", color: "var(--accent)", fontSize: ".85rem", fontWeight: 600, transition: "all .2s", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,156,249,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(79,156,249,0.07)"; }}>
              👥 Facebook Group
            </a>
            <button onClick={() => navigate("events")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, marginBottom: 10, background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.18)", color: "var(--accent2)", fontSize: ".85rem", fontWeight: 600, transition: "all .2s", width: "100%", textDecoration: "none", textAlign: "left", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(167,139,250,0.07)"; }}>
              📅 Events
            </button>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "var(--muted)", fontSize: ".82rem" }}>© 2026 MLDSN Nepal. Non-profit community.</span>
          <span style={{ color: "var(--muted)", fontSize: ".82rem", fontFamily: "var(--ff-mono)" }}>mldsnnepal.org</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Blog List ────────────────────────────────────────────────────────────────
function BlogList({ navigate }) {
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...Array.from(new Set(safePosts.map(p => p.tag)))];
  const filtered = filter === "All" ? safePosts : safePosts.filter(p => p.tag === filter);

  return (
    <div style={{ paddingTop: 64 }}>
      <div className="mountain-grid" style={{ padding: "72px clamp(16px,6vw,80px) 64px", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,156,249,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <SectionLabel>Knowledge Hub</SectionLabel>
          <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.8rem,4vw,3.2rem)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Blog on{" "}
            <span style={{ background: "linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Machine Learning</span>
            {" "}& Data Science
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "1rem", maxWidth: 520, lineHeight: 1.75, marginBottom: 28 }}>Articles on ML foundations, practical guides and research insights.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tags.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, transition: "all .2s", border: "1px solid", cursor: "pointer",
                  background: filter === t ? "rgba(79,156,249,0.15)" : "transparent",
                  borderColor: filter === t ? "rgba(79,156,249,0.5)" : "var(--border2)",
                  color: filter === t ? "var(--accent)" : "var(--sub)",
                }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px clamp(16px,6vw,80px)" }}>
        {filter === "All" && safePosts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontFamily: "var(--ff-mono)", color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Featured Post</div>
            <div className="featured-grid" onClick={() => navigate("article", safePosts[0])}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 1fr", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              
              <div className="featured-visual" style={{ background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240, position: "relative", overflow: "hidden", borderRight: "1px solid var(--border)" }}>
                {safePosts[0].heroImage ? (
                  <img src={safePosts[0].heroImage} alt={safePosts[0].title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                ) : (
                  <div style={{ fontFamily: "var(--ff-head)", fontSize: "5rem", color: "rgba(79,156,249,0.15)", fontWeight: 700 }}>ML</div>
                )}
              </div>

              <div style={{ padding: "clamp(20px,4vw,36px) clamp(18px,4vw,32px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                    <Tag color={safePosts[0].tagColor}>{safePosts[0].tag}</Tag>
                    <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)" }}>{safePosts[0].readTime}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.1rem,2vw,1.55rem)", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 12, color: "var(--text)" }}>{safePosts[0].title}</h2>
                  <p style={{ color: "var(--sub)", fontSize: ".9rem", lineHeight: 1.75, marginBottom: 20 }}>{safePosts[0].excerpt}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${safePosts[0].tagColor}22`, border: `1.5px solid ${safePosts[0].tagColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 11, color: safePosts[0].tagColor, flexShrink: 0 }}>
                      {safePosts[0].author ? safePosts[0].author.split(" ").map(w => w[0]).join("").slice(0, 2) : "AU"}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{safePosts[0].author}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{safePosts[0].date}</div>
                    </div>
                  </div>
                  <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>Read →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {(filter === "All" ? safePosts.slice(1) : filtered).map(post => (
            <div key={post.id} onClick={() => navigate("article", post)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${post.tagColor}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              
              <div style={{ width: "100%", height: 150, background: "rgba(255,255,255,0.01)", overflow: "hidden", position: "relative", borderBottom: "1px solid var(--border)" }}>
                {post.heroImage ? (
                  <img src={post.heroImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${post.tagColor}10, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-mono)", fontSize: 13, color: post.tagColor }}>{post.tag}</div>
                )}
              </div>

              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <Tag color={post.tagColor}>{post.tag}</Tag>
                  <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, color: "var(--muted)" }}>{post.readTime}</span>
                </div>
                <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.02rem", lineHeight: 1.35, letterSpacing: "-0.01em", marginBottom: 10, color: "var(--text)" }}>{post.title}</h3>
                <p style={{ color: "var(--sub)", fontSize: ".87rem", lineHeight: 1.7, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border)", marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${post.tagColor}20`, border: `1.5px solid ${post.tagColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 10, color: post.tagColor, flexShrink: 0 }}>
                      {post.author ? post.author.split(" ").map(w => w[0]).join("").slice(0, 2) : "AU"}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{post.date}</span>
                  </div>
                  <span style={{ color: post.tagColor, fontSize: 12, fontWeight: 600 }}>Read →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px clamp(20px,4vw,48px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--accent2),transparent)" }} />
          <Tag color="var(--accent2)">Community</Tag>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.1rem,2vw,1.5rem)", letterSpacing: "-0.02em", margin: "14px 0 10px" }}>Want to contribute a blog post?</h3>
          <p style={{ color: "var(--sub)", fontSize: ".92rem", maxWidth: 460, margin: "0 auto 24px" }}>MLDSN Nepal welcomes well-written articles on ML, data science, AI and their applications.</p>
          <Btn onClick={() => navigate("join")} primary>Join & Contribute</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Individual Article Viewer Panel ──────────────────────────────────────────
function ArticleView({ post, navigate }) {
  const others = safePosts.filter(p => p.id !== post.id);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [post.id]);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "48px clamp(16px,6vw,80px) 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%,${post.tagColor}08 0%,transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <button onClick={() => navigate("blog")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", fontSize: 13, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}>← Blog</button>
            <span style={{ color: "var(--border2)", fontSize: 13 }}>/</span>
            <span style={{ color: "var(--sub)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "min(260px,50vw)" }}>{post.title}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
            <Tag color={post.tagColor}>{post.tag}</Tag>
            <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)" }}>{post.readTime}</span>
            <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)" }}>· {post.date}</span>
          </div>
          <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.5rem,3.5vw,2.6rem)", lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: 16, color: "var(--text)" }}>{post.title}</h1>
          <p style={{ color: "var(--sub)", fontSize: "clamp(.92rem,1.5vw,1.05rem)", lineHeight: 1.7, marginBottom: 24, maxWidth: 680 }}>{post.excerpt}</p>
          <div className="author-row" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${post.tagColor}22`, border: `1.5px solid ${post.tagColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-body)", fontWeight: 700, fontSize: 13, color: post.tagColor, flexShrink: 0 }}>
              {post.author ? post.author.split(" ").map(w => w[0]).join("").slice(0, 2) : "AU"}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--text)" }}>{post.author}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{post.authorRole || "Contributor"}</div>
            </div>
            {post.url && post.url !== "#" && (
              <a href={post.url} target="_blank" rel="noreferrer" className="view-orig"
                style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border2)", color: "var(--sub)", transition: "all .2s", whiteSpace: "nowrap", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>View original ↗</a>
            )}
          </div>
        </div>
      </div>

      <div className="article-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px clamp(16px,6vw,80px)", display: "grid", gridTemplateColumns: "1fr 280px", gap: "clamp(28px,5vw,56px)", alignItems: "start" }}>
        <article className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} style={{ minWidth: 0 }} />
        <aside className="article-sidebar" style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px", marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>About this post</div>
            {[["Category", post.tag], ["Author", post.author], ["Read time", post.readTime], ["Published", post.date]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)", fontSize: ".83rem", gap: 8 }}>
                <span style={{ color: "var(--muted)", flexShrink: 0 }}>{k}</span>
                <span style={{ color: "var(--text)", fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px", marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>More Posts</div>
            {others.map((p, i) => (
              <div key={p.id} onClick={() => navigate("article", p)}
                style={{ paddingBottom: i < others.length - 1 ? 14 : 0, marginBottom: i < others.length - 1 ? 14 : 0, borderBottom: i < others.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                <div style={{ marginBottom: 5 }}><Tag color={p.tagColor}>{p.tag}</Tag></div>
                <div style={{ fontSize: ".85rem", color: "var(--sub)", lineHeight: 1.4, fontWeight: 500, transition: "color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; }}>{p.title}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Membership Form Component ────────────────────────────────────────────────
function MembershipForm({ navigate }) {
  const [status, setStatus] = useState("idle"); 
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [honeypot, setHoneypot] = useState("");

  const interestsList = [
    "Natural Language Processing (NLP)",
    "Computer Vision",
    "Generative AI & LLMs",
    "Data Engineering & Pipelines",
    "MLOps & Production Systems",
    "AI Ethics & Policy"
  ];

  const handleCheckboxChange = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) {
      setStatus("awaiting_verification");
      return;
    }

    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const searchParams = new URLSearchParams();
    searchParams.append("FullName", formData.get("FullName"));
    searchParams.append("Email", formData.get("Email"));
    searchParams.append("Phone", formData.get("Phone"));
    searchParams.append("Organization", formData.get("Organization"));
    searchParams.append("Role", formData.get("Role"));
    searchParams.append("ProfileURL", formData.get("ProfileURL"));
    searchParams.append("Interests", selectedInterests.join(", "));
    searchParams.append("DataAgreement", formData.get("DataAgreement") ? "Agreed" : "No");

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: searchParams.toString()
      });
      
      const data = await response.json();
      
      if (data.result === "duplicate") {
        setStatus("duplicate");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      
      if (data.result === "awaiting_verification") {
        setStatus("awaiting_verification");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      
      setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8, background: "var(--surface)",
    border: "1px solid var(--border)", color: "var(--text)", outline: "none",
    fontFamily: "var(--ff-body)", fontSize: 14, marginTop: 6, transition: "all 0.2s"
  };

  if (status === "awaiting_verification") {
    return (
      <div style={{ paddingTop: 100, paddingBottom: 100, maxWidth: 600, margin: "0 auto", paddingLeft: 16, paddingRight: 16, textAlign: "center" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", marginBottom: 12 }}>Check Your Inbox</h2>
          <p style={{ color: "var(--sub)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 }}>
            An activation link has been dispatched to your email address. Please click the link inside that message to verify your identity and authorize your entry into the MLDSN database.
          </p>
          <Btn onClick={() => navigate("home")} primary>Return Home</Btn>
        </div>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div style={{ paddingTop: 100, paddingBottom: 100, maxWidth: 600, margin: "0 auto", paddingLeft: 16, paddingRight: 16, textAlign: "center" }}>
        <div style={{ background: "var(--card)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", marginBottom: 12 }}>Already Registered!</h2>
          <p style={{ color: "var(--sub)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 }}>
            Our database shows this email address has already been submitted to the MLDSN network index. If you need to modify your tech interests or registration profile, please reach out to the admin team at aimldsn@gmail.com.
          </p>
          <Btn onClick={() => navigate("home")} primary>Return Home</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 100, paddingBottom: 100, maxWidth: 700, margin: "0 auto", paddingLeft: 16, paddingRight: 16 }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <SectionLabel>Onboarding Portal</SectionLabel>
        <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "2.2rem", color: "var(--text)" }}>Join MLDSN Nepal</h1>
        <p style={{ color: "var(--sub)", marginTop: 8 }}>Register directly to align with domestic developer hubs and research pipelines.</p>
      </div>

      {status === "error" && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 24 }}>
          Pipeline transit exception encountered. Please review the script endpoint parameters config setup.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
        <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

        <div>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 600, fontSize: "1.1rem", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 16, color: "var(--accent)" }}>1. Identity & Context</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>Full Name *
              <input type="text" name="FullName" required style={inputStyle} placeholder="e.g. John Doe" />
            </label>
            <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>Email Address *
              <input type="email" name="Email" required style={inputStyle} placeholder="john@example.com" />
            </label>
            <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>Contact Number *
              <input type="tel" name="Phone" required style={inputStyle} placeholder="+977 98XXXXXXXX" />
            </label>
            <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>Institution / Organization *
              <input type="text" name="Organization" required style={inputStyle} placeholder="University or Company name" />
            </label>
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 600, fontSize: "1.1rem", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 16, color: "var(--accent)" }}>2. Domain Mapping</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>Primary Current Role *
              <select name="Role" required style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", background: "var(--surface) url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2364748b\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>') no-repeat right 12px center", backgroundSize: "16px" }}>
                <option value="" disabled selected>Select option</option>
                <option value="Student">Undergraduate / Graduate Student</option>
                <option value="Researcher">Academic Researcher / Professor</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="ML Engineer">Machine Learning / AI Engineer</option>
                <option value="Software Engineer">Software Engineer / Tech Professional</option>
                <option value="Executive">Executive / Startup Founder</option>
                <option value="Other">Other Profession</option>
              </select>
            </label>
            <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>Professional Profile Link (Optional)
              <input type="url" name="ProfileURL" style={inputStyle} placeholder="LinkedIn or GitHub address" />
            </label>
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 600, fontSize: "1.1rem", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 12, color: "var(--accent)" }}>3. Core Tech Interests</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Identify your areas of interest to stay updated with specialized network opportunities.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
            {interestsList.map(interest => (
              <label key={interest} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", background: "var(--surface)" }}>
                <input type="checkbox" checked={selectedInterests.includes(interest)} onChange={() => handleCheckboxChange(interest)} style={{ marginTop: 2, accentColor: "var(--accent)" }} />
                <span style={{ fontSize: 13, color: "var(--text)" }}>{interest}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 20 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", fontSize: 13, color: "var(--sub)", lineHeight: 1.5, userSelect: "none" }}>
            <input type="checkbox" name="DataAgreement" required style={{ marginTop: 3, accentColor: "var(--accent)", cursor: "pointer" }} />
            <span>I understand that my information will be saved with the administration and they can send me an email related to future events organised by MLDSN *</span>
          </label>
          
          <div style={{ paddingTop: 8 }}>
            <Btn primary type="submit" disabled={status === "loading"} style={{ minWidth: 160 }}>
              {status === "loading" ? "Processing..." : "Submit Application"}
            </Btn>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("home");
  const [activePost, setActivePost] = useState(null);

  const navigate = useCallback((target, post = null) => {
    setPage(target);
    if (post) setActivePost(post);
    if (target !== "home" || post) window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar page={page} navigate={navigate} />
      {page === "home" && (
        <>
          <Hero navigate={navigate} />
          <StatsTicker />
          <About />
          <Mission />
          <History />
          <HomeEventsPreview navigate={navigate} />
          <HomeBlog navigate={navigate} />
          <JoinCTA navigate={navigate} />
          <Footer navigate={navigate} />
        </>
      )}
      {page === "team"    && <><DedicatedTeamPage /><Footer navigate={navigate} /></>}
      {page === "events"  && <><DedicatedEventsPage navigate={navigate} /><Footer navigate={navigate} /></>}
      {page === "blog"    && <><BlogList           navigate={navigate} /><Footer navigate={navigate} /></>}
      {page === "article" && activePost && <><ArticleView post={activePost} navigate={navigate} /><Footer navigate={navigate} /></>}
      {page === "join"    && <><MembershipForm    navigate={navigate} /><Footer navigate={navigate} /></>}
    </div>
  );
}
