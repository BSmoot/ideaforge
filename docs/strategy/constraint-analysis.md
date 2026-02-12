# IdeaForge -- Constraint Analysis

**Status**: Complete  
**Source SD**: strategy-document.md  
**Date**: 2026-02-12  
**Analyst**: Project Guardian (AI-assisted)  
**Overall Risk Level**: HIGH

---

## Executive Summary

The IdeaForge strategy document describes a compelling product vision for an underserved market niche. However, the MVP scope as written is **too ambitious for a solo developer in 3 months**. Several of the six MVP features are individually significant engineering efforts, and two of them -- the AI Development Partner and the Connection Graph -- carry substantial complexity risk that the timeline does not account for.

This analysis identifies 3 blocking constraints, 5 significant constraints, and 4 notable constraints. The primary recommendation is to **reduce MVP scope to 4 features** by deferring Connection Graph visualization and voice-to-text input, and to **simplify the AI Development Partner** to a single interaction mode (contextual chat) rather than five distinct AI actions at launch.

---

## Summary

| Category | Count |
|----------|-------|
| Constraint categories analyzed | 5 |
| Blocking constraints | 3 |
| Significant constraints | 5 |
| Notable constraints | 4 |
| Conflicts identified | 2 |
| Gaps requiring decision | 4 |
| Overall risk level | **HIGH** |

---

## Blocking Constraints -- Must Resolve Before Proceeding

### BLOCK-001: MVP Scope Exceeds Solo Developer Capacity

**Category**: Resource / Timeline  
**Severity**: BLOCKING

**Description**:

The SD lists 6 MVP features, each with meaningful engineering complexity. The 12-week timeline allocates them as follows:

| Weeks | Feature | Estimated Real Effort | SD Estimate |
|-------|---------|----------------------|-------------|
| 1-4 | Core data model + Spark Capture + Basic Idea Canvas | 4-5 weeks | 4 weeks |
| 5-8 | AI Development Partner (5 distinct AI modes) | 5-7 weeks | 4 weeks |
| 9-10 | Connection Graph + Status Tracking | 3-5 weeks | 2 weeks |
| 11-12 | Polish + Onboarding | 2-3 weeks | 2 weeks |

**Total realistic estimate: 14-20 weeks for a solo developer**, versus the 12 weeks budgeted.

The most dangerous underestimate is the AI Development Partner. The SD describes five distinct AI interaction modes (Challenge, Explore Adjacent, Connect, Summarize for Action, Custom Prompting). Each mode requires:
- Unique prompt engineering and context assembly
- Different output formats and UI treatments
- Testing with real idea content to verify quality
- Edge case handling (empty ideas, very long ideas, unrelated ideas)

Building five distinct, high-quality AI modes is not 4 weeks of work. It is closer to 6-8 weeks if the quality bar described in the strategy ("AI must feel like a thinking partner, not autocomplete") is to be met.

**Hard Requirements**:
- Solo developer is the only resource for Phase 1
- 3-month timeline is a strategic commitment (competitive window assumption A7)
- All 6 features are listed as "must-have for launch"

**Owner**: Product / Developer (same person in solo scenario)

**Flexibility**: HIGH -- The developer owns both scope and timeline. No external stakeholder has mandated all 6 features.

**Timeline Impact**: If all 6 features are attempted, the timeline will slip to 4-5 months, or quality will be sacrificed across the board. Neither outcome is acceptable -- late launch risks the competitive window, and low quality risks the "AI wrapper perception" (Risk #2 in the SD).

**Resolution Path**:

Option A (RECOMMENDED): **Reduce MVP to 4 core features**
1. Spark Capture (simplified -- text only, no voice)
2. Idea Canvas (markdown workspace with structured sections)
3. AI Development Partner (simplified -- see BLOCK-002)
4. Idea Status Tracking (simple state machine, not evolution history)

Defer to fast-follow (Phase 1.5, weeks 13-16):
- Connection Graph visualization
- Voice-to-text capture
- Full evolution history tracking

Option B: **Extend timeline to 16 weeks**
- Keep all 6 features but accept 4-month timeline
- Risk: competitive window assumption weakens

Option C: **Hire a contractor for frontend work**
- Keep 12-week timeline with expanded team
- Risk: coordination overhead, cost increase ($5-10K for 8 weeks of part-time frontend)
- The SD mentions this as a Phase 2 consideration; pulling it forward is viable

---

### BLOCK-002: AI Development Partner Complexity is Severely Underestimated

**Category**: Technical  
**Severity**: BLOCKING

**Description**:

The SD describes 5 distinct AI interaction modes, each requiring unique prompt engineering, context assembly, and UI/UX treatment. This is the single highest-risk feature in the MVP. Breaking down the actual work:

**Per AI mode, minimum engineering effort:**

| Component | Effort per Mode |
|-----------|----------------|
| Prompt engineering + testing | 2-3 days |
| Context assembly (current idea + related ideas) | 1-2 days (shared, but nuanced per mode) |
| UI for mode-specific output | 1-2 days |
| Edge cases + error handling | 1 day |
| **Subtotal** | **5-8 days per mode** |

5 modes x 5-8 days = 25-40 days = **5-8 weeks of work** for the AI partner alone.

Additionally, the "Connect" mode (AI finds links to other ideas in your workspace) is essentially the Connection Graph feature implemented through AI rather than visualization. This requires:
- Embedding or semantic comparison of all ideas in the workspace
- Efficient retrieval of relevant ideas given a query idea
- Meaningful explanation of why ideas are connected
- This is a retrieval-augmented generation (RAG) system, which is a non-trivial engineering effort on its own

**Hard Requirements**:
- AI must feel like "thinking partner, not autocomplete" (SD strategic principle #2)
- AI response latency < 3 seconds p95 (SD guardrail metric)
- AI must be contextual to current idea + related ideas (not generic)

**Owner**: Developer

**Flexibility**: HIGH -- The number and sophistication of AI modes is an internal decision.

**Timeline Impact**: If all 5 modes are built to quality, this feature alone consumes 5-8 weeks of a 12-week timeline.

**Resolution Path** (RECOMMENDED):

**Launch with 1 AI mode: Contextual Chat.**

Instead of 5 specialized modes, build one high-quality contextual chat interface where:
- The user's current idea (and optionally related ideas) is loaded as context
- The user can ask anything: "challenge this," "what am I missing," "how does this connect to X"
- The AI responds conversationally with idea context

This approach:
- Delivers 80% of the value with 20% of the engineering effort
- Is the natural "MVP of the MVP" for AI interaction
- Allows users to discover what they actually want from the AI (informing which specialized modes to build later)
- Can be built in 2-3 weeks with high quality
- Aligns with strategic principle #6 ("Speed is a feature")

The specialized modes (Challenge, Explore Adjacent, Connect, Summarize) become **prompt templates** on top of the contextual chat -- a 1-2 day effort each, built iteratively based on user feedback in weeks 13-20.

---

### BLOCK-003: Desktop App vs. Web App Decision is Unresolved and Blocking

**Category**: Technical / Architecture  
**Severity**: BLOCKING

**Description**:

The SD lists this as an open question: "Desktop app (Electron/Tauri) vs. web app for MVP?" and flags it as blocking. This decision has cascading effects on:

- **Data storage**: Desktop app naturally supports local-first SQLite; web app requires IndexedDB or server-side storage
- **AI API communication**: Desktop app can call LLM APIs directly (simpler); web app needs a backend proxy (CORS, API key security)
- **Distribution**: Desktop app requires build/signing/auto-update infrastructure; web app needs hosting
- **Development speed**: Web app is faster to iterate; desktop app (Tauri) requires Rust knowledge for native features
- **Offline capability**: Desktop naturally offline; web requires service workers and careful caching

The SD mentions Tauri vs. Electron but also mentions "web app" in the Phase 1 roadmap section ("Web app, single-user focus" on line 413). These statements are contradictory.

**Hard Requirements**:
- Local-first storage is a core differentiator (SD value proposition)
- No account required to start (SD feature #6)
- Must be buildable by solo developer

**Owner**: Developer

**Flexibility**: HIGH -- This is a technical decision with no external constraint.

**Timeline Impact**: Choosing the wrong platform could add 2-4 weeks of rework. The decision must be made before coding begins.

**Resolution Path** (RECOMMENDED):

**Build as a web application with local-first storage via IndexedDB/OPFS, with Tauri desktop wrapper as a Phase 1.5 deliverable.**

Rationale:
1. Web app is fastest to develop and iterate (no build/signing overhead)
2. Modern browser storage (Origin Private File System, IndexedDB) supports local-first patterns
3. Libraries like cr-sqlite or electric-sql enable local-first web with future sync
4. A Tauri wrapper can be added later to package the web app as a desktop app
5. No account required -- just visit the URL, data stays in the browser
6. API key security solved with a lightweight backend proxy (single endpoint)

This also resolves the implicit contradiction in the SD between "web app" and "local-first" -- they are not mutually exclusive with modern browser storage APIs.

---

## Significant Constraints -- Must Address in Planning

### SIG-001: AI API Cost Model is Uncertain and Potentially Margin-Destroying

**Category**: Business / Financial  
**Severity**: SIGNIFICANT

**Description**:

The SD estimates AI cost per user at $2-4/month (assumption A6, confidence LOW). This estimate is optimistic for the described usage patterns.

**Cost analysis for a single "Challenge This" AI interaction:**

| Component | Tokens (estimated) | Cost (Claude API) |
|-----------|--------------------|-------------------|
| System prompt + instructions | ~500 tokens | Input |
| Current idea context | ~1,000-3,000 tokens | Input |
| Related ideas context (2-3 ideas) | ~2,000-5,000 tokens | Input |
| AI response | ~500-1,500 tokens | Output |
| **Total per interaction** | **4,000-10,000 input + 1,000 output** | **~$0.015-$0.045** |

At the free tier (20 interactions/month): **$0.30-$0.90/month per free user** -- manageable.

At the Pro tier (500 interactions/month): **$7.50-$22.50/month per Pro user** -- this exceeds the $10/month subscription price.

Even at 200 interactions/month (realistic power user): **$3.00-$9.00/month** -- this consumes 30-90% of revenue.

The "Connect" feature is even more expensive because it requires comparing an idea against all other ideas, potentially multiplying token usage by the size of the idea library.

**Hard Requirements**:
- Pro tier is $10/month (SD pricing)
- AI must be high quality ("thinking partner" positioning)
- AI cost per user must leave room for gross margin (SD target: 60-70%)

**Owner**: Developer / Product

**Flexibility**: MODERATE -- Pricing can be adjusted, but aggressive price increases risk adoption.

**Timeline Impact**: None on development timeline, but critical for business viability.

**Resolution Path**:

1. **Use model tiering from day one**: Use a cheaper, faster model (Claude Haiku or GPT-4o-mini) for simple operations (summarize, categorize), and a premium model (Claude Sonnet) only for high-value operations (challenge, deep analysis). Reserve Opus-class models for the most complex synthesis tasks only.

2. **Implement aggressive caching**: Cache AI-generated embeddings for connection discovery. Cache responses for identical or near-identical prompts. Use semantic similarity to avoid redundant API calls.

3. **Optimize context windows**: Do not send entire ideas as context. Summarize ideas into compressed representations (200-300 tokens instead of 1,000-3,000). Pre-compute idea summaries on save.

4. **Set realistic Pro tier limits**: 500 interactions/month may be too generous at $10/month. Consider 200 interactions/month, or raise Pro to $15/month, or implement usage-based pricing above a threshold.

5. **Track cost per user from day one**: Instrument every API call with cost tracking. This is not optional -- it is a survival metric.

---

### SIG-002: Connection Discovery (RAG) is a Standalone Engineering Challenge

**Category**: Technical  
**Severity**: SIGNIFICANT

**Description**:

The SD's "Connection Graph" and the AI "Connect" mode both depend on the same underlying capability: given an idea, find semantically related ideas in the user's workspace. This is a retrieval-augmented generation (RAG) problem that requires:

1. **Embedding generation**: Every idea must be converted to a vector embedding
2. **Vector storage and search**: Embeddings must be stored and queried efficiently
3. **Relevance ranking**: Results must be ranked by actual conceptual relevance, not just keyword similarity
4. **Explanation generation**: The system must explain *why* ideas are connected (not just "these are similar")
5. **Incremental updates**: When an idea changes, its embedding and connections must update

For a small workspace (< 100 ideas), a naive approach works: embed everything, compare with cosine similarity, done. But the engineering to make this reliable, fast, and useful is non-trivial.

**Options for implementation:**

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| API-based embeddings (OpenAI/Cohere) | High quality, simple | Adds API dependency + cost, latency | 1-2 weeks |
| Local embeddings (transformers.js) | Offline, no API cost | Lower quality, large model download, slow | 2-3 weeks |
| Keyword/TF-IDF matching | Simple, fast, offline | Low quality connections | 3-5 days |
| Hybrid (keywords + API embeddings) | Balanced | More complex | 2-3 weeks |

**Owner**: Developer

**Flexibility**: HIGH -- Connection discovery sophistication can be graduated.

**Resolution Path**:

For MVP, use **keyword extraction + TF-IDF similarity** as the connection engine. This is simple, fast, works offline, and costs nothing. It will find obvious connections (shared keywords, similar topics) even if it misses subtle semantic links.

Upgrade to embedding-based connections in Phase 1.5 or 2, once:
- The product has validated that users care about connections
- The cost model is understood
- The team has bandwidth for RAG infrastructure

This reduces the Connection Graph from a 3-5 week effort to a 1-week effort.

---

### SIG-003: Local-First Architecture Constrains Technology Choices

**Category**: Technical  
**Severity**: SIGNIFICANT

**Description**:

The SD positions local-first as a core differentiator. This constrains technology decisions significantly:

**What local-first requires:**
- All data must be readable/writable without a network connection
- The application must function fully offline (except AI features)
- Data must be stored on the user's device, not on a remote server
- Future sync must not require re-architecture (CRDTs or operational transforms)

**What local-first rules out:**
- PostgreSQL + Apache AGE (mentioned in open questions) -- this is a server-side database, incompatible with local-first
- Any server-dependent data model
- Authentication-gated access to own data

**What local-first implies for the tech stack:**

| Layer | Local-First Web App | Local-First Desktop (Tauri) |
|-------|--------------------|-----------------------------|
| Storage | IndexedDB, OPFS, or sql.js (SQLite in WASM) | SQLite via better-sqlite3 |
| Sync (future) | cr-sqlite, PowerSync, ElectricSQL | Same, or custom sync |
| Search | Client-side full-text search (lunr.js, MiniSearch) | SQLite FTS5 |
| AI | API calls from client (needs proxy for key security) | Direct API calls |

The SD's open question about PostgreSQL vs. Neo4j is **irrelevant for MVP** -- neither is compatible with local-first architecture. The answer is SQLite (or IndexedDB) for MVP, with a graph layer built in application code.

**Owner**: Developer

**Flexibility**: LOW -- Local-first is a strategic differentiator, not a nice-to-have.

**Resolution Path**:

1. Use **SQLite via sql.js (WASM)** or **better-sqlite3 (Tauri)** for local storage
2. Model the idea graph as a relational schema (ideas table + connections table), not a graph database
3. Build graph queries in application code (the graph will be small enough -- hundreds, not millions of nodes)
4. Plan for sync by using UUIDs for all records and tracking modification timestamps
5. Remove PostgreSQL and Neo4j from consideration for MVP

---

### SIG-004: Graph Visualization is a Rabbit Hole

**Category**: Technical  
**Severity**: SIGNIFICANT

**Description**:

The SD calls for a "simple force-directed graph" for the Connection Graph feature. In practice, force-directed graph visualization in the browser is a well-understood problem, but "simple" is misleading:

**What "simple force-directed graph" actually requires:**

1. Choose a library (d3-force, vis.js, cytoscape.js, Sigma.js)
2. Layout algorithm tuning (force strength, collision, centering)
3. Node rendering (idea titles, status indicators, truncation)
4. Edge rendering (connection strength, labels)
5. Interaction (zoom, pan, click to navigate, hover for details)
6. Performance (degrades at 200+ nodes without WebGL)
7. Responsive layout (different screen sizes)
8. Integration with the rest of the app (clicking a node opens the idea)

This is 2-3 weeks of focused frontend work for a solo developer, assuming familiarity with the chosen library. If the developer has not built force-directed graphs before, add 1 week for learning.

The graph is visually impressive but is **not part of the core value loop** for MVP. Users can discover connections through the AI "Connect" mode and through manual linking without a visual graph. The graph becomes valuable only after a user has 20+ ideas with connections -- which will not happen in the first session.

**Owner**: Developer

**Flexibility**: HIGH -- Graph visualization is a presentation layer, not a data model decision.

**Resolution Path** (RECOMMENDED):

**Defer visual graph to Phase 1.5. For MVP, show connections as a simple list.**

Instead of a force-directed graph, display connections on each idea's canvas:
- "Related Ideas" section with linked idea titles
- Click to navigate to a connected idea
- Add/remove connections manually or via AI suggestion

This delivers the connection value without the visualization engineering. The visual graph can be added in weeks 13-16 as a high-impact, well-scoped feature.

---

### SIG-005: Voice-to-Text Adds Complexity Without Core Value

**Category**: Technical / Scope  
**Severity**: SIGNIFICANT

**Description**:

The SD lists "voice-to-text" as one of the Spark Capture input modes. Voice-to-text in a browser or desktop app requires:

1. **Web Speech API** (browser-native) -- free but inconsistent across browsers, no offline support
2. **Whisper API** (OpenAI) -- high quality but adds API dependency and cost ($0.006/minute)
3. **Local Whisper** (whisper.cpp/transformers.js) -- offline but large model, complex integration

Voice capture is a nice-to-have, not a core value driver. The "Prolific Creator" persona captures ideas in text form more often than voice form in a desktop/web context. Voice is more natural on mobile, which is explicitly deferred.

**Owner**: Developer

**Flexibility**: HIGH -- No user has requested this; it is a speculative feature.

**Resolution Path** (RECOMMENDED):

**Defer voice-to-text to Phase 2.** Text and paste-from-clipboard cover the MVP capture needs. If users request voice capture, it can be added as a focused feature.

---

## Notable Constraints -- Document and Monitor

### NOTE-001: LLM Provider Lock-in Risk

**Category**: Technical  
**Severity**: NOTABLE

**Description**: The SD recommends Claude API as primary LLM. Prompt engineering is provider-specific -- prompts optimized for Claude may perform poorly on GPT-4 or Gemini. Building a provider abstraction layer from day one is mentioned in the SD but adds engineering overhead.

**Owner**: Developer  
**Recommendation**: Use a lightweight abstraction (e.g., Vercel AI SDK or LangChain.js) from day one. This adds approximately 1 day of setup but prevents weeks of rework later. Do not build a custom abstraction -- use an existing one.

---

### NOTE-002: Data Loss Risk in Local-First Architecture

**Category**: Technical / User Trust  
**Severity**: NOTABLE

**Description**: The SD sets a guardrail of "0 data loss incidents." With local-first architecture, data loss means the user's browser storage or local files are corrupted/deleted. The application has no server-side backup.

Risks:
- Browser clears IndexedDB (incognito mode, storage pressure, user action)
- File system corruption on desktop
- No automatic backup mechanism in MVP

**Owner**: Developer  
**Recommendation**: Implement JSON/Markdown export from day one. Users can manually back up their ideas. Auto-backup to a local file on a timer (every 5 minutes). These are approximately 2 days of work and critical for user trust.

---

### NOTE-003: "No Account Required" Creates Monetization Friction

**Category**: Business  
**Severity**: NOTABLE

**Description**: The SD states "No account required to start." This is excellent for onboarding but creates a problem: how do you convert a user with no account to a paid subscriber? You need an account system to process payments and manage subscriptions.

**Owner**: Product  
**Recommendation**: Defer monetization infrastructure to Phase 1.5. MVP is free-only. When Pro tier is introduced, require account creation at that point. This is consistent with the Obsidian model (free core, account only for paid features).

---

### NOTE-004: The "Forge" Metaphor May Confuse or Alienate

**Category**: Brand / UX  
**Severity**: NOTABLE

**Description**: The forge metaphor (Sparks, Anvil, Bellows, Crucible, Tempered Steel) is evocative but may not be immediately intuitive. Users familiar with note-taking tools expect "notes," "documents," "folders." The forge terminology could increase cognitive load during onboarding.

**Owner**: Product / Design  
**Recommendation**: Use the forge metaphor in marketing and brand identity, but keep the in-product terminology simple for MVP. "Ideas" not "Sparks." "Workspace" not "Anvil." "AI Assistant" not "Bellows." Test the metaphor with users before committing to it in the UI.

---

## Conflicts -- Issues Requiring Resolution

### CONFLICT-001: Quality vs. Speed in AI Features

**Severity**: SIGNIFICANT

**Description**: The SD simultaneously demands:
- AI that feels like a "thinking partner, not autocomplete" (high quality bar)
- AI response latency < 3 seconds (speed)
- 5 distinct AI modes in MVP (scope)
- Solo developer in 12 weeks (resource constraint)

These four requirements are in direct tension. High-quality AI interaction requires extensive prompt engineering, testing, and iteration. Five modes multiply this effort by five. The quality bar and speed metric cannot be met for 5 modes in the time available.

**Constraints in Conflict**:
- Strategic principle #2 (AI as thinking partner)
- Guardrail metric (< 3 seconds p95)
- MVP scope (5 AI modes)
- Resource constraint (solo developer, 12 weeks)

**Resolution Options**:

| Option | Trade-off | Recommended? |
|--------|-----------|--------------|
| Reduce to 1 AI mode (contextual chat) | Fewer features but higher quality | **Yes** |
| Keep 5 modes but accept lower quality | Risk "AI wrapper" perception | No |
| Extend timeline to 16-20 weeks | Delays launch | Acceptable fallback |
| Hire AI/prompt engineering contractor | Adds cost ($3-5K) and coordination overhead | Maybe for Phase 1.5 |

**Recommendation**: Reduce to 1 high-quality contextual chat mode. Add specialized modes as prompt templates iteratively post-launch based on user feedback.

---

### CONFLICT-002: Local-First vs. AI-Powered Features

**Severity**: SIGNIFICANT

**Description**: The SD positions local-first privacy as a core differentiator, but every AI feature requires sending idea content to a cloud LLM API. This creates a fundamental tension:

- Users who care about privacy may refuse to send ideas to OpenAI/Anthropic
- The SD mentions local LLM support (Ollama) but defers it
- Without AI, IdeaForge loses its primary differentiator over Obsidian

**Constraints in Conflict**:
- Local-first / privacy positioning
- AI-powered development features (require cloud API)
- Solo developer scope (cannot build local LLM support in MVP)

**Resolution Options**:

| Option | Trade-off | Recommended? |
|--------|-----------|--------------|
| Accept the tension; be transparent about what data goes where | Honest, may lose privacy-absolutist users | **Yes** |
| Add Ollama support in MVP | 1-2 weeks of additional work, lower AI quality | No |
| Position as "local-first storage, cloud-optional AI" | Clear distinction between data at rest and AI processing | **Yes (messaging)** |

**Recommendation**: Be transparent. "Your ideas are stored locally on your device. When you use AI features, your idea content is sent to [provider] for processing and is not stored or used for training. AI features are optional -- IdeaForge works without them." This is honest, clear, and addresses the concern without requiring local LLM infrastructure in MVP.

---

## Gaps -- Missing Information That Blocks Planning

### GAP-001: No Technical Architecture Decision

**Blocking**: Yes

**Description**: The SD lists multiple technology options (React vs. SolidJS, Electron vs. Tauri vs. web, SQLite vs. Postgres vs. Neo4j, Markdown vs. JSON vs. SQLite for storage) without making decisions. Several of these options are mutually exclusive or incompatible with stated requirements (e.g., PostgreSQL is incompatible with local-first).

**Impact**: Cannot begin development until architecture is decided. Wrong choices could require full rework.

**Resolution**:
- **Action**: Developer must produce an Architecture Decision Record (ADR) before coding begins
- **Owner**: Developer
- **Deadline**: Before Week 1 of development

**Recommended Architecture for MVP:**

| Layer | Decision | Rationale |
|-------|----------|-----------|
| Platform | Web app (SPA) | Fastest to develop, easiest to distribute |
| Framework | React + TypeScript | Largest ecosystem, most hiring flexibility |
| Desktop wrapper | Tauri (Phase 1.5) | Better performance than Electron, smaller bundle |
| Storage | sql.js (SQLite in WASM) + IndexedDB persistence | Local-first, query-capable, future sync-ready |
| AI SDK | Vercel AI SDK | Provider-agnostic, streaming support, TypeScript-native |
| AI Provider | Claude API (primary), OpenAI (fallback) | Quality reasoning for idea development |
| Editor | TipTap or Milkdown | Markdown-based, extensible, React-compatible |
| Styling | Tailwind CSS | Fast development, consistent design |
| Build | Vite | Fast builds, good TypeScript support |
| Graph viz (Phase 1.5) | Cytoscape.js | Mature, performant, good API |

---

### GAP-002: No Defined Data Model

**Blocking**: Yes

**Description**: The SD describes features but does not specify the data model. The data model for ideas, connections, stages, and AI interaction history must be designed before implementation.

**Impact**: Data model decisions affect every feature. Changing the data model after launch requires migration logic.

**Resolution**:
- **Action**: Design and document the core data schema before coding
- **Owner**: Developer
- **Deadline**: Week 1 of development

**Recommended Core Schema (SQLite):**

```sql
-- Core idea record
CREATE TABLE ideas (
  id TEXT PRIMARY KEY,           -- UUID
  title TEXT NOT NULL,
  content TEXT,                  -- Markdown body
  status TEXT DEFAULT 'spark',   -- spark | developing | refined | parked | archived
  created_at TEXT NOT NULL,      -- ISO 8601
  updated_at TEXT NOT NULL,
  metadata TEXT                  -- JSON blob for extensible fields
);

-- Connections between ideas
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES ideas(id),
  target_id TEXT NOT NULL REFERENCES ideas(id),
  type TEXT DEFAULT 'related',   -- related | builds_on | contradicts | merged_into
  description TEXT,              -- Why these are connected
  source TEXT DEFAULT 'manual',  -- manual | ai_suggested | ai_confirmed
  created_at TEXT NOT NULL
);

-- AI interaction history
CREATE TABLE ai_interactions (
  id TEXT PRIMARY KEY,
  idea_id TEXT NOT NULL REFERENCES ideas(id),
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER,
  cost_estimate REAL,
  created_at TEXT NOT NULL
);

-- Tags
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE idea_tags (
  idea_id TEXT NOT NULL REFERENCES ideas(id),
  tag_id TEXT NOT NULL REFERENCES tags(id),
  PRIMARY KEY (idea_id, tag_id)
);

-- Full-text search
CREATE VIRTUAL TABLE ideas_fts USING fts5(
  title, content, content=ideas, content_rowid=rowid
);
```

---

### GAP-003: No Onboarding Strategy Defined

**Blocking**: No

**Description**: The SD sets a guardrail of "time to first value < 3 minutes" (or < 5 minutes in the earlier metrics section -- these are contradictory). No onboarding flow or first-run experience is described.

**Impact**: Poor onboarding will undermine retention metrics. This must be designed but is not blocking development start.

**Resolution**:
- **Action**: Design first-run experience during weeks 1-4 (while building core data model)
- **Owner**: Product / Developer
- **Deadline**: Before beta launch (Week 11-12)

---

### GAP-004: Free Tier Limits Are Contradictory

**Blocking**: No

**Description**: The SD defines the free tier differently in two places:
- Line 248: "unlimited local ideas, basic AI features (limited daily AI interactions, e.g., 20/day)"
- Line 460: "50 ideas, 20 AI interactions/month"

These are dramatically different: unlimited vs. 50 ideas, and 20/day vs. 20/month for AI.

**Impact**: Affects monetization strategy and AI cost projections.

**Resolution**:
- **Action**: Decide on free tier limits before building the limitation logic
- **Owner**: Product
- **Recommendation**: Start with 100 ideas and 50 AI interactions/month. This is generous enough to demonstrate value but constraining enough to drive upgrades. 20/month is too restrictive for users to experience the AI value; 20/day is too generous for cost management.

---

## PM Guidance -- Include in Feature Breakdown

### Scope: All Features

**CONSTRAINTS SUMMARY:**
- Solo developer, 12-week target (recommend reducing scope or extending to 14-16 weeks)
- Local-first architecture: all data stored client-side (SQLite via WASM or IndexedDB)
- Web app first, desktop wrapper (Tauri) in Phase 1.5
- No server-side database in MVP (no PostgreSQL, no Neo4j)
- AI features require cloud API; be transparent about data flow

**ARCHITECTURE DECISIONS NEEDED:**
- Platform + framework (recommend React + TypeScript + Vite)
- Storage engine (recommend sql.js for SQLite-in-WASM)
- AI SDK (recommend Vercel AI SDK)
- Editor component (recommend TipTap or Milkdown)

### Scope: AI Features

**COST MANAGEMENT IS CRITICAL:**
- Track tokens and cost per interaction from day one
- Implement model tiering (cheap models for simple tasks, premium for complex)
- Pre-compute idea summaries to reduce context window sizes
- Set realistic Pro tier interaction limits (200/month at $10/month)
- Cache connection discovery results

**QUALITY BAR:**
- One high-quality AI mode beats five mediocre ones
- Build contextual chat first, add specialized modes as prompt templates
- Test AI responses with real idea content, not lorem ipsum

### Scope: Connection Discovery

**PHASED APPROACH:**
- Phase 1: Keyword/TF-IDF similarity (simple, fast, offline)
- Phase 1.5: Embedding-based similarity (API-dependent, higher quality)
- Phase 2: Full RAG with vector storage

### Scope: Data and Storage

**LOCAL-FIRST REQUIREMENTS:**
- All data in client-side storage
- Implement JSON export from day one (backup mechanism)
- Use UUIDs for all record IDs (future sync readiness)
- Track modification timestamps on all records

---

## Revised MVP Feature Recommendation

Based on this constraint analysis, the recommended MVP scope is:

### Must Have (Weeks 1-12)

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 1 | **Spark Capture** | 1 week | Text + paste only. No voice. Fast entry with title + description + tags. |
| 2 | **Idea Canvas** | 3 weeks | Markdown editor with structured sections. TipTap or Milkdown. Save to local SQLite. |
| 3 | **AI Contextual Chat** | 3 weeks | Single chat interface, idea context pre-loaded. Provider-agnostic via Vercel AI SDK. Cost tracking. |
| 4 | **Idea Status Tracking** | 1 week | Simple state machine (Spark > Developing > Refined > Parked > Archived). Status filters. |
| 5 | **Search + Navigation** | 1 week | Full-text search via SQLite FTS5. Tag filtering. Idea list/grid view. |
| 6 | **Polish + Onboarding** | 2 weeks | First-run experience. Export to JSON/Markdown. Error handling. Performance. |
| - | **Buffer** | 1 week | Unexpected issues, bug fixes, scope adjustments. |

**Total: 12 weeks**

### Fast-Follow (Weeks 13-18, Phase 1.5)

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 7 | **AI Prompt Templates** | 1 week | "Challenge This," "Explore Adjacent," "Summarize" as pre-built prompts on top of contextual chat |
| 8 | **Connection Discovery** | 2 weeks | TF-IDF similarity + manual linking. "Related Ideas" list on each canvas. |
| 9 | **Connection Graph Visualization** | 2 weeks | Cytoscape.js force-directed graph. Click to navigate. |
| 10 | **Tauri Desktop Wrapper** | 1 week | Package web app as desktop app with native SQLite. |

### What Was Cut and Why

| Feature | Reason | When to Revisit |
|---------|--------|----------------|
| Voice-to-text capture | Adds complexity without core value for desktop users | Phase 2 (mobile) |
| 5 specialized AI modes | Scope exceeds timeline; 1 quality mode beats 5 mediocre ones | Phase 1.5 as prompt templates |
| Visual connection graph | 2-3 weeks of frontend work for a feature that needs 20+ ideas to be useful | Phase 1.5 |
| Full evolution history | Nice-to-have; status tracking is sufficient for MVP | Phase 2 |
| Neo4j / PostgreSQL | Incompatible with local-first architecture | Never (for core product) |

---

## Verification Status

### Tier 1: Presence Verification
- [X] Technology constraints documented (.gitignore confirms Node.js orientation)
- [X] Timeline constraints documented (3-month target in SD)
- [X] Resource constraints documented (solo developer in SD)
- [ ] Brand guidelines -- none exist yet (greenfield project)
- [ ] Compliance/legal docs -- none exist yet (no user data handling yet)

### Tier 2: Content Verification
- [X] Technology options analyzed against local-first requirement
- [X] Timeline estimates validated against feature complexity
- [X] AI cost model analyzed against pricing strategy
- [X] Competitive assumptions reviewed (market analysis in SD)

### Tier 3: Authority Verification
- [ ] Architecture decisions -- pending developer decision (GAP-001)
- [ ] Free tier limits -- pending product decision (GAP-004)
- [ ] Scope reduction -- pending developer/product agreement

### Analysis Scope
- **Time spent**: Full analysis
- **Categories covered**: 5 (Technical, Resource, Business, Scope, Brand)
- **Unexplored areas**: Legal/compliance (no user data handling in MVP -- revisit for cloud sync), accessibility (WCAG compliance -- should be addressed in design phase)
- **Assumptions made**: [ASSUMPTION] Developer has intermediate-to-advanced TypeScript and React experience. [ASSUMPTION] Developer has not built force-directed graph visualizations before. [ASSUMPTION] AI API pricing is based on Claude API as of early 2026.

---

## Risk Summary Matrix

| Risk | Likelihood | Impact | Mitigation Status |
|------|------------|--------|-------------------|
| Scope exceeds timeline | **HIGH** | HIGH | Addressed -- scope reduction recommended |
| AI costs exceed revenue | **HIGH** | HIGH | Addressed -- model tiering + cost tracking recommended |
| AI quality disappoints users | MEDIUM | HIGH | Addressed -- focus on 1 quality mode, not 5 mediocre |
| Architecture rework required | MEDIUM | HIGH | Addressed -- ADR required before coding |
| "AI wrapper" perception | MEDIUM | HIGH | Partially addressed -- deep integration helps, but risk remains |
| Data loss erodes trust | LOW | **CRITICAL** | Addressed -- export + auto-backup recommended |
| Competitive window closes | MEDIUM | MEDIUM | Addressed -- faster MVP with reduced scope |
| Privacy concerns limit adoption | LOW | MEDIUM | Addressed -- transparent data handling messaging |

---

## Final Verdict

The IdeaForge strategy identifies a genuine market gap and proposes a defensible product vision. The strategic thinking is sound. The execution plan, however, **overestimates what a solo developer can deliver in 12 weeks** and **underestimates the complexity of AI integration at the quality bar described**.

The recommended path forward:

1. **Resolve BLOCK-003 first**: Decide on web app vs. desktop app (recommend: web app)
2. **Accept the scope reduction**: 4 core features, not 6. One AI mode, not five.
3. **Produce an ADR**: Lock in technology decisions before writing code
4. **Build cost tracking into the AI layer from day one**: This is a survival metric
5. **Plan for Phase 1.5**: The deferred features (graph viz, prompt templates, Tauri wrapper) are a 4-6 week sprint immediately after MVP launch

The product can succeed, but only if scope discipline is maintained. The strategy document itself warns about this risk: "Depends on ruthless scope discipline" (assumption A4). This constraint analysis is the first act of that discipline.

---

*Generated by: Project Guardian constraint analysis*  
*Source: strategy-document.md (2026-02-12)*  
*Confidence: HIGH for technical constraints, MEDIUM for business/cost projections*  
*Next step: Resolve blocking constraints (BLOCK-001 through BLOCK-003), then proceed to feature breakdown*
