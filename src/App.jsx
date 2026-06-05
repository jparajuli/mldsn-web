import { useState, useEffect, useCallback } from "react";

// ─── Styles, data & assets ────────────────────────────────────────────────────
import "./styles/global.css";
import { LOGO_URL }       from "./data/logo.js";
import { POSTS }          from "./data/posts.js";
import {
  STATS, MISSION_ITEMS, TEAM,
  TIMELINE, TIMELINE_COLORS, EVENTS_DATA,
} from "./data/siteData.js";

// ─── Logo component ───────────────────────────────────────────────────────────
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

// ─── Shared primitives ────────────────────────────────────────────────────────
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
    cursor: "pointer", border: "none", fontFamily: "var(--ff-body)",
    ...(primary
      ? { background: "linear-gradient(135deg,var(--accent),#2563eb)", color: "#fff", boxShadow: "0 8px 32px rgba(79,156,249,0.3)" }
      : { background: "transparent", border: "1px solid var(--border2)", color: "var(--text)" }),
    ...extra,
  };
  const enter = e => { e.currentTarget.style.transform = "translateY(-2px)"; if (primary) e.currentTarget.style.boxShadow = "0 12px 40px rgba(79,156,249,0.45)"; else e.currentTarget.style.borderColor = "rgba(79,156,249,0.4)"; };
  const leave = e => { e.currentTarget.style.transform = "none"; if (primary) e.currentTarget.style.boxShadow = "0 8px 32px rgba(79,156,249,0.3)"; else e.currentTarget.style.borderColor = "var(--border2)"; };
  if (href) return <a href={href} target="_blank" style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</a>;
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
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
      };
      requestAnimationFrame(() => requestAnimationFrame(attempt));
    }
  }, [page, navigate]);

  const links = [
    { label: "Home",    action: () => { navigate("home"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    { label: "About",   action: () => scrollToSection("about") },
    { label: "Mission", action: () => scrollToSection("mission") },
    { label: "Team",    action: () => scrollToSection("team") },
    { label: "Events",  action: () => scrollToSection("events") },
    { label: "Blog",    action: () => navigate("blog") },
    { label: "Contact", action: () => scrollToSection("contact") },
  ];

  const isBlog = page === "blog" || page === "article";

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
        style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 10, padding: 0, flexShrink: 0 }}>
        <Logo size={36} />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 15, color: "var(--text)", lineHeight: 1.1 }}>MLDSN Nepal</div>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".05em" }}>ML & Data Science Network</div>
        </div>
      </button>

      <div className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {links.map(l => (
          <button key={l.label} onClick={l.action}
            style={{ padding: "7px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500, border: "none", fontFamily: "var(--ff-body)", transition: "color .2s",
              background: (isBlog && l.label === "Blog") ? "rgba(79,156,249,0.08)" : "transparent",
              color:      (isBlog && l.label === "Blog") ? "var(--accent)" : "var(--sub)",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = (isBlog && l.label === "Blog") ? "var(--accent)" : "var(--sub)"}
          >{l.label}</button>
        ))}
        <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary small style={{ marginLeft: 8 }}>Join Network</Btn>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(v => !v)}
        style={{ background: "none", border: "none", color: "var(--text)", fontSize: 22, display: "none", padding: "6px 8px", lineHeight: 1 }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, bottom: 0, background: "rgba(8,12,16,0.98)", backdropFilter: "blur(20px)", padding: "20px 24px 40px", display: "flex", flexDirection: "column", zIndex: 199, overflowY: "auto" }}>
          {links.map(l => (
            <button key={l.label} onClick={() => { l.action(); setMenuOpen(false); }}
              style={{ padding: "16px 0", fontSize: 17, fontFamily: "var(--ff-body)", fontWeight: 600, color: "var(--text)", background: "none", border: "none", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              {l.label}
            </button>
          ))}
          <div style={{ marginTop: 28 }}>
            <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary style={{ width: "100%", display: "block", textAlign: "center" }}>
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
          <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary>Become a Member</Btn>
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
        {STATS.map((s, i) => (
          <div key={i} className="stat-cell" style={{ padding: "24px 16px", textAlign: "center", borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
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
                <a key={l} href={h} target="_blank"
                  style={{ flex: "1 1 110px", padding: "10px 8px", borderRadius: 8, textAlign: "center", background: bg, border: `1px solid ${bd}`, color: c, fontSize: 13, fontWeight: 600, transition: "opacity .2s" }}
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
          {MISSION_ITEMS.map((item, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", transition: "border-color .25s,transform .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 16, background: `linear-gradient(135deg,${accents[i]},transparent)`, border: `1px solid ${borders[i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: colors[i] }}>{item.icon}</div>
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
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "clamp(16px,4vw,32px)", paddingBottom: i < TIMELINE.length - 1 ? 40 : 0 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", border: `2px solid ${TIMELINE_COLORS[item.colors]}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: TIMELINE_COLORS[item.colors] }} />
                  </div>
                </div>
                <div style={{ paddingTop: 4 }}>
                  <Tag color={TIMELINE_COLORS[item.colors]}>{item.year}</Tag>
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

// ─── Team ─────────────────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>The People</SectionLabel>
        <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 8 }}>Core Team</h2>
        <p style={{ color: "var(--sub)", marginBottom: 40, maxWidth: 500, fontSize: ".95rem" }}>Volunteers from academia, industry, and research — united by the mission to grow Nepal's AI ecosystem.</p>
        <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {TEAM.map((m, i) => (
            <a key={i} href={m.url || "#"} target="_blank"
              style={{ display: "block", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 18px", transition: "all .25s", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${m.color}14`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${m.color}33,${m.color}11)`, border: `1.5px solid ${m.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-body)", fontWeight: 700, fontSize: 13, color: m.color }}>{m.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--text)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.role}</div>
                </div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: m.color, fontFamily: "var(--ff-mono)", background: `${m.color}12`, border: `1px solid ${m.color}30`, padding: "3px 8px", borderRadius: 4, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                📍 {m.location}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────
function Events() {
  return (
    <section id="events" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Events</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 14 }}>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>News & Events</h2>
          <a href="https://sites.google.com/view/mldsnorg/news-and-events/events" target="_blank"
            style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid var(--border2)", color: "var(--sub)", fontSize: 13, fontWeight: 500, transition: "all .2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>All Events →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {EVENTS_DATA.map((ev, i) => (
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

// ─── Home Blog preview ────────────────────────────────────────────────────────
function HomeBlog({ navigate }) {
  return (
    <section id="blog" className="sec" style={{ padding: "100px clamp(16px,6vw,80px)", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel>Knowledge Hub</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 14 }}>
          <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.45rem,2.4vw,2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>Recent Blog Posts</h2>
          <button onClick={() => navigate("blog")} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid var(--border2)", color: "var(--sub)", fontSize: 13, fontWeight: 500, transition: "all .2s", background: "none", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>All Posts →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {[...POSTS].slice(0, 4).map((p, i) => (
            <div key={i} onClick={() => navigate("article", p)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.tagColor}44`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${p.tagColor}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ marginBottom: 12 }}><Tag color={p.tagColor}>{p.tag}</Tag></div>
              <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "1rem", marginBottom: 10, lineHeight: 1.4, color: "var(--text)" }}>{p.title}</h3>
              <p style={{ color: "var(--sub)", fontSize: ".87rem", lineHeight: 1.7, marginBottom: 16 }}>{p.excerpt}</p>
              <span style={{ color: p.tagColor, fontSize: 13, fontWeight: 600 }}>Read post →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Join CTA ─────────────────────────────────────────────────────────────────
function JoinCTA() {
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
            <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary>Register Now — It's Free</Btn>
            <Btn href="https://www.facebook.com/groups/217595548832685">Facebook Group</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
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
              <a href="mailto:aimldsn@gmail.com" style={{ color: "var(--sub)", fontSize: ".85rem", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--sub)"}>✉ aimldsn@gmail.com</a>
              <span style={{ color: "var(--sub)", fontSize: ".85rem" }}>📞 +977 9851158281</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 14, color: "var(--text)" }}>Quick Links</div>
            {[
              ["NWMLDS 2021",     "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2021"],
              ["NWMLDS 2020",     "https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2020"],
              ["Research & Career","https://sites.google.com/view/mldsnorg/research-career"],
              ["Become a Member", "https://sites.google.com/view/mldsnorg/become-a-member"],
            ].map(([l, h]) => (
              <a key={l} href={h} target="_blank" style={{ display: "block", color: "var(--muted)", fontSize: ".85rem", marginBottom: 10, transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 14, color: "var(--text)" }}>Recent Blogs</div>
            {[...POSTS].slice(0, 4).map((p, i) => (
              <button key={p.id} onClick={() => navigate("article", p)}
                style={{ display: "block", background: "none", border: "none", textAlign: "left", color: "var(--muted)", fontSize: ".83rem", marginBottom: 10, lineHeight: 1.4, transition: "color .2s", cursor: "pointer", padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>{p.title}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: ".85rem", marginBottom: 14, color: "var(--text)" }}>Community</div>
            {[
              ["👥 Facebook Group","https://www.facebook.com/groups/217595548832685",         "var(--accent)",  "rgba(79,156,249,0.07)","rgba(79,156,249,0.18)","rgba(79,156,249,0.15)"],
              ["📅 Events",        "https://sites.google.com/view/mldsnorg/news-and-events/events","var(--accent2)","rgba(167,139,250,0.07)","rgba(167,139,250,0.18)","rgba(167,139,250,0.15)"],
            ].map(([l, h, c, bg, bd, hbg]) => (
              <a key={l} href={h} target="_blank"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, marginBottom: 10, background: bg, border: `1px solid ${bd}`, color: c, fontSize: ".85rem", fontWeight: 600, transition: "all .2s", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.background = hbg}
                onMouseLeave={e => e.currentTarget.style.background = bg}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "var(--muted)", fontSize: ".82rem" }}>© 2025 MLDSN Nepal. Non-profit community.</span>
          <span style={{ color: "var(--muted)", fontSize: ".82rem", fontFamily: "var(--ff-mono)" }}>mldsnnepal.org</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Blog List ────────────────────────────────────────────────────────────────
function BlogList({ navigate }) {
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...Array.from(new Set(POSTS.map(p => p.tag)))];
  const filtered = filter === "All" ? POSTS : POSTS.filter(p => p.tag === filter);

  return (
    <div style={{ paddingTop: 64 }}>
      <div className="mountain-grid" style={{ padding: "72px clamp(16px,6vw,80px) 64px", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,156,249,0.07) 0%,transparent 70%)", animation: "drift 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <SectionLabel>Knowledge Hub</SectionLabel>
          <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.8rem,4vw,3.2rem)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16, animation: "fade-up .55s ease both" }}>
            Blog on{" "}
            <span style={{ background: "linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Machine Learning</span>
            {" "}& Data Science
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "1rem", maxWidth: 520, lineHeight: 1.75, marginBottom: 28 }}>Articles on ML foundations, practical guides and research insights.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tags.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, transition: "all .2s", border: "1px solid",
                  background: filter === t ? "rgba(79,156,249,0.15)" : "transparent",
                  borderColor: filter === t ? "rgba(79,156,249,0.5)" : "var(--border2)",
                  color: filter === t ? "var(--accent)" : "var(--sub)",
                }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px clamp(16px,6vw,80px)" }}>
        {filter === "All" && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontFamily: "var(--ff-mono)", color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Featured Post</div>
            <div className="featured-grid" onClick={() => navigate("article", POSTS[0])}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 1fr", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,156,249,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="featured-visual" style={{ background: "linear-gradient(135deg,rgba(79,156,249,0.12) 0%,rgba(167,139,250,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220, position: "relative", overflow: "hidden", borderRight: "1px solid var(--border)" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 50%,rgba(79,156,249,0.15) 0%,transparent 65%)" }} />
                <div style={{ fontFamily: "var(--ff-head)", fontSize: "clamp(4rem,8vw,7rem)", color: "rgba(79,156,249,0.15)", fontWeight: 700, userSelect: "none", lineHeight: 1 }}>Kgl</div>
                <div style={{ position: "absolute", bottom: 20, left: 20, fontFamily: "var(--ff-mono)", fontSize: 11, color: "rgba(79,156,249,0.5)", letterSpacing: ".1em" }}>kaggle_i.post</div>
              </div>
              <div style={{ padding: "clamp(20px,4vw,36px) clamp(18px,4vw,32px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                    <Tag color={POSTS[0].tagColor}>{POSTS[0].tag}</Tag>
                    <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--muted)" }}>{POSTS[0].readTime}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(1.1rem,2vw,1.55rem)", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 12, color: "var(--text)" }}>{POSTS[0].title}</h2>
                  <p style={{ color: "var(--sub)", fontSize: ".9rem", lineHeight: 1.75, marginBottom: 20 }}>{POSTS[0].excerpt}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${POSTS[0].tagColor}22`, border: `1.5px solid ${POSTS[0].tagColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 11, color: POSTS[0].tagColor, flexShrink: 0 }}>
                      {POSTS[0].author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{POSTS[0].author}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{POSTS[0].date}</div>
                    </div>
                  </div>
                  <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>Read →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {(filter === "All" ? POSTS.slice(1) : filtered).map(post => (
            <div key={post.id} onClick={() => navigate("article", post)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${post.tagColor}44`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${post.tagColor}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${post.tagColor},transparent)` }} />
              <div style={{ padding: "22px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <Tag color={post.tagColor}>{post.tag}</Tag>
                  <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, color: "var(--muted)" }}>{post.readTime}</span>
                </div>
                <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: "clamp(.95rem,1.6vw,1.1rem)", lineHeight: 1.35, letterSpacing: "-0.01em", marginBottom: 10, color: "var(--text)", flex: 0 }}>{post.title}</h3>
                <p style={{ color: "var(--sub)", fontSize: ".87rem", lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{post.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${post.tagColor}20`, border: `1.5px solid ${post.tagColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-body)", fontWeight: 600, fontSize: 10, color: post.tagColor, flexShrink: 0 }}>
                      {post.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
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
          <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary>Join & Contribute</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Article View ─────────────────────────────────────────────────────────────
function ArticleView({ post, navigate }) {
  const others = POSTS.filter(p => p.id !== post.id);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [post.id]);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "48px clamp(16px,6vw,80px) 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%,${post.tagColor}08 0%,transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <button onClick={() => navigate("blog")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", fontSize: 13, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>← Blog</button>
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
              {post.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--text)" }}>{post.author}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{post.authorRole}</div>
            </div>
            {post.url && post.url !== "#" && (
              <a href={post.url} target="_blank" className="view-orig"
                style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border2)", color: "var(--sub)", transition: "all .2s", whiteSpace: "nowrap" }}
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
                  onMouseLeave={e => e.currentTarget.style.color = "var(--sub)"}>{p.title}</div>
              </div>
            ))}
          </div>
          <a href="https://sites.google.com/view/mldsnorg/become-a-member" target="_blank"
            style={{ display: "block", background: "rgba(79,156,249,0.08)", border: "1px solid rgba(79,156,249,0.25)", borderRadius: 14, padding: "16px 18px", textAlign: "center", transition: "all .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(79,156,249,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(79,156,249,0.08)"}>
            <div style={{ fontSize: 11, fontFamily: "var(--ff-mono)", color: "var(--accent)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Community</div>
            <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--text)", marginBottom: 6 }}>Join MLDSN Nepal</div>
            <div style={{ fontSize: ".8rem", color: "var(--sub)", lineHeight: 1.6 }}>Get updates on events, workshops and new posts.</div>
          </a>
        </aside>
      </div>
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
          <Team />
          <Events />
          <HomeBlog navigate={navigate} />
          <JoinCTA />
          <Footer navigate={navigate} />
        </>
      )}
      {page === "blog"    && <><BlogList    navigate={navigate} /><Footer navigate={navigate} /></>}
      {page === "article" && activePost && <><ArticleView post={activePost} navigate={navigate} /><Footer navigate={navigate} /></>}
    </div>
  );
}