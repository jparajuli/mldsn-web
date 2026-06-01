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

  /* ── Article prose ── */
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
  /* FIX: tables scroll horizontally on mobile instead of overflowing */
  .article-body .data-table-wrap { width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin:1.4rem 0; }
  .article-body .data-table { width:100%; border-collapse:collapse; font-size:.88rem; min-width:400px; }
  .article-body .data-table th { text-align:left; padding:8px 12px; border-bottom:1px solid var(--border2); color:var(--accent); font-family:var(--ff-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; background:rgba(79,156,249,.04); }
  .article-body .data-table td { padding:8px 12px; border-bottom:1px solid var(--border); color:var(--sub); vertical-align:top; }
  .article-body .data-table tr:hover td { background:rgba(255,255,255,.02); }
  .article-body .step-list  { list-style:none; padding:0; }
  .article-body .step-list li { display:flex; gap:14px; margin-bottom:1.2rem; align-items:flex-start; }
  .article-body .step-num { width:26px; height:26px; border-radius:50%; flex-shrink:0; background:rgba(79,156,249,.12); border:1px solid rgba(79,156,249,.3); display:flex; align-items:center; justify-content:center; font-family:var(--ff-mono); font-size:.75rem; color:var(--accent); font-weight:600; margin-top:2px; }

  /* ── Responsive helpers ── */

  /* Navbar: hide desktop links, show hamburger on mobile */
  @media(max-width:820px) {
    .desktop-nav { display:none!important; }
    .hamburger   { display:block!important; }
  }

  /* Stats: 4-col → 2x2 grid on narrow screens; remove mid-borders cleanly */
  @media(max-width:560px) {
    .stats-grid { grid-template-columns:1fr 1fr!important; }
    .stat-cell  { border-right:none!important; border-bottom:1px solid var(--border)!important; }
    .stat-cell:nth-child(odd)  { border-right:1px solid var(--border)!important; }
    .stat-cell:nth-last-child(-n+2) { border-bottom:none!important; }
  }

  /* About: two-col → one-col */
  @media(max-width:720px) { .about-grid { grid-template-columns:1fr!important; } }

  /* About card action buttons: let them wrap on tiny screens */
  @media(max-width:360px) { .about-card-actions { flex-direction:column!important; } }

  /* Team/advisors: single col on very narrow */
  @media(max-width:340px) { .team-grid { grid-template-columns:1fr!important; } }

  /* Article: drop sidebar below content */
  @media(max-width:860px) {
    .article-grid    { grid-template-columns:1fr!important; }
    .article-sidebar { position:static!important; }
  }

  /* Article author row: stack vertically on phones */
  @media(max-width:520px) {
    .author-row              { flex-direction:column!important; align-items:flex-start!important; }
    .author-row .view-orig   { margin-left:0!important; }
  }

  /* Blog featured card: hide the decorative left panel on mobile */
  @media(max-width:600px) {
    .featured-grid   { grid-template-columns:1fr!important; }
    .featured-visual { display:none!important; }
  }

  /* Footer: 4-col → 2-col → 1-col */
  @media(max-width:800px) { .footer-grid { grid-template-columns:1fr 1fr!important; } }
  @media(max-width:460px) { .footer-grid { grid-template-columns:1fr!important; } }

  /* Hero CTA buttons: stack on very small screens */
  @media(max-width:380px) {
    .hero-ctas         { flex-direction:column!important; }
    .hero-ctas > *     { width:100%!important; text-align:center!important; box-sizing:border-box!important; }
  }

  /* Reduce vertical section padding on mobile */
  @media(max-width:600px) {
    .sec { padding-top:64px!important; padding-bottom:64px!important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value:"2018", label:"Founded",             suffix:"" },
  { value:"5",    label:"Day Annual Workshop",  suffix:"+" },
  { value:"6",    label:"Years Active",         suffix:"+" },
  { value:"100",  label:"Members & Growing",    suffix:"s" },
];

const MISSION_ITEMS = [
  { icon:"◉", title:"Community & Events",        desc:"Build a strong networking platform for AI, ML, and Data Science enthusiasts across Nepal and globally, while organizing impactful workshops, seminars, guest lectures, hackathons, and conferences." },
  { icon:"◎", title:"Research & Innovation",     desc:"Drive research excellence through publications, blogs, and peer-reviewed papers. Bridge the gap between industry and academia by supporting students and researchers while fostering collaboration to translate ideas into real-world solutions and startups." },
  { icon:"◐", title:"Digital Nepal",             desc:"Bridge the urban-rural divide by promoting AI, digital literacy, and technology-driven solutions for the inclusive development of rural Nepal." },
  { icon:"◆", title:"Skill & Talent Development",desc:"Equip the next generation with industry-relevant skills through bootcamps, structured training programs, mentorship, and certification pathways in AI and Data Science." },
];

const TEAM = [
  { name:"Mr. Surya Bahadur Basnet",  role:"Principal",                               location:"Sankalpa College, Nepal",           url:"https://www.linkedin.com/in/surya-bdr-basnet-554859172/",  initials:"SB", color:"#fb923c" },
  { name:"Dr. Jhanak Parajuli",       role:"Data Scientist & Global Program Manager", location:"Germany",                           url:"https://www.linkedin.com/in/jhanak-parajuli-41a29635/",    initials:"JP", color:"#4f9cf9" },
  { name:"Dr. Tej Bahadur Shahi",     role:"Researcher",                              location:"CQUniversity, Australia",           url:"https://scholar.google.com/citations?user=t7kVlfIAAAAJ",   initials:"TS", color:"#34d399" },
  { name:"Dr. Sarbagya Ratna Shakya", role:"Asst. Professor",                         location:"Eastern New Mexico University, USA",url:"https://sites.google.com/view/sarbagyashakya/home",        initials:"SR", color:"#a78bfa" },
  { name:"Mr. Ashok Kumar Pant",      role:"CTO & Co-founder",                        location:"Treeleaf, Nepal",                   url:"https://www.linkedin.com/in/asokpant/",                    initials:"AP", color:"#f472b6" },
  { name:"Mr. Dilip Yogi",            role:"Application Architect",                   location:"ABC Fitness Solution, USA",         url:"https://www.linkedin.com/in/yogidilip/",                   initials:"DY", color:"#facc15" },
];

const ADVISORS = [
  { name:"Prof. Dr. Manish Pokharel",       role:"Dean, School of Engineering",                              location:"Kathmandu University, Nepal",      url:"https://ku.edu.np/contact-detail/18",                                            initials:"MP", color:"#60a5fa" },
  { name:"Ass. Prof. Reg Bahadur Bhandari", role:"Registrar",                                                location:"Lumbini Technological University", url:"https://www.linkedin.com/in/associate-professor-reg-bahadur-bhandari-b6436125/", initials:"RB", color:"#c084fc" },
  { name:"Dr. Binod Bhattarai",             role:"Asst. Prof. Univ. of Aberdeen / Chief AI Scientist",       location:"UK",                               url:"https://scholar.google.com/citations?user=PDEi58sAAAAJ",                         initials:"BB", color:"#a78bfa" },
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

const POSTS = [
  {
    id:"kaggle", slug:"kaggle_i",
    title:"Kaggle: The Best Place to Start Machine Learning and Data Science",
    excerpt:"Whether you're a beginner or a seasoned data scientist, Kaggle offers competitions, datasets and community kernels that accelerate your ML journey significantly.",
    tag:"Learning", tagColor:"#4f9cf9",
    author:"Dr. Jhanak Parajuli", authorRole:"Data Scientist, Germany",
    date:"2020", readTime:"8 min read",
    url:"https://sites.google.com/view/mldsnorg/blog/kaggle_i",
    content:`
      <p>Either you are a beginner or a proficient data scientist and/or machine learning engineer, there is always a lot to learn from <a href="https://www.kaggle.com/" target="_blank">Kaggle</a>. Kaggle is a competition platform and provides us with a variety of datasets. You can also read very interesting kernels written by many competitors — it is really helpful to understand different perspectives from different data scientists.</p>
      <h2>Getting Started as a Beginner</h2>
      <p>If you are a beginner, try a very simple competition such as <a href="https://www.kaggle.com/c/titanic" target="_blank">the Titanic dataset</a>. Though there is no single solid step-by-step approach to solve any data science problem, it is always useful to know some initial steps before attacking any task.</p>
      <h2>The Four Core Steps</h2>
      <ol class="step-list">
        <li><div class="step-num">1</div><div><strong>Understand the Problem</strong><br/>Be clear on what you are doing or expected to solve before attacking any problem. It gives you a big picture and some expectation about the results.</div></li>
        <li><div class="step-num">2</div><div><strong>Collect the Requirements</strong><br/>The most important requirement is data. You need proper information about what data is needed and what sources to obtain it from. Data types, sizes and sources may vary. Data engineers can help in this section.</div></li>
        <li><div class="step-num">3</div><div><strong>Know the Data Architecture</strong><br/>Every organisation has its own data architecture — support for data storage (SQL, NoSQL), data in motion (real-time access), data governance and ETL. This gives a clear feeling on how to handle further steps such as data wrangling, feature engineering, hyperparameter tuning and applying relevant ML or deep learning algorithms.</div></li>
        <li><div class="step-num">4</div><div><strong>Prepare the Data Dictionary</strong><br/>This is the initial data analysis approach, where you understand the parameters and features of your dataset. You need to understand what each term means and why it exists. Get rid of unwanted data from your model.</div></li>
      </ol>
      <h2>Case Study: The Titanic Dataset</h2>
      <p>The Titanic dataset is the perfect starting point. Here is the full data dictionary you need before modelling:</p>
      <div class="data-table-wrap"><table class="data-table">
        <thead><tr><th>Field</th><th>Description</th><th>Values</th></tr></thead>
        <tbody>
          <tr><td><code>Survived</code></td><td>Survival status</td><td>0 = No, 1 = Yes</td></tr>
          <tr><td><code>Pclass</code></td><td>Ticket class (proxy for SES)</td><td>1 = 1st, 2 = 2nd, 3 = 3rd</td></tr>
          <tr><td><code>Sex</code></td><td>Gender</td><td>Male or Female</td></tr>
          <tr><td><code>Age</code></td><td>Age in years</td><td>Numeric</td></tr>
          <tr><td><code>SibSp</code></td><td>Siblings / spouses aboard</td><td>Numeric count</td></tr>
          <tr><td><code>Parch</code></td><td>Parents / children aboard</td><td>Numeric count</td></tr>
          <tr><td><code>Fare</code></td><td>Passenger fare</td><td>Numeric</td></tr>
          <tr><td><code>Embarked</code></td><td>Port of embarkation</td><td>C = Cherbourg, Q = Queenstown, S = Southampton</td></tr>
        </tbody>
      </table></div>
      <div class="callout">
        <div class="callout-title">Variable Notes</div>
        <ul>
          <li><strong>Pclass</strong> is a proxy for socio-economic status — 1st = Upper, 2nd = Middle, 3rd = Lower.</li>
          <li><strong>Age</strong> is fractional if less than 1. Estimated ages appear as xx.5.</li>
          <li><strong>SibSp</strong> counts siblings and spouses (mistresses and fiancés excluded).</li>
          <li><strong>Parch</strong> counts parents and children. Some children travelled only with a nanny, so parch=0 for them.</li>
        </ul>
      </div>
      <h2>Going Further</h2>
      <p>Follow <a href="https://www.kaggle.com/jparajuli/data-exploration-encoding-and-ml-in-titanic" target="_blank">this kernel</a> created by Dr. Jhanak Parajuli on Kaggle to understand the detailed steps and analysis for the Titanic dataset — including data exploration, encoding and applying ML models end-to-end.</p>
      <blockquote>Kaggle is not just a competition platform — it is a learning community. Every kernel you read teaches you something a textbook never could.</blockquote>
    `,
  },
  {
    id:"linear-algebra", slug:"linear_algebra_i",
    title:"Linear Algebra for Machine Learning (Part I)",
    excerpt:"Vectors, matrices and transformations form the mathematical backbone of every ML algorithm. This guide builds intuition before formulas.",
    tag:"Mathematics", tagColor:"#a78bfa",
    author:"MLDSN Nepal", authorRole:"Editorial Team",
    date:"2020", readTime:"10 min read",
    url:"https://sites.google.com/view/mldsnorg/blog/linear_algebra_i",
    content:`
      <p>Machine learning algorithms operate almost entirely on numbers arranged in specific structures — vectors and matrices. Without a working understanding of linear algebra, many ML concepts remain opaque. This guide builds geometric intuition first and introduces notation second.</p>
      <h2>Why Linear Algebra Matters in ML</h2>
      <p>Every dataset you work with is a matrix. Every neural network layer performs a matrix multiplication. Principal Component Analysis (PCA) uses eigenvectors. Image data is stored as multi-dimensional arrays. Understanding these mathematical objects is not optional — it is the foundation.</p>
      <div class="callout">
        <div class="callout-title">Core objects you need to master</div>
        <ul>
          <li><strong>Scalars</strong> — single numbers (e.g. a learning rate of 0.01)</li>
          <li><strong>Vectors</strong> — ordered lists of numbers representing a point or direction in space</li>
          <li><strong>Matrices</strong> — rectangular grids of numbers; the workhorse of ML computation</li>
          <li><strong>Tensors</strong> — generalised multi-dimensional arrays (what PyTorch and TensorFlow store data in)</li>
        </ul>
      </div>
      <h2>Vectors: Intuition First</h2>
      <p>Think of a vector as an arrow in space. A 2D vector <code>[3, 4]</code> points 3 units right and 4 units up from the origin. In ML, a single data point (e.g. a person with height=170cm, weight=65kg) is represented as a vector <code>[170, 65]</code>.</p>
      <p>Key vector operations:</p>
      <ul>
        <li><strong>Addition</strong> — add element-wise; geometrically chains two arrows</li>
        <li><strong>Scalar multiplication</strong> — stretches or shrinks the arrow</li>
        <li><strong>Dot product</strong> — measures how aligned two vectors are; fundamental to similarity and attention</li>
        <li><strong>Norm (length)</strong> — <code>||v|| = sqrt(v1^2 + v2^2 + ... + vn^2)</code>; used in regularisation</li>
      </ul>
      <h2>Matrices: The Workhorses</h2>
      <p>A matrix is a 2D array of numbers with <em>m</em> rows and <em>n</em> columns, written as an <em>m x n</em> matrix. In ML your dataset of 1000 samples with 20 features is a <code>1000 x 20</code> matrix.</p>
      <h3>Matrix Multiplication</h3>
      <p>Given matrix <strong>A</strong> (m x k) and matrix <strong>B</strong> (k x n), their product <strong>C = AB</strong> is (m x n). The element at row i, column j of C is the dot product of row i of A with column j of B. This is exactly what a neural network layer does.</p>
      <h2>Transformations: Seeing the Geometry</h2>
      <p>Every matrix represents a geometric transformation of space:</p>
      <ul>
        <li><strong>Rotation</strong> — spins vectors around the origin</li>
        <li><strong>Scaling</strong> — stretches or compresses along axes</li>
        <li><strong>Shear</strong> — slants the grid diagonally</li>
        <li><strong>Projection</strong> — squashes higher-dimensional vectors into a lower-dimensional subspace (core to PCA)</li>
      </ul>
      <blockquote>A matrix does not just hold numbers — it encodes a transformation of space. Learning to see this is what separates a practitioner from someone who merely applies formulas.</blockquote>
      <h2>What's Coming in Part II</h2>
      <p>Part II will cover <strong>eigenvalues and eigenvectors</strong> (the engine of PCA), <strong>matrix decompositions</strong> (SVD, LU), and <strong>solving systems of linear equations</strong> as they appear in linear regression and optimisation.</p>
    `,
  },
  {
    id:"probability", slug:"probability_i",
    title:"Probability for Machine Learning (Part I)",
    excerpt:"From Bayes' theorem to probability distributions — mastering the statistical thinking required to reason under uncertainty in ML systems.",
    tag:"Mathematics", tagColor:"#34d399",
    author:"MLDSN Nepal", authorRole:"Editorial Team",
    date:"2020", readTime:"9 min read",
    url:"https://sites.google.com/view/mldsnorg/blog/probability_i",
    content:`
      <p>Machine learning is fundamentally about making decisions under uncertainty. A model never knows the truth — it estimates the likelihood of different outcomes from data. Probability theory gives us the language to reason about this uncertainty rigorously.</p>
      <h2>Why Probability Underpins ML</h2>
      <ul>
        <li>A classifier outputs <strong>probabilities</strong> over classes, not hard labels</li>
        <li>Loss functions like cross-entropy come from <strong>maximum likelihood estimation</strong></li>
        <li>Regularisation (L2) corresponds to placing a <strong>Gaussian prior</strong> on weights</li>
        <li>Generative models (VAEs, diffusion models) learn <strong>distributions over data</strong></li>
      </ul>
      <h2>Core Concepts</h2>
      <h3>Conditional Probability</h3>
      <p>The probability of event A <em>given</em> event B has occurred is:</p>
      <div class="callout">
        <div class="callout-title">Formula</div>
        <strong>P(A | B) = P(A and B) / P(B)</strong>, where P(B) &gt; 0
      </div>
      <p>In ML: "What is the probability this email is spam, <em>given</em> it contains the word 'prize'?" is a conditional probability question.</p>
      <h3>Bayes Theorem</h3>
      <div class="callout">
        <div class="callout-title">Bayes Theorem</div>
        <strong>P(A | B) = P(B | A) x P(A) / P(B)</strong>
        <ul style="margin-top:10px">
          <li><strong>P(A)</strong> — Prior: what we believed before seeing B</li>
          <li><strong>P(B | A)</strong> — Likelihood: how probable is B if A is true</li>
          <li><strong>P(A | B)</strong> — Posterior: updated belief after seeing B</li>
        </ul>
      </div>
      <h2>Key Probability Distributions</h2>
      <div class="data-table-wrap"><table class="data-table">
        <thead><tr><th>Distribution</th><th>Type</th><th>ML Use Case</th></tr></thead>
        <tbody>
          <tr><td><code>Bernoulli</code></td><td>Discrete</td><td>Binary classification outputs</td></tr>
          <tr><td><code>Categorical</code></td><td>Discrete</td><td>Multi-class classification (softmax)</td></tr>
          <tr><td><code>Gaussian (Normal)</code></td><td>Continuous</td><td>Weight initialisation, noise modelling</td></tr>
          <tr><td><code>Beta</code></td><td>Continuous</td><td>Bayesian A/B testing, priors over probabilities</td></tr>
          <tr><td><code>Dirichlet</code></td><td>Continuous</td><td>Topic models (LDA), priors over distributions</td></tr>
        </tbody>
      </table></div>
      <h3>The Gaussian Distribution</h3>
      <p>The Gaussian <code>N(mu, sigma^2)</code> is the most widely used distribution in ML. Its bell curve is characterised by mean <strong>mu</strong> (centre) and variance <strong>sigma^2</strong> (spread). By the Central Limit Theorem, averages of many independent random variables tend towards a Gaussian.</p>
      <blockquote>Understanding probability means building the intuition to ask "what do we know, what don't we know, and how confident should we be?" That mindset is the core skill in ML.</blockquote>
      <h2>What's Coming in Part II</h2>
      <p>Part II will cover <strong>maximum likelihood estimation</strong>, <strong>information theory</strong> (entropy, KL divergence, cross-entropy loss), and how these tools connect directly to training neural networks.</p>
    `,
  },
  {
    id:"llm-journey",
    slug:"llm_journey_opportunities",
    title:"The LLM Journey: From Text Prediction to Intelligent Agents — and What It Means for Nepal",
    excerpt:"Large language models have evolved from simple autocomplete systems into reasoning agents that write code, pass professional exams, and power entire products. Here is how we got here, and why the opportunity for Nepal has never been greater.",
    tag:"AI & LLMs", tagColor:"#f472b6",
    author:"MLDSN Nepal", authorRole:"Editorial Team",
    date:"2025", readTime:"7 min read",
    content:`
      <p>Not long ago, a language model was a specialised research tool — impressive in a seminar room, but far from the world's daily life. That changed in November 2022, when ChatGPT crossed one million users in five days. Since then, large language models (LLMs) have moved faster than almost any technology in history, and the question for every student, researcher, and practitioner in Nepal is no longer <em>should I pay attention to this?</em> — it is <em>how do I make the most of it?</em></p>

      <h2>How We Got Here: A Brief Timeline</h2>
      <p>The story of LLMs begins with the <strong>Transformer architecture</strong>, introduced by Google researchers in the landmark 2017 paper "Attention Is All You Need." Transformers replaced the sequential processing of earlier recurrent networks with a mechanism called self-attention, allowing models to process entire sequences in parallel and to weigh the relevance of every word against every other word simultaneously. This architectural leap made scaling practical.</p>
      <p>GPT-1 (2018) and BERT (2018) were the first wave. GPT-3 (2020), with its 175 billion parameters, was the moment that made the broader world pay attention — it could write essays, answer questions, and translate languages without being explicitly trained on any specific task. The key insight was that a large enough model, trained on enough text, develops broad capabilities that were never directly programmed.</p>
      <p>Then came the alignment era. Instruction-tuning and Reinforcement Learning from Human Feedback (RLHF) transformed raw language models into assistants that actually followed instructions, declined harmful requests, and gave useful answers. ChatGPT, Claude, and Gemini were all products of this phase.</p>

      <div class="callout">
        <div class="callout-title">Key Milestones at a Glance</div>
        <ul>
          <li><strong>2017</strong> — Transformer architecture introduced by Google</li>
          <li><strong>2020</strong> — GPT-3 demonstrates few-shot generalisation at scale</li>
          <li><strong>2022</strong> — ChatGPT launches; one million users in five days</li>
          <li><strong>2024</strong> — GPT-4o brings real-time multimodal interaction (text, voice, image)</li>
          <li><strong>Jan 2025</strong> — DeepSeek R1: open-source reasoning model rivalling closed frontier models at a fraction of the cost</li>
          <li><strong>2025</strong> — Agentic AI: LLMs that plan, use tools, and complete multi-step tasks autonomously</li>
        </ul>
      </div>

      <h2>The Two Biggest Shifts of 2024–2025</h2>
      <h3>1. From Assistants to Reasoners</h3>
      <p>Until 2024, most LLMs worked by pattern-matching at impressive scale — they were, in a sense, very sophisticated autocomplete systems. The release of OpenAI o1 and, shortly after, DeepSeek R1 in January 2025 marked a qualitative shift: <strong>reasoning models</strong>. These systems use chain-of-thought processing and reinforcement learning to actually work through problems step by step before giving an answer. DeepSeek R1, released under an open MIT licence, achieved benchmark results comparable to OpenAI's best reasoning model — and was reported to cost approximately 95% less to train and deploy. This democratised access to frontier-level reasoning, making it available to researchers and developers who could not afford expensive API calls.</p>

      <h3>2. From Chatbots to Agents</h3>
      <p>The second major shift is the move from question-and-answer chatbots to <strong>agentic AI</strong> — systems that can plan a sequence of actions, call external tools (APIs, databases, code interpreters, web browsers), remember context across sessions, and correct their own mistakes. In 2025, AI-assisted code now accounts for nearly half of all new software written, according to GitHub's annual report. Agentic workflows are beginning to change how entire professions operate — not just individual tasks, but the shape of work itself.</p>

      <h2>The State of LLMs Today</h2>
      <p>As of 2025, the global LLM market was valued at over $6 billion and is projected to reach $36 billion by 2030. ChatGPT alone has more than 200 million monthly active users. But raw user numbers only tell part of the story. The more significant development is the <strong>bifurcation of the field</strong> into two distinct tracks.</p>
      <p>On one side are the closed frontier models — GPT-5, Claude Opus, and Gemini Ultra — which push the boundaries of what is possible with very large compute budgets. GPT-5, released in 2025, introduced a 400,000-token context window and reduced hallucination rates to roughly 6%. On the other side, the open-source ecosystem — Llama, Mistral, Qwen, and now DeepSeek — has produced models that run on modest hardware and can be fine-tuned for specific domains without sharing sensitive data with any third party.</p>
      <p>This distinction matters enormously for organisations in Nepal and across the developing world. You no longer need to rely solely on expensive proprietary APIs. A well-chosen open model, fine-tuned on domain-specific data, can outperform a generic frontier model on a specific task — and run on infrastructure you control.</p>

      <h2>Opportunities: Where Should Nepal Focus?</h2>
      <p>Nepal's government has already announced a national ambition to develop a Nepali-language LLM, and the country's National AI Policy (2025) explicitly targets AI for socio-economic development. But building a full-scale LLM from scratch is not the only — or even the most practical — path forward. The real opportunities lie in several more accessible directions.</p>

      <ol class="step-list">
        <li>
          <div class="step-num">1</div>
          <div>
            <strong>Nepali Language AI</strong><br/>
            Current off-the-shelf LLMs perform poorly on low-resource languages like Nepali. Fine-tuning an existing open-source model on high-quality Nepali text — news, literature, government documents, educational content — is both achievable and high-impact. It could power better search, government services, educational tools, and healthcare information for millions of people who are not fluent in English.
          </div>
        </li>
        <li>
          <div class="step-num">2</div>
          <div>
            <strong>Education and Personalised Tutoring</strong><br/>
            A 2025 study assessing LLMs against Nepal's K-10 curriculum found that while current models show promise, they lack cultural scaffolding — the ability to connect concepts to a Nepali learner's lived experience. This gap is an open research problem. Students and researchers at Nepali universities are uniquely positioned to build localised educational AI that global labs are not incentivised to create.
          </div>
        </li>
        <li>
          <div class="step-num">3</div>
          <div>
            <strong>Agriculture and Rural Development</strong><br/>
            Nepal's economy is largely agricultural. LLM-powered advisory tools — accessible via SMS or voice for farmers without smartphones — could deliver crop disease detection, weather interpretation, and market price guidance. Several successful pilots in similar contexts (India, Kenya, Bangladesh) show this is viable at low cost using fine-tuned smaller models.
          </div>
        </li>
        <li>
          <div class="step-num">4</div>
          <div>
            <strong>Healthcare Information Access</strong><br/>
            With a shortage of doctors relative to population, especially in rural areas, AI-assisted triage and health information tools could meaningfully extend the reach of Nepal's healthcare system. LLMs trained on Nepali medical literature and guidelines, combined with rigorous safety constraints, represent a serious research and product opportunity.
          </div>
        </li>
        <li>
          <div class="step-num">5</div>
          <div>
            <strong>Research and Publications</strong><br/>
            The global LLM research community is producing hundreds of papers per week. Nepali researchers who build expertise in areas like fine-tuning, evaluation, multilingual NLP, or AI safety can contribute meaningfully to this literature and build international collaborations. The tools to do serious LLM research — open models, cloud compute grants, and public datasets — are more accessible than ever.
          </div>
        </li>
        <li>
          <div class="step-num">6</div>
          <div>
            <strong>Careers and the Global Remote Economy</strong><br/>
            Prompt engineering, LLM application development, fine-tuning, and AI product management are skills in extreme global demand. A Nepali developer with strong LLM skills can work for international companies remotely — a genuine pathway to high-income employment that did not exist five years ago.
          </div>
        </li>
      </ol>

      <h2>A Note on Responsibility</h2>
      <p>LLMs are not without risk. They hallucinate — producing confident-sounding but false information. They can reflect and amplify the biases present in their training data. They raise genuine questions about copyright, consent, and job displacement. Any serious practitioner working with these systems must engage with these questions, not just the capabilities. Building AI literacy in Nepal means building critical AI literacy — understanding both what these systems can do and what they should not be trusted to do without human oversight.</p>

      <blockquote>The countries and communities that will benefit most from the LLM era are not necessarily those with the largest compute budgets. They are those who develop the skills to adapt these tools to their own languages, problems, and contexts. Nepal has both the need and the talent. What it needs now is focused effort.</blockquote>

      <h2>Getting Started</h2>
      <p>If you are new to LLMs, the most practical starting point is hands-on experimentation. Use the free tiers of ChatGPT, Claude, or Gemini. Read the original Transformer paper and the GPT-3 paper to understand the foundations. Explore Hugging Face to see the breadth of available open models. Follow the MLDSN Nepal blog and community for local context, events, and collaborative opportunities. The LLM journey is one of the most important technological journeys of our generation — and it is very much still in its early chapters.</p>
    `,
  },
];

const TIMELINE_COLORS = ["var(--accent)","var(--accent2)","var(--green)","var(--orange)"];

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
function Tag({ children, color = "var(--accent)" }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 10px", borderRadius:4,
      fontSize:11, fontFamily:"var(--ff-mono)", letterSpacing:".08em",
      fontWeight:500, textTransform:"uppercase",
      background:`${color}18`, border:`1px solid ${color}44`, color,
    }}>{children}</span>
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

  // If already on home: scroll immediately.
  // If on another page: navigate first, then scroll after paint.
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
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      padding:"0 clamp(16px,4vw,60px)",
      background: scrolled ? "rgba(8,12,16,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition:"all .3s ease",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      height:64,
    }}>
      {/* Logo */}
      <button onClick={() => { navigate("home"); window.scrollTo({ top:0, behavior:"smooth" }); }}
        style={{ background:"none", border:"none", display:"flex", alignItems:"center", gap:10, padding:0, flexShrink:0 }}>
        <div style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,var(--accent),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:13, color:"#fff", letterSpacing:".04em", flexShrink:0 }}>ML</div>
        <div style={{ textAlign:"left" }}>
          <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:15, color:"var(--text)", lineHeight:1.1 }}>MLDSN Nepal</div>
          <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".05em" }}>ML & Data Science Network</div>
        </div>
      </button>

      {/* Desktop links */}
      <div className="desktop-nav" style={{ display:"flex", gap:2, alignItems:"center" }}>
        {links.map(l => (
          <button key={l.label} onClick={l.action}
            style={{
              padding:"7px 14px", borderRadius:6, fontSize:13, fontWeight:500, border:"none",
              background:(isBlog && l.label==="Blog") ? "rgba(79,156,249,0.08)" : "transparent",
              color:(isBlog && l.label==="Blog") ? "var(--accent)" : "var(--sub)",
              transition:"color .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color="var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color=(isBlog && l.label==="Blog") ? "var(--accent)" : "var(--sub)"}
          >{l.label}</button>
        ))}
        <Btn href="https://sites.google.com/view/mldsnorg/become-a-member" primary small style={{ marginLeft:8 }}>Join Network</Btn>
      </div>

      {/* Mobile hamburger — hidden on desktop via CSS */}
      <button className="hamburger" onClick={() => setMenuOpen(v => !v)}
        style={{ background:"none", border:"none", color:"var(--text)", fontSize:22, display:"none", padding:"6px 8px", lineHeight:1 }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position:"fixed", top:64, left:0, right:0, bottom:0,
          background:"rgba(8,12,16,0.98)", backdropFilter:"blur(20px)",
          padding:"20px 24px 40px", display:"flex", flexDirection:"column",
          zIndex:199, overflowY:"auto",
        }}>
          {links.map(l => (
            <button key={l.label} onClick={() => { l.action(); setMenuOpen(false); }}
              style={{
                padding:"16px 0", fontSize:17, fontFamily:"var(--ff-body)", fontWeight:600,
                color:"var(--text)", background:"none", border:"none",
                borderBottom:"1px solid var(--border)", textAlign:"left",
              }}>
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

// ─── STATS TICKER ─────────────────────────────────────────────────────────────
function StatsTicker() {
  return (
    <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"var(--surface)", padding:"0 clamp(16px,5vw,60px)" }}>
      {/* stats-grid: 4 cols on desktop, 2x2 on mobile via CSS class */}
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
                <a key={l} href={h} target="_blank"
                  style={{ flex:"1 1 110px", padding:"10px 8px", borderRadius:8, textAlign:"center", background:bg, border:`1px solid ${bd}`, color:c, fontSize:13, fontWeight:600, transition:"opacity .2s" }}
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
            <div key={i}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"24px 20px", transition:"border-color .25s,transform .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ width:44, height:44, borderRadius:10, marginBottom:16,
                background:`linear-gradient(135deg,${["rgba(79,156,249,.15)","rgba(167,139,250,.15)","rgba(52,211,153,.15)","rgba(251,146,60,.15)"][i]},transparent)`,
                border:`1px solid ${["rgba(79,156,249,.25)","rgba(167,139,250,.25)","rgba(52,211,153,.25)","rgba(251,146,60,.25)"][i]}`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                color:["var(--accent)","var(--accent2)","var(--green)","var(--orange)"][i] }}>{item.icon}</div>
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
                <div style={{ flexShrink:0, position:"relative" }}>
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

// ─── TEAM ─────────────────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)", background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>The People</SectionLabel>
        <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em", marginBottom:8 }}>Core Team</h2>
        <p style={{ color:"var(--sub)", marginBottom:40, maxWidth:500, fontSize:".95rem" }}>Volunteers from academia, industry, and research — united by the mission to grow Nepal's AI ecosystem.</p>
        {/* minmax(260px) prevents cards from exceeding viewport on small phones */}
        <div className="team-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14, marginBottom:48 }}>
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

        <div style={{ borderTop:"1px solid var(--border)", paddingTop:40 }}>
          <h3 style={{ fontFamily:"var(--ff-head)", fontWeight:600, fontSize:"1.1rem", marginBottom:20, color:"var(--accent2)" }}>Advisory Board</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
            {ADVISORS.map((m, i) => (
              <a key={i} href={m.url||"#"} target="_blank"
                style={{ display:"flex", alignItems:"center", gap:12, background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px", transition:"all .2s", textDecoration:"none" }}
                onMouseEnter={e => e.currentTarget.style.borderColor=`${m.color}44`}
                onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                <div style={{ width:40, height:40, borderRadius:"50%", flexShrink:0, background:`${m.color}20`, border:`1.5px solid ${m.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:13, color:m.color }}>{m.initials}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:".88rem", color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{m.role} · {m.location}</div>
                </div>
              </a>
            ))}
          </div>
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
            <div key={i}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", transition:"all .25s" }}
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

// ─── HOME BLOG PREVIEW ────────────────────────────────────────────────────────
function HomeBlog({ navigate }) {
  return (
    <section id="blog" className="sec" style={{ padding:"100px clamp(16px,6vw,80px)", background:"var(--surface)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel>Knowledge Hub</SectionLabel>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:14 }}>
          <h2 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.45rem,2.4vw,2.1rem)", lineHeight:1.25, letterSpacing:"-0.02em" }}>Recent Blog Posts</h2>
          <button onClick={() => navigate("blog")}
            style={{ padding:"9px 20px", borderRadius:8, border:"1px solid var(--border2)", color:"var(--sub)", fontSize:13, fontWeight:500, transition:"all .2s", background:"none", whiteSpace:"nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="var(--sub)"; e.currentTarget.style.borderColor="var(--border2)"; }}>All Posts →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
          {POSTS.map((p, i) => (
            <div key={i} onClick={() => navigate("article", p)}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"24px 20px", cursor:"pointer", transition:"all .25s" }}
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
        {/* footer-grid: 4-col → 2-col → 1-col via media queries */}
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"clamp(24px,4vw,40px)", marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,var(--accent),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:13, color:"#fff", letterSpacing:".04em", flexShrink:0 }}>ML</div>
              <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:15 }}>MLDSN Nepal</div>
            </div>
            <p style={{ color:"var(--muted)", fontSize:".87rem", lineHeight:1.75, maxWidth:260, marginBottom:20 }}>A non-profit community advancing machine learning and data science education across Nepal since 2018.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <a href="mailto:aimldsn@gmail.com" style={{ color:"var(--sub)", fontSize:".85rem", transition:"color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color="var(--sub)"}>✉ aimldsn@gmail.com</a>
              <span style={{ color:"var(--sub)", fontSize:".85rem" }}>📞 +977 9851158281</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:".85rem", marginBottom:14, color:"var(--text)" }}>Quick Links</div>
            {[["NWMLDS 2021","hhttps://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2021"],
              ["NWMLDS 2020","https://sites.google.com/view/mldsnorg/news-and-events/events/nwmlds-2020"],
              ["Research & Career","https://sites.google.com/view/mldsnorg/research-career"],
              ["Become a Member","https://sites.google.com/view/mldsnorg/become-a-member"]].map(([l,h]) => (
              <a key={l} href={h} target="_blank"
                style={{ display:"block", color:"var(--muted)", fontSize:".85rem", marginBottom:10, transition:"color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:".85rem", marginBottom:14, color:"var(--text)" }}>Recent Blogs</div>
            {POSTS.map(p => (
              <button key={p.id} onClick={() => navigate("article", p)}
                style={{ display:"block", background:"none", border:"none", textAlign:"left", color:"var(--muted)", fontSize:".83rem", marginBottom:10, lineHeight:1.4, transition:"color .2s", cursor:"pointer", padding:0 }}
                onMouseEnter={e => e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}>{p.title}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:"var(--ff-body)", fontWeight:600, fontSize:".85rem", marginBottom:14, color:"var(--text)" }}>Community</div>
            {[["👥 Facebook Group","https://www.facebook.com/groups/217595548832685","var(--accent)","rgba(79,156,249,0.07)","rgba(79,156,249,0.18)","rgba(79,156,249,0.15)"],
              ["📅 Events","https://sites.google.com/view/mldsnorg/news-and-events/events","var(--accent2)","rgba(167,139,250,0.07)","rgba(167,139,250,0.18)","rgba(167,139,250,0.15)"]].map(([l,h,c,bg,bd,hbg]) => (
              <a key={l} href={h} target="_blank"
                style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:8, marginBottom:10, background:bg, border:`1px solid ${bd}`, color:c, fontSize:".85rem", fontWeight:600, transition:"all .2s", textDecoration:"none" }}
                onMouseEnter={e => e.currentTarget.style.background=hbg}
                onMouseLeave={e => e.currentTarget.style.background=bg}>{l}</a>
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
      {/* Hero */}
      <div className="mountain-grid" style={{ padding:"72px clamp(16px,6vw,80px) 64px", position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)" }}>
        <div style={{ position:"absolute", top:"20%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,156,249,0.07) 0%,transparent 70%)", animation:"drift 12s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
          <SectionLabel>Knowledge Hub</SectionLabel>
          <h1 style={{ fontFamily:"var(--ff-head)", fontWeight:700, fontSize:"clamp(1.8rem,4vw,3.2rem)", lineHeight:1.15, letterSpacing:"-0.02em", marginBottom:16, animation:"fade-up .55s ease both" }}>
            Blog on{" "}
            <span style={{ background:"linear-gradient(90deg,var(--accent),var(--accent2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Machine Learning</span>
            {" "}& Data Science
          </h1>
          <p style={{ color:"var(--sub)", fontSize:"1rem", maxWidth:520, lineHeight:1.75, marginBottom:28 }}>
            Articles on ML foundations, practical guides and research insights — written by MLDSN Nepal's community of practitioners and researchers.
          </p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {tags.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:500, transition:"all .2s", border:"1px solid",
                  background: filter===t ? "rgba(79,156,249,0.15)" : "transparent",
                  borderColor: filter===t ? "rgba(79,156,249,0.5)" : "var(--border2)",
                  color: filter===t ? "var(--accent)" : "var(--sub)" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px clamp(16px,6vw,80px)" }}>
        {/* Featured card */}
        {filter === "All" && (
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:11, fontFamily:"var(--ff-mono)", color:"var(--muted)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>Featured Post</div>
            <div className="featured-grid" onClick={() => navigate("article", POSTS[0])}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, overflow:"hidden", cursor:"pointer", display:"grid", gridTemplateColumns:"1fr 1fr", transition:"all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(79,156,249,0.35)"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              {/* Decorative panel — hidden on mobile via .featured-visual CSS class */}
              <div className="featured-visual"
                style={{ background:"linear-gradient(135deg,rgba(79,156,249,0.12) 0%,rgba(167,139,250,0.08) 100%)", display:"flex", alignItems:"center", justifyContent:"center", minHeight:220, position:"relative", overflow:"hidden", borderRight:"1px solid var(--border)" }}>
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
                    <div style={{ width:32, height:32, borderRadius:"50%", background:`${POSTS[0].tagColor}22`, border:`1.5px solid ${POSTS[0].tagColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:600, fontSize:11, color:POSTS[0].tagColor, flexShrink:0 }}>JP</div>
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

        {/* Post grid */}
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

        {/* Contribute CTA */}
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
      {/* Article hero */}
      <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"48px clamp(16px,6vw,80px) 40px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 20% 50%,${post.tagColor}08 0%,transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ maxWidth:800, margin:"0 auto", position:"relative" }}>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            <button onClick={() => navigate("blog")}
              style={{ background:"none", border:"none", padding:0, color:"var(--muted)", fontSize:13, display:"flex", alignItems:"center", gap:4, cursor:"pointer", transition:"color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color="var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}>← Blog</button>
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
          {/* Author row — stacks vertically on narrow screens via .author-row class */}
          <div className="author-row" style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`${post.tagColor}22`, border:`1.5px solid ${post.tagColor}55`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--ff-body)", fontWeight:700, fontSize:13, color:post.tagColor, flexShrink:0 }}>
              {post.author.split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:".9rem", color:"var(--text)" }}>{post.author}</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>{post.authorRole}</div>
            </div>
            <a href={post.url} target="_blank" className="view-orig"
              style={{ marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:500, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border2)", color:"var(--sub)", transition:"all .2s", whiteSpace:"nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.borderColor="rgba(79,156,249,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="var(--sub)"; e.currentTarget.style.borderColor="var(--border2)"; }}>View original ↗</a>
          </div>
        </div>
      </div>

      {/* Body + Sidebar — sidebar drops below on mobile via .article-grid class */}
      <div className="article-grid" style={{ maxWidth:1100, margin:"0 auto", padding:"48px clamp(16px,6vw,80px)", display:"grid", gridTemplateColumns:"1fr 280px", gap:"clamp(28px,5vw,56px)", alignItems:"start" }}>
        <article className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} style={{ minWidth:0 }} />
        <aside className="article-sidebar" style={{ position:"sticky", top:80 }}>
          {/* Meta card */}
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"18px", marginBottom:18 }}>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--accent)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>About this post</div>
            {[["Category",post.tag],["Author",post.author],["Read time",post.readTime],["Published",post.date]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:".83rem", gap:8 }}>
                <span style={{ color:"var(--muted)", flexShrink:0 }}>{k}</span>
                <span style={{ color:"var(--text)", fontWeight:500, textAlign:"right", wordBreak:"break-word" }}>{v}</span>
              </div>
            ))}
          </div>
          {/* More posts */}
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"18px", marginBottom:18 }}>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:11, color:"var(--accent)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>More Posts</div>
            {others.map((p, i) => (
              <div key={p.id} onClick={() => navigate("article", p)}
                style={{ paddingBottom: i<others.length-1?14:0, marginBottom: i<others.length-1?14:0, borderBottom: i<others.length-1?"1px solid var(--border)":"none", cursor:"pointer" }}>
                <div style={{ marginBottom:5 }}><Tag color={p.tagColor}>{p.tag}</Tag></div>
                <div style={{ fontSize:".85rem", color:"var(--sub)", lineHeight:1.4, fontWeight:500, transition:"color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color="var(--text)"}
                  onMouseLeave={e => e.currentTarget.style.color="var(--sub)"}>{p.title}</div>
              </div>
            ))}
          </div>
          {/* Join CTA */}
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
  const [page, setPage]         = useState("home");
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    // Ensure viewport meta tag exists — critical for mobile rendering
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
    if (target !== "home" || post) {
      window.scrollTo({ top:0, behavior:"smooth" });
    }
  }, []);

  return (
    <div style={{ minHeight:"100vh" }}>
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

      {page === "blog" && (
        <>
          <BlogList navigate={navigate} />
          <Footer navigate={navigate} />
        </>
      )}

      {page === "article" && activePost && (
        <>
          <ArticleView post={activePost} navigate={navigate} />
          <Footer navigate={navigate} />
        </>
      )}
    </div>
  );
}
