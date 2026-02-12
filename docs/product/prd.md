# IdeaForge - Product Requirements Document

**Version**: 1.0
**Status**: Final
**Last Updated**: 2026-02-12
**Author**: PRISM Spec Writer
**Contributors**: Product Strategist, Project Guardian, Product Manager, UX Architect, UI Designer, Product Marketer

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-12 | PRISM Spec Writer | Initial PRD consolidating strategy, constraints, feature breakdown, UX flows, design system, and marketing |

---

## 1. Executive Summary

### 1.1 Overview

IdeaForge is an **AI-augmented idea development platform** that transforms raw thoughts into structured, connected, and actionable concepts. Unlike existing tools that treat ideas as static notes (Notion) or rigid pipeline items (IdeaScale), IdeaForge treats ideas as living entities that evolve, connect, and compound over time — with AI as an active thinking partner rather than a passive assistant.

**Market Positioning**: Your ideas deserve more than a graveyard. IdeaForge is where raw sparks become refined concepts through AI-augmented development.

**Core Differentiator**: The **Idea Graph** — a knowledge structure where AI surfaces non-obvious connections between ideas, challenges assumptions, and helps users develop half-formed thoughts into validated concepts.

**MVP Focus**: Launch as a **personal idea workspace** targeting indie creators, researchers, and solo founders. Expand into team collaboration post-PMF.

### 1.2 Goals & Success Metrics

| Goal | Metric | Target (Month 6) | Rationale |
|------|--------|-------------------|-----------|
| **Ideas are developed, not just captured** | Weekly ideas moved from Spark to Developing+ | 1+ per WAU | Core value proposition |
| **AI engagement** | AI interactions per session | 3+ | AI is a thinking partner, not novelty |
| **Sustained use** | Weekly active users (WAU) | 500+ | Retention indicates real value |
| **Monetization** | Free-to-paid conversion rate | 4-5% | Comparable to productivity SaaS |
| **Retention** | Monthly churn (Pro) | Under 8% | Users find ongoing value |
| **Performance** | P95 response time | Under 2 seconds | Friction kills ideation flow |
| **Quality** | AI response quality (user rating) | Over 4.0/5.0 | AI must be helpful, not annoying |
| **Onboarding** | Time to first value | Under 3 minutes | Instant value demonstration |
| **Data safety** | Data loss incidents | 0 | Critical for user trust |

**North Star Metric**: **Weekly Ideas Developed** — number of ideas that move from "Spark" to "Developing" or beyond per active user per week. This measures the core value proposition: IdeaForge helps you develop ideas, not just capture them.

### 1.3 Scope

**In Scope (MVP - Phase 1, Weeks 1-12)**:
- Spark capture (text-only, under 5 seconds)
- Idea canvas (markdown editing with structured sections)
- AI contextual chat (thinking partner with idea context)
- Status tracking (Spark → Developing → Refined → Parked → Archived)
- Full-text search and filtering
- Local-first storage (SQLite-in-WASM)
- Data export (JSON, Markdown)
- Web application (responsive)
- Onboarding and polish

**Out of Scope (Deferred to Phase 1.5+)**:
- Visual connection graph (weeks 13-16)
- AI prompt templates (week 13)
- AI connection discovery (weeks 14-16)
- Voice-to-text capture (Phase 2)
- Tauri desktop wrapper (week 18)
- Team collaboration (Phase 3)
- Mobile native app (Phase 2)
- Import/export integrations (Phase 2)
- Monetization infrastructure (Phase 1.5)
- Enterprise features (SSO, audit logs) (Phase 4)

---

## 2. User Stories & Requirements

### 2.1 User Personas

#### Primary Persona: The Prolific Thinker (Maya - Marketing Manager)

**Demographics**:
- Age: 25-45
- Occupation: Indie hackers, solo founders, content creators, researchers, knowledge workers
- Technical comfort: High - already uses 2+ productivity tools

**Behavior**:
- Generates 5-50+ ideas per week
- Currently loses most ideas to scattered capture (Apple Notes, Notion, voice memos, Slack DMs to self)
- Spends hours brainstorming with ChatGPT/Claude but insights vanish after sessions
- Rarely reviews captured ideas

**Goals**:
- Capture ideas effortlessly without breaking creative flow
- Develop raw thoughts into structured concepts
- See connections between ideas across time
- Have AI challenge and improve thinking

**Pain Points**:
1. **Capture friction**: Switching to structured tools kills flow
2. **Connection blindness**: Cannot see how today's idea relates to last month's insight
3. **Development gap**: Ideas stay as one-liners; no tool helps evolve them
4. **Review absence**: No system prompts revisiting ideas
5. **AI chat amnesia**: Great brainstorming in ChatGPT, but insights vanish

**Willingness to Pay**: $8-15/month (already pays for Notion, Obsidian Sync, or Readwise)

**Job-to-be-Done**: When I have a new idea (in the shower, on a walk, reading an article), I want to capture it effortlessly and have it connect to my existing thinking, so I can develop my best ideas into something real instead of losing them.

#### Secondary Persona: The Innovation Team Lead (Deferred to Phase 3)

**Note**: Secondary persona documented in strategy but not targeted in MVP. B2B expansion path validated for future.

### 2.2 User Stories (MVP - Phase 1)

#### Epic 1: Foundation and Data Layer

**US-001: Application Shell and Navigation**

*As a* new user visiting IdeaForge for the first time,
*I want* the application to load quickly and present a clear, intuitive layout,
*So that* I can immediately understand how to start capturing ideas without reading documentation.

**Priority**: P0
**Effort**: M (3-4 days)

**Acceptance Criteria**:
- Given a user visits the application URL, when the page loads, then the main application shell renders within 2 seconds with a sidebar navigation, main content area, and a visible "New Spark" action.
- Given the application is loaded, when the user views the sidebar, then they see navigation items for: Ideas (list/grid), Search, and Settings.
- Given the application is loaded on a mobile-width viewport (< 768px), when the user views the layout, then the sidebar collapses to a hamburger menu and the content area takes full width.
- Given any navigation item is clicked, when the target view loads, then the previously active view is replaced without a full page reload (SPA routing).

**Edge Cases**:
- Browser does not support required APIs (IndexedDB, WASM) → show clear compatibility message listing supported browsers
- Extremely slow connection → application shell loads from cache on repeat visits

---

**US-002: Local-First Data Layer (SQLite-in-WASM)**

*As a* user of IdeaForge,
*I want* my ideas to be stored locally on my device and persist across browser sessions,
*So that* I own my data, can work offline, and never lose ideas to server outages.

**Priority**: P0
**Effort**: L (5-7 days)

**Acceptance Criteria**:
- Given the application is loaded for the first time, when the data layer initializes, then a SQLite database is created in the browser using sql.js (WASM) and persisted to IndexedDB or OPFS.
- Given an idea is created or modified, when the operation completes, then the change is persisted to local storage within 500ms.
- Given the user closes the browser and reopens the application, when it loads, then all previously saved ideas are present and unmodified.
- Given the browser is offline (no network connection), when the user creates, edits, or deletes ideas, then all operations succeed without error (AI features excluded).
- Given the database schema, when inspected, then all records use UUID primary keys and include created_at and updated_at ISO 8601 timestamps.
- Given the database, when auto-backup triggers (every 5 minutes of active use), then a JSON snapshot is saved to a secondary IndexedDB store as a recovery mechanism.

**Edge Cases**:
- Browser storage quota exceeded → detect and warn before data loss, suggest export
- IndexedDB cleared by browser → auto-backup provides recovery path; show clear error with recovery instructions
- Corrupt database file → detect on load, offer to restore from last auto-backup

---

#### Epic 2: Spark Capture

**US-003: Quick Spark Entry**

*As a* prolific thinker who just had an idea,
*I want* to capture it in under 5 seconds with just a title and optional quick note,
*So that* I do not lose the thought while it is fresh and I am not forced into a structured template.

**Priority**: P0
**Effort**: M (3-4 days)

**Acceptance Criteria**:
- Given the user is anywhere in the application, when they click the "New Spark" button (or press Ctrl/Cmd+N), then a spark capture modal or inline form appears within 200ms.
- Given the spark capture form is open, when the user types a title (required, 1-200 characters) and optionally a description (freeform text, no limit), then they can save with Enter key or a Save button.
- Given a valid title is entered and saved, when the spark is persisted, then a new idea record is created with status "spark", the current timestamp, and a generated UUID.
- Given the spark is saved, when the save completes, then a brief confirmation is shown (toast notification, < 2 seconds) and the form clears for another entry.
- Given the user saves a spark, when they navigate to the Ideas list, then the new spark appears at the top of the list sorted by creation date.
- Given the spark capture form is open, when the user presses Escape, then the form closes without saving (if title is empty) or prompts for confirmation (if title has content).

**Edge Cases**:
- Empty title submission → prevent save, show inline validation "Title is required"
- Very long title (> 200 characters) → truncate with character count indicator
- Rapid successive entries → each save completes independently; no race conditions
- Paste from clipboard → support pasting multi-line text into description
- Duplicate title → allow it (ideas distinguished by UUID)

---

**US-004: Spark Capture with Tags**

*As a* user capturing a spark,
*I want* to optionally add one or more tags during capture,
*So that* I can categorize the idea immediately when the context is clear in my mind.

**Priority**: P1
**Effort**: S (1-2 days)

**Acceptance Criteria**:
- Given the spark capture form is open, when the user views the form, then an optional tag input field is visible below the description field.
- Given the tag input is focused, when the user types a tag name, then existing tags are shown as autocomplete suggestions (matching by prefix).
- Given the user types a new tag name that does not exist, when they press Enter or comma, then a new tag is created and associated with the spark.
- Given tags are added to the spark, when the spark is saved, then the tag associations are persisted to the idea_tags table.
- Given a tag is added in error, when the user clicks the "x" on the tag chip, then the tag is removed from the spark (but not deleted from the tags table).

**Edge Cases**:
- Tag with special characters → allow alphanumeric, hyphens, and underscores only; strip others
- Very long tag name (> 50 characters) → truncate with validation message
- Duplicate tag on same idea → silently prevent duplicate association

---

#### Epic 3: Idea Canvas

**US-005: Markdown Idea Editor**

*As a* user who wants to develop a captured spark,
*I want* a rich markdown editor where I can write, format, and structure my idea with headings, lists, bold/italic, and links,
*So that* I can develop a rough thought into a well-articulated concept.

**Priority**: P0
**Effort**: L (5-7 days)

**Acceptance Criteria**:
- Given the user clicks on an idea in the list or navigates to an idea URL, when the canvas loads, then a markdown editor is displayed with the idea's title and content.
- Given the editor is loaded, when the user types markdown syntax, then it is rendered in real-time with WYSIWYG-style formatting (headings, bold, italic, lists, links, code blocks, blockquotes).
- Given the user edits the content, when they pause typing for 1 second (debounced), then the changes are auto-saved to the local database without requiring a manual save action.
- Given the auto-save triggers, when the save completes, then a subtle "Saved" indicator is shown (not disruptive).
- Given the editor has content, when the user adds a heading, then it appears in an optional outline/table-of-contents sidebar for long ideas.
- Given the user is on the canvas, when they edit the idea title, then the title updates in-place (inline editing) and auto-saves.

**Edge Cases**:
- Very large idea (> 50,000 characters) → editor remains responsive; consider virtual rendering
- Concurrent edits in multiple browser tabs → last-write-wins with conflict detection and warning
- Browser crash during edit → auto-save interval ensures at most 1 second of data loss
- Copy/paste from external sources (Word, web pages) → strip unsupported formatting, preserve plain text and basic markdown

---

**US-006: Structured Idea Sections**

*As a* user developing an idea,
*I want* optional structured sections (Problem, Solution, Evidence, Next Steps) that I can use as a thinking framework,
*So that* I have guidance on how to develop a raw thought into a complete concept without being forced into rigid structure.

**Priority**: P1
**Effort**: M (3-4 days)

**Acceptance Criteria**:
- Given the user is on the idea canvas, when they click "Add Section" or use a slash command, then a menu of section templates is shown: Problem, Solution, Evidence, Next Steps, Open Questions, and Custom.
- Given the user selects a section template, when it is inserted, then the section appears as a labeled heading in the editor with optional placeholder text (e.g., "What problem does this idea solve?").
- Given a section is inserted, when the user types below it, then the content is part of the idea's markdown body (sections are markdown headings, not separate data fields).
- Given sections exist in the editor, when the user views the outline sidebar, then the sections appear as navigable entries.
- Given the user does not want sections, when they write freely without using the section feature, then the idea is saved as unstructured markdown with no penalty or prompting.

**Edge Cases**:
- User deletes a section heading but keeps content → content remains as unstructured text
- User reorders sections → standard text editing applies; drag-and-drop is Phase 2
- User adds the same section type twice → allow it; sections are just markdown headings

---

**US-007: Idea Metadata Panel**

*As a* user viewing an idea on the canvas,
*I want* to see and edit the idea's metadata (status, tags, creation date, last modified) in a side panel,
*So that* I can manage the idea's lifecycle and categorization without cluttering the writing space.

**Priority**: P0
**Effort**: M (3-4 days)

**Acceptance Criteria**:
- Given the user is on the idea canvas, when the canvas loads, then a metadata panel is visible (sidebar or collapsible panel) showing: status, tags, created date, last modified date.
- Given the metadata panel is visible, when the user clicks on the status field, then a dropdown appears with the valid statuses: Spark, Developing, Refined, Parked, Archived.
- Given the user changes the status, when they select a new status, then the status updates immediately and auto-saves.
- Given the metadata panel is visible, when the user views the tags section, then existing tags are shown as chips with an option to add or remove tags.
- Given the metadata panel shows dates, when viewed, then dates are displayed in a human-readable relative format (e.g., "2 hours ago", "Jan 15, 2026") with exact timestamp on hover.
- Given the user collapses the metadata panel, when they continue editing, then the full width is available for the editor.

**Edge Cases**:
- Idea with no tags → show "Add tags..." placeholder
- Status transition validation → all transitions are allowed (no enforced workflow in MVP)

---

#### Epic 4: AI Contextual Chat

**US-008: AI Chat Panel**

*As a* user developing an idea on the canvas,
*I want* to open a chat panel and have a conversation with AI about my idea,
*So that* the AI can challenge my thinking, suggest improvements, identify gaps, and help me develop the idea further.

**Priority**: P0
**Effort**: L (5-7 days)

**Acceptance Criteria**:
- Given the user is on the idea canvas, when they click "Chat with AI" (or press Ctrl/Cmd+Shift+A), then a chat panel opens alongside the editor (split view or slide-in panel).
- Given the chat panel opens, when the AI context is loaded, then the current idea's title and content are automatically included as context for the AI conversation (the user does not need to paste their idea into the chat).
- Given the chat panel is open and context is loaded, when the user types a message and sends it, then the AI responds with a contextual, thoughtful reply that references specifics from the idea.
- Given the AI is generating a response, when the response is being produced, then the response streams token-by-token into the chat panel (streaming response, not waiting for full completion).
- Given the AI responds, when the response is complete, then the response time is under 3 seconds for the first token (p95).
- Given a conversation is in progress, when the user sends multiple messages, then the full conversation history is maintained within the session and the AI references earlier messages appropriately.
- Given the user closes the chat panel, when they reopen it, then the previous conversation for that idea is still visible (persisted to ai_interactions table).
- Given the user is chatting, when they want to go back to editing, then the editor remains fully functional alongside the open chat panel (no blocking modals).

**Edge Cases**:
- Idea has no content yet (just a title) → AI acknowledges sparse context and asks clarifying questions
- Very long idea (> 10,000 characters) → summarize the idea before including as context to stay within token limits
- AI API is unreachable (network error, rate limit) → show clear error: "AI is currently unavailable. Your ideas are safe — AI features require an internet connection." Allow retry.
- AI returns empty or malformed response → show "Something went wrong with the AI response. Please try again."
- User sends message while previous response is still streaming → queue the message or disable send until streaming completes

---

**US-009: AI Interaction Cost Tracking**

*As the* developer and operator of IdeaForge,
*I want* every AI interaction to be tracked with token counts and estimated cost,
*So that* I can monitor API spend, understand per-user economics, and set appropriate usage limits.

**Priority**: P0
**Effort**: S (2 days)

**Acceptance Criteria**:
- Given an AI interaction completes, when the response is received, then the following are recorded in the ai_interactions table: idea_id, prompt text, response text, model used, input token count, output token count, and estimated cost (USD).
- Given AI interactions are tracked, when the developer queries the ai_interactions table, then they can calculate total cost per user session, per day, and per idea.
- Given a cost tracking record, when the cost estimate is calculated, then it uses the current model's pricing (configurable, not hardcoded) applied to the actual token counts.
- Given the user is on the Settings page, when they view AI usage, then they see a count of AI interactions used this month (preparation for future usage limits).

**Edge Cases**:
- API response does not include token counts (some providers) → estimate based on character count heuristics
- Cost calculation for cached responses → mark as $0 cost

---

**US-010: AI Privacy Transparency**

*As a* user who cares about the privacy of my ideas,
*I want* to clearly understand what data is sent to the AI provider and what stays local,
*So that* I can make an informed decision about using AI features.

**Priority**: P0
**Effort**: S (1 day)

**Acceptance Criteria**:
- Given the user opens the AI chat panel for the first time, when the panel renders, then a brief, dismissible notice is shown: "Your ideas are stored locally on your device. When you use AI features, your idea content is sent to [provider name] for processing. [Provider] does not store or train on your data. AI features are optional."
- Given the user has dismissed the notice, when they open the chat panel again, then the notice does not reappear (preference stored locally).
- Given the user navigates to Settings, when they view the Privacy section, then a detailed explanation of data handling is available: what is stored locally, what is sent to the AI provider, what the provider's data retention policy is.

**Edge Cases**:
- AI provider changes → privacy notice text should be configurable, not hardcoded

---

#### Epic 5: Idea Status and Lifecycle

**US-011: Idea Status Workflow**

*As a* user managing multiple ideas,
*I want* to set and change the status of each idea (Spark, Developing, Refined, Parked, Archived),
*So that* I can track which ideas need attention, which are mature, and which are on hold.

**Priority**: P0
**Effort**: S (2 days)

**Acceptance Criteria**:
- Given a new idea is created via spark capture, when the idea is saved, then its status defaults to "Spark."
- Given the user is on the idea canvas, when they change the status via the metadata panel dropdown, then the status updates and auto-saves immediately.
- Given the user changes an idea's status, when the change is saved, then the updated_at timestamp is refreshed.
- Given the status is changed, when the user views the ideas list, then the idea appears in the correct status category (if filtered) and shows a visual status indicator (color dot or badge).
- Given the available statuses, when listed, then they are: Spark (blue), Developing (amber), Refined (green), Parked (gray), Archived (muted/hidden by default).
- Given an idea has status "Archived," when the user views the main ideas list, then archived ideas are hidden by default but viewable via a filter toggle.

**Edge Cases**:
- All status transitions are allowed (no enforced sequence in MVP)
- Bulk status change → not in MVP; single idea status change only
- Status with zero ideas → status filter still shows in the filter list with a count of 0

---

**US-012: Ideas List and Grid View**

*As a* user with many ideas,
*I want* to view all my ideas in a list or grid, with the ability to sort and filter by status, date, and tags,
*So that* I can quickly find the idea I want to work on or see which ideas need attention.

**Priority**: P0
**Effort**: M (3-4 days)

**Acceptance Criteria**:
- Given the user navigates to the Ideas view, when the view loads, then all non-archived ideas are displayed in a list view by default (sorted by last modified, most recent first).
- Given the ideas list is displayed, when the user clicks a view toggle, then the display switches between list view (compact rows) and grid view (card layout).
- Given the ideas are displayed, when the user clicks a status filter (Spark, Developing, Refined, Parked, Archived), then only ideas with that status are shown. Multiple status filters can be active simultaneously.
- Given the ideas are displayed, when the user selects a sort option, then ideas are sorted by: Last Modified (default), Created Date, Title (alphabetical), or Status.
- Given the ideas list, when each idea entry is rendered, then it shows: title, status indicator (color), first line or summary of content (truncated to 100 chars), tag chips, and last modified date.
- Given the user clicks on an idea in the list, when they click, then the idea canvas opens for that idea.
- Given there are no ideas, when the list is empty, then a friendly empty state is shown with a prompt to create the first idea.

**Edge Cases**:
- Hundreds of ideas → implement virtual scrolling or pagination (> 100 ideas) for performance
- Idea with very long title → truncate with ellipsis in list/grid view
- Filter combination returns zero results → show "No ideas match your filters" with a clear-filters action

---

**US-013: Full-Text Search**

*As a* user looking for a specific idea,
*I want* to search across all idea titles and content with instant results,
*So that* I can find any idea within seconds regardless of how many ideas I have.

**Priority**: P0
**Effort**: M (3 days)

**Acceptance Criteria**:
- Given the user is anywhere in the application, when they click the search bar (or press Ctrl/Cmd+K), then a search input is focused and ready for typing.
- Given the user types a search query, when at least 2 characters are entered, then matching ideas are shown in real-time (as-you-type results, debounced at 200ms).
- Given search results are displayed, when an idea matches, then the search highlights the matching text in the title and/or content preview.
- Given search results are displayed, when the user clicks on a result, then the idea canvas opens for that idea.
- Given the search query matches zero ideas, when results are displayed, then a "No ideas found for '[query]'" message is shown.
- Given the user is searching, when they clear the search field or press Escape, then the full ideas list is restored.
- Given ideas exist with tags, when the user types a tag name in search, then ideas with that tag are included in results.

**Edge Cases**:
- Special characters in search query → escape for SQLite FTS5 syntax
- Very common word matches hundreds of ideas → limit display to top 20 results with "Show all" option
- Search while offline → fully functional (local-first, SQLite FTS5)

---

#### Epic 6: Polish, Onboarding, and Data Safety

**US-014: First-Run Onboarding Experience**

*As a* first-time user visiting IdeaForge,
*I want* a brief, non-intrusive onboarding that shows me how to capture my first idea and introduces the AI chat feature,
*So that* I reach my first moment of value within 3 minutes without feeling overwhelmed.

**Priority**: P0
**Effort**: M (3-4 days)

**Acceptance Criteria**:
- Given a user visits IdeaForge for the first time (no existing data in local storage), when the application loads, then a welcome experience begins (not a multi-step tutorial wizard, but a guided first action).
- Given the onboarding starts, when the welcome message is shown, then it is concise (under 50 words) and immediately prompts: "What's an idea you've been thinking about? Capture it now."
- Given the user captures their first spark during onboarding, when the spark is saved, then the onboarding advances to show a brief tooltip pointing to the "Open on Canvas" action: "Now develop it further."
- Given the user opens their first idea on the canvas, when the canvas loads, then a tooltip points to the AI chat button: "Try asking the AI to challenge your idea or explore it further."
- Given the onboarding is complete (3 steps: capture, open canvas, see AI chat), when the user dismisses it, then the onboarding does not appear again (preference stored locally).
- Given the user skips onboarding at any step, when they click "Skip" or dismiss, then the onboarding ends and does not reappear.

**Edge Cases**:
- User has existing data (returning user, different browser) → no onboarding shown
- User completes onboarding partially then closes browser → resume from last incomplete step on next visit
- Screen reader / keyboard-only users → onboarding tooltips must be accessible (ARIA labels, focus management)

---

**US-015: Data Export (JSON and Markdown)**

*As a* user who stores all my ideas locally,
*I want* to export all my ideas as JSON and/or Markdown files at any time,
*So that* I have a portable backup of my data and am never locked into IdeaForge.

**Priority**: P0
**Effort**: M (3 days)

**Acceptance Criteria**:
- Given the user navigates to Settings > Data, when they click "Export All Ideas," then a dialog appears offering format choices: JSON (complete data with metadata) or Markdown (human-readable, one file per idea).
- Given the user selects JSON export, when the export runs, then a single JSON file is downloaded containing all ideas, tags, connections, and AI interaction history with full metadata.
- Given the user selects Markdown export, when the export runs, then a ZIP file is downloaded containing one .md file per idea, with YAML frontmatter for metadata (status, tags, dates).
- Given the export completes, when the file is downloaded, then a confirmation message is shown: "Exported [N] ideas successfully."
- Given a single idea is open on the canvas, when the user clicks "Export This Idea" from the idea menu, then that single idea is exported in the chosen format.

**Edge Cases**:
- Zero ideas to export → show "No ideas to export" message; disable export button
- Very large export (1000+ ideas) → show progress indicator; do not block UI
- Export includes AI interaction history → include in JSON export; exclude from Markdown export (too verbose)
- Special characters in idea titles → sanitize for use as filenames in Markdown export

---

**US-016: Settings Page**

*As a* user of IdeaForge,
*I want* a settings page where I can configure AI provider, view usage stats, manage data, and set preferences,
*So that* I can customize the application to my needs.

**Priority**: P1
**Effort**: S (2 days)

**Acceptance Criteria**:
- Given the user clicks Settings in the sidebar, when the settings page loads, then it shows sections: AI Configuration, Data Management, Privacy, and About.
- Given the AI Configuration section, when viewed, then the user can enter or update their AI API key (stored locally, never transmitted except to the AI provider).
- Given the Data Management section, when viewed, then the user sees: total idea count, database size, export button, and a "Clear All Data" option (with confirmation dialog).
- Given the Privacy section, when viewed, then the user sees the privacy explanation from US-010 in a persistent, detailed format.
- Given the About section, when viewed, then it shows the application version, link to documentation/support, and link to the project website.

**Edge Cases**:
- Invalid API key entered → validate on save with a test API call; show error if invalid
- "Clear All Data" → require typing "DELETE" to confirm (prevent accidental data loss)

---

**US-017: Error Handling and Offline Indicators**

*As a* user working in IdeaForge,
*I want* clear feedback when something goes wrong or when I am offline,
*So that* I know whether my work is saved and which features are available.

**Priority**: P0
**Effort**: S (2 days)

**Acceptance Criteria**:
- Given the browser loses network connectivity, when the offline state is detected, then a non-intrusive banner appears: "You are offline. Your ideas are saved locally. AI features require an internet connection."
- Given the user is offline, when they try to use the AI chat, then a message appears in the chat panel: "AI is unavailable while offline. Your ideas are safe."
- Given the network reconnects, when connectivity is restored, then the offline banner disappears automatically.
- Given a database operation fails, when an error occurs, then a toast notification shows a user-friendly message (not a stack trace) with a retry option if applicable.
- Given an unexpected error occurs anywhere in the application, when the error boundary catches it, then the user sees "Something went wrong. Your data is saved. Try refreshing the page." with an option to report the issue.

**Edge Cases**:
- Intermittent connectivity (flapping) → debounce online/offline detection (3-second threshold) to avoid banner flicker
- Error during auto-save → retry with exponential backoff (3 retries), then show persistent warning if all retries fail

---

**US-018: Keyboard Shortcuts**

*As a* power user who values speed,
*I want* keyboard shortcuts for common actions (new idea, search, toggle AI chat),
*So that* I can navigate and operate IdeaForge without reaching for the mouse.

**Priority**: P1
**Effort**: S (1-2 days)

**Acceptance Criteria**:
- Given the user is anywhere in the application, when they press Ctrl/Cmd + N, then the spark capture form opens.
- Given the user is anywhere in the application, when they press Ctrl/Cmd + K, then the search input is focused.
- Given the user is on the idea canvas, when they press Ctrl/Cmd + Shift + A, then the AI chat panel toggles open/closed.
- Given the user is on the idea canvas, when they press Ctrl/Cmd + S, then a manual save is triggered (with confirmation, even though auto-save is active).
- Given the user wants to discover shortcuts, when they press Ctrl/Cmd + /, then a keyboard shortcut cheat sheet overlay is shown.
- Given a shortcut conflicts with the browser or editor, when the conflict is detected, then the application shortcut does not override the browser/editor default.

**Edge Cases**:
- User on a non-US keyboard layout → shortcuts use key positions, not characters
- Focus is inside the editor vs. outside → some shortcuts only work when focus is not in a text input (except editor-specific ones)

---

**US-019: Idea Deletion**

*As a* user managing my ideas,
*I want* to delete ideas I no longer need,
*So that* my workspace stays organized and free of clutter.

**Priority**: P0
**Effort**: S (1-2 days)

**Acceptance Criteria**:
- Given the user is on the idea canvas or in the ideas list, when they click "Delete" on an idea, then a confirmation dialog appears: "Are you sure you want to delete this idea? This cannot be undone."
- Given the confirmation dialog is shown, when the user confirms deletion, then the idea and its associated tags, connections, and AI interactions are removed from the database.
- Given the deletion completes, when the user returns to the ideas list, then the deleted idea no longer appears.
- Given the idea had connections to other ideas, when it is deleted, then the connections referencing it are also deleted (cascade), but the connected ideas themselves are not affected.
- Given the user cancels the deletion, when they click "Cancel," then no data is modified.

**Edge Cases**:
- Deleting the only idea → return to empty state with create prompt
- Deleting while offline → works normally (local operation)
- Bulk deletion → not in MVP; single idea deletion only

---

## 3. Design Specifications

### 3.1 Design System Reference

**Design System**: IdeaForge Custom Palette (Forge-Inspired)
**Token Source**: `C:\Users\bsmoo\projects\ideaforge\docs\design\design-system.md`
**Implementation**: React + Tailwind CSS + CVA (class-variance-authority)
**Version**: 1.0.0

**Core Principles**:
1. **Forge-Inspired Warmth**: Amber/orange accents evoke the creative heat of a forge
2. **Deep Focus**: Dark backgrounds reduce eye strain for extended work sessions
3. **Clear Hierarchy**: Typography and spacing guide attention without clutter
4. **Semantic Tokens**: Every color, shadow, and spacing value has meaning
5. **Dark Mode First**: Designed for creators who work at all hours

**Primary Color Palette**:
- **Primary (Forge Amber)**: `hsl(25, 95%, 53%)` - #F97316 - Warm creative energy
- **Accent (Ember Glow)**: `hsl(24, 100%, 50%)` - #FF7700 - Highlight
- **Secondary (Warm Slate)**: `hsl(215, 16%, 47%)` - #697A8F - Anvil metal
- **Background (Dark)**: `hsl(222, 47%, 11%)` - #1A1F2E - Deep charcoal
- **Foreground (Dark)**: `hsl(210, 40%, 98%)` - #F9FAFB - Off-white text

**Status Color Semantics** (matching idea lifecycle):
- **Spark**: Blue (`hsl(217, 91%, 60%)`) - Raw potential
- **Developing**: Amber (`hsl(38, 92%, 50%)`) - Active heat
- **Refined**: Green (`hsl(142, 76%, 36%)`) - Tempered steel
- **Parked**: Gray (`hsl(220, 9%, 46%)`) - Cooling
- **Archived**: Muted gray (`hsl(220, 9%, 70%)`) - Cold storage

**Typography**:
- **Sans**: Inter (body and UI)
- **Mono**: JetBrains Mono (code and technical content)
- **Scale**: Display (60px) → H1 (48px) → H2 (36px) → H3 (30px) → H4 (24px) → H5 (20px) → Body (16px) → Caption (12px)

**Spacing Scale**: Tailwind default (4px increments)

**Border Radius**: 8px default (--radius)

**Shadows**:
- `--shadow-forge`: Amber glow effect for primary CTAs

### 3.2 Component Library

All components implemented using CVA (class-variance-authority) for type-safe variants. Full specifications in design-system.md.

**Core Components (MVP)**:
1. **Button** - Variants: primary, secondary, outline, ghost, destructive, forge, link
2. **Card** - Interactive and static variants with padding/shadow options
3. **Input/Textarea** - Form inputs with consistent styling
4. **Badge** - Status badges (spark, developing, refined, parked, archived) + semantic (success, warning, destructive, info)
5. **Tag** - Removable tag chips for categorization
6. **Modal** - Radix UI Dialog for spark capture, confirmations
7. **Toast** - Notifications for success, error, warning states
8. **AI Chat Panel** - Streaming chat interface with context indicator

**Layout Components**:
- **App Shell**: Sidebar + header + main content layout
- **Canvas Layout**: Editor + metadata sidebar + AI panel split view
- **Ideas Grid**: Responsive card grid for idea dashboard

### 3.3 Information Architecture

```
IdeaForge
├── Ideas (Home)
│   ├── All Ideas (list/grid view)
│   ├── Filter by Status
│   │   ├── Spark
│   │   ├── Developing
│   │   ├── Refined
│   │   ├── Parked
│   │   └── Archived
│   ├── Sort (Last Modified, Created, Title, Status)
│   └── New Spark (floating action)
├── Idea Canvas
│   ├── Title (editable)
│   ├── Markdown Editor
│   │   ├── Formatting toolbar
│   │   ├── Structured sections (optional)
│   │   └── Auto-save indicator
│   ├── Metadata Panel (collapsible)
│   │   ├── Status dropdown
│   │   ├── Tags
│   │   ├── Created/Modified dates
│   │   └── Connections (Phase 1.5)
│   └── AI Chat Panel (toggleable)
│       ├── Context indicator
│       ├── Message history
│       └── Input field
├── Search (Ctrl/Cmd+K)
│   ├── Full-text search
│   ├── Tag search
│   └── Real-time results
└── Settings
    ├── AI Configuration
    │   └── API Key
    ├── Data Management
    │   ├── Export (JSON/Markdown)
    │   └── Clear All Data
    ├── Privacy
    │   └── Data handling explanation
    └── About
        ├── Version
        └── Links
```

### 3.4 Key Screen Layouts

#### Ideas Dashboard (Home)

**Layout**:
- Sidebar (left, 256px): Navigation + logo
- Header (top, 64px): Search + "New Spark" CTA
- Main content: Grid/list of idea cards

**Responsive**:
- Mobile (< 640px): Single column, hamburger menu
- Tablet (640-1024px): 2 columns, collapsible sidebar
- Desktop (>= 1024px): 3-4 columns, persistent sidebar

#### Idea Canvas

**Layout**:
- Sidebar (left, 256px): Same as dashboard
- Title bar: Idea title (editable) + "Chat with AI" button
- Main content (flex): Markdown editor
- Metadata panel (right, 320px, collapsible): Status, tags, dates
- AI chat panel (right, 384px, toggleable): Overlays on mobile, side panel on desktop

**Responsive**:
- Mobile: Full-width editor, AI chat as full-screen overlay
- Tablet: Editor + metadata sidebar, AI chat as overlay
- Desktop: Three-panel (editor + metadata + AI chat)

### 3.5 Responsive Behavior

| Breakpoint | Key Changes |
|------------|-------------|
| Mobile (< 640px) | Hamburger menu, single column cards, full-screen AI chat overlay, stacked metadata |
| Tablet (640-768px) | Two columns, collapsible sidebar, AI chat as slide-in panel |
| Desktop (>= 1024px) | Full layout, persistent sidebar, three-panel canvas, grid view default |

### 3.6 Accessibility Requirements

- **WCAG 2.1 Level**: AA minimum
- **Color Contrast**: All text/UI combinations meet 4.5:1 (text) and 3:1 (UI) ratios
- **Focus Indicators**: All interactive elements have visible 2px focus ring (--ring color)
- **Keyboard Navigation**: All features accessible via keyboard (Tab, Enter, Escape, Arrow keys)
- **Touch Targets**: Minimum 44x44px on mobile
- **Semantic HTML**: Proper heading hierarchy, labels on all inputs, ARIA labels on icon buttons
- **Screen Reader**: All images/icons have alt text or aria-label

### 3.7 Icon System

**Library**: Lucide React (open source, consistent style)

**Key Icon Mappings**:
- Spark: `Zap` (lightning bolt)
- Developing: `Hammer` (active work)
- Refined: `CheckCircle` (complete)
- Parked: `Pause` (on hold)
- Archived: `Archive`
- AI features: `Sparkles`
- Search: `Search`
- Settings: `Settings`
- New idea: `Plus` or `Zap`

**Sizing**:
- Small: 16px (h-4 w-4)
- Medium: 20px (h-5 w-5)
- Large: 24px (h-6 w-6)

---

## 4. Technical Constraints

### 4.1 Architecture Decisions

**Platform**: Web application (SPA) - fastest to develop, easiest to distribute
**Desktop Wrapper**: Tauri (deferred to Phase 1.5) - better performance than Electron

**Tech Stack** (from GAP-001 recommendation):
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + CVA
- **Build**: Vite
- **Storage**: sql.js (SQLite-in-WASM) + IndexedDB persistence
- **AI SDK**: Vercel AI SDK (provider-agnostic, streaming support)
- **AI Provider**: Claude API (primary), OpenAI (fallback)
- **Editor**: TipTap (markdown-based, extensible, React-compatible)

**Local-First Architecture**:
- All data stored client-side (IndexedDB / OPFS)
- No server-side database in MVP
- PostgreSQL and Neo4j ruled out for MVP (incompatible with local-first)
- Graph queries in application code (graph will be small — hundreds, not millions of nodes)
- UUIDs for all records + modification timestamps (future sync readiness)

### 4.2 Scope Cuts (from Constraint Analysis)

| Feature | Why Cut | Impact | Phase |
|---------|---------|--------|-------|
| Graph visualization | 2-3 weeks frontend work; needs 20+ ideas to be useful (SIG-004) | Connections shown as list instead of graph | Phase 1.5 (weeks 14-17) |
| 5 specialized AI modes | Scope exceeds timeline; 1 quality mode beats 5 mediocre (BLOCK-002) | Users write own prompts instead of clicking templates | Phase 1.5 (week 13 as templates) |
| Connection discovery (RAG) | Standalone engineering challenge (SIG-002) | No automatic "related to X" suggestions | Phase 1.5 (weeks 14-16) |
| Voice-to-text | Adds complexity without core value for desktop (SIG-005) | Users type instead of speaking | Phase 2 (mobile) |
| Desktop app (Tauri) | Build/signing/update infrastructure (BLOCK-003) | Browser access only | Phase 1.5 (week 18) |

### 4.3 Data Model (SQLite Schema)

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

-- Connections between ideas (Phase 1.5)
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

### 4.4 AI Cost Management

**Cost Model** (from SIG-001 analysis):
- **Target**: $2-4/month per Pro user at 200 interactions/month
- **Reality**: $0.015-$0.045 per interaction with context
- **Risk**: 500 interactions/month at $10/month price point = negative margin

**Mitigation Strategies**:
1. **Model tiering**: Cheap models (Haiku, GPT-4o-mini) for simple tasks, premium (Sonnet) only for complex synthesis
2. **Aggressive caching**: Cache embeddings, cache responses for identical prompts
3. **Context optimization**: Summarize ideas to 200-300 tokens instead of sending full 1000-3000 token content
4. **Realistic limits**: 200 interactions/month for Pro tier ($10/month)
5. **Cost tracking from day one**: Instrument every API call

### 4.5 Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Initial load | < 2 seconds | First impressions |
| Spark save | < 500ms | No perceived lag |
| AI first token | < 3 seconds (p95) | Conversational feel |
| Search results | < 200ms | Instant feedback |
| Auto-save | < 1 second debounce | Balance safety vs. performance |

### 4.6 Browser Compatibility

**Supported**:
- Chrome/Edge 90+ (IndexedDB, WASM)
- Firefox 88+ (IndexedDB, WASM)
- Safari 14+ (IndexedDB, WASM)

**Unsupported**:
- Internet Explorer (all versions)
- Opera Mini (limited JS)

**Fallback**:
- Browser compatibility check on load
- Clear message: "IdeaForge requires a modern browser. Please update to Chrome, Firefox, or Safari."

---

## 5. Content & Messaging

### 5.1 Positioning

**Headline**: Your ideas deserve more than a graveyard.

**Subheadline**: IdeaForge is the AI-augmented workspace where raw sparks become refined concepts. Capture, develop, and connect your ideas — all stored privately on your device.

**Value Proposition**:

For prolific thinkers who lose ideas in scattered notes and chat histories, IdeaForge is the AI-powered idea development workspace that transforms raw thoughts into connected, validated concepts. Unlike Notion (static pages), Obsidian (manual linking), or ChatGPT (ephemeral conversations), IdeaForge treats every idea as a living entity that the AI helps you grow, connect, and develop over time.

**Three Core Value Props**:
1. **Development, not just capture** - AI helps you evolve sparks into refined concepts
2. **AI as thinking partner, not autocomplete** - Challenges assumptions, surfaces connections, asks hard questions
3. **Local-first privacy** - Your ideas stay on your device; you own your data

### 5.2 Brand Voice

**Tone**: Confident, purposeful, direct. Creative, warm, honest.

**Avoid**:
- Cutesy/hyperbolic language ("revolutionary," "game-changer")
- Corporate jargon ("synergy," "leverage," "ideation platform")
- Overused PKM terms ("second brain")
- AI-first messaging (lead with outcome, not feature)

**Examples**:
- **Good**: "Develop ideas, not just capture them."
- **Bad**: "Unleash your creative potential with revolutionary AI-powered brainstorming!"

### 5.3 Terminology

**In-Product** (functional language, not metaphor):
- Ideas (not "sparks" in UI labels)
- Workspace / Canvas (not "anvil")
- Chat with AI (not "bellows")
- Statuses: Spark → Developing → Refined → Parked → Archived

**Marketing** (forge metaphor acceptable):
- "Forge your ideas from sparks to steel"
- "Heat, hammer, temper your thinking"
- "Where raw inspiration meets the anvil"

**Avoid**:
- Overusing forge metaphor in product UI (increases cognitive load)

### 5.4 In-Product Copy

#### Onboarding

**Welcome Message**:
> Welcome to IdeaForge.
>
> Your ideas are stored locally on your device — private, fast, and always available. Let's capture your first spark.

**First Spark Prompt**:
> What's an idea you've been thinking about?

**Canvas Introduction**:
> Now develop it further. Use markdown to structure your thoughts, or just write freely.

**AI Chat Introduction**:
> Try asking the AI to challenge your idea or explore it further. Your idea content is already loaded as context.

#### Empty States

**No Ideas**:
> No ideas yet.
>
> Every great concept starts as a spark. Capture your first idea now.
>
> [New Spark]

**No Search Results**:
> No ideas found for "[query]"
>
> Try different keywords, or browse all ideas.

**No Tags**:
> Add tags to organize your ideas by theme, project, or category.

**No Connections** (Phase 1.5):
> No connections yet.
>
> Link related ideas to build your idea graph.

#### Error Messages

**Offline**:
> You're offline. Your ideas are saved locally. AI features require an internet connection.

**AI Unavailable**:
> AI is currently unavailable. Your ideas are safe — AI features require an internet connection.

**Save Error**:
> Failed to save. Retrying...

**Save Error (Final)**:
> Could not save your changes. Please check your browser storage settings.

**Database Error**:
> Something went wrong with the database. Your data is backed up automatically. Try refreshing the page.

#### Success Messages

**Spark Captured**:
> Spark captured!

**Status Changed**:
> Status updated to [status].

**Idea Deleted**:
> Idea deleted.

**Export Complete**:
> Exported [N] ideas successfully.

**Settings Saved**:
> Settings saved.

### 5.5 Privacy Messaging

**AI Chat First-Time Notice**:
> Your ideas are stored locally on your device. When you use AI features, your idea content is sent to [provider name] for processing. [Provider] does not store or train on your data. AI features are optional.

**Settings > Privacy (Detailed)**:
> ### Your Data, Your Device
>
> **What stays local:**
> - All your ideas, tags, and connections
> - Your AI conversation history
> - Your settings and preferences
>
> **What goes to the cloud:**
> - When you use AI features, the current idea's title and content are sent to [provider name] for processing
> - AI responses are streamed back and saved locally
> - [Provider name] does not store your data or use it for training
>
> **What you control:**
> - AI features are entirely optional
> - You can export all your data at any time (Settings > Data > Export)
> - You can delete all your data at any time (Settings > Data > Clear All Data)
>
> **No account required:**
> - You don't need to create an account to use IdeaForge
> - Your data stays in your browser (IndexedDB)
> - We don't track you or collect analytics
>
> For questions, see our [Privacy Policy](#) or [contact support](#).

---

## 6. Go-to-Market

### 6.1 Launch Strategy

**Target Launch**: Month 3 (end of Phase 1 development)

**Launch Channels**:
1. **ProductHunt** - Main launch event (Thursday)
2. **IndieHackers** - Build-in-public log (starting immediately)
3. **Hacker News** - Show HN post (same day as ProductHunt)
4. **Reddit** - r/productivity, r/SideProject, r/PKM
5. **Twitter** - Thread with demo video

**Pre-Launch**:
- IndieHackers build log (weekly updates)
- Landing page with email signup
- Demo video (2-3 minutes)

**Launch Day**:
- ProductHunt post (optimized for Thursday launch)
- Show HN with honest framing ("I built this because I lose ideas in ChatGPT")
- Twitter thread with screenshots + demo link
- Reddit posts (same-day, different communities)

**Post-Launch**:
- Weekly changelog updates (visible progress)
- User feedback collection (in-app + email)
- Feature iteration based on usage data

### 6.2 Pricing Strategy (Phase 1.5+)

**MVP**: Free-only (no payment infrastructure)

**Phase 1.5+**:

| Tier | Price | Includes | Target |
|------|-------|----------|--------|
| **Free** | $0 | 100 ideas, 50 AI interactions/month, basic features | Trial users, casual thinkers |
| **Pro** | $10/month | Unlimited ideas, 200 AI interactions/month, full features | Prolific individual thinkers |
| **Team** (Phase 3) | $20/user/month | Everything in Pro + shared workspaces, team feeds | Small teams (5-50) |
| **Enterprise** (Phase 4) | Custom | Everything in Team + SSO, audit, SLA | 50+ seats |

**Free-to-Paid Conversion Strategy**:
- Require account creation at upgrade (not at signup)
- Show AI interaction count in Settings
- Prompt upgrade when nearing limit (80% consumed)

### 6.3 Marketing Messages by Channel

**ProductHunt**:
> IdeaForge - AI-Powered Idea Development, Not Just Capture
>
> Stop losing great ideas to scattered notes and ephemeral AI chats. IdeaForge is a local-first workspace where raw sparks become refined concepts with AI as your thinking partner.
>
> Unlike Notion (static notes) or ChatGPT (lost in history), IdeaForge treats ideas as living entities you develop over time.

**Hacker News**:
> Show HN: IdeaForge - AI-Augmented Idea Development (Local-First, Open Beta)
>
> I built IdeaForge because I kept having great brainstorming sessions with Claude/ChatGPT, but all the insights would vanish after the chat ended. Notion felt too rigid, and Obsidian required too much manual linking.
>
> IdeaForge is a web app where you capture ideas quickly, develop them in a markdown editor, and chat with AI about them — with the idea pre-loaded as context. Everything is stored locally (SQLite in WASM), so your ideas stay private.
>
> Would love feedback from the HN community!

**Twitter Thread**:
> Thread 1/7: Your ideas deserve more than a graveyard.
>
> I just launched IdeaForge — an AI-augmented workspace where raw sparks become refined concepts. Here's why it's different 👇
>
> [Screenshots + demo link]

**Reddit (r/productivity)**:
> I built a tool to solve my own problem: ideas dying in scattered notes
>
> Like many of you, I capture ideas everywhere — Apple Notes, Notion, Slack DMs to myself, ChatGPT. But I rarely go back and develop them. They just pile up.
>
> IdeaForge is my solution: fast capture + AI chat (with your idea as context) + local-first storage. No account needed, everything stays on your device.
>
> It's free and open for feedback. Would love to know if this resonates with others who have the same problem!

---

## 7. Phased Roadmap

### Phase 1: MVP (Weeks 1-12)

**Goal**: Deliver a usable personal idea workspace with AI-augmented development. Validate that users return weekly to develop ideas (not just capture).

**Features** (15 P0 stories):
- Spark capture (text, under 5 seconds)
- Idea canvas (markdown editor, structured sections)
- AI contextual chat (thinking partner)
- Status tracking (5 states: Spark → Developing → Refined → Parked → Archived)
- Ideas list/grid view (filter, sort)
- Full-text search
- Data export (JSON, Markdown)
- Onboarding (3-step: capture, canvas, AI)
- Settings (AI config, data management, privacy)
- Error handling and offline indicators
- Keyboard shortcuts
- Idea deletion

**Features** (4 P1 stories, if time allows):
- Tags on capture
- Structured idea sections (optional)
- Settings page enhancements
- Keyboard shortcut cheat sheet

**Timeline**:
- Weeks 1-2: Foundation (shell, data layer)
- Weeks 2-3: Capture (spark form, tags)
- Weeks 3-5: Canvas (editor, metadata, sections)
- Weeks 5-8: AI (chat panel, cost tracking, privacy)
- Weeks 8-9: Status & Search (workflow, list view, search)
- Weeks 10-12: Polish (onboarding, export, error handling, shortcuts)

**Success Criteria**:
- Weekly active users: 500+
- Ideas developed per user/week: 1+
- AI interactions per session: 3+
- Time to first value: < 3 minutes
- Free-to-paid interest (email signup): 10%+

**Key Metric**: Weekly ideas moved from Spark to Developing+ (north star)

---

### Phase 1.5: Fast Follow (Weeks 13-18)

**Goal**: Add deferred MVP features that significantly enhance the core experience. Prove connection discovery value and release desktop wrapper.

**Features**:
- **AI Prompt Templates** (1 week): "Challenge," "Explore," "Connect," "Summarize" as pre-built prompts on top of contextual chat
- **Manual Connections** (1 week): User-created links between ideas (related, builds on, contradicts, merges into)
- **AI Connection Suggestions** (2 weeks): TF-IDF similarity engine suggests related ideas
- **Connection Graph Visualization** (2 weeks): Cytoscape.js force-directed graph
- **Tauri Desktop Wrapper** (1 week): Package web app as native desktop app with native SQLite

**Success Criteria**:
- Connection density: 2+ connections per idea (manual + AI-suggested)
- Graph engagement: 30%+ of users view graph weekly
- Desktop adoption: 20%+ of users download desktop app

**Key Metric**: Connections created per user/week

---

### Phase 2: Connected Thinking (Months 7-12)

**Goal**: Deepen AI ability to work with the idea graph. Add features that make the graph more valuable as it grows.

**Features**:
- **AI Synthesis Reports**: "What your idea graph reveals about your thinking this month"
- **Idea Clustering**: Automatic theme detection using embeddings
- **Idea Resurfacing**: "Idea of the Day" to combat forgetting (AI selects stale but promising ideas)
- **Import**: From Notion, Obsidian, Apple Notes
- **Browser Extension**: Capture ideas while reading
- **API**: For integrations
- **Embedding-based Connection Discovery**: Upgrade from TF-IDF to semantic similarity (higher quality)
- **Voice-to-Text Capture**: Whisper integration for mobile

**Monetization**:
- Account creation required for Pro tier
- Payment infrastructure (Stripe)
- Pro tier limits enforcement (100 ideas free, 200 AI interactions/month at $10/month)

**Success Criteria**:
- Average ideas per user: 50+
- Free-to-paid conversion: 4-5%
- MRR: $8,000+ (800 Pro users)

**Key Metric**: Ideas per user growing month-over-month

---

### Phase 3: Team Forge (Months 13-18)

**Goal**: Enable small teams to share idea spaces. Validate B2B value proposition.

**Features**:
- **Shared Workspaces**: Permissions (view, edit, admin)
- **Team Idea Feeds**: Cross-pollination across team members
- **Collaborative Idea Development**: Multiple contributors on one idea
- **Team Analytics**: Contributions, traction tracking
- **Team Pricing**: $15-25/user/month

**Success Criteria**:
- Team adoption rate: 10% of Pro users upgrade to Team
- Ideas developed collaboratively: 20%+ of team ideas
- Revenue per team: $150+/month (10 users avg)

**Key Metric**: Team adoption rate, ideas developed collaboratively

---

### Phase 4: Innovation Platform (Months 18+)

**Goal**: Mature into a lightweight innovation management platform for mid-market teams.

**Features**:
- **Idea Challenges/Campaigns**: "Submit ideas for Q3 product direction"
- **Evaluation Frameworks**: Custom scoring criteria
- **Project Management Integration**: Linear, Jira, Asana
- **Advanced Analytics**: Reports, dashboards
- **Enterprise Tier**: SSO, audit logs, admin controls, SLA

**Success Criteria**:
- Enterprise tier revenue: 20%+ of total revenue
- Expansion within organizations: 2x seats per org per year

**Key Metric**: Revenue per team, expansion within organizations

---

## 8. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **AI costs exceed margins** | HIGH | HIGH | Model tiering from day one; usage-based limits per tier; prompt optimization; caching repeated patterns; cost tracking is survival metric |
| **Incumbent AI features close gap** | HIGH | MEDIUM | Move fast on AI-native architecture; build graph-specific AI that incumbents cannot easily replicate; speed is a feature |
| **Solo developer velocity insufficient** | MEDIUM | HIGH | Ruthless MVP scoping (already applied); use AI-assisted development; prioritize core loop over features; Phase 1.5 provides relief valve |
| **Users capture but do not develop** | MEDIUM | HIGH | AI-driven nudges to revisit ideas; make development the easiest path; onboarding emphasizes development value; north star metric tracks this |
| **Graph complexity overwhelms users** | MEDIUM | MEDIUM | Progressive disclosure — start with simple cards, reveal graph as it grows; AI handles complexity, users see simplicity |
| **Privacy concerns limit adoption** | MEDIUM | MEDIUM | Transparent data handling messaging (already implemented); local-first positioning; future: local LLM option |
| **Market too niche for venture scale** | LOW | MEDIUM | Not targeting venture scale initially; bootstrapping-friendly model; B2B expansion provides growth path if needed |
| **AI model API dependency** | MEDIUM | MEDIUM | Provider abstraction layer from day one (Vercel AI SDK); support multiple LLM providers; consider local model fallback for basic features |
| **Data loss erodes trust** | LOW | CRITICAL | Auto-backup every 5 minutes; manual export from day one; corrupt DB detection + recovery; 0 data loss incidents is guardrail metric |
| **Scope creep post-launch** | MEDIUM | MEDIUM | Document Phase 2+ features now; resist adding until Phase 1 retention validated; Product Marketer owns messaging, not feature requests |

---

## 9. Appendices

### 9.1 Glossary

| Term | Definition |
|------|------------|
| **Spark** | A raw, newly captured idea (status: "Spark") |
| **Canvas** | The markdown editing workspace for developing an idea |
| **Forge** | The act of developing and refining an idea (brand metaphor) |
| **Idea Graph** | The knowledge structure connecting related ideas |
| **AI Thinking Partner** | Contextual AI that challenges, explores, and helps develop ideas (vs. autocomplete) |
| **Local-First** | Architecture where all data is stored on the user's device, not on a server |
| **Status Workflow** | Spark → Developing → Refined → Parked → Archived |
| **Connection** | A typed relationship between two ideas (related, builds on, contradicts, merges into) |
| **AI Interaction** | A single prompt-response cycle with the AI |
| **TF-IDF** | Term Frequency-Inverse Document Frequency (keyword-based similarity for connection discovery) |
| **RAG** | Retrieval-Augmented Generation (AI technique for finding relevant content) |
| **DTCG** | Design Tokens Community Group (W3C standard for design tokens) |

### 9.2 References

**Source Documents**:
- Strategy Document: `docs/strategy/strategy-document.md`
- Constraint Analysis: `docs/strategy/constraint-analysis.md`
- Feature Breakdown: `docs/product/feature-breakdown.md`
- UX Flows: `docs/design/ux-flows.md`
- Design System: `docs/design/design-system.md`

**External References**:
- Market Analysis: Mordor Intelligence, Grand View Research (knowledge management market sizing)
- Competitive Analysis: Notion, Obsidian, Miro, IdeaScale, Brightidea, HYPE, Mem, Reflect, ChatGPT/Claude
- Community Signals: IndieHackers, r/productivity, r/Obsidian, ProductHunt trends

### 9.3 Open Questions

| Question | Owner | Blocking? | Status |
|----------|-------|-----------|--------|
| Which LLM provider offers best ideation quality vs. cost? | Developer | Yes | **To be resolved in Week 1 spike** |
| TipTap vs. Milkdown for markdown editor? | Developer | Yes | **To be resolved in Week 1 spike** |
| What is minimum graph size where AI connection suggestions become valuable? | Product | No | Validate in beta (hypothesis: 5+ ideas) |
| Should AI interactions be synchronous or asynchronous? | Developer | Partially | **Synchronous (streaming) recommended** |
| What is right balance between AI proactivity and user control? | Product | No | Validate in beta (start conservative) |
| Is "Prolific Thinker" segment reachable through content marketing? | Marketing | No | Test with landing page + IndieHackers build log |
| Free tier limits: 50 or 100 ideas? | Product | No | **Recommendation: 100 ideas, 50 AI interactions/month** |

### 9.4 Decision Log

| Decision | Date | Rationale | Impact |
|----------|------|-----------|--------|
| **Web app first, Tauri later** | 2026-02-12 | Fastest to develop; modern browsers support local-first via IndexedDB/WASM | Desktop wrapper deferred to Phase 1.5 |
| **One AI mode (contextual chat)** | 2026-02-12 | Quality over quantity; 1 high-quality mode beats 5 mediocre; specialized modes as templates in Phase 1.5 | Reduced AI development from 6-8 weeks to 2-3 weeks |
| **TF-IDF for connection discovery** | 2026-02-12 | Simple, fast, works offline; embedding-based upgrade in Phase 2 once value proven | Connection quality lower but sufficient for MVP validation |
| **SQLite-in-WASM via sql.js** | 2026-02-12 | Local-first compatible; query-capable; future sync-ready with UUIDs + timestamps | Performance acceptable up to 1000 ideas |
| **No graph visualization in MVP** | 2026-02-12 | 2-3 weeks effort; needs 20+ ideas to be useful; connections shown as list | Graph deferred to Phase 1.5 |
| **No voice capture in MVP** | 2026-02-12 | Adds complexity without core value for desktop users; more valuable on mobile | Voice deferred to Phase 2 (mobile) |
| **Claude API as primary LLM** | 2026-02-12 | Quality reasoning for idea development; Vercel AI SDK provides provider abstraction | To be validated in Week 1 spike |
| **Dark mode first** | 2026-02-12 | Target users (creators) work at all hours; dark reduces eye strain for extended sessions | Light mode available but dark is default |
| **Free tier: 100 ideas, 50 AI interactions/month** | 2026-02-12 | Generous enough to demonstrate value; constraining enough to drive upgrades; 20/month too restrictive | To be implemented in Phase 1.5 when monetization infrastructure is added |

---

## 10. Handoff Checklist

### For Development (APEX Architect)

- [x] All user stories documented with acceptance criteria
- [x] Technical constraints specified (stack, architecture, data model)
- [x] Design system tokens and components provided
- [x] API surface defined (AI provider via Vercel AI SDK)
- [x] Performance targets specified
- [x] Error handling requirements documented
- [x] Accessibility requirements specified (WCAG 2.1 AA)
- [x] Local-first architecture validated
- [x] Open questions flagged for Week 1 resolution

### For Design (Already Complete)

- [x] Design system tokens exported (design-system.md)
- [x] Component specifications with CVA variants
- [x] UX flows documented (ux-flows.md)
- [x] Information architecture defined
- [x] Responsive breakpoints specified
- [x] Icon system specified (Lucide)
- [x] Accessibility guidelines provided

### For Marketing (Already Complete)

- [x] Positioning statement finalized
- [x] Brand voice guidelines documented
- [x] In-product copy written (onboarding, empty states, errors, success)
- [x] Privacy messaging drafted
- [x] Launch strategy outlined (ProductHunt, IndieHackers, HN, Reddit, Twitter)
- [x] Pricing strategy documented (deferred to Phase 1.5)

### For QA / Testing (Future)

- [ ] Test plan to be created from acceptance criteria
- [ ] Browser compatibility matrix provided
- [ ] Performance benchmarks to be defined
- [ ] Accessibility testing checklist (WCAG 2.1 AA)

---

## Approval & Sign-Off

**Product Manager**: _________________ Date: _______

**Technical Lead**: _________________ Date: _______

**Design Lead**: _________________ Date: _______

**Marketing Lead**: _________________ Date: _______

---

**Document Version**: 1.0 (Final)
**Total Pages**: [Generated]
**Word Count**: ~11,500 words
**User Stories**: 19 (MVP Phase 1)
**Estimated Effort**: 11 person-weeks + 1 week buffer = 12 weeks
**Target Launch**: Month 3 (end of Phase 1)

---

*This PRD is the authoritative specification for IdeaForge MVP (Phase 1). All subsequent architecture, design, and implementation decisions should reference this document. Changes to scope, features, or requirements must be documented as amendments with version control.*

**File Location**: `C:\Users\bsmoo\projects\ideaforge\docs\product\prd.md`
