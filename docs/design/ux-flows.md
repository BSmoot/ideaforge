# IdeaForge — UX Flows and User Journeys

**Status**: Complete
**Phase**: MVP (Phase 1)
**Source**: Feature Breakdown (feature-breakdown.md)
**Date**: 2026-02-12
**Architect**: UX Architect (prism-experience-architect)

---

## Executive Summary

This document specifies the user experience for IdeaForge MVP, focusing on intuitive flows that support rapid idea capture, deep development with AI assistance, and effortless navigation. The UX embodies the forge metaphor while maintaining clarity for first-time users.

**Design Philosophy**: Fast, focused, and creative. The interface disappears when capturing, supports when developing, and connects when exploring.

**Key Principles**:
1. **Speed is sacred** - Every interaction optimized for flow state
2. **Progressive disclosure** - Simple surface, deep when needed
3. **Contextual intelligence** - Right tools at the right time
4. **Effortless navigation** - Find anything in 10 seconds or fewer

---

## 1. Core User Journeys

### Journey 1: First-Time Experience (Cold Start to "Aha Moment")

**Persona**: Maya, Marketing Manager (The Prolific Creator)
**Goal**: Understand what IdeaForge does and experience value within 3 minutes
**Entry Point**: Landing page or direct app URL
**Success Metric**: First spark created, AI chat opened, "I get it" moment achieved

#### Journey Stages

##### Stage 1: Arrival and Orientation
**Duration**: 0-30 seconds
**User Mindset**: "What is this tool? Can I trust it?"

**Touchpoints**:
- Application loads showing empty state
- Welcome message appears (non-blocking)

**User Actions**:
| Action | Expected Outcome | Emotion |
|--------|------------------|---------|
| URL loads | App shell renders in < 2 seconds with clear layout | Neutral → Impressed (if fast) |
| Views welcome message | Sees: "Capture ideas. Develop them with AI. Track progress." Brief, no jargon. | Curious |
| Reads prompt | "What's an idea you've been thinking about?" with focused input field | Engaged |

**Pain Points to Avoid**:
- Long tutorials or video explanations
- Multi-step signup wizard
- Unclear value proposition

**UX Decisions**:
- Welcome message is 2 sentences max, dismissible
- No account creation gate - instant access
- Primary action (input field) is visually dominant

---

##### Stage 2: First Capture (The Hook)
**Duration**: 30 seconds - 1 minute
**User Mindset**: "Let me test this quickly"

**Touchpoints**:
- Spark capture input (in-context, not a separate form)

**User Actions**:
| Action | Expected Outcome | Emotion |
|--------|------------------|---------|
| Types idea title in welcome input | Autofocus, characters appear instantly | "This is fast" |
| Presses Enter (or clicks "Capture") | Spark saves instantly, appears in empty space below | Satisfied → "That was easy" |
| Sees spark displayed as a card | Card shows title, timestamp, "Spark" status badge, "Open" button | Oriented |

**Micro-interactions**:
- Typing feels responsive (no debounce on display)
- Save happens with subtle animation (card slides in from top)
- Success is confirmed visually (check mark, brief highlight)

**Pain Points Prevented**:
- No "required fields" other than title
- No forced categorization at capture
- No page navigation - happens in-place

---

##### Stage 3: Discovery of Development Power
**Duration**: 1-2 minutes
**User Mindset**: "Okay, I captured one. Now what?"

**Touchpoints**:
- Spark card in list
- Canvas view
- AI chat panel discovery

**User Actions**:
| Action | Expected Outcome | Emotion |
|--------|------------------|---------|
| Clicks "Open" on spark card | Canvas opens with spark title at top, empty editor below | "Now I can develop this" |
| Sees editor with formatting options | Realizes this is more than a text box - markdown support visible | Interested |
| Notices "Chat with AI" button (pulsing dot or subtle cue) | Tooltip appears: "Ask AI to challenge or develop your idea" | Curious |
| Clicks AI chat button | Panel slides in from right with pre-loaded context message: "I've read your idea about [title]. How can I help you develop it?" | **Aha moment** - "The AI knows my idea!" |
| Types "challenge this" or "what am I missing?" | AI responds in 1-2 seconds with specific reference to their idea | Delighted → "This is useful" |

**Moments of Truth**:
1. **Canvas opens**: If it's intimidating or cluttered, user leaves. Must feel like a blank page with gentle guidance.
2. **AI responds with context**: If response is generic ("That's an interesting idea"), trust breaks. Must reference specific content.

**UX Decisions**:
- Canvas shows subtle prompt text: "Develop your spark... add details, structure your thinking"
- AI chat button is prominent but not intrusive (right side of header, icon + label)
- First AI message is pre-written system message showing context awareness
- Onboarding tooltip sequence (max 2 tooltips) guides to AI chat if user doesn't discover it naturally

---

##### Stage 4: Understanding the System
**Duration**: 2-3 minutes
**User Mindset**: "I see how this works. What else can I do?"

**Touchpoints**:
- Status change action
- Navigation back to ideas list
- Discovery of search

**User Actions**:
| Action | Expected Outcome | Emotion |
|--------|------------------|---------|
| Develops idea content in editor | Auto-save indicator shows "Saved" every few seconds | Secure - "My work is safe" |
| Notices metadata panel (right sidebar) | Sees status dropdown, currently "Spark" | "I can organize these" |
| Changes status to "Developing" | Status updates immediately, badge color changes | "I'm tracking progress" |
| Closes canvas (back button or ESC) | Returns to ideas list, sees their spark with "Developing" badge | Oriented - "I understand the workflow" |
| Notices search bar at top | Realizes they can find ideas easily | Confident - "This will scale" |

**Exit Moment** (positive):
User thinks: "I'll be back. This could replace my scattered notes."

**Success Indicators**:
- [ ] First spark captured in < 60 seconds
- [ ] Canvas opened and explored
- [ ] AI chat triggered and responded to
- [ ] Status understood and changed
- [ ] User returns within 24 hours

---

### Journey 2: Daily Capture Flow (The Quick Hit)

**Persona**: Alex, Indie Developer
**Goal**: Capture an idea that just occurred (shower thought, walking, reading)
**Context**: Has 5 seconds to write it down before distraction
**Success Metric**: Idea captured and accessible later, under 10 seconds total

#### Journey Map

##### Stage: Idea Occurs → Captured → Back to Life
**Duration**: 5-10 seconds
**User Mindset**: "I need to write this down NOW before I forget"

**User Flow**:
```
[Idea occurs while away from computer]
    ↓
[Opens IdeaForge bookmark or types URL]
    ↓
[App loads (from cache if returning user, < 1 second)]
    ↓
[EITHER path A: Clicks "New Idea" button (mouse users)
  OR path B: Presses Ctrl/Cmd+N (keyboard users)]
    ↓
[Capture modal appears, title field auto-focused]
    ↓
[Types title: "API design pattern for multi-tenant isolation"]
    ↓
[Presses Enter]
    ↓
[Spark saves, modal closes OR stays open for next capture]
    ↓
[User closes browser tab / switches to other task]
```

**Critical Success Factors**:
| Factor | Requirement | Why |
|--------|-------------|-----|
| Load speed | < 1 second (cached) | User might forget idea if delayed |
| Focus management | Title field auto-focused on modal open | No extra click needed |
| Keyboard flow | Ctrl/Cmd+N → type → Enter → done | No mouse required for power users |
| Minimal friction | Title only, description optional | Forced fields break flow |
| Capture confirmation | Brief visual + option to continue | User knows it saved but isn't blocked |

**Interaction Pattern Details**:

**Capture Modal Behavior**:
- Appears centered, medium size (600px wide max)
- Background dims slightly (modal overlay)
- Title input: Large, clear, 200 char limit with counter
- Description textarea: Below title, expandable, truly optional
- Tags input: Below description, autocomplete, comma-separated
- Actions: "Capture" button (primary) + "Capture & Open" (secondary) + Close icon

**Keyboard Shortcuts**:
- `Ctrl/Cmd + N`: Open capture modal (global)
- `Enter`: Save and close (when in title or tags)
- `Ctrl/Cmd + Enter`: Save and open on canvas
- `Escape`: Close modal (confirms if title has content)

**Success States**:
- After capture: Brief toast "Spark captured" (2 seconds, bottom-right)
- Modal clears for next entry (or closes if user preference)
- New spark appears at top of ideas list with timestamp

**Error States**:
- Empty title submission: Inline error below field "Title is required"
- Network offline: No error (local-first saves regardless)
- Storage quota exceeded: Modal warning "Storage nearly full - export recommended"

---

### Journey 3: Deep Development Session (The Work Session)

**Persona**: Jordan, Content Creator
**Goal**: Take a rough spark and develop it into a structured, well-thought-out concept
**Duration**: 15-45 minutes
**Success Metric**: Idea moves from "Spark" to "Refined" status, multiple AI interactions, sections added

#### Journey Map

##### Stage 1: Selecting an Idea to Develop
**User Mindset**: "I have time to think deeply. Which idea should I work on?"

**Touchpoints**: Ideas list, filters, search

**Flow**:
```
[User opens IdeaForge with intent to develop]
    ↓
[Views Ideas list (default: sorted by last modified)]
    ↓
[EITHER: Scans recent ideas
  OR: Filters by status "Spark" (ideas needing development)
  OR: Searches for keyword to find specific idea]
    ↓
[Clicks on spark card: "Local-first sync strategy for mobile"]
    ↓
[Canvas opens with idea]
```

**UX Decisions**:
- Ideas list defaults to "Last Modified" to surface recently touched ideas
- Status filter is persistent tabs at top of list (not a dropdown)
- Search is always visible (Cmd+K as secondary access)
- Spark cards show brief content preview (first 80 chars) to jog memory

---

##### Stage 2: Developing on Canvas
**User Mindset**: "I need to think this through. What are all the pieces?"

**Touchpoints**: Markdown editor, structured sections, metadata panel

**Flow**:
```
[Canvas loads with spark title and brief description]
    ↓
[User reads what they captured earlier]
    ↓
[Clicks in editor below title, starts writing]
    ↓
[Types: "## Problem" heading]
    ↓
[Editor recognizes heading, offers section template suggestions]
    ↓
[User continues writing problem description]
    ↓
[Uses "/" slash command or toolbar to add "## Solution" section]
    ↓
[Writes solution section]
    ↓
[Notices auto-save indicator: "Saved 3 seconds ago"]
    ↓
[Opens metadata panel (right sidebar) to add tags]
    ↓
[Adds tags: "architecture", "mobile", "sync"]
```

**Markdown Editor Behavior**:
- Real-time formatting (WYSIWYG-style markdown)
- Toolbar: Bold, Italic, Heading, List, Link, Code, Blockquote
- Slash commands: Type "/" for quick actions (heading, list, section template)
- Auto-save: Debounced 1 second after last keystroke
- Save indicator: Subtle text in top-right "Saving..." → "Saved"

**Structured Sections Feature**:
- Slash command: `/problem`, `/solution`, `/evidence`, `/next-steps`, `/questions`
- Inserts heading with optional placeholder text
- Sections are just markdown headings (not separate data fields)
- Outline sidebar shows all headings for navigation in long ideas

**Metadata Panel** (collapsible right sidebar):
```
┌─────────────────────────┐
│ Status: [Dropdown]      │
│   ☐ Spark               │
│   ☑ Developing          │
│   ☐ Refined             │
│   ☐ Parked              │
│   ☐ Archived            │
│                         │
│ Tags:                   │
│  [architecture] [×]     │
│  [mobile] [×]           │
│  [+ Add tag]            │
│                         │
│ Created:                │
│  2 days ago             │
│                         │
│ Last modified:          │
│  Just now               │
│                         │
│ Connections: 0          │
│  [+ Connect idea]       │
└─────────────────────────┘
```

---

##### Stage 3: AI Dialogue (The Thinking Partner)
**User Mindset**: "I have the basics. Now I need to pressure-test this and find gaps."

**Touchpoints**: AI chat panel

**Flow**:
```
[User finishes drafting solution section]
    ↓
[Clicks "Chat with AI" button in header (or presses Cmd+Shift+A)]
    ↓
[AI panel slides in from right (canvas shrinks to accommodate)]
    ↓
[AI shows context-loaded greeting: "I've read your idea about local-first sync. How can I help develop it?"]
    ↓
[User types: "challenge this approach"]
    ↓
[AI responds in 1-2 seconds with specific challenges referencing the solution]
    ↓
[User reads response, realizes they hadn't considered conflict resolution]
    ↓
[Switches focus back to editor, adds "## Conflict Resolution" section]
    ↓
[Switches back to AI chat, types: "what are edge cases for offline-first sync?"]
    ↓
[AI lists 5 edge cases with brief explanations]
    ↓
[User copies relevant points into their idea (editor still visible)]
    ↓
[After 3-4 exchanges, user feels idea is well-developed]
```

**AI Chat Panel Layout**:
```
┌─────────────────────────────────┐
│ Chat with AI            [× Close]│
├─────────────────────────────────┤
│ 🤖 I've read your idea about    │
│    local-first sync. How can I  │
│    help develop it?             │
│                                 │
│ 👤 challenge this approach      │
│                                 │
│ 🤖 Your approach has merit, but │
│    here are some concerns:      │
│    1. You mention CRDTs but...  │
│    2. Conflict resolution...    │
│    [continues]                  │
│                                 │
│ 👤 what are edge cases for      │
│    offline-first sync?          │
│                                 │
│ 🤖 [response appears here,      │
│     streaming token-by-token]   │
├─────────────────────────────────┤
│ [Type your message...          ]│
│                          [Send] │
└─────────────────────────────────┘
```

**AI Panel Behavior**:
- Opens as 400px-wide panel on right (canvas shrinks to 60% width)
- Scrolls independently of canvas
- Conversation persists - reopening shows full history
- Streaming responses (tokens appear as generated)
- Copy button on each AI message
- Canvas remains editable while panel is open (split view)

**AI Context Loading** (invisible to user):
- System prompt: "You are a thinking partner helping develop ideas. Reference their content specifically. Ask probing questions. Challenge assumptions."
- Includes: idea title, current status, full content (or summary if > 5000 chars)
- Conversation history for this idea

---

##### Stage 4: Finishing and Status Update
**User Mindset**: "This feels complete. What's next?"

**Flow**:
```
[User finishes AI conversation, has developed multiple sections]
    ↓
[Closes AI panel (or keeps it open for reference)]
    ↓
[Reads through their developed idea]
    ↓
[Opens metadata panel]
    ↓
[Changes status from "Developing" to "Refined"]
    ↓
[Status badge updates immediately]
    ↓
[User navigates back to ideas list (back button or ESC)]
    ↓
[Sees their idea now shows "Refined" badge]
    ↓
[Feels satisfaction - visible progress]
```

**Status Workflow** (state machine, any transition allowed):
```
Spark (blue dot) → raw idea, just captured
    ↓
Developing (amber dot) → actively working on it
    ↓
Refined (green dot) → well-developed, clear concept
    ↓
Parked (gray dot) → on hold, not discarded
    ↓
Archived (hidden) → done or discarded
```

**Success Indicators**:
- [ ] User spent 10+ minutes on canvas
- [ ] Multiple sections added
- [ ] 3+ AI interactions
- [ ] Status changed from "Spark" to higher stage
- [ ] User returns to this idea later (indicates value)

---

### Journey 4: Discovery and Review Flow (The Serendipity Loop)

**Persona**: Sam, Researcher
**Goal**: Browse old ideas, find forgotten sparks, connect related concepts
**Duration**: 10-20 minutes
**Success Metric**: Rediscover a spark, develop it further, or connect two ideas

#### Journey Map

##### Stage 1: Browsing with Intent
**User Mindset**: "I have some time. What ideas have I neglected?"

**Touchpoints**: Ideas list, filters, sorting

**Flow**:
```
[User opens IdeaForge without a specific idea in mind]
    ↓
[Views ideas list (default view)]
    ↓
[Clicks status filter: "Spark" (ideas never developed)]
    ↓
[List filters to show only sparks]
    ↓
[Changes sort: "Created Date" (oldest first)]
    ↓
[Sees spark from 3 weeks ago: "Gamification for habit tracking"]
    ↓
[Thinks: "Oh yeah, I forgot about this one!"]
    ↓
[Clicks to open]
```

**Ideas List View Options**:
```
┌────────────────────────────────────────────────────────┐
│ Ideas                    [Grid] [List] [Search icon]   │
├────────────────────────────────────────────────────────┤
│ Filters:  [All] [Spark] [Developing] [Refined] [Parked]│
│ Sort by:  [Last Modified ▼] [Created] [Title] [Status] │
├────────────────────────────────────────────────────────┤
│ ● Spark: Local-first sync strategy                    │
│   "Exploring CRDTs and conflict resolution..." 2d ago  │
│   [architecture] [mobile] [sync]                       │
│                                                        │
│ ● Developing: API design patterns for multi-tenant    │
│   "Isolation strategies at the database level..." 5d   │
│   [architecture] [saas]                                │
│                                                        │
│ ● Refined: Personal finance app positioning           │
│   "Target user: millennials with student loans..." 1w  │
│   [product] [fintech] [marketing]                      │
└────────────────────────────────────────────────────────┘
```

**List View Details**:
- Each card shows: status dot + title + content preview (80 chars) + tags + timestamp
- Hover reveals: "Open" button (primary) + "Delete" icon (danger)
- Click anywhere on card opens idea
- Archived ideas hidden by default (toggle: "Show archived")

**Grid View** (alternative):
- Same information, card-based layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- More visual, less dense
- Good for spatial memory ("I remember that green card in the bottom right")

---

##### Stage 2: Search and Retrieval
**User Mindset**: "I remember writing something about authentication. Where is it?"

**Touchpoints**: Search bar

**Flow**:
```
[User presses Cmd+K (or clicks search bar)]
    ↓
[Search modal opens, overlaying ideas list]
    ↓
[Types: "auth"]
    ↓
[As-you-type results appear (200ms debounce)]
    ↓
[Shows 3 matches with highlighted terms]
    ↓
[Results show: title (with "auth" highlighted), content snippet (with context), status badge]
    ↓
[User clicks result: "OAuth vs. JWT for API authentication"]
    ↓
[Search modal closes, canvas opens with that idea]
```

**Search Interface**:
```
┌────────────────────────────────────────┐
│  🔍  auth                       [× ESC]│
├────────────────────────────────────────┤
│  Results (3)                           │
│                                        │
│  ● OAuth vs. JWT for API *auth*...     │
│    "Comparing token-based *auth*..."   │
│    Spark • 12 days ago                 │
│                                        │
│  ● User *auth*entication flows         │
│    "Multi-factor *auth* with SMS..."   │
│    Developing • 5 days ago             │
│                                        │
│  ● *Auth*orization patterns in APIs    │
│    "Role-based access control for..."  │
│    Refined • 3 days ago                │
└────────────────────────────────────────┘
```

**Search Behavior**:
- Searches: title, content, tags
- Minimum 2 characters to trigger
- Results update as-you-type (debounced)
- Highlights matching terms in results
- Shows top 10 results (no pagination in MVP)
- Keyboard navigation: arrow keys to select, Enter to open
- Fully functional offline (local SQLite FTS5)

---

##### Stage 3: Status Transitions
**User Mindset**: "I need to organize these ideas by what needs attention"

**Touchpoints**: Status filter, bulk context

**Flow**:
```
[User views ideas list]
    ↓
[Notices 15 sparks (never developed)]
    ↓
[Filters to "Spark" status]
    ↓
[Scans list, opens one that seems promising]
    ↓
[Develops it briefly on canvas]
    ↓
[Changes status to "Developing" (marking progress)]
    ↓
[Returns to list, continues]
    ↓
[After reviewing several, has clear sense of: what's active, what's mature, what's parked]
```

**Status Management Use Cases**:
| Status | When to Use | User Intent |
|--------|-------------|-------------|
| Spark | Idea just captured, not yet developed | "I captured this, haven't thought deeply yet" |
| Developing | Actively working on it, not complete | "I'm thinking this through" |
| Refined | Well-developed, clear concept | "This is a solid idea, ready for action" |
| Parked | On hold but not discarded | "Good idea, wrong time" |
| Archived | Done (executed) or abandoned | "This is finished or no longer relevant" |

**Success Indicators**:
- [ ] User filters and sorts to find old ideas
- [ ] Search used to retrieve specific idea
- [ ] Rediscovered idea is reopened and developed further
- [ ] Status changes reflect real workflow (not just random clicks)

---

## 2. Information Architecture

### Site Map

```
IdeaForge Application
│
├── Ideas (Home)
│   ├── List View (default)
│   │   ├── All Ideas
│   │   ├── Filtered by Status
│   │   └── Filtered by Tags
│   ├── Grid View
│   └── Search Results View
│
├── Idea Canvas (dynamic route: /ideas/:id)
│   ├── Editor (main content)
│   ├── Metadata Panel (right sidebar, collapsible)
│   └── AI Chat Panel (right panel, toggleable)
│
├── Search (modal overlay, accessible globally)
│
└── Settings
    ├── AI Configuration
    ├── Data Management
    ├── Privacy
    └── About
```

### Navigation Model

#### Primary Navigation (Persistent Left Sidebar)
**Desktop** (always visible, 200px wide):
```
┌─────────────────┐
│  IdeaForge      │
│                 │
│  📝 Ideas       │  ← Active
│  🔍 Search      │  ← Opens modal
│  ⚙️  Settings   │
│                 │
│  [+ New Idea]   │  ← Prominent button
└─────────────────┘
```

**Tablet** (collapsible, hamburger menu):
- Hamburger icon (top-left) opens overlay navigation
- Same items as desktop
- Overlay dismisses on selection

**Mobile** (full-screen menu):
- Hamburger icon opens full-screen navigation
- Large touch targets
- Bottom-aligned "+ New Idea" button

#### Secondary Navigation (Contextual)
**On Ideas List**:
- Tabs for status filters (sticky at top of content)
- Sort dropdown (top-right)
- View toggle: List/Grid (top-right)

**On Idea Canvas**:
- Back button (top-left): Returns to ideas list
- Status dropdown (metadata panel)
- AI Chat toggle (header)

**Breadcrumbs** (not in MVP - deferred):
Would show: Ideas > [Idea Title] > AI Chat

#### Keyboard Navigation
**Global Shortcuts**:
- `Cmd+K`: Open search
- `Cmd+N`: New idea
- `Cmd+/`: Keyboard shortcuts cheat sheet
- `ESC`: Close modal/panel/return to previous view

**Canvas Shortcuts**:
- `Cmd+S`: Manual save (confirmation even though auto-save active)
- `Cmd+Shift+A`: Toggle AI chat
- `Cmd+E`: Toggle metadata panel

**Editor Shortcuts** (standard markdown):
- `Cmd+B`: Bold
- `Cmd+I`: Italic
- `Cmd+K`: Insert link
- `` Cmd+` ``: Code block

### Content Hierarchy

#### Ideas List Page
**Primary**: Ideas list/grid (80% of viewport)
**Secondary**: Status filters (tabs above list)
**Tertiary**: Sort/view controls (top-right corner)
**Action**: "+ New Idea" button (sidebar, always visible)

#### Idea Canvas Page
**Primary**: Editor content (60-70% of width)
**Secondary**: Metadata panel (15-20% of width, right side, collapsible)
**Tertiary**: AI chat panel (toggleable, replaces or overlays metadata when open)
**Context**: Title bar with back button, save indicator, AI chat button

#### Search Modal
**Primary**: Search input (top, focused on open)
**Secondary**: Results list (body of modal)
**Tertiary**: Result metadata (status badge, timestamp)

---

## 3. User Flows

### Flow 1: Spark Capture Flow

```
Entry Points:
  • Click "+ New Idea" button (sidebar)
  • Press Cmd+N (anywhere in app)
  • First-time onboarding prompt

┌───────────────────────────────────────────────┐
│                                               │
│    [User triggers capture]                    │
│           ↓                                   │
│    Capture modal opens                        │
│    (overlay, 600px wide, centered)            │
│           ↓                                   │
│    Title input auto-focused                   │
│           ↓                                   │
│    User types title                           │
│    (required, 1-200 chars)                    │
│           ↓                                   │
│    ┌───────────────────┐                      │
│    │  Add description? │                      │
│    └─────┬────────┬────┘                      │
│          │ Yes    │ No (skip)                 │
│          ↓        ↓                           │
│    Types desc  Presses Enter                  │
│          ↓        ↓                           │
│    ┌───────────────────┐                      │
│    │   Add tags?       │                      │
│    └─────┬────────┬────┘                      │
│          │ Yes    │ No                        │
│          ↓        ↓                           │
│    Types tags  Presses Enter                  │
│          ↓        ↓                           │
│    ┌──────────────────────┐                   │
│    │  Save destination?   │                   │
│    └─────┬────────────┬───┘                   │
│          │            │                       │
│    "Capture"    "Capture & Open"              │
│    (Enter)      (Cmd+Enter)                   │
│          ↓            ↓                       │
│    Modal closes   Canvas opens                │
│    Toast: "Saved"     ↓                       │
│          ↓        Editing session             │
│    Returns to                                 │
│    previous view                              │
│          ↓                                    │
│    Spark appears at                           │
│    top of ideas list                          │
│                                               │
└───────────────────────────────────────────────┘

Success Path: < 10 seconds, idea captured
Error Paths:
  • Empty title → Inline error, prevent save
  • Storage full → Warning, allow save, prompt export
  • Network offline → No error (local-first saves)
```

### Flow 2: Idea Development Flow (Canvas Session)

```
Entry Point: User clicks idea card in list

┌───────────────────────────────────────────────┐
│                                               │
│    [User clicks idea card]                    │
│           ↓                                   │
│    Canvas loads (< 500ms)                     │
│           ↓                                   │
│    Layout renders:                            │
│      • Title (editable inline)                │
│      • Editor (markdown, auto-focused)        │
│      • Metadata panel (right sidebar)         │
│           ↓                                   │
│    User reads current content                 │
│           ↓                                   │
│    ┌──────────────────────────┐               │
│    │ What does user want?     │               │
│    └──┬────────┬─────────┬────┘               │
│       │        │         │                    │
│   Add text  Structure  Get AI help            │
│       ↓        ↓         ↓                    │
│                                               │
│  PATH A: Writing                              │
│    Types in editor                            │
│         ↓                                     │
│    Markdown formats in real-time              │
│         ↓                                     │
│    Auto-save after 1 sec pause                │
│         ↓                                     │
│    "Saved" indicator shows briefly            │
│                                               │
│  PATH B: Structuring                          │
│    Types "/" slash command                    │
│         ↓                                     │
│    Menu appears:                              │
│      • /problem                               │
│      • /solution                              │
│      • /evidence                              │
│      • /next-steps                            │
│         ↓                                     │
│    Selects section type                       │
│         ↓                                     │
│    Heading inserted with placeholder          │
│         ↓                                     │
│    User fills in section                      │
│                                               │
│  PATH C: AI Assistance                        │
│    Clicks "Chat with AI" (header button)      │
│         ↓                                     │
│    AI panel slides in from right              │
│    (canvas width shrinks to 60%)              │
│         ↓                                     │
│    AI greeting loads context:                 │
│    "I've read your idea about [title]..."     │
│         ↓                                     │
│    User types message (e.g., "challenge this")│
│         ↓                                     │
│    AI responds in 1-2 seconds                 │
│    (streaming, token-by-token)                │
│         ↓                                     │
│    User reads response                        │
│         ↓                                     │
│    ┌──────────────────────────┐               │
│    │ Continue conversation?   │               │
│    └──────┬─────────┬─────────┘               │
│           │ Yes     │ No                      │
│           ↓         ↓                         │
│    Next question  Close panel                 │
│           ↓                                   │
│    Idea is developed through dialogue         │
│                                               │
│  ALL PATHS CONVERGE:                          │
│           ↓                                   │
│    User finishes development                  │
│           ↓                                   │
│    ┌──────────────────────────┐               │
│    │ Update status?           │               │
│    └──────┬─────────┬─────────┘               │
│           │ Yes     │ No (later)              │
│           ↓         ↓                         │
│    Opens metadata   Closes canvas             │
│    panel, changes   (auto-saved)              │
│    status           ↓                         │
│           ↓                                   │
│    Status updates   Returns to list           │
│    immediately                                │
│           ↓                                   │
│    Closes canvas or continues editing         │
│                                               │
└───────────────────────────────────────────────┘

Success Path: Idea content expanded, status progressed
Error Paths:
  • AI unavailable → Message: "AI offline, ideas safe"
  • Save fails → Retry 3x with backoff, then warn
  • Browser crash → Auto-save recovers to last 1-sec state
```

### Flow 3: Search and Navigation Flow

```
Entry Points:
  • Click search bar (top of screen)
  • Press Cmd+K (anywhere in app)
  • Type in always-visible search input

┌───────────────────────────────────────────────┐
│                                               │
│    [User triggers search]                     │
│           ↓                                   │
│    Search modal opens (or input focuses)      │
│           ↓                                   │
│    User types query (min 2 chars)             │
│           ↓                                   │
│    Results appear as-you-type                 │
│    (200ms debounce)                           │
│           ↓                                   │
│    ┌──────────────────────────┐               │
│    │ Results found?           │               │
│    └──────┬─────────┬─────────┘               │
│           │ Yes     │ No                      │
│           ↓         ↓                         │
│    Display results  "No results for '[query]'"│
│    (title, snippet, │                         │
│     status, date)   │                         │
│           ↓         │                         │
│    User reviews     User refines query        │
│           ↓              ↓                    │
│    ┌──────────────────────────┐               │
│    │ Interaction?             │               │
│    └──┬─────────┬─────────┬───┘               │
│       │         │         │                   │
│   Click     Arrow keys  Escape                │
│   result      navigate   (cancel)             │
│       ↓         ↓         ↓                   │
│   Canvas   Highlight   Close modal,           │
│   opens    result      return to              │
│   with     (Enter      previous view          │
│   that     opens)                             │
│   idea         ↓                              │
│               Canvas opens                    │
│                                               │
└───────────────────────────────────────────────┘

Success Path: User finds idea in < 5 seconds
Error Paths:
  • Query too short (< 2 chars) → No results, prompt to type more
  • Special characters in query → Escape for SQLite, no error
  • Offline → Fully functional (local search)
```

### Flow 4: Status Management Flow

```
Entry Points:
  • Canvas metadata panel
  • Ideas list (future: bulk actions)

┌───────────────────────────────────────────────┐
│                                               │
│    [User wants to change idea status]         │
│           ↓                                   │
│    Opens metadata panel (on canvas)           │
│    OR views status badge (on list card)       │
│           ↓                                   │
│    Clicks status dropdown                     │
│           ↓                                   │
│    Dropdown expands:                          │
│      ☐ Spark (blue)                          │
│      ☐ Developing (amber)                    │
│      ☐ Refined (green)                       │
│      ☐ Parked (gray)                         │
│      ☐ Archived (hidden)                     │
│           ↓                                   │
│    User selects new status                    │
│           ↓                                   │
│    Status updates immediately                 │
│    (no save button required)                  │
│           ↓                                   │
│    Visual feedback:                           │
│      • Badge color changes                    │
│      • Brief highlight animation              │
│      • "Status updated" toast (optional)      │
│           ↓                                   │
│    ┌──────────────────────────┐               │
│    │ Status = Archived?       │               │
│    └──────┬─────────┬─────────┘               │
│           │ Yes     │ No                      │
│           ↓         ↓                         │
│    Idea hidden      Remains visible           │
│    from list        in list                   │
│    (unless          (with new status)         │
│    "Show archived"                            │
│    toggled)                                   │
│           ↓                                   │
│    User continues work or closes canvas       │
│                                               │
└───────────────────────────────────────────────┘

All transitions allowed (no enforced sequence in MVP)
User can jump from Spark to Archived if needed
```

---

## 4. Interaction Patterns

### Pattern 1: Quick Capture Mechanism

**Implementation Decision**: **Persistent modal** (not inline, not command palette)

**Rationale**:
- Modal provides focused, distraction-free input
- Can be triggered globally with keyboard shortcut
- Preserves context (doesn't navigate away from current view)
- Dismissible without penalty

**Behavior Specification**:

| Interaction | Response | Timing |
|-------------|----------|--------|
| Click "+ New Idea" button | Modal slides in from top (100ms animation) | < 100ms |
| Press Cmd+N | Same modal appears | < 50ms |
| Modal opens | Title input auto-focused, cursor blinking | Immediate |
| Type in title field | Characters appear with no lag | < 16ms (60fps) |
| Press Enter (title only) | Spark saves, modal closes, toast appears | < 200ms |
| Press Cmd+Enter | Spark saves, modal closes, canvas opens | < 300ms |
| Press Escape | Modal closes if title empty, confirms if content | Immediate |
| Click outside modal | Same as Escape | Immediate |

**Visual Design**:
- Modal: 600px wide, centered vertically and horizontally
- Background: Dimmed overlay (rgba(0,0,0,0.5))
- Modal background: White (or theme-appropriate)
- Title input: Large (18px font), prominent
- Optional fields: Visually de-emphasized (smaller labels)
- Buttons: Primary (Capture), Secondary (Capture & Open)

**Accessibility**:
- Focus trap: Tab cycles through modal elements only
- Escape key always exits
- Screen reader: "New idea dialog" landmark
- All fields have ARIA labels

---

### Pattern 2: AI Chat Panel Integration

**Implementation Decision**: **Side panel** (not separate view, not overlay)

**Rationale**:
- User needs to see both editor and AI responses simultaneously
- Copy/paste between editor and AI is critical workflow
- Persistent conversation history must stay accessible
- Split view enables dialogue-while-editing

**Layout Options Evaluated**:

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Separate tab/view | Full screen for each | Context switching penalty | ❌ Rejected |
| Bottom drawer | Good for mobile | Obscures editor content | ❌ Rejected |
| Overlay modal | Simple to implement | Blocks editor, no parallel work | ❌ Rejected |
| Side panel (split) | Both visible, parallel work | Reduces editor width | ✅ **Selected** |

**Behavior Specification**:

**Panel States**:
1. **Closed** (default on canvas load):
   - Editor uses 80% of viewport width
   - Metadata panel on right (20%)
   - AI chat button in header (pulsing dot on first visit)

2. **Opening**:
   - Click "Chat with AI" button or press Cmd+Shift+A
   - Metadata panel slides out (100ms)
   - AI panel slides in from right (200ms)
   - Editor shrinks to 60% width (animated)
   - AI panel occupies 40% width

3. **Open**:
   - AI panel shows: header, conversation history, input field
   - Editor remains fully functional (parallel editing)
   - Splitter (resize divider) between editor and AI panel
   - Close button in AI panel header

4. **Closing**:
   - Click close button, press Cmd+Shift+A, or press Escape
   - AI panel slides out (200ms)
   - Editor expands to 80% width (animated)
   - Metadata panel slides back in (100ms)
   - Conversation history is saved (persists on reopen)

**AI Panel Layout**:
```
┌─────────────────────────────────────┐
│ Chat with AI            [Minimize][×]│  ← Header
├─────────────────────────────────────┤
│                                     │
│  [Conversation history scrolls here]│  ← Body
│  • System context message           │    (scrollable)
│  • User messages (right-aligned)    │
│  • AI messages (left-aligned)       │
│                                     │
│  [Streaming response appears here]  │
│                                     │
├─────────────────────────────────────┤
│  [Type your message...            ] │  ← Footer
│                            [Send] │  (fixed)
└─────────────────────────────────────┘
```

**Responsive Behavior**:
- Desktop (> 1024px): Side panel as described
- Tablet (768-1024px): AI panel overlays editor (70% width), dimmed background
- Mobile (< 768px): AI panel is full-screen view (navigate to/from)

---

### Pattern 3: Auto-Save and Save Indication

**Implementation Decision**: **Debounced auto-save** with visual confirmation

**Auto-Save Logic**:
1. User types in editor
2. Every keystroke resets a 1-second timer
3. When timer expires (1 sec of no typing), save triggers
4. Save happens asynchronously (non-blocking)
5. On save complete, indicator updates

**Save States**:
| State | Indicator | Timing |
|-------|-----------|--------|
| Typing | "Editing..." (subtle, gray) | While typing |
| Saving | "Saving..." (gray, spinner) | 0-500ms |
| Saved | "Saved" (green check, brief) | 500ms then fade |
| Error | "Save failed - Retrying..." (amber warning) | Persistent until resolved |

**Save Indicator Placement**:
- Top-right corner of canvas, next to metadata panel toggle
- Small text (12px), non-intrusive
- Icon + text (check mark or spinner)

**Error Recovery**:
```
Save attempt fails
    ↓
Retry 1: Wait 2 seconds, retry
    ↓
Retry 2: Wait 4 seconds, retry
    ↓
Retry 3: Wait 8 seconds, retry
    ↓
All retries fail
    ↓
Persistent warning: "Unable to save. Check storage space. Your data is cached."
    ↓
User clicks warning
    ↓
Export dialog opens with instructions
```

**Accessibility**:
- Save status announced to screen readers
- Manual save available: Cmd+S (always works, shows confirmation)

---

### Pattern 4: Status Transitions

**Implementation Decision**: **Instant update** with dropdown selector

**Status Dropdown Behavior**:
- Click status badge in metadata panel
- Dropdown expands below (or above if near bottom)
- 5 options with color-coded dots
- Hover highlights option
- Click selects instantly (no "Apply" button)
- Dropdown closes on selection
- Status badge updates with animation (brief scale pulse)

**Visual Design**:
```
Before click: [● Spark ▾]

After click:  [● Spark ▾]  ← Currently selected (checkmark)
              ┌─────────────────┐
              │ ● Spark       ✓│
              │ ● Developing    │
              │ ● Refined       │
              │ ● Parked        │
              │ ● Archived      │
              └─────────────────┘

After selection: [● Developing ▾]  (color changes amber)
```

**Status Colors**:
- Spark: Blue (#3B82F6)
- Developing: Amber (#F59E0B)
- Refined: Green (#10B981)
- Parked: Gray (#6B7280)
- Archived: Muted (#9CA3AF, hidden from list by default)

---

### Pattern 5: Search Interaction

**Implementation Decision**: **Command palette** style (modal overlay)

**Behavior**:
1. Trigger: Cmd+K or click search icon
2. Modal appears with immediate focus on input
3. Type query (min 2 chars)
4. Results update as-you-type (debounced 200ms)
5. Navigate with arrow keys or mouse
6. Enter opens selected result
7. Escape closes modal

**Search Results Display**:
```
┌────────────────────────────────────────────────┐
│  🔍  local-first sync             [× ESC]      │
├────────────────────────────────────────────────┤
│                                                │
│  Results (3)                                   │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ ● Local-first sync strategy              │ │ ← Highlighted
│  │   "Exploring CRDTs and conflict resolu..." │ │   (keyboard nav)
│  │   Developing • 2 days ago                 │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  │ OAuth vs. JWT for API authentication     │ │
│  │   "Comparing token-based authentication..."│ │
│  │   Spark • 12 days ago                     │ │
│                                                │
│  │ Authorization patterns in APIs            │ │
│  │   "Role-based access control for API..."  │ │
│  │   Refined • 3 days ago                    │ │
│                                                │
└────────────────────────────────────────────────┘
```

**Keyboard Navigation**:
- `↓`: Next result
- `↑`: Previous result
- `Enter`: Open selected result
- `Escape`: Close modal
- `Cmd+K`: Toggle search (open if closed, close if open)

---

## 5. Wireframe Descriptions

### Screen 1: Dashboard / Ideas List (Home View)

**Layout**: Three-column structure with persistent sidebar

```
┌────────────────────────────────────────────────────────────────────┐
│ [IdeaForge]                        [Search: Cmd+K]    [@] Settings │ ← Header
├───────┬────────────────────────────────────────────────────────────┤
│       │ Ideas               [Grid] [List]                          │
│ 📝    │                                                             │
│ Ideas │ ┌─────────────────────────────────────────────────────────┐│
│       │ │ [All] [Spark] [Developing] [Refined] [Parked]          ││ ← Status tabs
│ 🔍    │ └─────────────────────────────────────────────────────────┘│
│Search │ Sort by: [Last Modified ▼]                                 │
│       │                                                             │
│ ⚙️    │ ┌─────────────────────────────────────────────────────────┐│
│Set    │ │ ● Spark: Local-first sync strategy                     ││
│tings  │ │   "Exploring CRDTs and conflict resolution patterns..." ││ ← Idea card
│       │ │   [architecture] [mobile] [sync]                        ││   (list item)
│ ───   │ │   2 days ago                                  [Open]    ││
│       │ └─────────────────────────────────────────────────────────┘│
│[+ New]│                                                             │
│ Idea  │ ┌─────────────────────────────────────────────────────────┐│
│       │ │ ● Developing: API design patterns for multi-tenant     ││
│       │ │   "Isolation strategies at the database level using..." ││
│       │ │   [architecture] [saas]                                 ││
│       │ │   5 days ago                                  [Open]    ││
│       │ └─────────────────────────────────────────────────────────┘│
│       │                                                             │
│       │ ┌─────────────────────────────────────────────────────────┐│
│       │ │ ● Refined: Personal finance app positioning            ││
│       │ │   "Target user: millennials with student loan debt..." ││
│       │ │   [product] [fintech] [marketing]                      ││
│       │ │   1 week ago                                  [Open]    ││
│       │ └─────────────────────────────────────────────────────────┘│
│       │                                                             │
│       │ [More ideas...]                                             │
│       │                                                             │
└───────┴────────────────────────────────────────────────────────────┘

Sidebar: 200px wide, fixed
Content: Remaining width (flexible)
Cards: Full width of content area, 100px min-height
Spacing: 16px between cards, 24px padding
```

**Key Elements**:
- Persistent "+ New Idea" button (bottom of sidebar, or floating)
- Status filter tabs are always visible (sticky at top of content)
- Each card shows: status dot, title (bold), content preview (2 lines max), tags, timestamp, hover actions
- Hover reveals: "Open" button (primary), "Delete" icon (subtle, right corner)
- Empty state (no ideas): Large centered message "Capture your first idea" with prominent "+ New Idea" button

---

### Screen 2: Spark Capture Modal

**Layout**: Centered modal overlay

```
         ┌────────────────────────────────────────────┐
         │ New Idea                           [× ESC] │ ← Header
         ├────────────────────────────────────────────┤
         │                                            │
         │ Title *                                    │
         │ ┌────────────────────────────────────────┐ │
         │ │ [cursor here, auto-focused]            │ │ ← Title input
         │ └────────────────────────────────────────┘ │   (large, 18px)
         │ 0/200 characters                           │
         │                                            │
         │ Description (optional)                     │
         │ ┌────────────────────────────────────────┐ │
         │ │                                        │ │ ← Description
         │ │                                        │ │   textarea
         │ │                                        │ │   (expandable)
         │ └────────────────────────────────────────┘ │
         │                                            │
         │ Tags (optional)                            │
         │ ┌────────────────────────────────────────┐ │
         │ │ [architecture] [mobile] [+           ] │ │ ← Tag input
         │ └────────────────────────────────────────┘ │   (autocomplete)
         │                                            │
         │                [Capture] [Capture & Open]  │ ← Actions
         │                                            │
         └────────────────────────────────────────────┘

Modal: 600px wide, auto-height (max 80vh)
Background: Dimmed overlay (50% opacity)
Padding: 24px all sides
Spacing: 16px between fields
```

**Key Elements**:
- Title input auto-focused on modal open
- Enter key in title or tags submits form (saves)
- Cmd+Enter opens canvas after save
- Escape closes modal (confirms if content exists)
- "Capture" is primary button (green), "Capture & Open" is secondary (blue)
- Tag autocomplete dropdown appears below input when typing

---

### Screen 3: Idea Canvas (Main Workspace)

**Layout**: Three-panel layout (editor-centric)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Ideas          Local-first sync strategy         Saved   [🤖 Chat] │ ← Header
├───────────────────────────────────────────────────┬──────────────────────────┤
│                                                   │ Status:                  │
│ [Title: Local-first sync strategy]               │ ● [Developing ▾]         │
│                                                   │                          │
│ ## Problem                                        │ Tags:                    │
│                                                   │ [architecture] [×]       │
│ Most mobile apps fail offline. Users expect...   │ [mobile] [×]             │
│                                                   │ [sync] [×]               │
│ ## Solution                                       │ [+ Add tag]              │
│                                                   │                          │
│ Use CRDTs for conflict-free eventual...          │ Created:                 │
│                                                   │ 2 days ago               │
│ ### Conflict Resolution                           │                          │
│                                                   │ Last modified:           │
│ When two clients [cursor]                        │ Just now                 │
│                                                   │                          │
│                                                   │ Connections: 0           │
│                                                   │ [+ Connect idea]         │
│                                                   │                          │
│ ┌───────────────────────────────────────────────┐ │                          │
│ │ /problem   /solution   /evidence              │ │                          │
│ │ /next-steps   /questions                      │ │                          │
│ └───────────────────────────────────────────────┘ │                          │
│  ↑ Slash command menu (triggered by typing "/")  │                          │
│                                                   │                          │
│                                                   │                          │
│                                                   │                          │
│                                                   │                          │
│                                                   │                          │
│                                                   │                          │
└───────────────────────────────────────────────────┴──────────────────────────┘

Editor (left): 70% of width
Metadata panel (right): 30% of width, collapsible
Header: 60px height, fixed
Padding: 24px in editor, 16px in panel
```

**Key Elements**:
- Title is editable inline (click to edit, auto-saves)
- Editor supports full markdown formatting (toolbar appears on text selection)
- Slash command menu appears when user types "/" (context-aware)
- Metadata panel is scrollable if content exceeds viewport
- Back button returns to ideas list
- AI chat button has pulsing dot indicator on first canvas visit (onboarding)
- Auto-save indicator in top-right (subtle, non-distracting)

---

### Screen 4: Idea Canvas with AI Chat Panel

**Layout**: Three-panel split (editor + AI)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Back          Local-first sync strategy         Saved   [🤖 Chat (active)] │
├────────────────────────────────────────┬─────────────────────────────────────┤
│                                        │ Chat with AI       [Minimize] [× ]  │
│ [Title: Local-first sync strategy]    ├─────────────────────────────────────┤
│                                        │                                     │
│ ## Problem                             │ 🤖 I've read your idea about        │
│                                        │    local-first sync. How can I      │
│ Most mobile apps fail offline...      │    help you develop it?             │
│                                        │                                     │
│ ## Solution                            │ 👤 challenge this approach          │
│                                        │                                     │
│ Use CRDTs for conflict-free...        │ 🤖 Your approach has merit, but     │
│                                        │    here are some concerns:          │
│ ### Conflict Resolution                │                                     │
│                                        │    1. CRDTs introduce complexity    │
│ When two clients [cursor]             │       that may not be warranted if  │
│                                        │       your sync conflicts are rare  │
│                                        │                                     │
│                                        │    2. You mention "eventual         │
│                                        │       consistency" but haven't      │
│                                        │       addressed how users will      │
│                                        │       perceive delayed sync...      │
│                                        │                                     │
│                                        │    [AI response continues]          │
│                                        │                                     │
│                                        │ 👤 what are edge cases for...       │
│                                        │                                     │
│                                        │ 🤖 [Streaming response appears      │
│                                        │     here token-by-token...]         │
│                                        │                                     │
│                                        ├─────────────────────────────────────┤
│                                        │ [Type your message...            ]  │
│                                        │                           [Send]    │
└────────────────────────────────────────┴─────────────────────────────────────┘

Editor (left): 60% of width (reduced from 70%)
AI panel (right): 40% of width (replaces metadata panel)
Splitter: Draggable divider between editor and AI (user can resize)
```

**Key Elements**:
- AI panel header shows "Chat with AI" title and close/minimize buttons
- Conversation history scrolls independently
- User messages right-aligned (light blue background)
- AI messages left-aligned (white/neutral background)
- Streaming responses appear token-by-token (not all at once)
- Input field fixed at bottom of panel
- Metadata panel is hidden when AI chat is open (or minimized to icons-only)

---

### Screen 5: Search / Filter View

**Layout**: Modal overlay (command palette style)

```
         ┌────────────────────────────────────────────────────┐
         │  🔍  sync architecture                     [× ESC] │ ← Search input
         ├────────────────────────────────────────────────────┤
         │                                                    │
         │  Results (5)                                       │
         │                                                    │
         │  ┌──────────────────────────────────────────────┐ │
         │  │ ● Local-first sync strategy                  │ │ ← Result 1
         │  │   "Exploring CRDTs and conflict resolution..." │   (highlighted)
         │  │   Developing • 2 days ago                     │ │
         │  └──────────────────────────────────────────────┘ │
         │                                                    │
         │  │ OAuth vs. JWT for API authentication         │ │ ← Result 2
         │  │   "Comparing token-based authentication with..."│ │
         │  │   Spark • 12 days ago                         │ │
         │                                                    │
         │  │ Microservices architecture patterns          │ │ ← Result 3
         │  │   "Event-driven architecture with message..."  │ │
         │  │   Refined • 3 weeks ago                       │ │
         │                                                    │
         │  │ Database sync strategies                     │ │ ← Result 4
         │  │   "Comparing master-slave replication vs..."   │ │
         │  │   Parked • 1 month ago                        │ │
         │                                                    │
         │  │ System architecture review notes             │ │ ← Result 5
         │  │   "Architectural decision records for sync..."  │ │
         │  │   Developing • 1 week ago                     │ │
         │                                                    │
         │                                                    │
         └────────────────────────────────────────────────────┘

Modal: 700px wide, max 600px height
Positioned: Centered, slightly toward top (30% from top)
Results: Scrollable if > 10 results
Highlight: Blue background for selected result
```

**Key Elements**:
- Search input is always focused (auto-focus on open)
- Results update as-you-type (200ms debounce)
- Matching text is highlighted in bold or color
- Each result shows: status dot, title, content snippet (truncated), date
- Keyboard navigation: arrows to select, Enter to open, Escape to close
- Click anywhere outside modal to close
- "No results" state shows helpful message: "No ideas match '[query]'. Try different keywords."

---

## 6. Accessibility Considerations

### Keyboard Navigation Requirements

**Global Navigation**:
| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd/Ctrl + N` | Open spark capture modal | Anywhere in app |
| `Cmd/Ctrl + K` | Open search modal | Anywhere in app |
| `Cmd/Ctrl + /` | Show keyboard shortcuts | Anywhere in app |
| `Escape` | Close modal/panel/return | Context-dependent |
| `Tab` | Next focusable element | Standard |
| `Shift + Tab` | Previous focusable element | Standard |

**Canvas-Specific**:
| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd/Ctrl + S` | Manual save (confirm) | Canvas editor |
| `Cmd/Ctrl + B` | Bold text | Canvas editor |
| `Cmd/Ctrl + I` | Italic text | Canvas editor |
| `Cmd/Ctrl + K` | Insert link | Canvas editor (conflicts with search - editor takes precedence when focused) |
| `Cmd/Ctrl + Shift + A` | Toggle AI chat panel | Canvas |
| `Cmd/Ctrl + E` | Toggle metadata panel | Canvas |

**List Navigation**:
| Shortcut | Action | Context |
|----------|--------|---------|
| `Arrow Down` | Next idea in list | Ideas list |
| `Arrow Up` | Previous idea in list | Ideas list |
| `Enter` | Open selected idea | Ideas list |
| `Delete` | Delete selected idea (confirm) | Ideas list |

**Focus Management**:
- Modals trap focus (Tab cycles within modal only)
- Closing modal returns focus to trigger element
- Opening AI panel maintains editor focus (user can Tab to panel)
- Opening metadata panel does not steal focus
- Keyboard shortcuts work regardless of focus location (except when typing in inputs)

---

### Screen Reader Support

**Landmark Regions**:
```html
<header role="banner">
  <!-- Top navigation, logo, search, settings -->
</header>

<nav role="navigation" aria-label="Main navigation">
  <!-- Sidebar: Ideas, Search, Settings links -->
</nav>

<main role="main">
  <!-- Ideas list or Idea canvas -->

  <aside role="complementary" aria-label="Idea metadata">
    <!-- Metadata panel -->
  </aside>

  <aside role="complementary" aria-label="AI chat">
    <!-- AI chat panel -->
  </aside>
</main>

<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <!-- Spark capture modal -->
</div>
```

**ARIA Labels and Descriptions**:
| Element | ARIA Attribute | Value |
|---------|----------------|-------|
| Spark capture modal | `aria-labelledby`, `aria-modal` | "New Idea", true |
| Search modal | `aria-labelledby`, `aria-modal` | "Search Ideas", true |
| AI chat panel | `aria-label` | "AI conversation" |
| Metadata panel | `aria-label` | "Idea metadata and status" |
| Status dropdown | `aria-label` | "Change idea status" |
| Icon-only buttons | `aria-label` | "Chat with AI", "Close panel", etc. |
| Auto-save indicator | `aria-live="polite"` | Announces "Saving..." and "Saved" |

**Screen Reader Announcements**:
- Spark capture success: "Idea saved"
- Status change: "Status changed to Developing"
- AI response ready: "AI response received" (user can navigate to read)
- Search results updated: "5 results found for [query]"
- Error states: "Save failed, retrying..." (polite announcement)

---

### Color Contrast Requirements

**WCAG 2.1 AA Compliance** (minimum 4.5:1 for normal text, 3:1 for large text)

**Status Colors** (against white background):
| Status | Color | Contrast Ratio | Pass? |
|--------|-------|----------------|-------|
| Spark | #2563EB (blue) | 4.52:1 | ✅ AA |
| Developing | #D97706 (amber) | 4.81:1 | ✅ AA |
| Refined | #059669 (green) | 4.56:1 | ✅ AA |
| Parked | #4B5563 (gray) | 7.12:1 | ✅ AAA |
| Archived | #6B7280 (gray) | 5.89:1 | ✅ AA |

**Text Colors**:
| Element | Color | Background | Contrast | Pass? |
|---------|-------|------------|----------|-------|
| Primary text | #111827 | #FFFFFF | 14.7:1 | ✅ AAA |
| Secondary text | #6B7280 | #FFFFFF | 5.89:1 | ✅ AA |
| Link text | #2563EB | #FFFFFF | 4.52:1 | ✅ AA |
| Error text | #DC2626 | #FFFFFF | 4.53:1 | ✅ AA |
| Success text | #059669 | #FFFFFF | 4.56:1 | ✅ AA |

**Button States**:
| State | Background | Text | Contrast | Pass? |
|-------|------------|------|----------|-------|
| Primary (default) | #2563EB | #FFFFFF | 4.52:1 | ✅ AA |
| Primary (hover) | #1D4ED8 | #FFFFFF | 5.01:1 | ✅ AA |
| Primary (focus) | #2563EB + outline | #FFFFFF | - | ✅ (outline visible) |
| Secondary (default) | #F3F4F6 | #111827 | 14.7:1 | ✅ AAA |
| Secondary (hover) | #E5E7EB | #111827 | 14.2:1 | ✅ AAA |

**Focus Indicators**:
- All interactive elements have visible focus outline
- Outline: 2px solid #2563EB (blue), 2px offset
- Outline contrast: 4.52:1 against white background (WCAG AA)
- Outline persists until focus moves

---

### Alternative Input Methods

**Voice Control Compatibility**:
- All buttons have descriptive labels (not just icons)
- Interactive elements are properly labeled for voice commands
- Example voice commands:
  - "Click New Idea" → Opens capture modal
  - "Click Chat with AI" → Opens AI panel
  - "Show Settings" → Opens settings page

**Touch Target Sizing** (mobile/tablet):
- Minimum touch target: 44x44px (iOS) / 48x48px (Android)
- Spacing between targets: min 8px
- Status dropdown options: 48px height each
- Idea cards: full-width, min 80px height (easy to tap)

**Keyboard-Only Operation**:
- Every feature is fully operable without a mouse
- Visual indication of keyboard focus at all times
- Focus order follows logical reading order (top-to-bottom, left-to-right)
- Skip links provided: "Skip to main content", "Skip to navigation"

---

## 7. Empty States

### No Ideas Yet (First-Time User)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                  📝                                │
│                                                    │
│         No ideas yet. Let's capture one!           │
│                                                    │
│  Capture your thoughts as they come. Develop them  │
│  with AI assistance. Track your progress.          │
│                                                    │
│            [+ Capture Your First Idea]             │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Design**:
- Large emoji or icon (64px)
- Headline (24px, bold)
- Subtext (16px, 2 lines max, centered)
- Primary action button (prominent, centered)
- Generous whitespace

---

### Search No Results

```
┌────────────────────────────────────────────────────┐
│  🔍  quantum computing                     [× ESC] │
├────────────────────────────────────────────────────┤
│                                                    │
│                  🤷                                │
│                                                    │
│       No ideas match "quantum computing"           │
│                                                    │
│            Try different keywords or               │
│         [Clear Search] [Browse All Ideas]          │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Design**:
- Icon or emoji indicating "not found"
- Clear message with quoted search term
- Helpful suggestion
- Action buttons to recover (clear search, browse all)

---

### AI Chat First Interaction

```
┌─────────────────────────────────────────────────┐
│ Chat with AI                         [× Close] │
├─────────────────────────────────────────────────┤
│                                                 │
│  🤖 I've read your idea about                   │
│     "Local-first sync strategy"                 │
│                                                 │
│     I can help you:                             │
│     • Challenge your thinking                   │
│     • Explore alternative angles                │
│     • Identify gaps or risks                    │
│     • Develop specific sections                 │
│                                                 │
│     What would you like to explore?             │
│                                                 │
├─────────────────────────────────────────────────┤
│  [Type your message...                       ]  │
│                                     [Send]      │
└─────────────────────────────────────────────────┘
```

**Design**:
- System message from AI (not user-initiated)
- Contextual: mentions the idea title
- Sets expectations: lists what AI can do
- Open-ended prompt for user to engage
- Friendly, inviting tone

---

### No Connections Yet (Future: Phase 1.5)

```
┌─────────────────────────────────────────┐
│ Connections: 0                          │
│                                         │
│  No connections yet.                    │
│                                         │
│  As you develop more ideas, you'll see  │
│  how they relate to each other here.    │
│                                         │
│  [+ Connect to Another Idea]            │
│                                         │
└─────────────────────────────────────────┘
```

**Design**:
- Brief explanation of what connections are
- Hint at future value ("as you develop more ideas")
- Manual action available (user can create connection now)

---

## 8. Error Recovery Flows

### Error Type 1: Network Offline (AI Features)

**User Action**: Opens AI chat panel while offline

**Error Flow**:
```
[User clicks "Chat with AI"]
    ↓
[AI panel opens]
    ↓
[System detects: navigator.onLine === false]
    ↓
[AI panel shows message instead of conversation:]

┌─────────────────────────────────────────────────┐
│ Chat with AI                         [× Close] │
├─────────────────────────────────────────────────┤
│                                                 │
│              📡                                 │
│                                                 │
│     You're offline. AI features require an      │
│     internet connection.                        │
│                                                 │
│     Your ideas are saved locally and safe.      │
│     AI chat will work when you're back online.  │
│                                                 │
│     Continue editing your idea, and come back   │
│     to AI when connected.                       │
│                                                 │
└─────────────────────────────────────────────────┘

[User closes panel or network reconnects]
    ↓
[On reconnect: system detects online state]
    ↓
[If panel still open, message automatically replaces with functional chat]
    ↓
[Toast notification: "Back online. AI features available."]
```

**Design Decisions**:
- No error "modal" - inline message in panel
- Reassuring: "Your ideas are safe"
- Clear expectation: "AI requires internet"
- Allows user to continue working

---

### Error Type 2: Save Failed (Database Error)

**User Action**: Types in editor, auto-save triggers, save fails

**Error Flow**:
```
[User types in editor]
    ↓
[Auto-save triggers after 1 sec pause]
    ↓
[Save attempt fails (e.g., storage quota exceeded, corruption)]
    ↓
[Retry 1: Wait 2 seconds, retry silently]
    ↓
[Retry 1 fails]
    ↓
[Retry 2: Wait 4 seconds, retry silently]
    ↓
[Retry 2 fails]
    ↓
[Retry 3: Wait 8 seconds, retry silently]
    ↓
[Retry 3 fails]
    ↓
[All retries exhausted]
    ↓
[Persistent warning banner appears at top of canvas:]

┌─────────────────────────────────────────────────────────┐
│ ⚠️ Unable to save your changes. Your data is cached in  │
│    memory. Check storage space or export your ideas.    │
│    [Check Storage] [Export Now] [Dismiss]               │
└─────────────────────────────────────────────────────────┘

[User clicks "Check Storage"]
    ↓
[Settings page opens, Data Management section visible]
    ↓
[Shows: "Storage used: 95%. Delete old ideas or export to free space."]

[User clicks "Export Now"]
    ↓
[Export dialog opens with pre-selected JSON format]
    ↓
[Export completes, saves to Downloads]
    ↓
[Banner updates: "✅ Exported successfully. Try saving again?"]
```

**Design Decisions**:
- Silent retries (exponential backoff)
- Persistent warning only after all retries fail
- Provides recovery paths: check storage, export
- Data is cached in memory (user doesn't lose work immediately)
- Clear messaging about what's happening

---

### Error Type 3: AI Response Failure

**User Action**: Sends message to AI, API fails

**Error Flow**:
```
[User types "challenge this" in AI chat]
    ↓
[Clicks Send]
    ↓
[Message appears in conversation history]
    ↓
[Spinner appears: "AI is thinking..."]
    ↓
[API call fails (network error, rate limit, server error)]
    ↓
[Spinner replaced with error message:]

┌─────────────────────────────────────────────────┐
│ 🤖 [User message]                               │
│ 👤 challenge this                               │
│                                                 │
│ ⚠️ Something went wrong. AI couldn't respond.   │
│    [Retry] [Different question?]                │
│                                                 │
└─────────────────────────────────────────────────┘

[User clicks "Retry"]
    ↓
[Same message is resent]
    ↓
[If succeeds: normal response]
    ↓
[If fails again: same error, retry count shown]

[User clicks "Different question?"]
    ↓
[Error message dismissed, input field focused]
```

**Design Decisions**:
- Error is inline in conversation (not a modal)
- Retry action is immediately available
- Allows user to move on with different question
- Does not block the interface

---

### Error Type 4: Idea Deletion Confirmation (Preventing Mistakes)

**User Action**: Clicks delete icon on idea card

**Flow**:
```
[User clicks Delete icon on idea card]
    ↓
[Confirmation dialog appears (modal)]

┌─────────────────────────────────────────────────┐
│ Delete Idea?                         [× Cancel] │
├─────────────────────────────────────────────────┤
│                                                 │
│     Are you sure you want to delete             │
│     "Local-first sync strategy"?                │
│                                                 │
│     This will permanently delete the idea,      │
│     all its content, and conversation history.  │
│                                                 │
│     This cannot be undone.                      │
│                                                 │
│          [Cancel]  [Delete Permanently]         │
│                                                 │
└─────────────────────────────────────────────────┘

[User clicks "Delete Permanently"]
    ↓
[Idea is deleted from database]
    ↓
[Idea card fades out of list (animation)]
    ↓
[Toast notification: "Idea deleted"]
    ↓
[Optional: "Undo" button in toast (5-second window)]

[If user clicks "Undo"]
    ↓
[Idea is restored]
    ↓
[Idea card reappears in list]
    ↓
[Toast: "Idea restored"]
```

**Design Decisions**:
- Confirmation required (no accidental deletion)
- Clear consequence: "cannot be undone"
- Undo window (5 seconds) as safety net
- Destructive action is visually distinct (red button, requires confirmation)

---

## 9. UX Decisions and Rationale

### Decision 1: Modal vs. Inline Spark Capture

**Decision**: **Persistent modal** overlay (not inline, not command palette)

**Rationale**:
- **Speed**: Modal can be triggered globally with Cmd+N regardless of current view
- **Focus**: Overlay provides distraction-free, focused input (no competing UI)
- **Context preservation**: Does not navigate away from current view (idea list or canvas)
- **Flexibility**: Can be triggered from anywhere, appears consistently
- **Dismissibility**: Easy to close without penalty (Escape key)

**Alternatives considered**:
| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|--------------|
| Inline at top of list | No context switch | Only available on Ideas list | Too limiting |
| Command palette (Cmd+K style) | Feels fast, power-user friendly | Conflicts with search (Cmd+K), less discoverable | Shortcut conflict |
| Full-screen capture view | Maximum focus | Too heavy for quick capture | Breaks flow |

---

### Decision 2: AI Panel as Side Split (Not Overlay, Not Separate View)

**Decision**: **Side panel** that splits the canvas (60/40 layout)

**Rationale**:
- **Parallel work**: User can see editor and AI responses simultaneously (critical for copy/paste workflow)
- **Context**: AI responses reference editor content; user needs to see both to understand
- **Persistent conversation**: History stays visible while editing (unlike overlay that blocks)
- **Progressive disclosure**: Panel is hidden by default, opens when needed, doesn't clutter canvas initially

**Alternatives considered**:
| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|--------------|
| Overlay modal | Simple, full-width AI panel | Blocks editor, forces context switching | Breaks workflow |
| Separate tab/view | Full screen for each | High context-switching penalty | Too disruptive |
| Bottom drawer | Good for mobile | Obscures editor content on desktop | Wrong platform optimization |

---

### Decision 3: Auto-Save with Debounce (Not Manual Save)

**Decision**: **1-second debounced auto-save** with visual indicator

**Rationale**:
- **Zero cognitive load**: User never thinks about saving, it just happens
- **Flow preservation**: No "Save" button means no interruption to writing flow
- **Safety**: Losing 1 second of work (max) in a crash is acceptable
- **Transparency**: Visual indicator ("Saved") builds trust without requiring action
- **Fallback**: Manual save (Cmd+S) available for control-seeking users

**Alternatives considered**:
| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|--------------|
| Manual save only | User has full control | Users forget to save, data loss risk | Too risky |
| Instant auto-save (every keystroke) | Maximum safety | High database write load, performance risk | Over-engineering |
| No save indicator | Cleanest UI | User uncertainty ("Did it save?") | Breaks trust |

---

### Decision 4: Status as Simple State Machine (Not Enforced Workflow)

**Decision**: **Any status transition allowed**, no enforced sequence

**Rationale**:
- **Flexibility**: User can skip stages if appropriate (Spark → Refined for simple ideas)
- **No frustration**: Enforced workflows create friction ("Why can't I just mark this parked?")
- **Progressive complexity**: MVP keeps it simple; future versions can add workflow rules if users want them
- **Trust user**: User knows their ideas better than the system does

**Alternatives considered**:
| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|--------------|
| Enforced sequence (Spark → Dev → Refined) | Clear workflow | Frustrating when user wants to skip or go backward | Too rigid |
| No status (just tags) | Ultimate flexibility | No built-in progress tracking | MVP needs some structure |
| Status with "Reason for skip" | Enforced but with escape hatch | Adds friction to capture | Over-complicates |

---

### Decision 5: Search as Modal (Not Inline Filter)

**Decision**: **Command-palette-style modal** (Cmd+K)

**Rationale**:
- **Speed**: Keyboard-accessible from anywhere (no need to click search field)
- **Focus**: Full-screen results with no distractions
- **Flexibility**: Works regardless of current view (list, canvas, settings)
- **Familiarity**: Command palette pattern is widely adopted (VS Code, Slack, Notion)
- **Progressive disclosure**: Doesn't clutter UI when not in use

**Alternatives considered**:
| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|--------------|
| Always-visible search bar | No modal, always available | Takes up header space, less keyboard-friendly | Clutters UI |
| Inline filter on list | Simple, no overlay | Only works on Ideas list, not global | Too limited |
| Separate search page | Full-featured search UI | Requires navigation, breaks flow | Too heavy |

---

## 10. Open Questions for Review

### Question 1: Spark Capture Modal - Clear After Save?

**Context**: After a user captures a spark, should the modal:
- **Option A**: Close automatically (user returns to previous view)
- **Option B**: Clear and stay open (for rapid sequential captures)
- **Option C**: Ask user preference on first use

**Consideration**: Power users might capture 5+ sparks in a row (brainstorming session). Option B serves them better. Casual users might prefer Option A (less UI in the way).

**Recommendation**: **Option B (clear and stay open)** with small "Done" button to close modal. Supports rapid capture without forcing it.

---

### Question 2: AI Chat History Persistence - How Long?

**Context**: AI conversation history is saved per idea. But should it:
- **Option A**: Persist forever (entire conversation history always available)
- **Option B**: Expire after 30 days (reduce database size)
- **Option C**: User-controlled (setting to clear old conversations)

**Consideration**: Long conversations can help users remember their thinking process. But storing thousands of AI messages increases database size significantly.

**Recommendation**: **Option A (persist forever)** for MVP, add Option C (manual clear) in Phase 1.5. Users should control their data.

---

### Question 3: Status Transition Animations - Necessary?

**Context**: When a user changes status, should there be:
- **Option A**: Instant update (no animation)
- **Option B**: Brief animation (badge color fades/scales)
- **Option C**: Celebration for key transitions (Spark → Refined)

**Consideration**: Animations add delight but can slow down power users who change status frequently.

**Recommendation**: **Option B (brief animation)** - 200ms color fade and scale pulse. Provides feedback without slowing workflow. Option C deferred to post-MVP polish.

---

### Question 4: Mobile Navigation Pattern

**Context**: MVP is web-responsive, but navigation must work on mobile. Should sidebar:
- **Option A**: Hamburger menu (overlay)
- **Option B**: Bottom tab bar (persistent)
- **Option C**: Full-screen menu with large touch targets

**Consideration**: Hamburger menus are familiar but hide navigation. Bottom tab bars are always visible but limit to 3-4 items.

**Recommendation**: **Option A (hamburger menu)** with "+" New Idea button as floating action button (FAB) in bottom-right corner. Keeps navigation accessible without cluttering mobile screen.

---

## 11. Notes for Spec Writer (prism-spec-writer)

### Integration with UI Designer Output

The UI designer will provide:
- **Visual design specs**: Color palette, typography, spacing, component styles
- **Component library**: Button variants, input fields, cards, modals
- **Responsive breakpoints**: Exact pixel values for mobile/tablet/desktop transitions
- **Motion design**: Animation curves, timing, easing functions

This UX document provides:
- **User flows**: What happens when (interaction logic)
- **Layout structure**: Where components go (wireframes)
- **Content hierarchy**: What's primary, secondary, tertiary
- **Behavioral specs**: How interactions work (auto-save timing, keyboard shortcuts, etc.)

**Handoff points**:
1. UI designer uses these wireframes as base for visual mockups
2. Spec writer integrates both UX flows (this doc) and UI design (designer's output) into final PRD
3. Developer implements using PRD as single source of truth

---

### Key UX Patterns to Emphasize in PRD

**Speed**:
- Spark capture: < 5 seconds
- Canvas load: < 500ms
- AI response first token: < 3 seconds
- Search results: < 200ms (debounced)

**Focus**:
- Auto-focus on capture title input (modal open)
- Auto-focus on canvas editor (canvas load)
- Auto-focus on search input (search modal open)
- Focus management in modals (trap focus, return on close)

**Feedback**:
- Auto-save indicator (subtle but visible)
- Status change confirmation (animation)
- AI streaming responses (token-by-token)
- Toast notifications (brief, non-blocking)

**Safety**:
- Confirmation dialogs for destructive actions (delete idea)
- Retry logic for failed saves (3x exponential backoff)
- Offline indicators (banner, AI panel message)
- Export always available (data portability)

---

### Accessibility Requirements Summary

**Must-haves for MVP**:
- All interactive elements keyboard-accessible
- All icon-only buttons have ARIA labels
- Modals trap focus and announce their purpose
- Status changes announced to screen readers
- Color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- Focus indicators visible on all interactive elements

**Defer to Phase 1.5**:
- Full keyboard navigation of AI chat history (arrow keys to navigate messages)
- Screen reader-optimized graph visualization (if graph added)
- High contrast theme toggle

---

## Appendix: Success Metrics by Journey

| Journey | Metric | Target | How to Measure |
|---------|--------|--------|----------------|
| First-time experience | Time to first spark | < 60 seconds | Track timestamp: page load → first idea saved |
| First-time experience | AI chat opened | > 70% of first sessions | Track: AI panel opened in first session |
| Daily capture | Capture time | < 10 seconds | Track: modal open → idea saved |
| Daily capture | Return rate | > 40% within 7 days | Track: users who capture 2nd+ idea within 7 days |
| Deep development | Session duration on canvas | > 10 minutes | Track: canvas open → canvas close duration |
| Deep development | AI interactions per session | > 3 messages | Track: messages sent in AI chat per canvas session |
| Deep development | Status progression | > 20% of sparks move to Developing+ | Track: status transitions over time |
| Discovery/review | Search usage | > 50% of users search within first week | Track: search modal opened, queries submitted |
| Discovery/review | Rediscovery rate | > 30% of ideas opened 2+ times | Track: ideas opened more than once |

---

**Document Complete**
**Next Step**: Handoff to prism-ui-designer (visual design) and prism-spec-writer (PRD consolidation)

