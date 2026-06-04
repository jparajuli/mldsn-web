import { useState, useEffect, useCallback } from "react";

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #080c10;
    --surface: #0d1117;
    --card:    #111620;
    --card2:   #141926;
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --accent:  #4f9cf9;
    --accent2: #a78bfa;
    --green:   #34d399;
    --orange:  #fb923c;
    --text:    #e2e8f0;
    --muted:   #64748b;
    --sub:     #94a3b8;
    --ff-head: 'Fraunces', Georgia, serif;
    --ff-body: 'Outfit', sans-serif;
    --ff-mono: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--ff-body); font-size: 16px; line-height: 1.6; overflow-x: hidden; }
  ::selection { background: rgba(79,156,249,0.25); color: #fff; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: var(--ff-body); }

  @keyframes fade-up   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fade-in   { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
  @keyframes drift     { 0%,100%{transform:translateY(0) translateX(0)} 33%{transform:translateY(-14px) translateX(6px)} 66%{transform:translateY(8px) translateX(-8px)} }
  @keyframes spin-slow { to { transform:rotate(360deg); } }

  .mountain-grid {
    background-image: linear-gradient(rgba(79,156,249,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,156,249,0.04) 1px,transparent 1px);
    background-size: 48px 48px;
  }

  .article-body { line-height:1.85; color:var(--sub); font-size:1.01rem; }
  .article-body h2 { font-family:var(--ff-head); font-weight:700; font-size:clamp(1.3rem,2vw,1.7rem); color:var(--text); letter-spacing:-0.02em; margin:2.4rem 0 1rem; line-height:1.3; }
  .article-body h3 { font-family:var(--ff-head); font-weight:600; font-size:clamp(1.05rem,1.6vw,1.25rem); color:var(--text); letter-spacing:-0.01em; margin:2rem 0 .8rem; line-height:1.35; }
  .article-body p  { margin-bottom:1.3rem; }
  .article-body strong { color:var(--text); font-weight:600; }
  .article-body em     { color:var(--accent2); font-style:italic; }
  .article-body a  { color:var(--accent); border-bottom:1px solid rgba(79,156,249,.3); transition:border-color .2s; }
  .article-body a:hover { border-color:var(--accent); }
  .article-body ol,.article-body ul { padding-left:1.5rem; margin-bottom:1.4rem; }
  .article-body li { margin-bottom:.55rem; color:var(--sub); }
  .article-body li strong { color:var(--text); }
  .article-body code { font-family:var(--ff-mono); font-size:.86rem; background:rgba(79,156,249,.08); border:1px solid rgba(79,156,249,.18); padding:1px 6px; border-radius:4px; color:var(--accent); }
  .article-body blockquote { border-left:3px solid var(--accent); padding:12px 20px; margin:1.6rem 0; background:rgba(79,156,249,.04); border-radius:0 8px 8px 0; font-style:italic; color:var(--sub); }
  .article-body .callout { background:var(--card2); border:1px solid var(--border); border-radius:12px; padding:18px 20px; margin:1.6rem 0; font-size:.92rem; }
  .article-body .callout-title { font-family:var(--ff-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.1em; color:var(--accent); margin-bottom:8px; }
  .article-body .data-table-wrap { width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin:1.4rem 0; }
  .article-body .data-table { width:100%; border-collapse:collapse; font-size:.88rem; min-width:400px; }
  .article-body .data-table th { text-align:left; padding:8px 12px; border-bottom:1px solid var(--border2); color:var(--accent); font-family:var(--ff-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; background:rgba(79,156,249,.04); }
  .article-body .data-table td { padding:8px 12px; border-bottom:1px solid var(--border); color:var(--sub); vertical-align:top; }
  .article-body .data-table tr:hover td { background:rgba(255,255,255,.02); }
  .article-body .step-list  { list-style:none; padding:0; }
  .article-body .step-list li { display:flex; gap:14px; margin-bottom:1.2rem; align-items:flex-start; }
  .article-body .step-num { width:26px; height:26px; border-radius:50%; flex-shrink:0; background:rgba(79,156,249,.12); border:1px solid rgba(79,156,249,.3); display:flex; align-items:center; justify-content:center; font-family:var(--ff-mono); font-size:.75rem; color:var(--accent); font-weight:600; margin-top:2px; }

  @media(max-width:820px) { .desktop-nav{display:none!important} .hamburger{display:block!important} }
  @media(max-width:560px) {
    .stats-grid { grid-template-columns:1fr 1fr!important; }
    .stat-cell  { border-right:none!important; border-bottom:1px solid var(--border)!important; }
    .stat-cell:nth-child(odd)  { border-right:1px solid var(--border)!important; }
    .stat-cell:nth-last-child(-n+2) { border-bottom:none!important; }
  }
  @media(max-width:720px) { .about-grid { grid-template-columns:1fr!important; } }
  @media(max-width:360px) { .about-card-actions { flex-direction:column!important; } }
  @media(max-width:340px) { .team-grid { grid-template-columns:1fr!important; } }
  @media(max-width:860px) { .article-grid{grid-template-columns:1fr!important} .article-sidebar{position:static!important} }
  @media(max-width:520px) { .author-row{flex-direction:column!important;align-items:flex-start!important} .author-row .view-orig{margin-left:0!important} }
  @media(max-width:600px) { .featured-grid{grid-template-columns:1fr!important} .featured-visual{display:none!important} }
  @media(max-width:800px) { .footer-grid { grid-template-columns:1fr 1fr!important; } }
  @media(max-width:460px) { .footer-grid { grid-template-columns:1fr!important; } }
  @media(max-width:380px) { .hero-ctas{flex-direction:column!important} .hero-ctas > *{width:100%!important;text-align:center!important;box-sizing:border-box!important} }
  @media(max-width:600px) { .sec { padding-top:64px!important; padding-bottom:64px!important; } }
`;

// ═══════════════════════════════════════════════════════════════════
//  EASY BLOG WRITING — MARKDOWN PARSER
//  Write posts in Markdown, the site converts them to styled HTML.
//
//  Supported syntax:
//    ## Heading 2          → <h2>
//    ### Heading 3         → <h3>
//    **bold**              → <strong>
//    *italic*              → <em>
//    `code`                → <code>
//    > blockquote          → <blockquote>
//    - item / * item       → <ul><li>
//    1. item               → <ol><li>
//    [text](url)           → <a>
//    ---                   → <hr>
//    blank line            → new paragraph
//
//  Special callout box:
//    :::callout Title Here
//    Body text of the callout.
//    :::
//
// ═══════════════════════════════════════════════════════════════════
function parseMarkdown(md) {
  const lines = md.split("\n");
  let html = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Callout block  :::callout Title
    if (line.startsWith(":::callout")) {
      const title = line.replace(":::callout", "").trim();
      let body = "";
      i++;
      while (i < lines.length && !lines[i].startsWith(":::")) {
        body += lines[i] + "\n";
        i++;
      }
      html += `<div class="callout"><div class="callout-title">${title}</div>${inlineFormat(body.trim())}</div>\n`;
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("## "))  { html += `<h2>${inlineFormat(line.slice(3))}</h2>\n`; i++; continue; }
    if (line.startsWith("### ")) { html += `<h3>${inlineFormat(line.slice(4))}</h3>\n`; i++; continue; }

    // Blockquote
    if (line.startsWith("> ")) {
      let bq = line.slice(2);
      while (i + 1 < lines.length && lines[i + 1].startsWith("> ")) { i++; bq += " " + lines[i].slice(2); }
      html += `<blockquote>${inlineFormat(bq)}</blockquote>\n`;
      i++; continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      html += "<ul>\n";
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        html += `<li>${inlineFormat(lines[i].slice(2))}</li>\n`;
        i++;
      }
      html += "</ul>\n";
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      html += "<ol>\n";
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        html += `<li>${inlineFormat(lines[i].replace(/^\d+\. /, ""))}</li>\n`;
        i++;
      }
      html += "</ol>\n";
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") { html += "<hr/>\n"; i++; continue; }

    // Blank line → skip (paragraph spacing handled by <p> margin)
    if (line.trim() === "") { i++; continue; }

    // Regular paragraph — collect consecutive non-special lines
    let para = line;
    while (
      i + 1 < lines.length &&
      lines[i + 1].trim() !== "" &&
      !lines[i + 1].startsWith("#") &&
      !lines[i + 1].startsWith(">") &&
      !lines[i + 1].startsWith(":::") &&
      !/^[-*] /.test(lines[i + 1]) &&
      !/^\d+\. /.test(lines[i + 1])
    ) {
      i++;
      para += " " + lines[i];
    }
    html += `<p>${inlineFormat(para)}</p>\n`;
    i++;
  }
  return html;
}

function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g,  "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,       "<em>$1</em>")
    .replace(/`(.+?)`/g,         "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
}

// ═══════════════════════════════════════════════════════════════════
//  BLOG POSTS
//
//  To add a new post, copy one of the objects below and fill it in.
//  Write the `content` field in Markdown — no HTML needed.
//
//  Required fields:
//    id         – unique slug, no spaces (e.g. "my-post")
//    title      – shown as the article heading
//    excerpt    – short summary shown on cards
//    tag        – badge label (e.g. "Learning", "AI & LLMs")
//    tagColor   – hex colour for the badge
//    author     – author name
//    authorRole – role shown under the author name
//    date       – year or date string
//    readTime   – e.g. "6 min read"
//    url        – "View original" link (can be "#" if none)
//    content    – the article body, written in Markdown
// ═══════════════════════════════════════════════════════════════════
const POSTS_RAW = [
  {
    id: "kaggle",
    title: "Kaggle: The Best Place to Start Machine Learning and Data Science",
    excerpt: "Whether you're a beginner or a seasoned data scientist, Kaggle offers competitions, datasets and community kernels that accelerate your ML journey significantly.",
    tag: "Learning", tagColor: "#4f9cf9",
    author: "MLDSN Nepal", authorRole: "Data Scientist, Germany",
    date: "2020", readTime: "8 min read",
    url: "https://sites.google.com/view/mldsnorg/blog/kaggle_i",
    content: `
Either you are a beginner or a proficient data scientist, there is always a lot to learn from [Kaggle](https://www.kaggle.com/). Kaggle is a competition platform and provides a variety of datasets. You can also read very interesting kernels written by many competitors.

## Getting Started as a Beginner

If you are a beginner, try a simple competition such as [the Titanic dataset](https://www.kaggle.com/c/titanic). Though there is no single solid step-by-step approach to solve any data science problem, it is always useful to know some initial steps.

## The Four Core Steps

1. **Understand the Problem** — Be clear on what you are doing before attacking any problem. It gives a big picture and some expectation about the results.
2. **Collect the Requirements** — The most important requirement is data. You need proper information about what data is needed and where to obtain it from.
3. **Know the Data Architecture** — Every organisation has its own architecture for storage (SQL, NoSQL), data in motion, governance and ETL.
4. **Prepare the Data Dictionary** — Understand what each term means and why it exists. Get rid of unwanted data from your model.

:::callout Variable Notes
**Pclass** is a proxy for socio-economic status — 1st = Upper, 2nd = Middle, 3rd = Lower.
**Age** is fractional if less than 1. Estimated ages appear as xx.5.
**SibSp** counts siblings and spouses (mistresses and fiancés excluded).
:::

## Going Further

Follow [this kernel](https://www.kaggle.com/jparajuli/data-exploration-encoding-and-ml-in-titanic) created by Dr. Jhanak Parajuli to understand detailed steps for the Titanic dataset — including data exploration, encoding and applying ML models end-to-end.

> Kaggle is not just a competition platform — it is a learning community. Every kernel you read teaches you something a textbook never could.
`
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra for Machine Learning (Part I)",
    excerpt: "Vectors, matrices and transformations form the mathematical backbone of every ML algorithm. This guide builds intuition before formulas.",
    tag: "Mathematics", tagColor: "#a78bfa",
    author: "MLDSN Nepal", authorRole: "Editorial Team",
    date: "2020", readTime: "10 min read",
    url: "https://sites.google.com/view/mldsnorg/blog/linear_algebra_i",
    content: `
Machine learning algorithms operate almost entirely on numbers arranged in specific structures — vectors and matrices. Without a working understanding of linear algebra, many ML concepts remain opaque.

## Why Linear Algebra Matters in ML

Every dataset you work with is a matrix. Every neural network layer performs a matrix multiplication. PCA uses eigenvectors. Image data is stored as multi-dimensional arrays.

:::callout Core objects you need to master
**Scalars** — single numbers (e.g. a learning rate of 0.01)
**Vectors** — ordered lists of numbers representing a point or direction in space
**Matrices** — rectangular grids of numbers; the workhorse of ML computation
**Tensors** — generalised multi-dimensional arrays (what PyTorch and TensorFlow use)
:::

## Vectors: Intuition First

Think of a vector as an arrow in space. A 2D vector \`[3, 4]\` points 3 units right and 4 units up from the origin.

Key vector operations:

- **Addition** — add element-wise; geometrically chains two arrows
- **Scalar multiplication** — stretches or shrinks the arrow
- **Dot product** — measures how aligned two vectors are; fundamental to attention
- **Norm (length)** — \`||v|| = sqrt(v1^2 + v2^2 + ...)\` used in regularisation

## Matrices: The Workhorses

A matrix is a 2D array with *m* rows and *n* columns. In ML your dataset of 1000 samples with 20 features is a \`1000 x 20\` matrix.

### Matrix Multiplication

Given matrix **A** (m x k) and **B** (k x n), their product **C = AB** is (m x n). Each element is the dot product of a row of A with a column of B — exactly what a neural network layer does.

> A matrix does not just hold numbers — it encodes a transformation of space. Learning to see this separates a practitioner from someone who merely applies formulas.

## What's Coming in Part II

Part II will cover **eigenvalues and eigenvectors** (the engine of PCA), **matrix decompositions** (SVD, LU), and **solving systems of linear equations** as they appear in linear regression and optimisation.
`
  },
  {
    id: "probability",
    title: "Probability for Machine Learning (Part I)",
    excerpt: "From Bayes' theorem to probability distributions — mastering the statistical thinking required to reason under uncertainty in ML systems.",
    tag: "Mathematics", tagColor: "#34d399",
    author: "MLDSN Nepal", authorRole: "Editorial Team",
    date: "2020", readTime: "9 min read",
    url: "https://sites.google.com/view/mldsnorg/blog/probability_i",
    content: `
Machine learning is fundamentally about making decisions under uncertainty. Probability theory gives us the language to reason about this rigorously.

## Why Probability Underpins ML

- A classifier outputs **probabilities** over classes, not hard labels
- Loss functions like cross-entropy come from **maximum likelihood estimation**
- Regularisation (L2) corresponds to placing a **Gaussian prior** on weights
- Generative models (VAEs, diffusion) learn **distributions over data**

## Core Concepts

### Conditional Probability

The probability of event A *given* event B has occurred:

:::callout Formula
**P(A | B) = P(A and B) / P(B)**, where P(B) > 0
:::

### Bayes Theorem

:::callout Bayes Theorem
**P(A | B) = P(B | A) x P(A) / P(B)**

**P(A)** — Prior: what we believed before seeing B
**P(B | A)** — Likelihood: how probable is B if A is true
**P(A | B)** — Posterior: updated belief after seeing B
:::

## Key Distributions

- **Bernoulli** — binary classification outputs
- **Categorical** — multi-class classification (softmax)
- **Gaussian (Normal)** — weight initialisation, noise modelling
- **Beta** — Bayesian A/B testing, priors over probabilities
- **Dirichlet** — topic models (LDA), priors over distributions

> Understanding probability means building the intuition to ask "what do we know, what don't we know, and how confident should we be?" That mindset is the core skill in ML.
`
  },
  {
    id: "llm-journey",
    title: "The LLM Journey: From Text Prediction to Intelligent Agents — and What It Means for Nepal",
    excerpt: "Large language models have evolved from simple autocomplete systems into reasoning agents that write code, pass professional exams, and power entire products. Here is how we got here, and why the opportunity for Nepal has never been greater.",
    tag: "AI & LLMs", tagColor: "#f472b6",
    author: "MLDSN Nepal", authorRole: "Editorial Team",
    date: "2025", readTime: "7 min read",
    url: "#",
    content: `
Not long ago, a language model was a specialised research tool — impressive in a seminar room, but far from daily life. That changed in November 2022, when ChatGPT crossed one million users in five days. Since then, large language models (LLMs) have moved faster than almost any technology in history.

## How We Got Here: A Brief Timeline

The story of LLMs begins with the **Transformer architecture**, introduced by Google researchers in the landmark 2017 paper "Attention Is All You Need." Transformers replaced sequential processing with self-attention, allowing models to process entire sequences in parallel.

GPT-1 (2018) and BERT (2018) were the first wave. GPT-3 (2020), with 175 billion parameters, was the moment that made the broader world pay attention. The key insight: a large enough model, trained on enough text, develops broad capabilities that were never directly programmed.

:::callout Key Milestones at a Glance
**2017** — Transformer architecture introduced by Google
**2020** — GPT-3 demonstrates few-shot generalisation at scale
**2022** — ChatGPT launches; one million users in five days
**2024** — GPT-4o brings real-time multimodal interaction
**Jan 2025** — DeepSeek R1: open-source reasoning model rivalling frontier models at a fraction of the cost
**2025** — Agentic AI: LLMs that plan, use tools, and complete multi-step tasks
:::

## The Two Biggest Shifts of 2024–2025

### 1. From Assistants to Reasoners

The release of OpenAI o1 and DeepSeek R1 in January 2025 marked a qualitative shift: **reasoning models**. DeepSeek R1, under an open MIT licence, achieved benchmark results comparable to OpenAI's best model — at approximately 95% lower cost. This democratised access to frontier-level reasoning.

### 2. From Chatbots to Agents

The move to **agentic AI** — systems that plan sequences of actions, call external tools, remember context, and correct their own mistakes — is beginning to change how entire professions operate.

## Opportunities: Where Should Nepal Focus?

1. **Nepali Language AI** — Fine-tuning an open-source model on high-quality Nepali text is both achievable and high-impact.
2. **Education and Personalised Tutoring** — Students and researchers at Nepali universities are uniquely positioned to build localised educational AI.
3. **Agriculture and Rural Development** — LLM-powered advisory tools accessible via SMS or voice could help millions of farmers.
4. **Healthcare Information Access** — AI-assisted triage tools could meaningfully extend Nepal's healthcare reach.
5. **Research and Publications** — Open models and public datasets make serious LLM research more accessible than ever.
6. **Careers and the Global Remote Economy** — LLM skills are in extreme global demand, opening remote income pathways.

## A Note on Responsibility

LLMs hallucinate, can amplify biases, and raise questions about copyright and job displacement. Building AI literacy in Nepal means building *critical* AI literacy.

> The countries that will benefit most from the LLM era are those who develop the skills to adapt these tools to their own languages, problems, and contexts. Nepal has both the need and the talent. What it needs now is focused effort.
`
  },
];

// Convert all Markdown content to HTML at load time
const POSTS = POSTS_RAW.map(p => ({
  ...p,
  slug: p.id.replace(/-/g, "_"),
  content: parseMarkdown(p.content),
}));

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value:"2018", label:"Founded",             suffix:"" },
  { value:"10",    label:"Workshops & Seminars",  suffix:"+" },
  { value:"7",    label:"Years Active",         suffix:"+" },
  { value:"100",  label:"Members & Growing",    suffix:"s" },
];

const MISSION_ITEMS = [
  { icon:"◉", title:"Community & Events",        desc:"Build a strong networking platform for AI, ML, and Data Science enthusiasts across Nepal and globally, while organizing impactful workshops, seminars, guest lectures, hackathons, and conferences." },
  { icon:"◎", title:"Research & Innovation",     desc:"Drive research excellence through publications, blogs, and peer-reviewed papers. Bridge the gap between industry and academia by supporting students and researchers." },
  { icon:"◐", title:"Digital Nepal",             desc:"Bridge the urban-rural divide by promoting AI, digital literacy, and technology-driven solutions for the inclusive development of rural Nepal." },
  { icon:"◆", title:"Skill & Talent Development",desc:"Equip the next generation with industry-relevant skills through bootcamps, structured training programs, mentorship, and certification pathways in AI and Data Science." },
];

const TEAM = [
  { name:"Mr. Surya Bahadur Basnet",  role:"Principal",                               location:"Sankalpa College, Nepal",           url:"https://www.linkedin.com/in/surya-bdr-basnet-554859172/",  initials:"SB", color:"#fb923c" },
  { name:"Dr. Tej Bahadur Shahi",     role:"Researcher",                              location:"CQUniversity, Australia",           url:"https://scholar.google.com/citations?user=t7kVlfIAAAAJ",   initials:"TS", color:"#34d399" },
  { name:"Dr. Sarbagya Ratna Shakya", role:"Asst. Professor",                         location:"Eastern New Mexico University, USA",url:"https://sites.google.com/view/sarbagyashakya/home",        initials:"SR", color:"#a78bfa" },
  { name:"Mr. Ashok Kumar Pant",      role:"CTO & Co-founder",                        location:"Treeleaf, Nepal",                   url:"https://www.linkedin.com/in/asokpant/",                    initials:"AP", color:"#f472b6" },
  { name:"Mr. Dilip Yogi",            role:"Application Architect",                   location:"USA",                               url:"https://www.linkedin.com/in/yogidilip/",                   initials:"DY", color:"#facc15" },
  { name:"Dr. Jhanak Parajuli",       role:"Senior Data Scientist",                   location:"Germany",                           url:"https://www.linkedin.com/in/jhanak-parajuli-41a29635/",    initials:"JP", color:"#4f9cf9" },
];

const TIMELINE = [
  { year:"2018",   title:"Foundation",      colors:0, desc:"Launched with a 3-day National Workshop on Machine Learning and Data Science (May 9–11). Overwhelming participation confirmed Nepal's appetite for AI/ML education." },
  { year:"2019+",  title:"Global Webinars", colors:1, desc:"Invited world leaders and experts in data science to share insights on the evolving field and opportunities for Nepal's growing tech community." },
  { year:"Annual", title:"NWMLDS",          colors:2, desc:"National Workshop on Machine Learning and Data Science — Nepal's only flagship 5-day ML/DS workshop — held every year since 2018 for students, researchers and startup founders." },
  { year:"2021",   title:"Symposium at LTU",colors:3, desc:"Organized a one-day symposium at Lumbini Technological University, expanding MLDSN's reach into western Nepal." },
];

const EVENTS_DATA = [
  { year:"Annual",  title:"NWMLDS — National Workshop on ML & DS", type:"Workshop", accent:"var(--accent)",  desc:"Nepal's only flagship 5-day ML/DS workshop. Held every year since 2018 for students, researchers and startup founders." },
  { year:"2021",    title:"1-Day Symposium at LTU",                type:"Symposium",accent:"var(--accent2)", desc:"A focused one-day symposium at Lumbini Technological University, Nepalganj — bringing ML/DS education to western Nepal." },
  { year:"Ongoing", title:"International Webinar Series",          type:"Webinar",  accent:"var(--green)",   desc:"Global experts in data science and ML share their views on how the field is evolving and opportunities for Nepal's tech community." },
];

const TIMELINE_COLORS = ["var(--accent)","var(--accent2)","var(--green)","var(--orange)"];

// ─── LOGO ─────────────────────────────────────────────────────────────────────
// Replace LOGO_URL with your image URL or a base64 data URL.
// While no logo is set, the "ML" text badge is shown as fallback.
const LOGO_URL = "data:image/png;base64,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";

function Logo({ size = 36 }) {
  if (LOGO_URL) {
    // Width is wider than height to match the rectangular MLDSN logo proportions
    const w = Math.round(size * 2.2);
    const h = Math.round(size * 0.72);
    return (
      <img
        src={LOGO_URL}
        alt="MLDSN Nepal"
        style={{ width:w, height:h, objectFit:"contain", flexShrink:0, borderRadius:3 }}
      />
    );
  }
  return (
    <div style={{ width:size, height:size, borderRadius:8, background:"linear-gradient(135deg,var(--accent),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:Math.round(size*0.36), color:"#fff", letterSpacing:".04em", flexShrink:0 }}>ML</div>
  );
}

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
function Tag({ children, color = "var(--accent)" }) {
  return (
    <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:4, fontSize:11, fontFamily:"var(--ff-mono)", letterSpacing:".08em", fontWeight:500, textTransform:"uppercase", background:`${color}18`, border:`1px solid ${color}44`, color }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
      <div style={{ width:24, height:1, background:"var(--accent)" }} />
      <span style={{ fontFamily:"var(--ff-mono)", fontSize:11, letterSpacing:".14em", textTransform:"uppercase", color:"var(--accent)" }}>{children}</span>
    </div>
  );
}

function Btn({ children, href, onClick, primary, small, style: extra = {} }) {
  const base = {
    display:"inline-block", borderRadius:10, fontWeight:600, transition:"all .2s",
    fontSize: small ? 13 : 15, padding: small ? "8px 18px" : "13px 28px",
    cursor:"pointer", border:"none", fontFamily:"var(--ff-body)",
    ...(primary
      ? { background:"linear-gradient(135deg,var(--accent),#2563eb)", color:"#fff", boxShadow:"0 8px 32px rgba(79,156,249,0.3)" }
      : { background:"transparent", border:"1px solid var(--border2)", color:"var(--text)" }),
    ...extra,
  };
  if (href) return (
    <a href={href} target="_blank" style={base}
      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; if(primary) e.currentTarget.style.boxShadow="0 12px 40px rgba(79,156,249,0.45)"; else e.currentTarget.style.borderColor="rgba(79,156,249,0.4)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="none"; if(primary) e.currentTarget.style.boxShadow="0 8px 32px rgba(79,156,249,0.3)"; else e.currentTarget.style.borderColor="var(--border2)"; }}
    >{children}</a>
  );
  return (
    <button onClick={onClick} style={base}
      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="none"; }}
    >{children}</button>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
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
      document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    } else {
      navigate("home");
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior:"smooth" });
        else requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }));
      };
      requestAnimationFrame(() => requestAnimationFrame(attempt));
    }
  }, [page, navigate]);

  const links = [
    { label:"Home",    action: () => { navigate("home"); window.scrollTo({ top:0, behavior:"smooth" }); } },
    { label:"About",   action: () => scrollToSection("about") },
    { label:"Mission", action: () => scrollToSection("mission") },
    { label:"Team",    action: () => scrollToSection("team") },
    { label:"Events",  action: () => scrollToSection("events") },
    { label:"Blog",    action: () => navigate("blog") },
    { label:"Contact", action: () => scrollToSection("contact") },
  ];

  const isBlog = page === "blog" || page === "article";

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, padding:"0 clamp(16px,4vw,60px)", background: scrolled ? "rgba(8,12,16,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent", transition:"all .3s ease", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>

      <button onClick={() => { navigate("home"); window.scrollTo({ top:0, behavior:"smooth" }); }}
        style={{ background:"none", border:"none", display:"flex", alignItems:"center", gap:10, padding:0, flexShrink:0 }}>
        <Logo size={36} />
        <div style={{ textAlign:"left" }}>
          <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:15, color:"var(--text)", lineHeight:1.1 }}>MLDSN Nepal</div>
          <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".05em" }}>ML & Data Science Network</div>
        </div>
      </button>

      <div className="desktop-nav" style={{ display:"flex", gap:2, alignItems:"center" }}>
        {links.map(l => (
          <button key={l.label} onClick={l.action}
            style={{ padding:"7px 14px", borderRadius:6, fontSize:13, fontWeight:500, border:"none", background:(isBlog && l.label==="Blog") ? "rgba(79,156,249,0.08)" : "transparent", color:(isBlog && l.label==="Blog") ? "var(--accent)" : "var(--sub)", transition:"color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color="var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color=(isBlog && l.label==="Blog") ? "var(--accent)" : "var(--sub)"}
          >{l.label}</button>
        ))}
        <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary small style={{ marginLeft:8 }}>Join Network</Btn>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(v => !v)}
        style={{ background:"none", border:"none", color:"var(--text)", fontSize:22, display:"none", padding:"6px 8px", lineHeight:1 }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{ position:"fixed", top:64, left:0, right:0, bottom:0, background:"rgba(8,12,16,0.98)", backdropFilter:"blur(20px)", padding:"20px 24px 40px", display:"flex", flexDirection:"column", zIndex:199, overflowY:"auto" }}>
          {links.map(l => (
            <button key={l.label} onClick={() => { l.action(); setMenuOpen(false); }}
              style={{ padding:"16px 0", fontSize:17, fontFamily:"var(--ff-body)", fontWeight:600, color:"var(--text)", background:"none", border:"none", borderBottom:"1px solid var(--border)", textAlign:"left" }}>
              {l.label}
            </button>
          ))}
          <div style={{ marginTop:28 }}>
            <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary style={{ width:"100%", display:"block", textAlign:"center" }}>
              Join Network — It's Free
            </Btn>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section id="home" className="mountain-grid sec" style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"120px clamp(16px,6vw,80px) 80px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"15%", right:"8%", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,156,249,0.09) 0%,transparent 70%)", animation:"drift 12s ease-in-out infinite", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", left:"5%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%)", animation:"drift 16s ease-in-out infinite reverse", pointerEvents:"none" }} />
      <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", opacity:.04, pointerEvents:"none" }} viewBox="0 0 1440 220" preserveAspectRatio="none">
        <polygon points="0,220 180,80 320,160 480,40 620,130 760,20 900,110 1080,50 1260,120 1440,60 1440,220" fill="white" />
      </svg>
      <div style={{ maxWidth:860, position:"relative", zIndex:1, width:"100%" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28, padding:"6px 14px", borderRadius:20, background:"rgba(79,156,249,0.08)", border:"1px solid rgba(79,156,249,0.25)", animation:"fade-up .5s ease both" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)", animation:"pulse-dot 2s ease-in-out infinite", flexShrink:0 }} />
          <span style={{ fontFamily:"var(--ff-mono)", fontSize:11, letterSpacing:".12em", color:"var(--accent)", textTransform:"uppercase" }}>Est. 2018 · Kathmandu, Nepal</span>
        </div>
        <h1 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(2rem,5vw,3.8rem)", lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:24, animation:"fade-up .6s .1s ease both" }}>
          Machine Learning &{" "}
          <span style={{ background:"linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Data Science</span>
          {" "}Network Nepal
        </h1>
        <p style={{ fontSize:"clamp(.9rem,1.8vw,1.15rem)", color:"var(--sub)", maxWidth:620, lineHeight:1.75, marginBottom:40, animation:"fade-up .6s .2s ease both" }}>
          A non-profit community dedicated to advancing AI, machine learning and data science in Nepal — through education, research, networking and rural digital inclusion.
        </p>
        <div className="hero-ctas" style={{ display:"flex", gap:12, flexWrap:"wrap", animation:"fade-up .6s .3s ease both" }}>
          <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary>Become a Member</Btn>
          <Btn onClick={() => document.getElementById("about")?.scrollIntoView({ behavior:"smooth" })}>Learn More ↓</Btn>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function StatsTicker() {
  return (
    <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"var(--surface)", padding:"0 clamp(16px,5vw,60px)" }}>
      <div className="stats-grid" style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-cell" style={{ padding:"24px 16px", textAlign:"center", borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.5rem,2.8vw,2.2rem)", letterSpacing:"-0.02em", color: i%2===0 ? "var(--accent)" : "var(--accent2)", lineHeight:1 }}>
              {s.value}<span style={{ fontSize:"60%" }}>{s.suffix}</span>
            </div>
            <div style={{ fontSize:12, color:"var(--muted)", marginTop:6, letterSpacing:".04em" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)" }}>
      <div className="about-grid" style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(32px,6vw,80px)", alignItems:"center" }}>
        <div>
          <SectionLabel>Who We Are</SectionLabel>
          <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em", marginBottom:20 }}>
            Nepal's leading community for <span style={{ color:"var(--accent)" }}>AI & Data Science</span>
          </h2>
          <p style={{ color:"var(--sub)", lineHeight:1.8, marginBottom:16, fontSize:".97rem" }}>
            Though machine learning and artificial intelligence existed from the 1960s, data science wasn't widely known until 2012. Within a decade it became one of the most demanded skillsets in industry and academia worldwide.
          </p>
          <p style={{ color:"var(--sub)", lineHeight:1.8, fontSize:".97rem" }}>
            Understanding this growing demand, we founded MLDSN Nepal in 2018 — a non-profit community where students, entrepreneurs, researchers and digital experts share knowledge, organise events, write blogs and collectively advance the field across Nepal.
          </p>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, padding:"28px 24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,var(--accent),var(--accent2))" }} />
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--muted)", marginBottom:20, letterSpacing:".08em" }}>// community.profile</div>
            {[["Founded","2018"],["Type","Non-Profit Community"],["Focus","ML · DS · AI"],["Location","Nepal (Global Network)"],["Contact","aimldsn@gmail.com"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"10px 0", borderBottom:"1px solid var(--border)", fontSize:".9rem", gap:8 }}>
                <span style={{ color:"var(--muted)", fontFamily:"var(--ff-mono)", fontSize:12, flexShrink:0 }}>{k}</span>
                <span style={{ color:"var(--text)", fontWeight:500, textAlign:"right", wordBreak:"break-all" }}>{v}</span>
              </div>
            ))}
            <div className="about-card-actions" style={{ marginTop:20, display:"flex", gap:8 }}>
              {[["Facebook Group","https://www.facebook.com/groups/217595548832685","var(--accent)","rgba(79,156,249,0.08)","rgba(79,156,249,0.2)"],
                ["Research & Career","https://sites.google.com/view/mldsnorg/research-career","var(--accent2)","rgba(167,139,250,0.08)","rgba(167,139,250,0.2)"]].map(([l,h,c,bg,bd]) => (
                <a key={l} href={h} target="_blank" style={{ flex:"1 1 110px", padding:"10px 8px", borderRadius:8, textAlign:"center", background:bg, border:`1px solid ${bd}`, color:c, fontSize:13, fontWeight:600, transition:"opacity .2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity=".75"}
                  onMouseLeave={e => e.currentTarget.style.opacity="1"}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", border:"1px solid rgba(79,156,249,0.2)", animation:"spin-slow 20s linear infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ─── MISSION ──────────────────────────────────────────────────────────────────
function Mission() {
  return (
    <section id="mission" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)", background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>Our Mission</SectionLabel>
        <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em", marginBottom:40, maxWidth:480 }}>
          Connecting Minds, Empowering Nepal Through AI, ML and DS
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:16 }}>
          {MISSION_ITEMS.map((item, i) => (
            <div key={i} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"24px 20px", transition:"border-color .25s,transform .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ width:44, height:44, borderRadius:10, marginBottom:16, background:`linear-gradient(135deg,${["rgba(79,156,249,.15)","rgba(167,139,250,.15)","rgba(52,211,153,.15)","rgba(251,146,60,.15)"][i]},transparent)`, border:`1px solid ${["rgba(79,156,249,.25)","rgba(167,139,250,.25)","rgba(52,211,153,.25)","rgba(251,146,60,.25)"][i]}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:["var(--accent)","var(--accent2)","var(--green)","var(--orange)"][i] }}>{item.icon}</div>
              <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"1.05rem", marginBottom:10 }}>{item.title}</h3>
              <p style={{ color:"var(--sub)", fontSize:".88rem", lineHeight:1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function History() {
  return (
    <section className="sec" style={{ padding:"100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>A Bit of History</SectionLabel>
        <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em", marginBottom:48 }}>Our journey since 2018</h2>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:16, top:0, bottom:0, width:1, background:"linear-gradient(180deg,var(--accent),var(--accent2),transparent)" }} />
          <div style={{ display:"flex", flexDirection:"column" }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display:"flex", gap:"clamp(16px,4vw,32px)", paddingBottom: i < TIMELINE.length-1 ? 40 : 0 }}>
                <div style={{ flexShrink:0 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--bg)", border:`2px solid ${TIMELINE_COLORS[item.colors]}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:TIMELINE_COLORS[item.colors] }} />
                  </div>
                </div>
                <div style={{ paddingTop:4 }}>
                  <Tag color={TIMELINE_COLORS[item.colors]}>{item.year}</Tag>
                  <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"1.05rem", margin:"10px 0 8px" }}>{item.title}</h3>
                  <p style={{ color:"var(--sub)", fontSize:".9rem", lineHeight:1.75, maxWidth:560 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TEAM (advisors removed) ──────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)", background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>The People</SectionLabel>
        <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em", marginBottom:8 }}>Core Team</h2>
        <p style={{ color:"var(--sub)", marginBottom:40, maxWidth:500, fontSize:".95rem" }}>Volunteers from academia, industry, and research — united by the mission to grow Nepal's AI ecosystem.</p>
        <div className="team-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
          {TEAM.map((m, i) => (
            <a key={i} href={m.url||"#"} target="_blank"
              style={{ display:"block", background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"20px 18px", transition:"all .25s", textDecoration:"none" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${m.color}44`; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${m.color}14`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%", flexShrink:0, background:`linear-gradient(135deg,${m.color}33,${m.color}11)`, border:`1.5px solid ${m.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:13, color:m.color }}>{m.initials}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:".9rem", color:"var(--text)", lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{m.role}</div>
                </div>
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, color:m.color, fontFamily:"var(--ff-mono)", background:`${m.color}12`, border:`1px solid ${m.color}30`, padding:"3px 8px", borderRadius:4, maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                📍 {m.location}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function Events() {
  return (
    <section id="events" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>Events</SectionLabel>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:14 }}>
          <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em" }}>News & Events</h2>
          <a href="https://sites.google.com/view/mldsnorg/news-and-events/events" target="_blank"
            style={{ padding:"9px 20px", borderRadius:8, border:"1px solid var(--border2)", color:"var(--sub)", fontSize:13, fontWeight:500, transition:"all .2s", whiteSpace:"nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="var(--sub)"; e.currentTarget.style.borderColor="var(--border2)"; }}>All Events →</a>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
          {EVENTS_DATA.map((ev, i) => (
            <div key={i} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", transition:"all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${ev.accent}44`; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ height:4, background:`linear-gradient(90deg,${ev.accent},transparent)` }} />
              <div style={{ padding:"22px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <Tag color={ev.accent}>{ev.type}</Tag>
                  <span style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--muted)" }}>{ev.year}</span>
                </div>
                <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"1rem", marginBottom:10, lineHeight:1.35 }}>{ev.title}</h3>
                <p style={{ color:"var(--sub)", fontSize:".87rem", lineHeight:1.7 }}>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOME BLOG ────────────────────────────────────────────────────────────────
function HomeBlog({ navigate }) {
  return (
    <section id="blog" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)", background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>Knowledge Hub</SectionLabel>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:14 }}>
          <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em" }}>Recent Blog Posts</h2>
          <button onClick={() => navigate("blog")} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid var(--border2)", color:"var(--sub)", fontSize:13, fontWeight:500, transition:"all .2s", background:"none", whiteSpace:"nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="var(--sub)"; e.currentTarget.style.borderColor="var(--border2)"; }}>All Posts →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
          {POSTS.map((p, i) => (
            <div key={i} onClick={() => navigate("article", p)} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"24px 20px", cursor:"pointer", transition:"all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${p.tagColor}44`; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${p.tagColor}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ marginBottom:12 }}><Tag color={p.tagColor}>{p.tag}</Tag></div>
              <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"1rem", marginBottom:10, lineHeight:1.4, color:"var(--text)" }}>{p.title}</h3>
              <p style={{ color:"var(--sub)", fontSize:".87rem", lineHeight:1.7, marginBottom:16 }}>{p.excerpt}</p>
              <span style={{ color:p.tagColor, fontSize:13, fontWeight:600 }}>Read post →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── JOIN CTA ─────────────────────────────────────────────────────────────────
function JoinCTA() {
  return (
    <section className="sec" style={{ padding:"100px clamp(16px,6vw,80px)" }}>
      <div style={{ maxWidth:780, margin:"0 auto", textAlign:"center", background:"var(--card)", border:"1px solid var(--border)", borderRadius:24, padding:"clamp(36px,6vw,72px) clamp(20px,5vw,64px)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%,rgba(79,156,249,0.08) 0%,transparent 60%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent)" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <Tag>Community</Tag>
          <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.5rem,2.8vw,2.4rem)", margin:"20px 0 16px", lineHeight:1.2, letterSpacing:"-0.02em" }}>
            Become a Member of<br /><span style={{ color:"var(--accent)" }}>MLDSN Nepal</span>
          </h2>
          <p style={{ color:"var(--sub)", fontSize:".97rem", lineHeight:1.75, maxWidth:480, margin:"0 auto 36px" }}>
            Join the network to receive updates on events, workshops, research opportunities and connect with Nepal's growing ML & DS community.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary>Register Now — It's Free</Btn>
            <Btn href="https://www.facebook.com/groups/217595548832685">Facebook Group</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer id="contact" style={{ background:"var(--surface)", borderTop:"1px solid var(--border)", padding:"56px clamp(16px,6vw,80px) 28px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"clamp(24px,4vw,40px)", marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <Logo size={36} />
              <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:15 }}>MLDSN Nepal</div>
            </div>
            <p style={{ color:"var(--muted)", fontSize:".87rem", lineHeight:1.75, maxWidth:260, marginBottom:20 }}>A non-profit community advancing machine learning and data science education across Nepal since 2018.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <a href="mailto:aimldsn@gmail.com" style={{ color:"var(--sub)", fontSize:".85rem", transition:"color .2s" }} onMouseEnter={e => e.currentTarget.style.color="var(--accent)"} onMouseLeave={e => e.currentTarget.style.color="var(--sub)"}>✉ aimldsn@gmail.com</a>
              <span style={{ color:"var(--sub)", fontSize:".85rem" }}>📞 +977 9851158281</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:".85rem", marginBottom:14, color:"var(--text)" }}>Quick Links</div>
            {[["NWMLDS 2021","https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2021"],["NWMLDS 2020","https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2020"],["Research & Career","https://sites.google.com/view/mldsnorg/research-career"],["Become a Member","https://sites.google.com/view/mldsnorg/become-a-member"]].map(([l,h]) => (
              <a key={l} href={h} target="_blank" style={{ display:"block", color:"var(--muted)", fontSize:".85rem", marginBottom:10, transition:"color .2s" }} onMouseEnter={e => e.currentTarget.style.color="var(--accent)"} onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:".85rem", marginBottom:14, color:"var(--text)" }}>Recent Blogs</div>
            {POSTS.map(p => (
              <button key={p.id} onClick={() => navigate("article", p)} style={{ display:"block", background:"none", border:"none", textAlign:"left", color:"var(--muted)", fontSize:".83rem", marginBottom:10, lineHeight:1.4, transition:"color .2s", cursor:"pointer", padding:0 }} onMouseEnter={e => e.currentTarget.style.color="var(--accent)"} onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}>{p.title}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:".85rem", marginBottom:14, color:"var(--text)" }}>Community</div>
            {[["👥 Facebook Group","https://www.facebook.com/groups/217595548832685","var(--accent)","rgba(79,156,249,0.07)","rgba(79,156,249,0.18)","rgba(79,156,249,0.15)"],["📅 Events","https://sites.google.com/view/mldsnorg/news-and-events/events","var(--accent2)","rgba(167,139,250,0.07)","rgba(167,139,250,0.18)","rgba(167,139,250,0.15)"]].map(([l,h,c,bg,bd,hbg]) => (
              <a key={l} href={h} target="_blank" style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:8, marginBottom:10, background:bg, border:`1px solid ${bd}`, color:c, fontSize:".85rem", fontWeight:600, transition:"all .2s", textDecoration:"none" }} onMouseEnter={e => e.currentTarget.style.background=hbg} onMouseLeave={e => e.currentTarget.style.background=bg}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <span style={{ color:"var(--muted)", fontSize:".82rem" }}>© 2025 MLDSN Nepal. Non-profit community.</span>
          <span style={{ color:"var(--muted)", fontSize:".82rem", fontFamily:"var(--ff-mono)" }}>mldsnnepal.org</span>
        </div>
      </div>
    </footer>
  );
}

// ─── BLOG LIST ────────────────────────────────────────────────────────────────
function BlogList({ navigate }) {
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...Array.from(new Set(POSTS.map(p => p.tag)))];
  const filtered = filter === "All" ? POSTS : POSTS.filter(p => p.tag === filter);

  return (
    <div style={{ paddingTop:64 }}>
      <div className="mountain-grid" style={{ padding:"72px clamp(16px,6vw,80px) 64px", position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)" }}>
        <div style={{ position:"absolute", top:"20%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,156,249,0.07) 0%,transparent 70%)", animation:"drift 12s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
          <SectionLabel>Knowledge Hub</SectionLabel>
          <h1 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.8rem,4vw,3.2rem)", lineHeight:1.15, letterSpacing:"-0.02em", marginBottom:16, animation:"fade-up .55s ease both" }}>
            Blog on{" "}
            <span style={{ background:"linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Machine Learning</span>
            {" "}& Data Science
          </h1>
          <p style={{ color:"var(--sub)", fontSize:"1rem", maxWidth:520, lineHeight:1.75, marginBottom:28 }}>Articles on ML foundations, practical guides and research insights.</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {tags.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:500, transition:"all .2s", border:"1px solid", background: filter===t ? "rgba(79,156,249,0.15)" : "transparent", borderColor: filter===t ? "rgba(79,156,249,0.5)" : "var(--border2)", color: filter===t ? "var(--accent)" : "var(--sub)" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px clamp(16px,6vw,80px)" }}>
        {filter === "All" && (
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:11, fontFamily:"var(--ff-mono)", color:"var(--muted)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>Featured Post</div>
            <div className="featured-grid" onClick={() => navigate("article", POSTS[0])}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, overflow:"hidden", cursor:"pointer", display:"grid", gridTemplateColumns:"1fr 1fr", transition:"all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              <div className="featured-visual" style={{ background:"linear-gradient(135deg,rgba(79,156,249,0.12) 0%,rgba(167,139,250,0.08) 100%)", display:"flex", alignItems:"center", justifyContent:"center", minHeight:220, position:"relative", overflow:"hidden", borderRight:"1px solid var(--border)" }}>
                <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 40% 50%,rgba(79,156,249,0.15) 0%,transparent 65%)" }} />
                <div style={{ fontFamily:"var(--ff-head)", fontSize:"clamp(4rem,8vw,7rem)", color:"rgba(79,156,249,0.15)", fontWeight:700, userSelect:"none", lineHeight:1 }}>Kgl</div>
                <div style={{ position:"absolute", bottom:20, left:20, fontFamily:"var(--ff-mono)", fontSize:11, color:"rgba(79,156,249,0.5)", letterSpacing:".1em" }}>kaggle_i.post</div>
              </div>
              <div style={{ padding:"clamp(20px,4vw,36px) clamp(18px,4vw,32px)", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div>
                  <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
                    <Tag color={POSTS[0].tagColor}>{POSTS[0].tag}</Tag>
                    <span style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--muted)" }}>{POSTS[0].readTime}</span>
                  </div>
                  <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.1rem,2vw,1.55rem)", lineHeight:1.3, letterSpacing:"-0.02em", marginBottom:12, color:"var(--text)" }}>{POSTS[0].title}</h2>
                  <p style={{ color:"var(--sub)", fontSize:".9rem", lineHeight:1.75, marginBottom:20 }}>{POSTS[0].excerpt}</p>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:`${POSTS[0].tagColor}22`, border:`1.5px solid ${POSTS[0].tagColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:600, fontSize:11, color:POSTS[0].tagColor, flexShrink:0 }}>
                      {POSTS[0].author.split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{POSTS[0].author}</div>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>{POSTS[0].date}</div>
                    </div>
                  </div>
                  <span style={{ color:"var(--accent)", fontSize:13, fontWeight:600 }}>Read →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
          {(filter === "All" ? POSTS.slice(1) : filtered).map(post => (
            <div key={post.id} onClick={() => navigate("article", post)}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column", transition:"all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${post.tagColor}44`; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 48px ${post.tagColor}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${post.tagColor},transparent)` }} />
              <div style={{ padding:"22px 20px", flex:1, display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
                  <Tag color={post.tagColor}>{post.tag}</Tag>
                  <span style={{ fontFamily:"var(--ff-mono)", fontSize:10, color:"var(--muted)" }}>{post.readTime}</span>
                </div>
                <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(.95rem,1.6vw,1.1rem)", lineHeight:1.35, letterSpacing:"-0.01em", marginBottom:10, color:"var(--text)", flex:0 }}>{post.title}</h3>
                <p style={{ color:"var(--sub)", fontSize:".87rem", lineHeight:1.7, marginBottom:16, flex:1 }}>{post.excerpt}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:`${post.tagColor}20`, border:`1.5px solid ${post.tagColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:600, fontSize:10, color:post.tagColor, flexShrink:0 }}>
                      {post.author.split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </div>
                    <span style={{ fontSize:12, color:"var(--muted)" }}>{post.date}</span>
                  </div>
                  <span style={{ color:post.tagColor, fontSize:12, fontWeight:600 }}>Read →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:56, background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, padding:"36px clamp(20px,4vw,48px)", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,var(--accent2),transparent)" }} />
          <Tag color="var(--accent2)">Community</Tag>
          <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.1rem,2vw,1.5rem)", letterSpacing:"-0.02em", margin:"14px 0 10px" }}>Want to contribute a blog post?</h3>
          <p style={{ color:"var(--sub)", fontSize:".92rem", maxWidth:460, margin:"0 auto 24px" }}>MLDSN Nepal welcomes well-written articles on ML, data science, AI and their applications. Join the community and share your knowledge.</p>
          <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary>Join & Contribute</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── ARTICLE VIEW ─────────────────────────────────────────────────────────────
function ArticleView({ post, navigate }) {
  const others = POSTS.filter(p => p.id !== post.id);
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [post.id]);

  return (
    <div style={{ paddingTop:64 }}>
      <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"48px clamp(16px,6vw,80px) 40px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 20% 50%,${post.tagColor}08 0%,transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ maxWidth:800, margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            <button onClick={() => navigate("blog")} style={{ background:"none", border:"none", padding:0, color:"var(--muted)", fontSize:13, display:"flex", alignItems:"center", gap:4, cursor:"pointer", transition:"color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color="var(--accent)"} onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}
            >← Blog</button>
            <span style={{ color:"var(--border2)", fontSize:13 }}>/</span>
            <span style={{ color:"var(--sub)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"min(260px,50vw)" }}>{post.title}</span>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
            <Tag color={post.tagColor}>{post.tag}</Tag>
            <span style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--muted)" }}>{post.readTime}</span>
            <span style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--muted)" }}>· {post.date}</span>
          </div>
          <h1 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.5rem,3.5vw,2.6rem)", lineHeight:1.2, letterSpacing:"-0.025em", marginBottom:16, color:"var(--text)" }}>{post.title}</h1>
          <p style={{ color:"var(--sub)", fontSize:"clamp(.92rem,1.5vw,1.05rem)", lineHeight:1.7, marginBottom:24, maxWidth:680 }}>{post.excerpt}</p>
          <div className="author-row" style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`${post.tagColor}22`, border:`1.5px solid ${post.tagColor}55`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:13, color:post.tagColor, flexShrink:0 }}>
              {post.author.split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:".9rem", color:"var(--text)" }}>{post.author}</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>{post.authorRole}</div>
            </div>
            {post.url && post.url !== "#" && (
              <a href={post.url} target="_blank" className="view-orig"
                style={{ marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:500, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border2)", color:"var(--sub)", transition:"all .2s", whiteSpace:"nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.borderColor="rgba(79,156,249,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color="var(--sub)"; e.currentTarget.style.borderColor="var(--border2)"; }}>View original ↗</a>
            )}
          </div>
        </div>
      </div>

      <div className="article-grid" style={{ maxWidth:1100, margin:"0 auto", padding:"48px clamp(16px,6vw,80px)", display:"grid", gridTemplateColumns:"1fr 280px", gap:"clamp(28px,5vw,56px)", alignItems:"start" }}>
        <article className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} style={{ minWidth:0 }} />
        <aside className="article-sidebar" style={{ position:"sticky", top:80 }}>
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"18px", marginBottom:18 }}>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--accent)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>About this post</div>
            {[["Category",post.tag],["Author",post.author],["Read time",post.readTime],["Published",post.date]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:".83rem", gap:8 }}>
                <span style={{ color:"var(--muted)", flexShrink:0 }}>{k}</span>
                <span style={{ color:"var(--text)", fontWeight:500, textAlign:"right", wordBreak:"break-word" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"18px", marginBottom:18 }}>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--accent)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>More Posts</div>
            {others.map((p, i) => (
              <div key={p.id} onClick={() => navigate("article", p)} style={{ paddingBottom: i<others.length-1?14:0, marginBottom: i<others.length-1?14:0, borderBottom: i<others.length-1?"1px solid var(--border)":"none", cursor:"pointer" }}>
                <div style={{ marginBottom:5 }}><Tag color={p.tagColor}>{p.tag}</Tag></div>
                <div style={{ fontSize:".85rem", color:"var(--sub)", lineHeight:1.4, fontWeight:500, transition:"color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color="var(--text)"} onMouseLeave={e => e.currentTarget.style.color="var(--sub)"}>{p.title}</div>
              </div>
            ))}
          </div>
          <a href="https://sites.google.com/view/mldsnorg/become-a-member" target="_blank"
            style={{ display:"block", background:"rgba(79,156,249,0.08)", border:"1px solid rgba(79,156,249,0.25)", borderRadius:14, padding:"16px 18px", textAlign:"center", transition:"all .2s" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(79,156,249,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(79,156,249,0.08)"}>
            <div style={{ fontSize:11, fontFamily:"var(--ff-mono)", color:"var(--accent)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Community</div>
            <div style={{ fontWeight:600, fontSize:".9rem", color:"var(--text)", marginBottom:6 }}>Join MLDSN Nepal</div>
            <div style={{ fontSize:".8rem", color:"var(--sub)", lineHeight:1.6 }}>Get updates on events, workshops and new posts.</div>
          </a>
        </aside>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
      document.head.appendChild(meta);
    }
    const styleEl = document.createElement("style");
    styleEl.textContent = GLOBAL_CSS;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const navigate = useCallback((target, post = null) => {
    setPage(target);
    if (post) setActivePost(post);
    if (target !== "home" || post) window.scrollTo({ top:0, behavior:"smooth" });
  }, []);

  return (
    <div style={{ minHeight:"100vh" }}>
      <Navbar page={page} navigate={navigate} />
      {page === "home" && (<><Hero navigate={navigate} /><StatsTicker /><About /><Mission /><History /><Team /><Events /><HomeBlog navigate={navigate} /><JoinCTA /><Footer navigate={navigate} /></>)}
      {page === "blog" && (<><BlogList navigate={navigate} /><Footer navigate={navigate} /></>)}
      {page === "article" && activePost && (<><ArticleView post={activePost} navigate={navigate} /><Footer navigate={navigate} /></>)}
    </div>
  );
}
