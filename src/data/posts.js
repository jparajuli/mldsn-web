// ─── MARKDOWN PARSER ─────────────────────────────────────────────────────────
// Converts the Markdown written in each post's `content` field into HTML.
//
// Supported syntax:
//   ## Heading 2         → <h2>
//   ### Heading 3        → <h3>
//   **bold**             → <strong>
//   *italic*             → <em>
//   `code`               → <code>
//   > blockquote         → <blockquote>
//   - item  /  * item    → <ul><li>
//   1. item              → <ol><li>
//   [text](url)          → <a target="_blank">
//   ---                  → <hr>
//   blank line           → paragraph break
//
// Special callout box:
//   :::callout Title Here
//   Body text of the callout.
//   :::
// ─────────────────────────────────────────────────────────────────────────────

function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,      "<em>$1</em>")
    .replace(/`(.+?)`/g,        "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
}

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

    // Blank line — skip
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

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────
// HOW TO ADD A NEW POST:
//   1. Copy the template object at the bottom of this file.
//   2. Fill in every field.
//   3. Write the article in the `content` field using Markdown.
//   4. Save — the site picks it up automatically.
//
// BACKTICK NOTE: because the content is a JS template literal, any
// inline code that uses backticks must be escaped: \`like this\`
//
// REQUIRED FIELDS:
//   id         – unique, no spaces  (e.g. "my-post-2025")
//   title      – article heading
//   excerpt    – 1–2 sentence summary shown on cards
//   tag        – badge label        (e.g. "Learning", "AI & LLMs", "Research")
//   tagColor   – hex colour         (e.g. "#4f9cf9")
//   author     – author full name
//   authorRole – role / affiliation shown under the name
//   date       – year or date string (e.g. "2025" or "Jun 2025")
//   readTime   – estimated read     (e.g. "6 min read")
//   url        – "View original" link; use "#" if there is no external URL
//   content    – article body in Markdown
// ─────────────────────────────────────────────────────────────────────────────

const POSTS_RAW = [

  // ── Post 1 ──────────────────────────────────────────────────────────────────
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
`,
  },

  // ── Post 2 ──────────────────────────────────────────────────────────────────
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
- **Norm (length)** — ||v|| = sqrt(v1^2 + v2^2 + ...) used in regularisation

## Matrices: The Workhorses

A matrix is a 2D array with *m* rows and *n* columns. In ML your dataset of 1000 samples with 20 features is a \`1000 x 20\` matrix.

### Matrix Multiplication

Given matrix **A** (m x k) and **B** (k x n), their product **C = AB** is (m x n). Each element is the dot product of a row of A with a column of B — exactly what a neural network layer does.

> A matrix does not just hold numbers — it encodes a transformation of space. Learning to see this separates a practitioner from someone who merely applies formulas.

## What's Coming in Part II

Part II will cover **eigenvalues and eigenvectors** (the engine of PCA), **matrix decompositions** (SVD, LU), and **solving systems of linear equations** as they appear in linear regression and optimisation.
`,
  },

  // ── Post 3 ──────────────────────────────────────────────────────────────────
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
`,
  },

  // ── Post 4 ──────────────────────────────────────────────────────────────────
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
`,
  },

  // ── ADD NEW POSTS BELOW THIS LINE ───────────────────────────────────────────
  // Copy the template below, remove the comment markers, fill it in and save.
  //
  // {
  //   id: "my-new-post",
  //   title: "Your Post Title",
  //   excerpt: "A short 1–2 sentence summary shown on cards and in search.",
  //   tag: "Learning",  tagColor: "#4f9cf9",
  //   author: "Your Name",  authorRole: "Your Role",
  //   date: "2025",  readTime: "5 min read",
  //   url: "#",
  //   content: `
  // Write your post here in Markdown.
  //
  // ## Section Heading
  //
  // Regular paragraph text. **Bold** and *italic* work normally.
  // Use \`inline code\` with escaped backticks.
  //
  // - Bullet one
  // - Bullet two
  //
  // :::callout Note Title
  // This is a highlighted callout box.
  // :::
  //
  // > This becomes a pull quote / blockquote.
  //   `,
  // },

];

// Convert Markdown → HTML at import time (runs once, not on every render)
export const POSTS = POSTS_RAW.map(p => ({
  ...p,
  slug: p.id.replace(/-/g, "_"),
  content: parseMarkdown(p.content),
}));