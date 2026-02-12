# IdeaForge -- Feature Breakdown Document

**Status**: Complete
**Source SD**: docs/strategy/strategy-document.md
**Constraints Doc**: docs/strategy/constraint-analysis.md
**Date**: 2026-02-12
**Author**: Product Manager (prism-manager)
**Tier**: 2 (Standard -- feature set, 6 epics, ~25 stories)

---

## Executive Summary

**Objective**: Enable prolific thinkers to capture raw ideas quickly, develop them with AI assistance, track their progress, and discover connections -- all in a local-first web application that treats ideas as living entities rather than static notes.

**MVP Scope (Phase 1, Weeks 1-12)**: 6 epics, 19 user stories delivering the core capture-develop-track loop with AI contextual chat. This scope reflects the guardian's recommended cuts: one unified AI mode instead of five, no graph visualization, no voice capture, no connection discovery engine. The MVP delivers a coherent experience where a user can go from raw thought to developed concept in a single session.

**Full Scope**: 25 stories across 6 epics (Phase 1) + 5 stories across 3 epics (Phase 1.5) + future phases.

**Estimated Effort**: 11 person-weeks + 1 week buffer = 12 weeks total for Phase 1.

**Key Constraints Applied**:
- Solo developer, 12-week timeline (BLOCK-001)
- One AI mode: contextual chat, not five specialized modes (BLOCK-002)
- Web app first, Tauri desktop wrapper deferred to Phase 1.5 (BLOCK-003)
- Local-first storage via SQLite-in-WASM, no server-side database (SIG-003)
- AI cost tracking from day one (SIG-001)
- JSON/Markdown export from day one for data safety (NOTE-002)

---

## Prioritization Framework

Each feature is assigned a priority band:

| Band | Code | Definition | Criteria |
|------|------|------------|----------|
| Must Ship | **P0** | Core value proposition; MVP is incomplete without it | Blocks the capture-develop-track loop |
| Should Ship | **P1** | Significant value; ship if time allows in Phase 1, otherwise Phase 1.5 | Enhances the core loop meaningfully |
| Nice to Have | **P2** | Valuable but deferrable without compromising MVP coherence | Polish, secondary workflows |
| Future | **P3** | Phase 2+ consideration | Requires team features, infrastructure, or validated demand |

Effort uses t-shirt sizing:

| Size | Days | Description |
|------|------|-------------|
| **S** | 1-2 days | Single component, well-understood pattern |
| **M** | 3-5 days | Multiple components, moderate complexity |
| **L** | 5-8 days | Cross-cutting feature, integration work |
| **XL** | 8-15 days | Major feature, significant unknowns |

---

## Phase 1: MVP (Weeks 1-12) -- Epics and Features

---

### EPIC-001: Foundation and Data Layer

**Objective**: Establish the local-first data layer, application shell, and navigation framework that all other features build upon.

**Success Criteria**: Application loads in < 2 seconds, data persists across browser sessions, all CRUD operations function without network connectivity.

**Priority**: P0 -- every other feature depends on this.

**Duration**: Weeks 1-2

---

#### US-001: Application Shell and Navigation

**Priority**: P0
**Effort**: M (3-4 days)
**Epic**: EPIC-001

**Story**:

> As a new user visiting IdeaForge for the first time,
> I want the application to load quickly and present a clear, intuitive layout,
> so that I can immediately understand how to start capturing ideas without reading documentation.

**Acceptance Criteria**:

- Given a user visits the application URL, when the page loads, then the main application shell renders within 2 seconds with a sidebar navigation, main content area, and a visible "New Idea" action.
- Given the application is loaded, when the user views the sidebar, then they see navigation items for: Ideas (list/grid), Search, and Settings.
- Given the application is loaded on a mobile-width viewport (< 768px), when the user views the layout, then the sidebar collapses to a hamburger menu and the content area takes full width.
- Given any navigation item is clicked, when the target view loads, then the previously active view is replaced without a full page reload (SPA routing).

**Edge Cases**:
- Browser does not support required APIs (IndexedDB, WASM) -- show a clear compatibility message listing supported browsers.
- Extremely slow connection -- application shell should load from cache on repeat visits (service worker or cache headers).

**Constraints Applied**:
- Local-first: No authentication gate or server dependency for initial load (NOTE-003)
- Progressive complexity: Simple on day 1 (SD principle #5)

**Dependencies**:
- Requires: None (foundational)
- Blocks: All other stories

**Design Notes**:
- Sidebar navigation with collapsible sections
- Persistent "New Idea" floating action button or header button
- Use Tailwind CSS for styling (GAP-001 recommendation)
- React Router for client-side routing

---

#### US-002: Local-First Data Layer (SQLite-in-WASM)

**Priority**: P0
**Effort**: L (5-7 days)
**Epic**: EPIC-001

**Story**:

> As a user of IdeaForge,
> I want my ideas to be stored locally on my device and persist across browser sessions,
> so that I own my data, can work offline, and never lose ideas to server outages.

**Acceptance Criteria**:

- Given the application is loaded for the first time, when the data layer initializes, then a SQLite database is created in the browser using sql.js (WASM) and persisted to IndexedDB or OPFS.
- Given an idea is created or modified, when the operation completes, then the change is persisted to local storage within 500ms.
- Given the user closes the browser and reopens the application, when it loads, then all previously saved ideas are present and unmodified.
- Given the browser is offline (no network connection), when the user creates, edits, or deletes ideas, then all operations succeed without error (AI features excluded).
- Given the database schema, when inspected, then all records use UUID primary keys and include created_at and updated_at ISO 8601 timestamps.
- Given the database, when auto-backup triggers (every 5 minutes of active use), then a JSON snapshot is saved to a secondary IndexedDB store as a recovery mechanism.

**Edge Cases**:
- Browser storage quota exceeded -- detect and warn the user before data loss, suggest export.
- IndexedDB cleared by browser (storage pressure, user action) -- auto-backup provides recovery path; show clear error with recovery instructions.
- Corrupt database file -- detect on load, offer to restore from last auto-backup.

**Constraints Applied**:
- Local-first architecture required (SIG-003)
- No PostgreSQL or Neo4j (SIG-003)
- UUIDs for all records, modification timestamps (SIG-003, future sync readiness)
- Auto-backup every 5 minutes (NOTE-002)

**Dependencies**:
- Requires: US-001 (application shell)
- Blocks: US-003, US-004, US-005, US-007, US-008, US-010, US-013

**Design Notes**:
- Use sql.js (SQLite compiled to WASM) with IndexedDB persistence
- Schema per GAP-002 recommendation in constraint analysis
- Data access layer abstraction to support future migration to native SQLite (Tauri)
- All database operations wrapped in a repository pattern for testability

---

### EPIC-002: Spark Capture

**Objective**: Enable users to capture raw ideas in under 5 seconds with minimal friction, supporting the "shower thought" use case where speed is everything.

**Success Criteria**: Time from intent to saved spark is under 5 seconds. Users capture 5+ sparks per week.

**Priority**: P0

**Duration**: Week 2 (overlaps with end of EPIC-001)

---

#### US-003: Quick Spark Entry

**Priority**: P0
**Effort**: M (3-4 days)
**Epic**: EPIC-002

**Story**:

> As a prolific thinker who just had an idea,
> I want to capture it in under 5 seconds with just a title and optional quick note,
> so that I do not lose the thought while it is fresh and I am not forced into a structured template.

**Acceptance Criteria**:

- Given the user is anywhere in the application, when they click the "New Idea" button (or press a keyboard shortcut), then a spark capture modal or inline form appears within 200ms.
- Given the spark capture form is open, when the user types a title (required, 1-200 characters) and optionally a description (freeform text, no limit), then they can save with Enter key or a Save button.
- Given a valid title is entered and saved, when the spark is persisted, then a new idea record is created with status "spark", the current timestamp, and a generated UUID.
- Given the spark is saved, when the save completes, then a brief confirmation is shown (toast notification, < 2 seconds) and the form clears for another entry.
- Given the user saves a spark, when they navigate to the Ideas list, then the new spark appears at the top of the list sorted by creation date.
- Given the spark capture form is open, when the user presses Escape, then the form closes without saving (if title is empty) or prompts for confirmation (if title has content).

**Edge Cases**:
- Empty title submission -- prevent save, show inline validation "Title is required."
- Very long title (> 200 characters) -- truncate with character count indicator.
- Rapid successive entries -- each save should complete independently; no race conditions on sequential creates.
- Paste from clipboard -- support pasting multi-line text into description field.
- Duplicate title -- allow it (ideas can have the same name; they are distinguished by UUID).

**Constraints Applied**:
- Text only, no voice capture (SIG-005 -- deferred to Phase 2)
- Speed is a feature (SD principle #6)
- "Under 5 seconds" target from SD feature description

**Dependencies**:
- Requires: US-002 (data layer)
- Blocks: US-005, US-007

**Design Notes**:
- Keyboard shortcut: Ctrl/Cmd + N globally
- Form should autofocus on title field
- Minimal UI: title input, description textarea, save button
- Consider inline capture at the top of the ideas list as an alternative to modal
- Tags can be added later on the canvas; do not add tag input to capture form (friction)

---

#### US-004: Spark Capture with Tags

**Priority**: P1
**Effort**: S (1-2 days)
**Epic**: EPIC-002

**Story**:

> As a user capturing a spark,
> I want to optionally add one or more tags during capture,
> so that I can categorize the idea immediately when the context is clear in my mind.

**Acceptance Criteria**:

- Given the spark capture form is open, when the user views the form, then an optional tag input field is visible below the description field.
- Given the tag input is focused, when the user types a tag name, then existing tags are shown as autocomplete suggestions (matching by prefix).
- Given the user types a new tag name that does not exist, when they press Enter or comma, then a new tag is created and associated with the spark.
- Given tags are added to the spark, when the spark is saved, then the tag associations are persisted to the idea_tags table.
- Given a tag is added in error, when the user clicks the "x" on the tag chip, then the tag is removed from the spark (but not deleted from the tags table).

**Edge Cases**:
- Tag with special characters -- allow alphanumeric, hyphens, and underscores only; strip others.
- Very long tag name (> 50 characters) -- truncate with validation message.
- Duplicate tag on same idea -- silently prevent duplicate association.

**Constraints Applied**:
- Must not add friction to the 5-second capture target; tags are optional

**Dependencies**:
- Requires: US-003 (spark capture form), US-002 (data layer with tags table)
- Blocks: US-013 (search by tag)

---

### EPIC-003: Idea Canvas

**Objective**: Provide a rich markdown editing environment where users develop sparks into structured, well-articulated concepts. This is where "development over capture" (SD principle #1) lives.

**Success Criteria**: Users who open the canvas spend an average of 3+ minutes developing an idea. Ideas move from "spark" to "developing" status.

**Priority**: P0

**Duration**: Weeks 3-5

---

#### US-005: Markdown Idea Editor

**Priority**: P0
**Effort**: L (5-7 days)
**Epic**: EPIC-003

**Story**:

> As a user who wants to develop a captured spark,
> I want a rich markdown editor where I can write, format, and structure my idea with headings, lists, bold/italic, and links,
> so that I can develop a rough thought into a well-articulated concept.

**Acceptance Criteria**:

- Given the user clicks on an idea in the list or navigates to an idea URL, when the canvas loads, then a markdown editor is displayed with the idea's title and content.
- Given the editor is loaded, when the user types markdown syntax, then it is rendered in real-time with WYSIWYG-style formatting (headings, bold, italic, lists, links, code blocks, blockquotes).
- Given the user edits the content, when they pause typing for 1 second (debounced), then the changes are auto-saved to the local database without requiring a manual save action.
- Given the auto-save triggers, when the save completes, then a subtle "Saved" indicator is shown (not disruptive).
- Given the editor has content, when the user adds a heading, then it appears in an optional outline/table-of-contents sidebar for long ideas.
- Given the user is on the canvas, when they edit the idea title, then the title updates in-place (inline editing) and auto-saves.

**Edge Cases**:
- Very large idea (> 50,000 characters) -- editor should remain responsive; consider virtual rendering for extreme cases.
- Concurrent edits in multiple browser tabs -- last-write-wins with conflict detection and warning.
- Browser crash during edit -- auto-save interval ensures at most 1 second of data loss.
- Copy/paste from external sources (Word, web pages) -- strip unsupported formatting, preserve plain text and basic markdown.

**Constraints Applied**:
- Use TipTap or Milkdown editor (GAP-001 recommendation)
- Local-first: all saves go to local SQLite (SIG-003)
- Files under 500 lines: editor component should delegate to sub-components

**Dependencies**:
- Requires: US-002 (data layer), US-003 (spark exists to open on canvas)
- Blocks: US-006, US-008, US-009

**Design Notes**:
- TipTap is the recommended choice: mature, extensible, React-native, excellent markdown support
- Toolbar with common formatting actions (bold, italic, heading, list, link, code)
- Keyboard shortcuts for all formatting actions (standard: Ctrl+B, Ctrl+I, etc.)
- Autofocus on content area when canvas opens
- Title displayed prominently above the editor

---

#### US-006: Structured Idea Sections

**Priority**: P1
**Effort**: M (3-4 days)
**Epic**: EPIC-003

**Story**:

> As a user developing an idea,
> I want optional structured sections (Problem, Solution, Evidence, Next Steps) that I can use as a thinking framework,
> so that I have guidance on how to develop a raw thought into a complete concept without being forced into rigid structure.

**Acceptance Criteria**:

- Given the user is on the idea canvas, when they click "Add Section" or use a slash command, then a menu of section templates is shown: Problem, Solution, Evidence, Next Steps, Open Questions, and Custom.
- Given the user selects a section template, when it is inserted, then the section appears as a labeled heading in the editor with optional placeholder text (e.g., "What problem does this idea solve?").
- Given a section is inserted, when the user types below it, then the content is part of the idea's markdown body (sections are markdown headings, not separate data fields).
- Given sections exist in the editor, when the user views the outline sidebar, then the sections appear as navigable entries.
- Given the user does not want sections, when they write freely without using the section feature, then the idea is saved as unstructured markdown with no penalty or prompting.

**Edge Cases**:
- User deletes a section heading but keeps the content -- content remains as unstructured text.
- User reorders sections -- standard text editing applies; drag-and-drop for headings is a Phase 2 enhancement.
- User adds the same section type twice -- allow it; sections are just markdown headings.

**Constraints Applied**:
- Development over capture (SD principle #1): sections help develop ideas
- Progressive complexity (SD principle #5): sections are optional, not required

**Dependencies**:
- Requires: US-005 (markdown editor)
- Blocks: None

---

#### US-007: Idea Metadata Panel

**Priority**: P0
**Effort**: M (3-4 days)
**Epic**: EPIC-003

**Story**:

> As a user viewing an idea on the canvas,
> I want to see and edit the idea's metadata (status, tags, creation date, last modified) in a side panel,
> so that I can manage the idea's lifecycle and categorization without cluttering the writing space.

**Acceptance Criteria**:

- Given the user is on the idea canvas, when the canvas loads, then a metadata panel is visible (sidebar or collapsible panel) showing: status, tags, created date, last modified date.
- Given the metadata panel is visible, when the user clicks on the status field, then a dropdown appears with the valid statuses: Spark, Developing, Refined, Parked, Archived.
- Given the user changes the status, when they select a new status, then the status updates immediately and auto-saves.
- Given the metadata panel is visible, when the user views the tags section, then existing tags are shown as chips with an option to add or remove tags.
- Given the metadata panel shows dates, when viewed, then dates are displayed in a human-readable relative format (e.g., "2 hours ago", "Jan 15, 2026") with exact timestamp on hover.
- Given the user collapses the metadata panel, when they continue editing, then the full width is available for the editor.

**Edge Cases**:
- Idea with no tags -- show "Add tags..." placeholder.
- Status transition validation -- all transitions are allowed (no enforced workflow in MVP); the state machine is informational, not restrictive.

**Constraints Applied**:
- Simple state machine for status tracking (BLOCK-001, option A)
- Tags per existing data model (GAP-002)

**Dependencies**:
- Requires: US-005 (canvas), US-002 (data layer), US-003 (idea creation)
- Blocks: US-011 (status tracking views)

---

### EPIC-004: AI Contextual Chat

**Objective**: Provide a single, high-quality AI chat interface where users can discuss their ideas with AI as a thinking partner, with the current idea loaded as context. This is the core differentiator.

**Success Criteria**: Users engage in 3+ AI interactions per session. AI response quality rated 4.0+/5.0. Response latency < 3 seconds p95.

**Priority**: P0

**Duration**: Weeks 5-8

---

#### US-008: AI Chat Panel

**Priority**: P0
**Effort**: L (5-7 days)
**Epic**: EPIC-004

**Story**:

> As a user developing an idea on the canvas,
> I want to open a chat panel and have a conversation with AI about my idea,
> so that the AI can challenge my thinking, suggest improvements, identify gaps, and help me develop the idea further.

**Acceptance Criteria**:

- Given the user is on the idea canvas, when they click "Chat with AI" (or press a keyboard shortcut), then a chat panel opens alongside the editor (split view or slide-in panel).
- Given the chat panel opens, when the AI context is loaded, then the current idea's title and content are automatically included as context for the AI conversation (the user does not need to paste their idea into the chat).
- Given the chat panel is open and context is loaded, when the user types a message and sends it, then the AI responds with a contextual, thoughtful reply that references specifics from the idea.
- Given the AI is generating a response, when the response is being produced, then the response streams token-by-token into the chat panel (streaming response, not waiting for full completion).
- Given the AI responds, when the response is complete, then the response time is under 3 seconds for the first token (p95).
- Given a conversation is in progress, when the user sends multiple messages, then the full conversation history is maintained within the session and the AI references earlier messages appropriately.
- Given the user closes the chat panel, when they reopen it, then the previous conversation for that idea is still visible (persisted to ai_interactions table).
- Given the user is chatting, when they want to go back to editing, then the editor remains fully functional alongside the open chat panel (no blocking modals).

**Edge Cases**:
- Idea has no content yet (just a title) -- AI should acknowledge the sparse context and ask clarifying questions to help develop the idea from scratch.
- Very long idea (> 10,000 characters) -- summarize the idea before including as context to stay within token limits (SIG-001 cost optimization).
- AI API is unreachable (network error, rate limit) -- show a clear error message: "AI is currently unavailable. Your ideas are safe -- AI features require an internet connection." Allow retry.
- AI returns an empty or malformed response -- show "Something went wrong with the AI response. Please try again."
- User sends message while previous response is still streaming -- queue the message or disable send until streaming completes.

**Constraints Applied**:
- Single contextual chat mode, not five specialized modes (BLOCK-002)
- AI as thinking partner, not autocomplete (SD principle #2)
- Response latency < 3 seconds p95 (SD guardrail metric)
- Use Vercel AI SDK for provider abstraction (NOTE-001, GAP-001)
- Cost tracking per interaction (SIG-001)
- Local-first with cloud AI: transparent about data flow (CONFLICT-002)

**Dependencies**:
- Requires: US-005 (canvas with idea content), US-002 (data layer for interaction history)
- Blocks: US-009 (AI cost tracking)

**Design Notes**:
- Chat panel slides in from the right side of the canvas
- System prompt should establish the AI as a thinking partner: "You are helping the user develop their idea. Be specific, reference their content, challenge assumptions, ask probing questions, suggest angles they have not considered."
- Include the idea title, status, and full content (or summary if > 5000 chars) in the system context
- Use Vercel AI SDK with Claude API as primary provider
- Store each interaction (prompt + response + model + tokens + cost estimate) in ai_interactions table

---

#### US-009: AI Interaction Cost Tracking

**Priority**: P0
**Effort**: S (2 days)
**Epic**: EPIC-004

**Story**:

> As the developer and operator of IdeaForge,
> I want every AI interaction to be tracked with token counts and estimated cost,
> so that I can monitor API spend, understand per-user economics, and set appropriate usage limits.

**Acceptance Criteria**:

- Given an AI interaction completes, when the response is received, then the following are recorded in the ai_interactions table: idea_id, prompt text, response text, model used, input token count, output token count, and estimated cost (USD).
- Given AI interactions are tracked, when the developer queries the ai_interactions table, then they can calculate total cost per user session, per day, and per idea.
- Given a cost tracking record, when the cost estimate is calculated, then it uses the current model's pricing (configurable, not hardcoded) applied to the actual token counts.
- Given the user is on the Settings page, when they view AI usage, then they see a count of AI interactions used this month (preparation for future usage limits).

**Edge Cases**:
- API response does not include token counts (some providers) -- estimate based on character count heuristics.
- Cost calculation for cached responses -- mark as $0 cost.

**Constraints Applied**:
- AI cost tracking from day one is a survival metric (SIG-001)
- Track API calls, tokens, and costs (CLAUDE.md production readiness rule)

**Dependencies**:
- Requires: US-008 (AI chat produces interactions to track)
- Blocks: None (but informs future usage limit features)

---

#### US-010: AI Privacy Transparency

**Priority**: P0
**Effort**: S (1 day)
**Epic**: EPIC-004

**Story**:

> As a user who cares about the privacy of my ideas,
> I want to clearly understand what data is sent to the AI provider and what stays local,
> so that I can make an informed decision about using AI features.

**Acceptance Criteria**:

- Given the user opens the AI chat panel for the first time, when the panel renders, then a brief, dismissible notice is shown: "Your ideas are stored locally on your device. When you use AI features, your idea content is sent to [provider name] for processing. [Provider] does not store or train on your data. AI features are optional."
- Given the user has dismissed the notice, when they open the chat panel again, then the notice does not reappear (preference stored locally).
- Given the user navigates to Settings, when they view the Privacy section, then a detailed explanation of data handling is available: what is stored locally, what is sent to the AI provider, what the provider's data retention policy is.

**Edge Cases**:
- AI provider changes -- privacy notice text should be configurable, not hardcoded.

**Constraints Applied**:
- Transparent data handling (CONFLICT-002 resolution)
- Local-first positioning with cloud-optional AI (CONFLICT-002)

**Dependencies**:
- Requires: US-008 (AI chat panel)
- Blocks: None

---

### EPIC-005: Idea Status and Lifecycle

**Objective**: Enable users to track idea progress through a simple status workflow, filter ideas by status, and maintain an organized workspace as their idea count grows.

**Success Criteria**: Users move at least 1 idea per week from "Spark" to "Developing" or beyond (north star metric). Users can find any idea within 10 seconds.

**Priority**: P0

**Duration**: Weeks 8-9

---

#### US-011: Idea Status Workflow

**Priority**: P0
**Effort**: S (2 days)
**Epic**: EPIC-005

**Story**:

> As a user managing multiple ideas,
> I want to set and change the status of each idea (Spark, Developing, Refined, Parked, Archived),
> so that I can track which ideas need attention, which are mature, and which are on hold.

**Acceptance Criteria**:

- Given a new idea is created via spark capture, when the idea is saved, then its status defaults to "Spark."
- Given the user is on the idea canvas, when they change the status via the metadata panel dropdown, then the status updates and auto-saves immediately.
- Given the user changes an idea's status, when the change is saved, then the updated_at timestamp is refreshed.
- Given the status is changed, when the user views the ideas list, then the idea appears in the correct status category (if filtered) and shows a visual status indicator (color dot or badge).
- Given the available statuses, when listed, then they are: Spark (blue), Developing (amber), Refined (green), Parked (gray), Archived (muted/hidden by default).
- Given an idea has status "Archived," when the user views the main ideas list, then archived ideas are hidden by default but viewable via a filter toggle.

**Edge Cases**:
- All status transitions are allowed (no enforced sequence in MVP) -- a user can go from Spark directly to Archived.
- Bulk status change -- not in MVP; single idea status change only.
- Status with zero ideas -- status filter still shows in the filter list with a count of 0.

**Constraints Applied**:
- Simple state machine, not evolution history (BLOCK-001 resolution)
- Status values per guardian's recommendation: Spark > Developing > Refined > Parked > Archived

**Dependencies**:
- Requires: US-002 (data layer), US-007 (metadata panel)
- Blocks: US-012 (ideas list with status filters)

---

#### US-012: Ideas List and Grid View

**Priority**: P0
**Effort**: M (3-4 days)
**Epic**: EPIC-005

**Story**:

> As a user with many ideas,
> I want to view all my ideas in a list or grid, with the ability to sort and filter by status, date, and tags,
> so that I can quickly find the idea I want to work on or see which ideas need attention.

**Acceptance Criteria**:

- Given the user navigates to the Ideas view, when the view loads, then all non-archived ideas are displayed in a list view by default (sorted by last modified, most recent first).
- Given the ideas list is displayed, when the user clicks a view toggle, then the display switches between list view (compact rows) and grid view (card layout).
- Given the ideas are displayed, when the user clicks a status filter (Spark, Developing, Refined, Parked, Archived), then only ideas with that status are shown. Multiple status filters can be active simultaneously.
- Given the ideas are displayed, when the user selects a sort option, then ideas are sorted by: Last Modified (default), Created Date, Title (alphabetical), or Status.
- Given the ideas list, when each idea entry is rendered, then it shows: title, status indicator (color), first line or summary of content (truncated to 100 chars), tag chips, and last modified date.
- Given the user clicks on an idea in the list, when they click, then the idea canvas opens for that idea.
- Given there are no ideas, when the list is empty, then a friendly empty state is shown with a prompt to create the first idea.

**Edge Cases**:
- Hundreds of ideas -- implement virtual scrolling or pagination (> 100 ideas) for performance.
- Idea with very long title -- truncate with ellipsis in list/grid view.
- Filter combination returns zero results -- show "No ideas match your filters" with a clear-filters action.

**Constraints Applied**:
- Progressive complexity (SD principle #5): simple list first, filters available but not mandatory

**Dependencies**:
- Requires: US-002 (data layer), US-003 (ideas exist), US-011 (status tracking)
- Blocks: US-013 (search enhances the list)

---

#### US-013: Full-Text Search

**Priority**: P0
**Effort**: M (3 days)
**Epic**: EPIC-005

**Story**:

> As a user looking for a specific idea,
> I want to search across all idea titles and content with instant results,
> so that I can find any idea within seconds regardless of how many ideas I have.

**Acceptance Criteria**:

- Given the user is anywhere in the application, when they click the search bar (or press Ctrl/Cmd + K), then a search input is focused and ready for typing.
- Given the user types a search query, when at least 2 characters are entered, then matching ideas are shown in real-time (as-you-type results, debounced at 200ms).
- Given search results are displayed, when an idea matches, then the search highlights the matching text in the title and/or content preview.
- Given search results are displayed, when the user clicks on a result, then the idea canvas opens for that idea.
- Given the search query matches zero ideas, when results are displayed, then a "No ideas found for '[query]'" message is shown.
- Given the user is searching, when they clear the search field or press Escape, then the full ideas list is restored.
- Given ideas exist with tags, when the user types a tag name in search, then ideas with that tag are included in results.

**Edge Cases**:
- Special characters in search query -- escape for SQLite FTS5 syntax.
- Very common word matches hundreds of ideas -- limit display to top 20 results with "Show all" option.
- Search while offline -- fully functional (local-first, SQLite FTS5).

**Constraints Applied**:
- Full-text search via SQLite FTS5 (SIG-003, GAP-001 recommendation)
- Client-side search, no server dependency (local-first)

**Dependencies**:
- Requires: US-002 (data layer with FTS5 virtual table), US-003 (ideas exist)
- Blocks: None

---

### EPIC-006: Polish, Onboarding, and Data Safety

**Objective**: Deliver a polished first-run experience, data export for safety, and overall quality that meets the "time to first value < 3 minutes" guardrail.

**Success Criteria**: New users create their first spark within 3 minutes of first visit. Users can export all data at any time. No data loss incidents.

**Priority**: P0

**Duration**: Weeks 10-12

---

#### US-014: First-Run Onboarding Experience

**Priority**: P0
**Effort**: M (3-4 days)
**Epic**: EPIC-006

**Story**:

> As a first-time user visiting IdeaForge,
> I want a brief, non-intrusive onboarding that shows me how to capture my first idea and introduces the AI chat feature,
> so that I reach my first moment of value within 3 minutes without feeling overwhelmed.

**Acceptance Criteria**:

- Given a user visits IdeaForge for the first time (no existing data in local storage), when the application loads, then a welcome experience begins (not a multi-step tutorial wizard, but a guided first action).
- Given the onboarding starts, when the welcome message is shown, then it is concise (under 50 words) and immediately prompts: "What is an idea you have been thinking about? Capture it now."
- Given the user captures their first spark during onboarding, when the spark is saved, then the onboarding advances to show a brief tooltip pointing to the "Open on Canvas" action: "Now develop it further."
- Given the user opens their first idea on the canvas, when the canvas loads, then a tooltip points to the AI chat button: "Try asking the AI to challenge your idea or explore it further."
- Given the onboarding is complete (3 steps: capture, open canvas, see AI chat), when the user dismisses it, then the onboarding does not appear again (preference stored locally).
- Given the user skips onboarding at any step, when they click "Skip" or dismiss, then the onboarding ends and does not reappear.

**Edge Cases**:
- User has existing data (returning user, different browser) -- no onboarding shown.
- User completes onboarding partially then closes browser -- resume from last incomplete step on next visit.
- Screen reader / keyboard-only users -- onboarding tooltips must be accessible (ARIA labels, focus management).

**Constraints Applied**:
- Time to first value < 3 minutes (SD guardrail metric)
- Progressive complexity (SD principle #5)
- No account required (NOTE-003)

**Dependencies**:
- Requires: US-001 (shell), US-003 (spark capture), US-005 (canvas), US-008 (AI chat)
- Blocks: None

---

#### US-015: Data Export (JSON and Markdown)

**Priority**: P0
**Effort**: M (3 days)
**Epic**: EPIC-006

**Story**:

> As a user who stores all my ideas locally,
> I want to export all my ideas as JSON and/or Markdown files at any time,
> so that I have a portable backup of my data and am never locked into IdeaForge.

**Acceptance Criteria**:

- Given the user navigates to Settings > Data, when they click "Export All Ideas," then a dialog appears offering format choices: JSON (complete data with metadata) or Markdown (human-readable, one file per idea).
- Given the user selects JSON export, when the export runs, then a single JSON file is downloaded containing all ideas, tags, connections, and AI interaction history with full metadata.
- Given the user selects Markdown export, when the export runs, then a ZIP file is downloaded containing one .md file per idea, with YAML frontmatter for metadata (status, tags, dates).
- Given the export completes, when the file is downloaded, then a confirmation message is shown: "Exported [N] ideas successfully."
- Given a single idea is open on the canvas, when the user clicks "Export This Idea" from the idea menu, then that single idea is exported in the chosen format.

**Edge Cases**:
- Zero ideas to export -- show "No ideas to export" message; disable export button.
- Very large export (1000+ ideas) -- show progress indicator; do not block UI.
- Export includes AI interaction history -- include in JSON export; exclude from Markdown export (too verbose).
- Special characters in idea titles -- sanitize for use as filenames in Markdown export.

**Constraints Applied**:
- JSON/Markdown export from day one (NOTE-002)
- No data lock-in; portable format
- Auto-backup complements manual export (US-002 handles auto-backup)

**Dependencies**:
- Requires: US-002 (data layer)
- Blocks: None

---

#### US-016: Settings Page

**Priority**: P1
**Effort**: S (2 days)
**Epic**: EPIC-006

**Story**:

> As a user of IdeaForge,
> I want a settings page where I can configure AI provider, view usage stats, manage data, and set preferences,
> so that I can customize the application to my needs.

**Acceptance Criteria**:

- Given the user clicks Settings in the sidebar, when the settings page loads, then it shows sections: AI Configuration, Data Management, Privacy, and About.
- Given the AI Configuration section, when viewed, then the user can enter or update their AI API key (stored locally, never transmitted except to the AI provider).
- Given the Data Management section, when viewed, then the user sees: total idea count, database size, export button, and a "Clear All Data" option (with confirmation dialog).
- Given the Privacy section, when viewed, then the user sees the privacy explanation from US-010 in a persistent, detailed format.
- Given the About section, when viewed, then it shows the application version, link to documentation/support, and link to the project website.

**Edge Cases**:
- Invalid API key entered -- validate on save with a test API call; show error if invalid.
- "Clear All Data" -- require typing "DELETE" to confirm (prevent accidental data loss).

**Constraints Applied**:
- API key stored locally only (local-first, SIG-003)
- No hardcoded credentials (CLAUDE.md critical constraint)

**Dependencies**:
- Requires: US-001 (shell with navigation), US-002 (data layer)
- Blocks: None

---

#### US-017: Error Handling and Offline Indicators

**Priority**: P0
**Effort**: S (2 days)
**Epic**: EPIC-006

**Story**:

> As a user working in IdeaForge,
> I want clear feedback when something goes wrong or when I am offline,
> so that I know whether my work is saved and which features are available.

**Acceptance Criteria**:

- Given the browser loses network connectivity, when the offline state is detected, then a non-intrusive banner appears: "You are offline. Your ideas are saved locally. AI features require an internet connection."
- Given the user is offline, when they try to use the AI chat, then a message appears in the chat panel: "AI is unavailable while offline. Your ideas are safe."
- Given the network reconnects, when connectivity is restored, then the offline banner disappears automatically.
- Given a database operation fails, when an error occurs, then a toast notification shows a user-friendly message (not a stack trace) with a retry option if applicable.
- Given an unexpected error occurs anywhere in the application, when the error boundary catches it, then the user sees "Something went wrong. Your data is saved. Try refreshing the page." with an option to report the issue.

**Edge Cases**:
- Intermittent connectivity (flapping) -- debounce online/offline detection (3-second threshold) to avoid banner flicker.
- Error during auto-save -- retry with exponential backoff (3 retries), then show persistent warning if all retries fail.

**Constraints Applied**:
- Typed errors with context, never swallow silently (CLAUDE.md code quality rule)
- Retry logic with exponential backoff (CLAUDE.md production readiness rule)
- No stack traces in user-facing errors (CLAUDE.md critical constraint)

**Dependencies**:
- Requires: US-001 (shell for banner placement), US-002 (data layer for save error detection)
- Blocks: None

---

#### US-018: Keyboard Shortcuts

**Priority**: P1
**Effort**: S (1-2 days)
**Epic**: EPIC-006

**Story**:

> As a power user who values speed,
> I want keyboard shortcuts for common actions (new idea, search, toggle AI chat),
> so that I can navigate and operate IdeaForge without reaching for the mouse.

**Acceptance Criteria**:

- Given the user is anywhere in the application, when they press Ctrl/Cmd + N, then the spark capture form opens.
- Given the user is anywhere in the application, when they press Ctrl/Cmd + K, then the search input is focused.
- Given the user is on the idea canvas, when they press Ctrl/Cmd + Shift + A, then the AI chat panel toggles open/closed.
- Given the user is on the idea canvas, when they press Ctrl/Cmd + S, then a manual save is triggered (with confirmation, even though auto-save is active).
- Given the user wants to discover shortcuts, when they press Ctrl/Cmd + /, then a keyboard shortcut cheat sheet overlay is shown.
- Given a shortcut conflicts with the browser or editor, when the conflict is detected, then the application shortcut does not override the browser/editor default.

**Edge Cases**:
- User on a non-US keyboard layout -- shortcuts should use key positions, not characters.
- Focus is inside the editor vs. outside -- some shortcuts should only work when focus is not in a text input (except editor-specific ones).

**Dependencies**:
- Requires: US-001, US-003, US-005, US-008
- Blocks: None

---

#### US-019: Idea Deletion

**Priority**: P0
**Effort**: S (1-2 days)
**Epic**: EPIC-006

**Story**:

> As a user managing my ideas,
> I want to delete ideas I no longer need,
> so that my workspace stays organized and free of clutter.

**Acceptance Criteria**:

- Given the user is on the idea canvas or in the ideas list, when they click "Delete" on an idea, then a confirmation dialog appears: "Are you sure you want to delete this idea? This cannot be undone."
- Given the confirmation dialog is shown, when the user confirms deletion, then the idea and its associated tags, connections, and AI interactions are removed from the database.
- Given the deletion completes, when the user returns to the ideas list, then the deleted idea no longer appears.
- Given the idea had connections to other ideas, when it is deleted, then the connections referencing it are also deleted (cascade), but the connected ideas themselves are not affected.
- Given the user cancels the deletion, when they click "Cancel," then no data is modified.

**Edge Cases**:
- Deleting the only idea -- return to empty state with create prompt.
- Deleting while offline -- works normally (local operation).
- Bulk deletion -- not in MVP; single idea deletion only.

**Dependencies**:
- Requires: US-002 (data layer), US-003 or US-005 (idea exists)
- Blocks: None

---

## Phase 1.5: Fast Follow (Weeks 13-18)

These features were deferred from MVP per the guardian constraint analysis. They enhance the core experience significantly and should be built immediately after MVP launch.

---

### EPIC-007: AI Prompt Templates

**Objective**: Add pre-built prompt templates on top of the contextual chat that give users structured ways to interact with the AI -- Challenge, Explore, Connect, and Summarize modes.

**Priority**: P1

**Duration**: Week 13

---

#### US-020: Pre-Built AI Prompt Templates

**Priority**: P1
**Effort**: M (3-5 days)
**Epic**: EPIC-007

**Story**:

> As a user chatting with AI about my idea,
> I want pre-built prompt buttons (Challenge This, Explore Adjacent Ideas, Find Connections, Summarize for Action),
> so that I can quickly trigger specific types of AI thinking without crafting prompts myself.

**Acceptance Criteria**:

- Given the AI chat panel is open, when the user views the input area, then quick-action buttons are displayed above the text input: "Challenge," "Explore," "Connect," "Summarize."
- Given the user clicks "Challenge," when the prompt is sent, then the AI critically examines the idea, identifies weaknesses, questions assumptions, and suggests what could go wrong.
- Given the user clicks "Explore," when the prompt is sent, then the AI suggests adjacent ideas, alternative angles, and "what if" scenarios related to the current idea.
- Given the user clicks "Connect," when the prompt is sent, then the AI analyzes the current idea against other ideas in the workspace (titles and summaries from the database) and suggests potential connections with explanations.
- Given the user clicks "Summarize," when the prompt is sent, then the AI produces a concise action-oriented summary: key insight, strongest aspect, biggest risk, and suggested next step.
- Given any template is used, when the AI responds, then the interaction is recorded in the chat history like any other message (the user can follow up on it).

**Dependencies**:
- Requires: US-008 (AI contextual chat)

---

### EPIC-008: Connection Discovery and Visualization

**Objective**: Enable users to discover relationships between ideas through AI-suggested connections and a visual graph, making the idea graph tangible and navigable.

**Priority**: P1

**Duration**: Weeks 14-17

---

#### US-021: Manual Idea Connections

**Priority**: P1
**Effort**: M (3-4 days)
**Epic**: EPIC-008

**Story**:

> As a user who sees a relationship between two ideas,
> I want to create a typed connection (related, builds on, contradicts, merges into) between them,
> so that I can build a web of related thinking that I can navigate later.

**Acceptance Criteria**:

- Given the user is on the idea canvas, when they view the metadata panel, then a "Connections" section is visible showing existing connections (if any) and an "Add Connection" action.
- Given the user clicks "Add Connection," when the connection dialog opens, then they can search for another idea by title and select a connection type: Related, Builds On, Contradicts, Merges Into.
- Given a connection is created, when saved, then it appears in the Connections section of both the source and target ideas (bidirectional display, even though storage may be directional).
- Given a connection exists, when the user clicks a connected idea title, then they navigate to that idea canvas.
- Given a connection exists, when the user clicks "Remove" on a connection, then the connection is deleted after confirmation.

**Dependencies**:
- Requires: US-002 (data layer with connections table), US-005 (canvas)

---

#### US-022: AI Connection Suggestions

**Priority**: P1
**Effort**: L (5-7 days)
**Epic**: EPIC-008

**Story**:

> As a user with multiple ideas,
> I want the AI to suggest connections between my ideas that I might not have noticed,
> so that I can discover non-obvious relationships in my thinking.

**Acceptance Criteria**:

- Given a user has 5 or more ideas, when they save or significantly edit an idea, then the system runs a background connection analysis (keyword/TF-IDF matching against other ideas).
- Given the analysis finds potentially related ideas (similarity score above threshold), when results are available, then a non-intrusive suggestion appears: "This idea might relate to: [idea title]. View connection?"
- Given the user accepts a suggested connection, when they click "Connect," then a connection of type "ai_suggested" is created between the two ideas.
- Given the user dismisses a suggestion, when they click "Dismiss," then that specific suggestion is not shown again.
- Given few ideas exist (fewer than 5), when the system checks for connections, then no suggestions are made (insufficient data).

**Dependencies**:
- Requires: US-021 (connection data model), US-002 (data layer)

---

#### US-023: Interactive Idea Graph Visualization

**Priority**: P1
**Effort**: L (7-10 days)
**Epic**: EPIC-008

**Story**:

> As a user who wants to see the big picture of my thinking,
> I want an interactive graph visualization where ideas are nodes and connections are edges,
> so that I can visually explore the structure of my idea graph and discover clusters.

**Acceptance Criteria**:

- Given the user navigates to the Graph view, when the view loads, then a force-directed graph is rendered with ideas as nodes and connections as edges.
- Given the graph is displayed, when the user hovers over a node, then a tooltip shows the idea title, status, and creation date.
- Given the graph is displayed, when the user clicks a node, then the idea canvas opens for that idea.
- Given the graph has many nodes, when the user scrolls or pinches, then the graph zooms in/out smoothly. The user can also pan by dragging the background.
- Given ideas have different statuses, when nodes are rendered, then they are color-coded by status (matching the status colors from the list view).
- Given the graph has connection types, when edges are rendered, then edge style or color varies by type (e.g., solid for "builds on," dashed for "contradicts").

**Dependencies**:
- Requires: US-021 (connections exist), US-002 (data layer)

**Design Notes**:
- Use Cytoscape.js (GAP-001 recommendation)
- Performance target: smooth at up to 200 nodes

---

### EPIC-009: Desktop Wrapper

**Objective**: Package the web application as a native desktop app using Tauri for improved performance, native SQLite access, and a more "app-like" experience.

**Priority**: P1

**Duration**: Week 18

---

#### US-024: Tauri Desktop Application

**Priority**: P1
**Effort**: L (5-7 days)
**Epic**: EPIC-009

**Story**:

> As a user who prefers desktop applications,
> I want to install IdeaForge as a native desktop app,
> so that I get faster performance, native file system access, and an always-available application without a browser tab.

**Acceptance Criteria**:

- Given the user downloads the Tauri desktop app, when they install and launch it, then the full IdeaForge web application runs inside a native window.
- Given the desktop app is running, when data is stored, then it uses native SQLite (better-sqlite3 via Tauri) instead of sql.js WASM for improved performance.
- Given the desktop app is running, when the user works offline, then all non-AI features function without degradation.
- Given the desktop app, when an update is available, then the user is notified and can update in-place.

**Dependencies**:
- Requires: All Phase 1 stories (the web app must be complete)

---

## Phase 2+ Features (Future Backlog)

These features are recorded for future planning. No user stories are written at this time; they will be decomposed when they enter active planning.

| Feature | Phase | Priority | Rationale |
|---------|-------|----------|-----------|
| **Team Workspaces** | Phase 3 | P3 | B2B value proposition; requires auth, permissions, server-side storage |
| **Real-Time Collaboration** | Phase 3 | P3 | Multiple users editing the same idea; requires CRDT or OT infrastructure |
| **Import from Notion/Obsidian** | Phase 2 | P2 | Reduces switching cost; requires format parsing for each source |
| **Browser Extension** | Phase 2 | P2 | Capture ideas while browsing; requires extension packaging for Chrome/Firefox |
| **Idea Resurfacing ("Idea of the Day")** | Phase 2 | P2 | Combats forgetting; AI selects an idea to revisit based on staleness and potential |
| **AI Synthesis Reports** | Phase 2 | P2 | Monthly summary of idea graph themes; high AI cost, high value |
| **Voting/Scoring Framework** | Phase 3 | P3 | Team feature for idea evaluation; enterprise pathway |
| **Project Management Integration** | Phase 4 | P3 | Push refined ideas to Linear/Jira; requires API integrations |
| **Mobile App** | Phase 2 | P2 | Native mobile capture; responsive web covers basic mobile use in MVP |
| **SSO and Enterprise Auth** | Phase 4 | P3 | Enterprise requirement; premature before team features |
| **Voice-to-Text Capture** | Phase 2 | P2 | Deferred per SIG-005; more valuable on mobile |
| **Embedding-Based Connection Discovery** | Phase 2 | P2 | Upgrade from TF-IDF to vector embeddings for higher quality connections |
| **Idea Challenges/Campaigns** | Phase 4 | P3 | Enterprise innovation feature: "Submit ideas for Q3 direction" |

---

## Dependency Map

```
Phase 1 -- Foundation [Weeks 1-2, sequential]:

  [US-001] Application Shell
      |
      v
  [US-002] Local-First Data Layer (SQLite-in-WASM)
      |
      +-------+-------+-------+
      |       |       |       |
      v       v       v       v

Phase 1 -- Core Features [Weeks 2-9, parallel after foundation]:

  [US-003] Quick Spark       [US-005] Markdown Idea Editor
      |                           |
      v                           +-------+-------+
  [US-004] Tags on Capture        |       |       |
                                  v       v       v
                             [US-006]  [US-007]  [US-008] AI Chat Panel
                             Sections  Metadata       |
                                          |           +-------+
                                          v           |       |
                                     [US-011]    [US-009]  [US-010]
                                     Status      Cost      Privacy
                                     Workflow    Tracking  Notice
                                          |
                                          v
                                     [US-012] Ideas List/Grid
                                          |
                                          v
                                     [US-013] Full-Text Search

Phase 1 -- Polish [Weeks 10-12, parallel]:

  [US-014] Onboarding      (requires US-001, US-003, US-005, US-008)
  [US-015] Data Export      (requires US-002)
  [US-016] Settings         (requires US-001, US-002)
  [US-017] Error Handling   (requires US-001, US-002)
  [US-018] Shortcuts        (requires US-001, US-003, US-005, US-008)
  [US-019] Idea Deletion    (requires US-002)

Phase 1.5 -- Enhancement [Weeks 13-18]:

  [US-020] AI Prompt Templates        (requires US-008)
  [US-021] Manual Connections         (requires US-002, US-005)
  [US-022] AI Connection Suggestions  (requires US-021)
  [US-023] Graph Visualization        (requires US-021)
  [US-024] Tauri Desktop Wrapper      (requires all Phase 1)
```

---

## Prioritization Matrix

### RICE Scores (Phase 1 Stories)

| Story | Reach (1-10) | Impact (0.25-3) | Confidence (0.5-1) | Effort (person-weeks) | RICE Score | Priority |
|-------|-------------|-----------------|--------------------|-----------------------|------------|----------|
| US-001 App Shell | 10 | 1 | 1.0 | 0.8 | 12.5 | P0 |
| US-002 Data Layer | 10 | 3 | 0.8 | 1.2 | 20.0 | P0 |
| US-003 Spark Capture | 10 | 3 | 1.0 | 0.8 | 37.5 | P0 |
| US-004 Tags on Capture | 6 | 0.5 | 0.8 | 0.4 | 6.0 | P1 |
| US-005 Markdown Editor | 10 | 3 | 0.8 | 1.2 | 20.0 | P0 |
| US-006 Structured Sections | 7 | 1 | 0.8 | 0.8 | 7.0 | P1 |
| US-007 Metadata Panel | 9 | 2 | 1.0 | 0.8 | 22.5 | P0 |
| US-008 AI Chat Panel | 10 | 3 | 0.8 | 1.2 | 20.0 | P0 |
| US-009 Cost Tracking | 3 | 2 | 1.0 | 0.4 | 15.0 | P0 |
| US-010 Privacy Notice | 8 | 1 | 1.0 | 0.2 | 40.0 | P0 |
| US-011 Status Workflow | 9 | 2 | 1.0 | 0.4 | 45.0 | P0 |
| US-012 Ideas List/Grid | 10 | 2 | 1.0 | 0.8 | 25.0 | P0 |
| US-013 Full-Text Search | 8 | 2 | 1.0 | 0.6 | 26.7 | P0 |
| US-014 Onboarding | 10 | 2 | 0.8 | 0.8 | 20.0 | P0 |
| US-015 Data Export | 7 | 2 | 1.0 | 0.6 | 23.3 | P0 |
| US-016 Settings | 5 | 1 | 1.0 | 0.4 | 12.5 | P1 |
| US-017 Error Handling | 10 | 1 | 1.0 | 0.4 | 25.0 | P0 |
| US-018 Keyboard Shortcuts | 4 | 1 | 1.0 | 0.3 | 13.3 | P1 |
| US-019 Idea Deletion | 8 | 1 | 1.0 | 0.3 | 26.7 | P0 |

### Priority Bands Summary

**P0 -- Must Ship (MVP)**: 15 stories

| Stories | Effort | Rationale |
|---------|--------|-----------|
| US-001, US-002, US-003, US-005, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-017, US-019 | ~10 person-weeks | Core capture-develop-track loop with AI chat, search, export, onboarding, and error handling. This is the minimum set for a coherent, launchable product. |

**P1 -- Should Ship (Phase 1 if time allows, otherwise Phase 1.5)**: 4 stories

| Stories | Effort | Rationale |
|---------|--------|-----------|
| US-004, US-006, US-016, US-018 | ~1.5 person-weeks | Tags on capture, structured sections, settings page, keyboard shortcuts. These enhance the experience but the product is usable without them. |

**Buffer**: 1 person-week for unexpected issues, bug fixes, and scope adjustments.

**Total Phase 1**: ~12.5 person-weeks (fits within 12 calendar weeks with P1 stories serving as scope relief valve).

---

## MVP Definition

### What MVP Delivers

A solo user can:
1. **Capture** a spark in under 5 seconds (title + optional description)
2. **Develop** the spark on a rich markdown canvas with structured sections
3. **Chat with AI** about their idea, getting challenges, suggestions, and feedback with the idea pre-loaded as context
4. **Track status** through Spark > Developing > Refined > Parked > Archived
5. **Search and browse** all ideas with full-text search, status filters, and sort options
6. **Export data** as JSON or Markdown at any time for backup and portability
7. **Work offline** for all non-AI features (local-first)

### What MVP Excludes (and Why)

| Excluded Feature | Why | Impact of Exclusion | When to Add |
|------------------|-----|---------------------|-------------|
| Graph visualization | 2-3 weeks of frontend work; needs 20+ ideas to be useful (SIG-004) | Users see connections as a list instead of a graph; functional but less visually compelling | Phase 1.5, weeks 14-17 |
| 5 specialized AI modes | Scope exceeds timeline; 1 quality mode beats 5 mediocre ones (BLOCK-002) | Users can still ask the AI anything via contextual chat; they write their own prompts instead of clicking a button | Phase 1.5, week 13 (as prompt templates) |
| Connection discovery | RAG system is a standalone engineering challenge (SIG-002) | No automatic "this idea relates to X" suggestions; users create connections manually | Phase 1.5, weeks 14-16 |
| Voice-to-text | Adds complexity without core value for desktop users (SIG-005) | Users type instead of speaking; acceptable for web/desktop context | Phase 2 (mobile) |
| Desktop app (Tauri) | Adds build/signing/update infrastructure (BLOCK-003) | Users access via browser; functional but less "app-like" | Phase 1.5, week 18 |
| User accounts and monetization | Creates friction; defer until value is proven (NOTE-003) | MVP is free-only; no revenue until Phase 1.5+ | Phase 1.5 (account), Phase 2 (payment) |
| Import/export from other tools | Requires format parsing per source | Users must manually recreate ideas from other tools | Phase 2 |

### MVP Success Criteria

- [ ] Core user job-to-be-done is completable: capture a raw thought and develop it into a structured concept with AI assistance
- [ ] All hard constraints from guardian satisfied: solo dev timeline, local-first, web app, one AI mode, cost tracking
- [ ] Success metrics are measurable: ideas captured, ideas developed (status changes), AI interactions per session, session duration
- [ ] User experience is coherent: no dead ends, no "coming soon" placeholders, every visible feature is functional
- [ ] Data safety is ensured: auto-backup, manual export, clear error messages

### MVP Timeline

| Phase | Weeks | Activities |
|-------|-------|------------|
| Foundation | 1-2 | App shell, data layer, routing, SQLite setup |
| Core Capture | 2-3 | Spark entry, idea list view |
| Canvas | 3-5 | Markdown editor, metadata panel, structured sections |
| AI Chat | 5-8 | Chat panel, streaming responses, cost tracking, privacy notice |
| Status and Search | 8-9 | Status workflow, ideas list/grid, full-text search |
| Polish | 10-12 | Onboarding, export, error handling, deletion, keyboard shortcuts, settings, bug fixes |
| Buffer | (distributed) | 1 week of slack distributed across the timeline |

---

## Design Guidance

### For UI Designer

**Visual Design Scope:**
- Application shell layout (sidebar + main content)
- Spark capture form (modal or inline)
- Idea canvas (editor + metadata panel + AI chat panel)
- Ideas list view and grid view
- Search interface (command palette style)
- Status indicators (color coding for 5 statuses)
- Onboarding tooltips/welcome flow
- Settings page
- Empty states (no ideas, no search results, no connections)

**Design Constraints:**
- Tailwind CSS for implementation (utility-first, no custom design system in MVP)
- Mobile-responsive (breakpoints at 768px and 1024px)
- Dark mode not required for MVP but design with it in mind (neutral base colors)
- Accessibility: WCAG 2.1 AA minimum (contrast ratios, focus indicators, screen reader labels)
- No custom illustrations or animations in MVP -- clean, functional, typographic design

**Key Design Decisions:**
- Three-panel layout on desktop: sidebar (narrow) + main content (wide) + AI chat (toggleable, right side)
- Two-panel layout on tablet: collapsible sidebar + main content (AI chat as overlay)
- Single-panel on mobile: hamburger menu + full-width content (AI chat as full-screen overlay)

### For Experience Architect

**UX Flow Scope:**
- First-time user journey: land on page > welcome message > capture first spark > open canvas > discover AI chat
- Returning user journey: open app > see ideas list > select idea > develop on canvas > chat with AI > update status
- Capture flow: trigger (button or shortcut) > title (required) > description (optional) > save
- Canvas flow: view idea > edit content > toggle metadata panel > toggle AI chat > navigate to another idea
- Search flow: trigger (search bar or shortcut) > type query > see results > click to open

**Key UX Decisions Needed:**
- Spark capture: modal overlay vs. inline at top of ideas list vs. command palette?
- Canvas layout: fixed metadata sidebar vs. collapsible vs. floating?
- AI chat: persistent side panel vs. overlay vs. separate view?
- Navigation: how to move between ideas on the canvas without returning to the list?

**Success Metrics to Support:**
- Time to first value < 3 minutes (onboarding flow must be 3 steps or fewer)
- Capture time < 5 seconds (form must autofocus, minimal fields, Enter to save)
- AI engagement 3+ interactions per session (chat must be visible and inviting on the canvas)

### For Product Marketer

**Positioning Scope:**
- Homepage messaging (when web app has a landing page)
- In-app copy (onboarding, empty states, feature descriptions)
- Privacy messaging (AI data handling transparency)

**Target Audience:**
- Primary: Prolific thinkers -- indie hackers, solo founders, content creators, researchers
- Ages 25-45, technically comfortable, already use 2+ productivity tools
- Generate 5-50+ ideas per week, currently losing most of them

**Key Differentiators to Emphasize:**
- "Develop ideas, not just capture them" (development over capture)
- "AI that thinks with you, not for you" (thinking partner, not autocomplete)
- "Your ideas, your device" (local-first privacy)
- "From shower thought to structured concept" (the full journey, not just one step)

**Messages to Avoid:**
- "AI-powered" as the primary pitch (AI tool fatigue -- lead with the outcome, not the feature)
- "Second brain" (overused term, associated with Obsidian/Notion)
- "Never lose an idea again" (capture is commodity; development is the differentiator)

---

## Handoff Checklist

- [x] All clarifying questions resolved (SD ambiguities addressed via constraint analysis)
- [x] Every story has acceptance criteria (Given/When/Then format)
- [x] Dependencies mapped without cycles (verified -- DAG structure, no circular references)
- [x] MVP clearly defined with rationale (15 P0 stories delivering capture-develop-track loop)
- [x] Constraints from guardian incorporated (all 3 blocking, 5 significant, 4 notable addressed)
- [x] Design guidance sections complete (UI, UX, Marketing guidance provided)
- [x] Timeline aligned with constraint deadlines (12 weeks with 1 week buffer)
- [x] Phase 1.5 features documented (5 stories, weeks 13-18)
- [x] Phase 2+ backlog captured (13 features for future planning)
- [x] Edge cases documented for all P0 stories

---

## Assumptions Made in This Breakdown

| # | Assumption | Impact If Wrong | Validation |
|---|-----------|-----------------|------------|
| FB-A1 | TipTap editor can handle markdown and structured sections without significant customization | Canvas effort increases by 1-2 weeks | Spike TipTap integration in week 1 |
| FB-A2 | sql.js (SQLite-in-WASM) performance is acceptable for up to 1000 ideas with FTS5 | Data layer may need re-architecture | Load test with synthetic data in week 2 |
| FB-A3 | Vercel AI SDK provides adequate streaming and provider abstraction | May need custom implementation or different SDK | Evaluate in week 1 alongside TipTap spike |
| FB-A4 | Auto-save with 1-second debounce does not create noticeable UI lag | May need to increase debounce or use Web Worker | Test during canvas development |
| FB-A5 | A single contextual chat mode delivers sufficient AI value for MVP retention | Users may want structured prompts sooner | Monitor user feedback and fast-track prompt templates if needed |

---

*Generated by: PRISM Product Manager*
*Source: strategy-document.md + constraint-analysis.md*
*Date: 2026-02-12*
*Next step: Architecture Decision Record (ADR) from developer, then begin Week 1 implementation*
