// ─── MARKDOWN PARSER ─────────────────────────────────────────────────────────
// Converts the Markdown written in each post's `content` field into HTML.
//
// Supported syntax:
//   ## Heading 2         → <h2>
//   ### Heading 3        → <h3>
//   **bold** → <strong>
//   *italic* → <em>
//   `code`                → <code>
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
// REQUIRED FIELDS:
//   id          – unique, no spaces  (e.g. "my-post-2025")
//   title       – article heading
//   excerpt     – 1–2 sentence summary shown on cards
//   tag         – badge label        (e.g. "Learning", "AI & LLMs", "Research")
//   tagColor    – hex colour         (e.g. "#4f9cf9")
//   heroImage   – specific visual header background link
//   author      – author full name
//   authorRole  – role / affiliation shown under the name
//   date        – year or date string (e.g. "2025" or "Jun 2025")
//   readTime    – estimated read     (e.g. "6 min read")
//   url         – "View original" link; use "#" if there is no external URL
//   content     – article body in Markdown
// ─────────────────────────────────────────────────────────────────────────────

const POSTS_RAW = [
  // ── Post 1 ──────────────────────────────────────────────────────────────────
  {
    id: "agentic-ai-startup-concepts",
    title: "5 High-Moat Agentic AI Startup Concepts for 2026: A VC Partner's Playbook",
    excerpt: "Forget chatbot wrappers. These five multi-agent startup concepts target expensive, document-heavy, compliance-driven B2B workflows where deep integrations and proprietary data create durable moats.",
    tag: "AI & LLMs", tagColor: "#f472b6",
    heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    author: "MLDSN Nepal", authorRole: "Editorial Team",
    date: "2025", readTime: "14 min read",
    url: "#",
    content: `
The agentic AI market is moving fast. It was valued at approximately USD 6.23 billion in 2024 and is projected to surge to USD 107.28 billion by 2032, reflecting a CAGR of 42.85%. But most of that capital is flooding into the wrong places — thin LLM wrappers with no defensibility, horizontal copilots with no workflow ownership, and consumer chatbots that compete directly with OpenAI's own products.

The real opportunity in 2026 is narrower and more specific: the more vertical the use case and the more critical the workflow, the more defensible the business tends to be. The startups worth building — and funding — are those that own an end-to-end operational workflow in a regulated, document-heavy, or software-fragmented industry.

Below are five such concepts. Each is grounded in a concrete multi-agent architecture, a genuine moat beyond the model layer, and a paying customer who is currently suffering through an expensive manual process.

---

## Concept 1: Autonomous Clinical Trial Protocol Intelligence (Life Sciences)

### The Specific Workflow

A pharmaceutical company running a Phase II/III clinical trial generates thousands of pages of protocol documents, amendment logs, adverse event reports, regulatory submissions (IND, NDA, EMA dossiers), and site audit trails. Today, a team of 6–10 regulatory affairs specialists spends months reconciling these across multiple systems manually.

The multi-agent replacement:

- **Agent A — Document Ingestion Agent:** Continuously monitors trial management systems (Veeva Vault, Medidata Rave), ingests new PDFs, amendment letters and site correspondence, and classifies them by document type, trial phase, and regulatory jurisdiction.
- **Agent B — Contradiction Detection Agent:** Cross-references the current protocol version against all amendments and site-level deviations. Flags any inconsistency — e.g. a dosing change in Amendment 7 not reflected in the site's dispensing log — with a cited evidence chain.
- **Agent C — Regulatory Mapping Agent:** Uses a fine-tuned model trained on FDA 21 CFR Part 11, ICH E6(R3) GCP guidelines, and EMA guidance to map each flagged inconsistency to the relevant regulatory requirement and generate a prioritised remediation plan.
- **Agent D — Submission Drafting Agent:** Drafts the required regulatory response or safety report in the correct eCTD format, ready for human sign-off before submission.
- **Agent E — Audit Trail Agent:** Maintains a complete, timestamped, human-readable log of every agent decision for FDA inspection readiness.

### The Agentic Moat

The defensibility is not the LLM — it is the proprietary regulatory knowledge graph built from thousands of historical FDA Complete Response Letters, Warning Letters, and approved submission packages. Every customer deployment deepens this graph. The Veeva Vault and Medidata integrations add switching cost: ripping this out means re-validating a GxP-compliant system, which takes 12–18 months.

### Market Validation / Demand

The payer is the Head of Regulatory Affairs at a top-20 pharmaceutical company. A single Phase III trial costs USD 300–600 million to run. Protocol deviations caught late cost USD 2–10 million in remediation and can delay approval by 12+ months. These teams are currently paying for armies of contract research organisation (CRO) staff at USD 150–250/hour to do this manually. A SaaS contract at USD 800K–2M per year per trial programme is an easy ROI conversation.

### Technical Feasibility (2026)

Buildable today. Reasoning models handle long-context document comparison well. The hard engineering is the Veeva/Medidata integration layer and the GxP-compliant audit trail — not the AI itself. Expect 6–9 months to first enterprise pilot.

### Risk Profile

The single point of failure is **hallucinated citations**. If Agent C maps a deviation to the wrong regulatory clause, the company files an incorrect response with the FDA. Mitigation: every regulatory claim must be grounded with an explicit document reference and confidence score, with mandatory human review before any submission leaves the system. The agent never touches the submission button.

---

## Concept 2: Construction Subcontractor Compliance Orchestrator

### The Specific Workflow

A general contractor (GC) managing a USD 200M commercial construction project coordinates 40–80 subcontractors. Before any subcontractor can mobilise on site, the GC must verify insurance certificates (GL, workers comp, umbrella), confirm prevailing wage compliance, check lien waiver status, validate safety certifications (OSHA 10/30), and ensure bonding is current. Today, a compliance team of 3–5 people chases this documentation via email, spreadsheets, and phone calls — continuously, for the 18–36 month project duration.

The multi-agent replacement:

- **Agent A — Document Collection Agent:** Sends automated, escalating requests to subcontractor contacts via email and a self-service portal. Tracks response rates and escalates to the GC's project manager when a subcontractor goes silent for more than 48 hours.
- **Agent B — Document Extraction Agent:** Ingests uploaded insurance certificates (Acord 25, Acord 28), lien waivers, and OSHA cards. Extracts policy numbers, coverage limits, effective/expiry dates, and named insured entities using a specialised document extraction model fine-tuned on construction compliance documents.
- **Agent C — Compliance Verification Agent:** Cross-checks extracted data against the project's contract requirements and applicable state prevailing wage schedules. Flags gaps — e.g. a subcontractor's umbrella policy expiring before project completion, or a coverage limit USD 1M below contractual minimums.
- **Agent D — Remediation Routing Agent:** For each gap, generates a specific, actionable request to the subcontractor ("Your GL policy expires Sept 1 — please upload a renewal certificate showing coverage through Dec 31") and tracks it in the project management system (Procore, Autodesk Construction Cloud).
- **Agent E — Lien Monitoring Agent:** Monitors county recorder databases (via API) for any liens filed against the project address and alerts the GC's legal team within 24 hours.

### The Agentic Moat

Deep integration with Procore and Autodesk Construction Cloud (the two dominant construction project management platforms covering 70%+ of large GC workflows) creates switching cost. The moat deepens over time as the system accumulates a proprietary database of subcontractor compliance histories — enabling risk scoring ("this subcontractor has had lapsed insurance on 3 of their last 5 projects") that no general-purpose tool can replicate.

### Market Validation / Demand

The payer is the VP of Risk or Director of Compliance at a top-50 ENR general contractor. A single uninsured subcontractor incident on a large project can result in a USD 5–20M uninsured liability exposure. These firms currently employ dedicated compliance coordinators at USD 60–90K/year each, plus carry liability from gaps they inevitably miss. The software market for construction risk management is fragmented and outdated — this is a greenfield automation opportunity within an existing, committed budget.

### Technical Feasibility (2026)

Largely buildable today. Document extraction on Acord forms is a solved problem. The county recorder API integrations are patchy (some counties are digital, others are not) — this is the most significant engineering challenge, not the AI. The Procore partnership/integration is the primary go-to-market unlock.

### Risk Profile

The single point of failure is **extraction errors on non-standard insurance certificates**. Brokers produce Acord certificates in dozens of non-standard formats and fonts. If Agent B misreads a coverage limit (e.g. reads USD 1M as USD 10M), the GC believes it is covered when it is not. Mitigation: every extracted value must display its source document highlight for human spot-check, and any certificate with low extraction confidence is automatically flagged for manual review.

---

## Concept 3: Cross-Border Trade Compliance Agent Network (Customs & Logistics)

### The Specific Workflow

A mid-market manufacturer or importer shipping goods across 10–30 countries maintains compliance with a patchwork of customs regulations, export control lists (ECCN, EAR99, ITAR), anti-dumping duty orders, and rapidly changing tariff schedules. Today, this requires a team of licensed customs brokers and trade compliance officers reviewing every shipment classification, denied party screening, and duty calculation manually — often across 5–7 disconnected systems (ERP, customs broker portal, OFAC/BIS databases, HS tariff databases, freight forwarder APIs).

The multi-agent replacement:

- **Agent A — Product Classification Agent:** Ingests product descriptions, technical specs, and bill of materials. Uses a fine-tuned model trained on HTS/ECCN rulings from CBP Binding Ruling Database to propose the correct HS code and ECCN classification, with a confidence score and cited precedent ruling.
- **Agent B — Denied Party Screening Agent:** Runs every counterparty (buyer, seller, freight forwarder, bank) against OFAC SDN, BIS Entity List, EU Consolidated List, and UN Security Council lists in real time at shipment creation. Surfaces fuzzy matches (not just exact matches) with a match confidence score.
- **Agent C — Duty & Tariff Optimisation Agent:** Given the classification and origin, calculates applicable duties under all relevant trade agreements (USMCA, CPTPP, GSP) and identifies preferential treatment opportunities. Flags anti-dumping/countervailing duty orders that apply.
- **Agent D — Document Generation Agent:** Auto-generates commercial invoices, certificates of origin, export control certifications, and FCC/EPA declarations in the correct format for the destination country, pre-populated from the shipment data.
- **Agent E — Regulatory Change Monitor:** Continuously monitors Federal Register, CBP bulletins, BIS rules, and equivalent foreign regulatory feeds. When a rule change affects an existing product line's classification or an active supplier's status, it proactively alerts the compliance team and flags affected open shipments.

### The Agentic Moat

The proprietary data asset is the accumulating database of customer-specific binding ruling precedents, supplier origin certifications, and historical classification decisions — all of which inform more accurate classifications for that customer's specific product catalogue. No off-the-shelf model has this. The ERP integrations (SAP GTS, Oracle GTM) are expensive to implement and create strong switching costs.

### Market Validation / Demand

The payer is the VP of Supply Chain or Chief Compliance Officer at any manufacturer or importer doing more than USD 50M in cross-border trade annually. Customs penalties in the US alone totalled over USD 800M in FY2024. Broker fees average 1–3% of shipment value. A wrong HS code classification on a high-volume product line can result in years of retroactive duty liability. This is an actively painful, well-funded problem.

### Technical Feasibility (2026)

High feasibility. Denied party screening and HS classification are mature NLP problems. The hardest component is Agent E — the regulatory change monitor — which requires reliable, low-latency parsing of poorly structured government regulatory feeds. Expect 9–12 months to a production-ready system.

### Risk Profile

The single point of failure is **a missed denied party match leading to an OFAC violation**. An OFAC civil penalty can reach USD 1M+ per transaction. This means Agent B must operate at recall > 99.9% — false negatives are catastrophic, false positives are merely annoying. The system must be tuned to flag ambiguous matches for mandatory human review rather than auto-clearing them.

---

## Concept 4: Healthcare Prior Authorisation Automation (Revenue Cycle)

### The Specific Workflow

A US hospital or medical group submits thousands of prior authorisation (PA) requests per month to insurance payers. Each PA requires pulling the relevant clinical documentation from the EHR (Epic, Cerner), matching it against the payer's specific medical policy criteria, writing a clinical justification letter, submitting via the payer's portal (each payer has a different portal), tracking status, and managing appeals. A large hospital system employs 20–50 FTE staff purely for this function at a cost of USD 3–5M per year — with a denial rate of 15–25% adding further downstream revenue leakage.

The multi-agent replacement:

- **Agent A — PA Trigger Agent:** Monitors the hospital's order entry system (via Epic SMART on FHIR API). When a physician orders a procedure that requires PA for the patient's specific payer/plan, it automatically initiates the PA workflow without waiting for a human to notice.
- **Agent B — Clinical Evidence Extraction Agent:** Pulls the relevant clinical documentation from the EHR — diagnosis codes, lab results, imaging reports, prior treatment history — and structures it against the payer's specific LCD/NCD medical policy criteria.
- **Agent C — Justification Drafting Agent:** Writes a clinical justification letter in the payer's preferred format, citing specific clinical findings from the patient's record that meet the payer's criteria. Uses a model fine-tuned on thousands of previously approved PA letters for each major payer.
- **Agent D — Submission & Tracking Agent:** Submits to the payer's portal (via RPA or direct API where available), tracks status, and automatically escalates denials to Agent E.
- **Agent E — Appeals Agent:** When a PA is denied, retrieves the denial reason, identifies the strongest counter-argument from clinical literature and internal approval precedents, drafts a peer-to-peer review request or formal appeal letter, and routes it to a physician advisor for review before submission.

### The Agentic Moat

The moat is the **payer-specific approval pattern database**. Every approved and denied PA generates a training signal: which clinical language, which diagnosis code combinations, which specific phrases triggered approval at which payer. This proprietary dataset — accumulated across hundreds of hospital customers — makes the justification drafting agent dramatically more accurate than any general-purpose model. Context and memory may be the new moats — when your product understands a user's world better than anything else, replacing it feels like starting over.

### Market Validation / Demand

The payer is the CFO or VP of Revenue Cycle at any hospital system. US hospitals spend over USD 35 billion annually on administrative costs related to PA alone. A single hospital system with 50,000 PA requests per year at USD 7 average cost-to-process is spending USD 350K annually just on labour — before counting the revenue lost to delays and denials. This is a top-3 revenue cycle priority at every health system in the country.

### Technical Feasibility (2026)

High feasibility for the drafting and submission components. The Epic SMART on FHIR integration is well-documented and increasingly supported. The key technical challenge is the heterogeneity of payer portals — some have APIs, many require RPA browser automation, and a few still require fax (yes, in 2026). The multi-payer portal layer is the hardest engineering problem, not the AI.

### Risk Profile

The single point of failure is **HIPAA compliance and data privacy**. Every patient record the system touches is PHI under HIPAA. A data breach or improper disclosure exposes the hospital — not the vendor — to USD 100K–1.9M per violation category. The system must be deployed in a HIPAA Business Associate Agreement framework, with on-premise or private-cloud deployment options for the most risk-averse health systems. This is a feature, not just a legal checkbox.

---

## Concept 5: M&A Due Diligence Acceleration Platform (Investment Banking / PE)

### The Specific Workflow

When a private equity firm or corporate M&A team runs due diligence on an acquisition target, they receive a virtual data room (VDR) containing 5,000–50,000 documents — financial statements, contracts, IP assignments, employment agreements, litigation records, environmental reports, and regulatory filings. A team of 10–20 associates, lawyers, and consultants spends 4–8 weeks reading, summarising, and cross-referencing these documents, at a total cost of USD 500K–2M in fees.

The multi-agent replacement:

- **Agent A — Document Triage Agent:** Connects directly to the VDR (Intralinks, Datasite, Ansarada APIs). Classifies every document by type, materiality, and risk category within hours of VDR access being granted. Surfaces the 200 highest-risk documents for human attention first.
- **Agent B — Contract Risk Extraction Agent:** For every material contract (customer agreements, supplier contracts, leases, IP licences), extracts key terms: change of control clauses, termination rights, exclusivity provisions, IP ownership, liability caps, and auto-renewal dates. Flags terms that deviate from market standard and quantifies their financial exposure.
- **Agent C — Financial Consistency Agent:** Cross-references management accounts, audited financials, and board minutes to identify inconsistencies — revenue recognition timing differences, off-balance-sheet liabilities referenced in board minutes but not on the balance sheet, related-party transactions not adequately disclosed.
- **Agent D — Regulatory & Litigation Agent:** Searches the document set for any mention of regulatory investigations, pending litigation, environmental liabilities, or employment claims. Cross-references public court records, EPA databases, and SEC EDGAR filings to verify disclosures are complete.
- **Agent E — Synthesis & Issues List Agent:** Generates a structured due diligence issues list — the "red list" — with each item linked to its source document, the relevant section of the purchase agreement it affects, and a suggested indemnity or price adjustment.

### The Agentic Moat

The moat is built on two layers. First, **domain-specific fine-tuning** on thousands of historical M&A due diligence reports, issues lists, and purchase agreements — the model understands what "market standard" means for change-of-control provisions in SaaS versus manufacturing deals. Second, **direct VDR integrations** with Intralinks and Datasite (which together control 60%+ of the enterprise VDR market) create a distribution advantage: the buyer's bank often controls VDR access, making this a top-of-funnel insertion point.

### Market Validation / Demand

The payer is the Managing Director at a PE firm or the Head of M&A at a Fortune 500. Agentic AI in financial services raised USD 262 million in 2025 across 21 rounds — a 45.3% year-over-year increase from 2024, with the category growing particularly fast in compliance, document processing, and advisory workflows. A USD 200M acquisition with USD 1.5M in diligence fees is standard. Compressing that by 60% while improving coverage is an immediate, quantifiable ROI. The buyers are sophisticated, move fast when they see ROI, and sign multi-year contracts.

### Risk Profile

The single point of failure is **hallucinated contract terms**. If Agent B incorrectly summarises a change-of-control clause as "waivable with 30 days notice" when the actual clause is "automatic termination," the acquirer may close a deal without knowing a key customer contract will immediately terminate. The mitigation is strict retrieval-augmented generation — every extracted term must be accompanied by the verbatim quote and page reference from the source document, and the system must flag low-confidence extractions for mandatory lawyer review. The agent accelerates lawyers; it does not replace them.

---

## The Common Thread

All five concepts share the same structural logic: they replace a workflow that is currently *possible* to do manually but is *too expensive, too slow, or too error-prone* to do well at scale. The agent is not magic — it is the industrialisation of expert judgment across thousands of documents simultaneously, with a full audit trail and structured escalation to humans when confidence is low.

The real advantage that does not get discussed enough is proven trust and regulatory compliance. Enterprise customers in finance, healthcare, legal, or government do not just buy software — they buy the vendor's demonstrated ability to meet audit requirements, data residency constraints, traceability, SOC 2 certifications, and industry-specific regulations.

If you are a founder entering this space: pick one workflow in one industry. Go deep before you go wide. The moat is in the data, the integrations, and the accumulated pattern-matching across thousands of real enterprise deployments — not in the LLM you chose.

## The best agentic AI companies of 2026 will not be remembered for the model they used. They will be remembered for the workflow they owned.
`,
  },

  // ── Post 2 ──────────────────────────────────────────────────────────────────
  {
    id: "probability-part-ii",
    title: "Probability for Machine Learning (Part II): Entropy & Estimation",
    excerpt: "Deep dive into Maximum Likelihood Estimation, Information Theory, and the mathematical roots of neural network loss functions.",
    tag: "Mathematics", tagColor: "#34d399",
    heroImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    author: "MLDSN Nepal", authorRole: "Editorial Team",
    date: "2026", readTime: "12 min read",
    url: "#",
    content: `
In Part I, we saw how probability forms the foundation of machine learning. In real life, however, we rarely know the true underlying rules (the "true probability distribution") that generated our data. Part II bridges theory to practice by exploring how we estimate model parameters and measure uncertainty — concepts that directly power how neural networks learn.

## 1. Maximum Likelihood Estimation (MLE)

Imagine you have a bag of marbles with unknown proportions of colors. You draw some marbles and want to guess the most likely mix inside the bag. This is the core problem MLE solves.

In machine learning, we don't know the true distribution p(data). Instead, we propose a model with adjustable parameters θ and ask: which θ makes our observed data most probable? We maximize the **likelihood function**:

:::callout The Likelihood Function
**L(θ) = ∏ p(xᵢ | θ)**

Products are messy for computers, so we take the natural log (log-likelihood):

**ℓ(θ) = ∑ log p(xᵢ | θ)**
:::

Maximizing this is the same as minimizing the negative log-likelihood — which turns out to be exactly the cross-entropy loss used in training most neural network classifiers today. MLE exists because we need a principled, statistically sound way to fit models to data when we only have samples, not the full truth.

## 2. Information Theory: Quantifying Uncertainty

Life (and data) is full of uncertainty. Information Theory, developed by Claude Shannon during World War II to improve communication systems, gives us tools to measure it.

The key idea is **Shannon Entropy**, which tells us how unpredictable a distribution is:

:::callout Entropy Formula
**H(X) = - ∑ p(x) log p(x)**
:::

High entropy = very uncertain (hard to compress). Low entropy = more predictable.

In ML, we compare our model's predicted distribution q to the true one p using:

- **Kullback-Leibler (KL) Divergence**: How much extra "surprise" we get by using the wrong distribution.
- **Cross-Entropy**: H(p, q) = H(p) + D_KL(p || q). Since the true entropy H(p) is fixed, minimizing cross-entropy during training is the same as minimizing KL divergence.

These ideas are why your classification loss functions work and appear in advanced techniques like GANs and variational autoencoders.

## 3. Regularization as Bayesian Thinking

Models can memorize training data and fail on new examples (overfitting). Weight Decay (L2 regularization) helps prevent this.

From a Bayesian viewpoint, this is **Maximum A Posteriori (MAP)** estimation — we combine the likelihood of the data with our prior beliefs about the parameters:

:::callout MAP Estimation
**θ_MAP = argmax [ log p(data | θ) + log p(θ) ]**
:::

Assuming weights are normally distributed around zero turns the prior into the familiar -λ||θ||² penalty in your loss function.

## Summary for Practitioners

MLE gives us loss functions, entropy and KL divergence power modern training objectives, and MAP explains why regularization works. Understanding these turns you from someone who just calls \`model.fit()\` into someone who knows why the math matters.

> Every modern neural network loss function is secretly built on these fundamental statistical principles.
`
  },

  // ── Post 3 ──────────────────────────────────────────────────────────────────
  {
    id: "llm-journey",
    title: "The LLM Journey: From Text Prediction to Intelligent Agents — and What It Means for Nepal",
    excerpt: "Large language models have evolved from simple autocomplete systems into reasoning agents that write code, pass professional exams, and power entire products. Here is how we got here, and why the opportunity for Nepal has never been greater.",
    tag: "AI & LLMs", tagColor: "#f472b6",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
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

  // ── Post 4 ──────────────────────────────────────────────────────────────────
  {
    id: "probability",
    title: "Probability for Machine Learning (Part I)",
    excerpt: "Master the art of reasoning under uncertainty: From Bayes' theorem to the statistical bedrock of modern ML.",
    tag: "Mathematics", tagColor: "#34d399",
    heroImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    author: "MLDSN Nepal", authorRole: "Editorial Team",
    date: "2020", readTime: "9 min read",
    url: "https://sites.google.com/view/mldsnorg/blog/probability_i",
    content: `
Machine learning is, at its heart, the science of decision-making under uncertainty. A model rarely deals in absolute certainties; instead, it estimates likelihoods. Probability theory is the formal language we use to quantify this process.

## The Statistical Foundation of AI

Why is probability non-negotiable for an ML practitioner? Consider these core pillars:

- **Probabilistic Classification:** Models output confidence scores, not just rigid labels.
- **Optimization:** Loss functions, such as cross-entropy, are rooted in *Maximum Likelihood Estimation (MLE)*.
- **Regularization:** Techniques like L2 regularization are essentially *Gaussian priors* placed on model weights.
- **Generative Power:** Modern models (VAEs, Diffusion) explicitly learn complex *probability distributions* over data.

## Core Concepts: The Bayesian Lens

Understanding probability starts with how we update our knowledge based on new evidence.

:::callout The Conditional Logic
The probability of event A, given that we have observed event B:

\`P(A | B) = P(A ∩ B) / P(B), where P(B) > 0\`
:::

:::callout Bayes' Theorem: Updating Beliefs
Bayes' theorem is the engine of learning. It formalizes how we move from a "Prior" to an "Updated Belief":

**P(A | B) = (P(B | A) × P(A)) / P(B)**

- **Prior (P(A)):** Our initial assumption.
- **Likelihood (P(B | A)):** How well the data fits the assumption.
- **Posterior (P(A | B)):** Our refined understanding.
:::

## The Practitioner's Toolbox: Key Distributions

- **Bernoulli** — Binary outcomes (0 or 1).
- **Categorical** — Multi-class tasks (Softmax).
- **Gaussian** — Noise modeling & weight initialization.
- **Beta** — Priors over probabilities.
- **Dirichlet** — Topic modeling (LDA).

> Understanding probability isn't just about formulas; it’s about building the intuition to ask: *What do we know, what remains uncertain, and how confident should we be?*

*Stay tuned for Part II, where we will dive into Maximum Likelihood Estimation and Information Theory.*
`
  },

  // ── Post 5 ──────────────────────────────────────────────────────────────────
  {
    id: "linear-algebra",
    title: "Linear Algebra for Machine Learning (Part I)",
    excerpt: "Vectors, matrices and transformations form the mathematical backbone of every ML algorithm. This guide builds intuition before formulas.",
    tag: "Mathematics", tagColor: "#a78bfa",
    heroImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80",
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

  // ── Post 6 ──────────────────────────────────────────────────────────────────
  {
    id: "kaggle",
    title: "Kaggle: The Best Place to Start Machine Learning and Data Science",
    excerpt: "Whether you're a beginner or a seasoned data scientist, Kaggle offers competitions, datasets and community kernels that accelerate your ML journey significantly.",
    tag: "Learning", tagColor: "#4f9cf9",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
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
  }

  // ── ADD NEW POSTS BELOW THIS LINE ───────────────────────────────────────────
  // Copy the template below, remove the comment markers, fill it in and save.
  //
  // {
  //   id: "my-new-post",
  //   title: "Your Post Title",
  //   excerpt: "A short 1–2 sentence summary shown on cards and in search.",
  //   tag: "Learning",  tagColor: "#4f9cf9",
  //   heroImage: "https://images.unsplash.com/photo-...",
  //   author: "Your Name",  authorRole: "Your Role",
  //   date: "2026",  readTime: "5 min read",
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
  //    `,
  // },
];

// Convert Markdown → HTML at import time (runs once, not on every render)
export const POSTS = POSTS_RAW.map(p => ({
  ...p,
  slug: p.id.replace(/-/g, "_"),
  content: parseMarkdown(p.content),
}));