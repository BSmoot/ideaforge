# IdeaForge -- Architecture Decision Record (ADR)

**Title**: IdeaForge MVP Technical Architecture
**Status**: Proposed
**Version**: 1.0
**Date**: 2026-02-12
**Author**: System Architect
**Source Documents**: PRD v1.0, Constraint Analysis, Feature Breakdown, Design System v1.0.0

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-12 | System Architect | Initial ADR covering full MVP architecture |

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

IdeaForge is a **local-first, client-side web application** with optional cloud AI integration. There is no server-side backend for MVP. All data lives in the browser via SQLite-in-WASM persisted to IndexedDB/OPFS. The only network calls are to the AI provider API.

```
+-------------------------------------------------------------------+
|                        BROWSER  [Client]                          |
|  +------------------+  +-----------------+  +-----------------+   |
|  |  React SPA       |  | AI Integration  |  | Data Layer      |   |
|  |  - App Shell     |  | - Vercel AI SDK |  | - sql.js  WASM  |   |
|  |  - Router        |  | - Streaming     |  | - SQLite + FTS5 |   |
|  |  - UI Components |  | - Cost Tracker  |  | - IndexedDB     |   |
|  |  - Zustand State |  | - Context Mgr   |  | - Auto-backup   |   |
|  |  - TipTap Editor |  |                 |  |                 |   |
|  +--------+---------+  +--------+--------+  +--------+--------+   |
|           |                      |                     |          |
+-------------------------------------------------------------------+
                        | HTTPS  [AI API calls only]
                        v
              +-------------------+
              | AI Provider API   |
              | [Claude / OpenAI] |
              +-------------------+
```

### 1.2 Component Architecture

**Application Layer**: App Shell  [Sidebar + Header + Main Content]  with SPA routes:
- `/` -> Redirect to `/ideas`
- `/ideas` -> IdeasDashboard
- `/ideas/:id` -> IdeaCanvas
- `/search` -> SearchView
- `/settings` -> SettingsView

**Service Layer**: IdeaService, AIService, ExportService, TagService, BackupService, OnboardingService

**Data Access Layer**: DatabaseManager wrapping sql.js, with IdeaRepository, TagRepository, AIInteractionRepository, ConnectionRepository, SettingsRepository

**Storage Layer**: sql.js  [in-memory SQLite with WASM] , IndexedDB/OPFS  [DB persistence + backups] , LocalStorage  [preferences, theme, onboarding state]

### 1.3 Key Data Flows

**Spark Capture**: User input -> SparkCaptureForm -> IdeaService.create -> IdeaRepository.insert + FTS index -> DatabaseManager.persist -> IndexedDB -> Zustand store update -> UI re-render + toast

**AI Chat**: User message -> AIChatPanel collects context  [idea + history + system prompt]  -> AIService.chat -> Vercel AI SDK -> Claude API  [streaming]  -> Token-by-token UI render -> AIRepository.save with cost tracking -> Zustand update

**Search**: User query  [debounced 200ms]  -> SearchService.search -> FTS5 MATCH query + tag LIKE query -> Merge/deduplicate -> Return top 20 results with highlights

**Auto-Save**: TipTap onChange -> 1s debounce -> IdeaService.update -> IdeaRepository.update + FTS sync -> DatabaseManager.persist -> Saved indicator

---

## 2. Tech Stack Decisions

### 2.1 Frontend Framework: React 19 + TypeScript 5.x + Vite 6.x

**Decision**: React with TypeScript, built with Vite.

**Rationale**: Largest ecosystem  [TipTap, Radix UI, Vercel AI SDK have first-class React support] . TypeScript strict mode critical for solo developer catching errors at compile time. Vite provides sub-second HMR and native WASM support needed for sql.js.

**Alternatives Considered**:
- SolidJS: Excellent performance but smaller ecosystem; TipTap and Radix UI do not have SolidJS adapters.
- Next.js: Adds server-side complexity that is unnecessary for a client-only SPA. Increases build complexity.
- Svelte 5: Smaller ecosystem for the required libraries  [TipTap, Vercel AI SDK] .

**Versions**: react ^19.0.0, typescript ^5.7.0, vite ^6.1.0

### 2.2 Styling: Tailwind CSS 4.x + CVA

**Decision**: Tailwind CSS for utility-first styling, CVA  [class-variance-authority]  for type-safe component variants.

**Rationale**: Tailwind 4 provides zero-config setup with Vite, CSS-first configuration via `@theme`, and fast development. CVA maps directly to the design system's variant specifications  [Button variants, Badge variants, etc.]  with full TypeScript inference.

**Alternatives Considered**:
- CSS Modules: More isolated but slower development; no design token integration.
- Styled Components: Runtime CSS-in-JS has performance overhead; ecosystem trend away from runtime CSS-in-JS.
- Panda CSS: Good alternative but smaller ecosystem and fewer examples.

**Versions**: tailwindcss ^4.0.0, class-variance-authority ^0.7.0

### 2.3 State Management: Zustand 5.x

**Decision**: Zustand with slice pattern for global state management.

**Rationale**: Minimal API surface  [no boilerplate] , works outside React components  [useful for services] , excellent TypeScript support, small bundle  [~1KB] . Slice pattern provides modular state without the complexity of Redux.

**Store Slices**:
- `IdeaSlice`: Ideas list, current idea, filters, sort order
- `AISlice`: Chat messages, streaming state, cost tracking, model config
- `UISlice`: Sidebar state, theme, toasts, modal stack, loading states

**Alternatives Considered**:
- Redux Toolkit: More boilerplate than Zustand for the same functionality. Overkill for a single-developer project.
- Jotai: Atom-based model is good for fine-grained reactivity but less intuitive for service-layer integration.
- React Context + useReducer: Adequate for simple state but re-render performance issues with frequent updates  [e.g., streaming AI tokens] .

**Versions**: zustand ^5.0.0

### 2.4 Database: sql.js  [SQLite-in-WASM]

**Decision**: sql.js for in-browser SQLite with FTS5 full-text search, persisted to IndexedDB.

**Rationale**: sql.js compiles SQLite to WebAssembly, providing a full SQL engine in the browser. This enables complex queries  [joins, aggregates, FTS5] , schema migrations, and future sync readiness  [UUIDs + timestamps] . IndexedDB persistence ensures data survives browser restarts. FTS5 provides fast, high-quality full-text search without additional dependencies.

**Persistence Strategy**:
1. On startup: Load database binary from IndexedDB into sql.js memory
2. On write operations: Export database binary and save to IndexedDB  [debounced 2s]
3. Auto-backup: Every 5 minutes, save a copy to a separate IndexedDB store  [max 3 rotations]

**Performance Expectations**:
- Database load from IndexedDB: < 100ms for databases up to 10MB
- Write operations: < 5ms per INSERT/UPDATE
- FTS5 search: < 50ms for databases with 1000+ ideas
- Persistence to IndexedDB: < 200ms for 5MB database

**Alternatives Considered**:
- IndexedDB directly  [via Dexie.js] : No SQL queries, no FTS, harder to migrate schema.
- PGlite  [Postgres-in-WASM] : Larger bundle  [~3MB vs ~500KB] , more complex than needed.
- OPFS + SQLite: Better performance but limited browser support  [no Firefox private browsing] .

**Versions**: sql.js ^1.11.0

### 2.5 Rich Text Editor: TipTap 2.x

**Decision**: TipTap  [ProseMirror-based]  for the markdown editor with WYSIWYG rendering.

**Rationale**: TipTap has first-class React bindings, extensive extension ecosystem  [markdown, code blocks, task lists] , and stores content as a document model that can be serialized to/from markdown. The `tiptap-markdown` extension provides bidirectional markdown conversion, allowing storage as markdown in SQLite while editing as rich text.

**Content Storage**: Markdown text in the `ideas.content` column  [not ProseMirror JSON] . This ensures portability  [markdown export is trivial]  and keeps the database human-readable.

**Key Extensions**:
- `@tiptap/starter-kit`: Headings, bold, italic, lists, code, blockquote
- `tiptap-markdown`: Markdown serialization/deserialization
- `@tiptap/extension-placeholder`: Placeholder text for empty editor
- `@tiptap/extension-link`: URL detection and linking
- `@tiptap/extension-code-block-lowlight`: Syntax-highlighted code blocks

**Alternatives Considered**:
- Milkdown: Plugin-based markdown editor, but smaller community and fewer examples.
- BlockNote: Modern block editor, but opinionated about structure  [blocks not paragraphs] .
- CodeMirror: Excellent for plain-text markdown, but no WYSIWYG rendering.

**Versions**: @tiptap/react ^2.10.0, tiptap-markdown ^0.8.0

### 2.6 AI Integration: Vercel AI SDK 4.x

**Decision**: Vercel AI SDK for provider-agnostic AI integration with streaming support.

**Rationale**: The Vercel AI SDK provides a unified interface for Claude, OpenAI, and other providers. It handles streaming responses, token counting, and error handling out of the box. The `useChat` hook integrates directly with React for real-time token rendering.

**Provider Strategy**:
- Primary: Claude  [claude-sonnet-4-20250514]  via `@ai-sdk/anthropic`
- Fallback: OpenAI  [gpt-4o-mini]  via `@ai-sdk/openai`
- Provider selection is user-configurable in Settings

**CORS Strategy for Direct Browser Calls**:
- **Preferred**: Direct browser-to-Anthropic API using the `anthropic-dangerous-direct-browser-access: true` header. This avoids needing a backend proxy. The API key is stored in the user's browser  [localStorage]  and sent directly to Anthropic.
- **Fallback**: If direct access is blocked or the user prefers not to expose their key, deploy a lightweight Cloudflare Worker as a proxy  [single POST endpoint, stateless, < 50 lines of code] .

**Security Note**: The API key is the user's own key, entered in Settings. IdeaForge never sees, stores, or transmits the key anywhere other than directly to the AI provider. This is similar to how tools like Cursor, Continue.dev, and other local-first AI tools handle API keys.

**Alternatives Considered**:
- LangChain.js: More features than needed; heavier dependency; designed for server-side orchestration.
- Direct fetch to provider APIs: No streaming abstraction; must implement SSE parsing manually per provider.
- Ollama  [local LLMs] : Excellent for privacy but lower quality for ideation tasks; deferred to Phase 2.

**Versions**: ai ^4.0.0, @ai-sdk/anthropic ^1.0.0, @ai-sdk/openai ^1.0.0

### 2.7 UI Primitives: Radix UI

**Decision**: Radix UI for accessible, unstyled UI primitives  [Dialog, Toast, Dropdown, Popover, Tooltip] .

**Rationale**: Radix provides WCAG-compliant keyboard navigation, focus management, and ARIA attributes out of the box. Components are unstyled, so they integrate cleanly with Tailwind CSS. This saves weeks of accessibility implementation on common patterns.

**Components Used**:
- `@radix-ui/react-dialog`: Spark capture modal, delete confirmation, export dialog
- `@radix-ui/react-dropdown-menu`: Status dropdown, sort options, idea actions menu
- `@radix-ui/react-popover`: Tag autocomplete, keyboard shortcut help
- `@radix-ui/react-tooltip`: Icon button labels, truncated text hover
- `@radix-ui/react-toast`: Notification system  [spark saved, error, status change]
- `@radix-ui/react-slot`: Component composition  [asChild pattern]

**Alternatives Considered**:
- Headless UI: Fewer components; no toast or tooltip primitives.
- Ark UI: Good alternative but smaller community and fewer React examples.
- shadcn/ui: Built on Radix  [good]  but copies component source code into project  [creates maintenance burden] . We use Radix directly with our own Tailwind + CVA styling.

### 2.8 Testing: Vitest + Playwright

**Decision**: Vitest for unit/component tests, Playwright for end-to-end tests.

**Rationale**: Vitest shares Vite's config and transform pipeline, enabling sub-second test execution. Playwright provides cross-browser E2E testing with built-in WASM support needed to test sql.js operations in real browser contexts.

**Testing Strategy**:
- Unit tests: Database operations, services, utility functions, Zod schemas
- Component tests: React components with @testing-library/react
- E2E tests: Critical user flows  [spark capture, AI chat, search, export]
- AI mocking: Mock Vercel AI SDK responses for deterministic tests

**Alternatives Considered**:
- Jest: Slower than Vitest; requires separate configuration from Vite.
- Cypress: Good E2E tool but weaker TypeScript support and no native WASM handling.

**Versions**: vitest ^3.0.0, @playwright/test ^1.50.0, @testing-library/react ^16.0.0

### 2.9 Routing: React Router 7.x

**Decision**: React Router for client-side SPA routing.

**Rationale**: Industry standard for React SPAs. Provides type-safe route parameters, lazy loading for code splitting, and loader/action patterns for data fetching.

**Route Structure**:

```typescript
const routes = [
  { path: '/', element: <Navigate to="/ideas" /> },
  { path: '/ideas', element: <IdeasDashboard /> },
  { path: '/ideas/:id', element: <IdeaCanvas /> },
  { path: '/search', element: <SearchView /> },
  { path: '/settings', element: <SettingsView /> },
  { path: '*', element: <NotFoundView /> },
];
```

**Versions**: react-router ^7.0.0

### 2.10 Build and Deploy: Vite + Vercel/Cloudflare Pages

**Decision**: Vite for build tooling, static deployment to Vercel or Cloudflare Pages.

**Rationale**: The application is a static SPA with no server-side rendering. Vite produces optimized bundles with tree-shaking, code splitting, and asset hashing. Deployment is a simple static file upload.

**Build Configuration**:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-editor': [
            '@tiptap/react', '@tiptap/starter-kit', 'tiptap-markdown'
          ],
          'vendor-ai': ['ai', '@ai-sdk/anthropic', '@ai-sdk/openai'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast'
          ],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['sql.js'],
  },
});
```

**Bundle Size Budget**:
- Initial JS: < 200KB gzipped  [excluding sql.js WASM]
- sql.js WASM: ~500KB  [loaded asynchronously]
- Total first load: < 800KB gzipped
- Largest chunk: < 100KB gzipped

---

## 3. Data Model

### 3.1 Complete SQLite Schema

```sql
-- ============================================================
-- IdeaForge Database Schema v1
-- Engine: SQLite via sql.js  [WASM]
-- Persistence: IndexedDB / OPFS
-- ============================================================

-- Schema version tracking for migrations
CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now')),
  description TEXT
);

INSERT INTO schema_version (version, description)
VALUES (1, 'Initial schema');

-- Core idea record
CREATE TABLE ideas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'spark'
    CHECK (status IN ('spark','developing','refined','parked','archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  metadata TEXT DEFAULT '{}'
);

-- Tags for categorization
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

-- Many-to-many: ideas <-> tags
CREATE TABLE idea_tags (
  idea_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (idea_id, tag_id)
);

-- Connections between ideas  [created in v1 for Phase 1.5]
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'related'
    CHECK (type IN ('related','builds_on','contradicts','merged_into')),
  description TEXT,
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual','ai_suggested','ai_confirmed')),
  created_at TEXT NOT NULL
);

-- AI interaction history
CREATE TABLE ai_interactions (
  id TEXT PRIMARY KEY,
  idea_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_estimate REAL,
  created_at TEXT NOT NULL
);

-- Application settings  [key-value store]
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ============================================================
-- Full-Text Search  [FTS5]
-- ============================================================

CREATE VIRTUAL TABLE ideas_fts USING fts5(
  title,
  content,
  content=ideas,
  content_rowid=rowid,
  tokenize='porter unicode61'
);

-- Triggers to keep FTS index in sync
CREATE TRIGGER ideas_ai AFTER INSERT ON ideas BEGIN
  INSERT INTO ideas_fts(rowid, title, content)
  VALUES (new.rowid, new.title, new.content);
END;

CREATE TRIGGER ideas_ad AFTER DELETE ON ideas BEGIN
  INSERT INTO ideas_fts(ideas_fts, rowid, title, content)
  VALUES ('delete', old.rowid, old.title, old.content);
END;

CREATE TRIGGER ideas_au AFTER UPDATE ON ideas BEGIN
  INSERT INTO ideas_fts(ideas_fts, rowid, title, content)
  VALUES ('delete', old.rowid, old.title, old.content);
  INSERT INTO ideas_fts(rowid, title, content)
  VALUES (new.rowid, new.title, new.content);
END;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at);
CREATE INDEX idx_ideas_updated_at ON ideas(updated_at);
CREATE INDEX idx_idea_tags_tag_id ON idea_tags(tag_id);
CREATE INDEX idx_idea_tags_idea_id ON idea_tags(idea_id);
CREATE INDEX idx_connections_source ON connections(source_id);
CREATE INDEX idx_connections_target ON connections(target_id);
CREATE INDEX idx_ai_interactions_idea ON ai_interactions(idea_id);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at);
CREATE INDEX idx_tags_name ON tags(name);
```

### 3.2 Migration Strategy

Migrations are embedded in the application code and run on database initialization. The `schema_version` table tracks which migrations have been applied.

**Migration Rules**:
1. Migrations are **additive only** for MVP  [no column drops, no table renames]
2. Each migration is a numbered SQL script  [v1, v2, v3...]
3. On startup, DatabaseManager checks current version and applies pending migrations in order
4. Migrations run inside a transaction; if any statement fails, the entire migration rolls back

**Migration Runner Pseudocode**:

```typescript
interface IMigration {
  readonly version: number;
  readonly description: string;
  readonly sql: string;
}

const MIGRATIONS: readonly IMigration[] = [
  { version: 1, description: 'Initial schema', sql: SCHEMA_V1_SQL },
  // Future migrations added here
];

function applyMigrations(db: Database): void {
  const currentVersion = getCurrentVersion(db);
  const pending = MIGRATIONS.filter(m => m.version > currentVersion);

  for (const migration of pending) {
    db.run('BEGIN TRANSACTION');
    try {
      db.run(migration.sql);
      db.run(
        'INSERT INTO schema_version (version, description) VALUES (?, ?)',
        [migration.version, migration.description]
      );
      db.run('COMMIT');
    } catch (error) {
      db.run('ROLLBACK');
      throw new DatabaseError(
        'Migration v' + migration.version + ' failed',
        { migration: migration.description, error }
      );
    }
  }
}
```

---

## 4. Application Architecture

### 4.1 Directory Structure

```
src/
|-- main.tsx                          # Entry point: React root + DB init
|-- App.tsx                           # Router setup + global providers
|
|-- components/
|   |-- ui/                           # Design system primitives (CVA)
|   |   |-- button.tsx
|   |   |-- card.tsx
|   |   |-- input.tsx
|   |   |-- textarea.tsx
|   |   |-- badge.tsx
|   |   |-- tag.tsx
|   |   |-- modal.tsx
|   |   |-- toast.tsx
|   |   |-- dropdown-menu.tsx
|   |   |-- tooltip.tsx
|   |   |-- skeleton.tsx
|   |   +-- index.ts                  # Barrel export
|   |
|   +-- layouts/
|       |-- app-shell.tsx             # Sidebar + header + main content
|       |-- canvas-layout.tsx         # Editor + metadata + AI panel
|       +-- ideas-grid.tsx            # Responsive card grid
|
|-- features/
|   |-- ideas/
|   |   |-- components/
|   |   |   |-- ideas-dashboard.tsx
|   |   |   |-- idea-card.tsx
|   |   |   |-- idea-filters.tsx
|   |   |   +-- idea-sort.tsx
|   |   |-- hooks/
|   |   |   +-- use-ideas.ts
|   |   +-- index.ts
|   |
|   |-- canvas/
|   |   |-- components/
|   |   |   |-- idea-canvas.tsx
|   |   |   |-- markdown-editor.tsx
|   |   |   |-- metadata-panel.tsx
|   |   |   |-- title-editor.tsx
|   |   |   +-- section-inserter.tsx
|   |   |-- hooks/
|   |   |   |-- use-auto-save.ts
|   |   |   +-- use-editor.ts
|   |   +-- index.ts
|   |
|   |-- ai-chat/
|   |   |-- components/
|   |   |   |-- ai-chat-panel.tsx
|   |   |   |-- chat-message.tsx
|   |   |   |-- chat-input.tsx
|   |   |   |-- context-indicator.tsx
|   |   |   +-- privacy-notice.tsx
|   |   |-- hooks/
|   |   |   +-- use-ai-chat.ts
|   |   |-- services/
|   |   |   |-- ai-service.ts
|   |   |   |-- context-builder.ts
|   |   |   +-- cost-tracker.ts
|   |   +-- index.ts
|   |
|   |-- search/
|   |   |-- components/
|   |   |   |-- search-view.tsx
|   |   |   |-- search-input.tsx
|   |   |   +-- search-results.tsx
|   |   |-- hooks/
|   |   |   +-- use-search.ts
|   |   +-- index.ts
|   |
|   |-- spark/
|   |   |-- components/
|   |   |   |-- spark-capture-modal.tsx
|   |   |   |-- spark-form.tsx
|   |   |   +-- tag-input.tsx
|   |   |-- hooks/
|   |   |   +-- use-spark-capture.ts
|   |   +-- index.ts
|   |
|   |-- settings/
|   |   |-- components/
|   |   |   |-- settings-view.tsx
|   |   |   |-- ai-config-section.tsx
|   |   |   |-- data-management-section.tsx
|   |   |   +-- privacy-section.tsx
|   |   +-- index.ts
|   |
|   |-- export/
|   |   |-- services/
|   |   |   |-- export-service.ts
|   |   |   |-- json-exporter.ts
|   |   |   +-- markdown-exporter.ts
|   |   +-- index.ts
|   |
|   +-- onboarding/
|       |-- components/
|       |   |-- onboarding-flow.tsx
|       |   +-- onboarding-tooltip.tsx
|       |-- services/
|       |   +-- onboarding-service.ts
|       +-- index.ts
|
|-- database/
|   |-- database-manager.ts           # sql.js init, persistence, backup
|   |-- migrations/
|   |   |-- index.ts                  # Migration registry
|   |   +-- v001-initial-schema.ts
|   +-- repositories/
|       |-- idea-repository.ts
|       |-- tag-repository.ts
|       |-- ai-interaction-repository.ts
|       |-- connection-repository.ts
|       |-- settings-repository.ts
|       +-- base-repository.ts        # Shared query helpers
|
|-- store/
|   |-- index.ts                      # Combined store with slices
|   +-- slices/
|       |-- idea-slice.ts
|       |-- ai-slice.ts
|       +-- ui-slice.ts
|
|-- hooks/
|   |-- use-keyboard-shortcuts.ts
|   |-- use-online-status.ts
|   |-- use-toast.ts
|   +-- use-theme.ts
|
|-- lib/
|   |-- id.ts                         # crypto.randomUUID wrapper
|   |-- date.ts                       # ISO 8601 helpers, relative time
|   |-- markdown.ts                   # Markdown utilities
|   |-- errors.ts                     # Error hierarchy
|   |-- validation.ts                 # Zod schemas
|   +-- constants.ts                  # App-wide constants
|
|-- styles/
|   +-- globals.css                   # Tailwind + design tokens
|
+-- types/
    |-- idea.ts                       # IIdea, IdeaStatus, etc.
    |-- ai.ts                         # IAIMessage, IAIConfig, etc.
    +-- common.ts                     # Shared types
```

### 4.2 Component Architecture

**Pattern**: Feature-based modules with Container/Presentational separation.

- **UI Components** (`components/ui/`): Pure presentational, styled with CVA, no business logic. Accept data via props, emit events via callbacks.
- **Feature Components** (`features/*/components/`): Connected to store and services via hooks. Compose UI components with feature-specific logic.
- **Hooks** (`features/*/hooks/`): Encapsulate business logic, store access, and side effects. Provide a clean interface between components and services.
- **Services** (`features/*/services/`): Pure business logic with dependency injection. No React dependencies. Accept repository/config via constructor or function parameters.
- **Repositories** (`database/repositories/`): Data access layer. Translate between SQL and TypeScript types. All queries are parameterized  [no string interpolation] .

**Dependency Flow**: Components -> Hooks -> Services -> Repositories -> DatabaseManager

### 4.3 Routing

```typescript
// src/App.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router';
import { lazy, Suspense } from 'react';
import { AppShell } from '@/components/layouts/app-shell';

const IdeasDashboard = lazy(() => import('@/features/ideas'));
const IdeaCanvas = lazy(() => import('@/features/canvas'));
const SearchView = lazy(() => import('@/features/search'));
const SettingsView = lazy(() => import('@/features/settings'));

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/ideas" replace /> },
      { path: 'ideas', element: <IdeasDashboard /> },
      { path: 'ideas/:id', element: <IdeaCanvas /> },
      { path: 'search', element: <SearchView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <NotFoundView /> },
    ],
  },
]);

export function App(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

### 4.4 Error Handling

**Error Hierarchy**:

```typescript
// src/lib/errors.ts

export class IdeaForgeError extends Error {
  public readonly code: string;
  public readonly context: Record<string, unknown>;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    code: string,
    context: Record<string, unknown> = {},
    isRetryable = false
  ) {
    super(message);
    this.name = 'IdeaForgeError';
    this.code = code;
    this.context = context;
    this.isRetryable = isRetryable;
  }
}

export class DatabaseError extends IdeaForgeError {
  constructor(
    message: string,
    context: Record<string, unknown> = {}
  ) {
    super(message, 'DATABASE_ERROR', context, true);
    this.name = 'DatabaseError';
  }
}

export class AIServiceError extends IdeaForgeError {
  constructor(
    message: string,
    context: Record<string, unknown> = {},
    isRetryable = true
  ) {
    super(message, 'AI_SERVICE_ERROR', context, isRetryable);
    this.name = 'AIServiceError';
  }
}

export class ValidationError extends IdeaForgeError {
  constructor(
    message: string,
    context: Record<string, unknown> = {}
  ) {
    super(message, 'VALIDATION_ERROR', context, false);
    this.name = 'ValidationError';
  }
}

export class ExportError extends IdeaForgeError {
  constructor(
    message: string,
    context: Record<string, unknown> = {}
  ) {
    super(message, 'EXPORT_ERROR', context, true);
    this.name = 'ExportError';
  }
}
```

**Retry with Exponential Backoff**:

```typescript
// src/lib/retry.ts

interface IRetryOptions {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
}

const DEFAULT_OPTIONS: IRetryOptions = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 10000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<IRetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error
        ? error
        : new Error(String(error));

      if (
        error instanceof IdeaForgeError &&
        !error.isRetryable
      ) {
        throw error;
      }

      if (attempt < opts.maxRetries) {
        const delay = Math.min(
          opts.baseDelayMs * Math.pow(2, attempt),
          opts.maxDelayMs
        );
        await new Promise(resolve =>
          setTimeout(resolve, delay)
        );
      }
    }
  }

  throw lastError;
}
```

**Error Boundary**  [React] :

```typescript
// src/components/error-boundary.tsx

import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react';

interface IProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface IState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<IProps, IState> {
  state: IState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>Your data is saved. Try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 4.5 AI Integration Design

**Context Builder**:

```typescript
// src/features/ai-chat/services/context-builder.ts

import type { IIdea } from '@/types/idea';
import type { IAIMessage } from '@/types/ai';

const MAX_CONTENT_LENGTH = 5000;

const SYSTEM_PROMPT = [
  'You are a thinking partner helping develop ideas in IdeaForge.',
  'Your role is to:',
  '- Challenge assumptions and identify blind spots',
  '- Ask probing questions that deepen thinking',
  '- Suggest connections to related concepts',
  '- Help structure and refine raw thoughts',
  '- Be direct and specific, not generic',
  '',
  'You have access to the user\'s current idea context below.',
  'Reference specific parts of their idea in your responses.',
  'Be conversational but substantive.',
].join('\n');

export function buildContext(
  idea: IIdea,
  history: readonly IAIMessage[]
): string {
  const truncatedContent =
    idea.content.length > MAX_CONTENT_LENGTH
      ? idea.content.slice(0, MAX_CONTENT_LENGTH) +
        '\n...[truncated]'
      : idea.content;

  return [
    SYSTEM_PROMPT,
    '',
    '--- CURRENT IDEA ---',
    'Title: ' + idea.title,
    'Status: ' + idea.status,
    'Content:',
    truncatedContent || '(No content yet)',
    '--- END IDEA ---',
  ].join('\n');
}
```

**Cost Tracker**:

```typescript
// src/features/ai-chat/services/cost-tracker.ts

interface IModelPricing {
  readonly inputPricePerMillion: number;
  readonly outputPricePerMillion: number;
}

const MODEL_PRICING: Record<string, IModelPricing> = {
  'claude-sonnet-4-20250514': {
    inputPricePerMillion: 3.0,
    outputPricePerMillion: 15.0,
  },
  'claude-haiku-3.5': {
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 1.25,
  },
  'gpt-4o-mini': {
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.6,
  },
};

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    return 0; // Unknown model
  }

  const inputCost =
    (inputTokens / 1_000_000) * pricing.inputPricePerMillion;
  const outputCost =
    (outputTokens / 1_000_000) * pricing.outputPricePerMillion;

  return (
    Math.round((inputCost + outputCost) * 1_000_000) /
    1_000_000
  );
}
```

---

## 5. API Design

### 5.1 AI Service Interface

```typescript
// src/features/ai-chat/services/ai-service.ts

import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import type { IIdea } from '@/types/idea';
import type { IAIMessage, IAIConfig } from '@/types/ai';
import { buildContext } from './context-builder';
import { calculateCost } from './cost-tracker';
import { AIServiceError } from '@/lib/errors';
import { withRetry } from '@/lib/retry';

export interface IAIServiceDeps {
  readonly getConfig: () => IAIConfig;
  readonly saveInteraction: (
    interaction: IAIInteractionInput
  ) => Promise<void>;
}

export function createAIService(deps: IAIServiceDeps) {
  function getProvider(config: IAIConfig) {
    switch (config.provider) {
      case 'anthropic':
        return createAnthropic({
          apiKey: config.apiKey,
          headers: {
            'anthropic-dangerous-direct-browser-access':
              'true',
          },
        });
      case 'openai':
        return createOpenAI({ apiKey: config.apiKey });
      default:
        throw new AIServiceError(
          'Unknown provider: ' + config.provider,
          { provider: config.provider }
        );
    }
  }

  async function chat(
    idea: IIdea,
    userMessage: string,
    history: readonly IAIMessage[],
    onToken: (token: string) => void
  ): Promise<{
    response: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }> {
    const config = deps.getConfig();
    const provider = getProvider(config);
    const systemPrompt = buildContext(idea, history);

    const messages = [
      ...history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    const result = await withRetry(
      () =>
        streamText({
          model: provider(config.model),
          system: systemPrompt,
          messages,
        }),
      { maxRetries: 2, baseDelayMs: 1000 }
    );

    let fullResponse = '';
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
      onToken(chunk);
    }

    const usage = await result.usage;
    const inputTokens = usage?.promptTokens ?? 0;
    const outputTokens = usage?.completionTokens ?? 0;
    const cost = calculateCost(
      config.model,
      inputTokens,
      outputTokens
    );

    await deps.saveInteraction({
      ideaId: idea.id,
      prompt: userMessage,
      response: fullResponse,
      model: config.model,
      inputTokens,
      outputTokens,
      costEstimate: cost,
    });

    return {
      response: fullResponse,
      inputTokens,
      outputTokens,
      cost,
    };
  }

  return { chat };
}
```

### 5.2 DatabaseManager Interface

```typescript
// src/database/database-manager.ts

import initSqlJs, { type Database } from 'sql.js';
import { applyMigrations } from './migrations';
import { DatabaseError } from '@/lib/errors';

const DB_KEY = 'ideaforge-db';
const BACKUP_KEY_PREFIX = 'ideaforge-backup-';
const MAX_BACKUPS = 3;
const BACKUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const PERSIST_DEBOUNCE_MS = 2000;

export interface IDatabaseManager {
  readonly db: Database;
  persist(): Promise<void>;
  backup(): Promise<void>;
  close(): void;
}

export async function createDatabaseManager():
  Promise<IDatabaseManager> {
  // Initialize sql.js with WASM
  const SQL = await initSqlJs({
    locateFile: (file: string) => '/sql.js/' + file,
  });

  // Load existing database from IndexedDB or create new
  const existingData = await loadFromIndexedDB(DB_KEY);
  const db = existingData
    ? new SQL.Database(existingData)
    : new SQL.Database();

  // Enable WAL mode and foreign keys
  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');

  // Apply pending migrations
  applyMigrations(db);

  // Persist debounce timer
  let persistTimer: ReturnType<typeof setTimeout> | null =
    null;

  // Auto-backup interval
  const backupInterval = setInterval(() => {
    backup().catch(err =>
      console.error(
        '[DatabaseManager] Backup failed:',
        { error: err.message }
      )
    );
  }, BACKUP_INTERVAL_MS);

  async function persist(): Promise<void> {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(async () => {
      try {
        const data = db.export();
        await saveToIndexedDB(DB_KEY, data);
      } catch (error) {
        throw new DatabaseError(
          'Failed to persist database',
          {
            error:
              error instanceof Error
                ? error.message
                : String(error),
          }
        );
      }
    }, PERSIST_DEBOUNCE_MS);
  }

  async function backup(): Promise<void> {
    const data = db.export();
    const backupKey =
      BACKUP_KEY_PREFIX + Date.now().toString();
    await saveToIndexedDB(backupKey, data);
    await pruneOldBackups();
  }

  function close(): void {
    clearInterval(backupInterval);
    if (persistTimer) clearTimeout(persistTimer);
    db.close();
  }

  return { db, persist, backup, close };
}

// IndexedDB helpers  [simplified signatures]
async function loadFromIndexedDB(
  key: string
): Promise<Uint8Array | null> {
  // Implementation uses IndexedDB API to load binary data
  return null;
}

async function saveToIndexedDB(
  key: string,
  data: Uint8Array
): Promise<void> {
  // Implementation uses IndexedDB API to save binary data
}

async function pruneOldBackups(): Promise<void> {
  // Keep only MAX_BACKUPS most recent backups
}
```

### 5.3 Search API

```typescript
// src/features/search/services/search-service.ts

import type { Database } from 'sql.js';
import type { IIdea } from '@/types/idea';

export interface ISearchResult {
  readonly idea: IIdea;
  readonly matchType: 'title' | 'content' | 'tag';
  readonly snippet: string;
  readonly rank: number;
}

export function createSearchService(
  getDb: () => Database
) {
  function search(
    query: string,
    limit = 20
  ): readonly ISearchResult[] {
    if (query.length < 2) return [];

    const db = getDb();
    const sanitizedQuery = sanitizeFTSQuery(query);

    // FTS5 search
    const ftsResults = db.exec(
      'SELECT ' +
      '  i.id, i.title, i.content, i.status, ' +
      '  i.created_at, i.updated_at, i.metadata, ' +
      '  snippet(ideas_fts, 1, \'<mark>\', ' +
      '    \'</mark>\', \'...\', 32) as snippet, ' +
      '  rank ' +
      'FROM ideas_fts ' +
      'JOIN ideas i ON i.rowid = ideas_fts.rowid ' +
      'WHERE ideas_fts MATCH ? ' +
      'ORDER BY rank ' +
      'LIMIT ?',
      [sanitizedQuery, limit]
    );

    // Tag search
    const tagResults = db.exec(
      'SELECT DISTINCT ' +
      '  i.id, i.title, i.content, i.status, ' +
      '  i.created_at, i.updated_at, i.metadata ' +
      'FROM ideas i ' +
      'JOIN idea_tags it ON i.id = it.idea_id ' +
      'JOIN tags t ON it.tag_id = t.id ' +
      'WHERE t.name LIKE ? ' +
      'LIMIT ?',
      ['%' + query + '%', limit]
    );

    // Merge, deduplicate, and return
    return mergeResults(ftsResults, tagResults, limit);
  }

  function sanitizeFTSQuery(query: string): string {
    return query
      .replace(/['"*()]/g, '')
      .split(/\s+/)
      .filter(term => term.length >= 2)
      .map(term => '"' + term + '"*')
      .join(' ');
  }

  return { search };
}
```

---

## 6. Security Considerations

### 6.1 API Key Management

- API keys are stored in the browser's localStorage  [encrypted with a simple XOR using a device-derived key via Web Crypto API]
- Keys are **never** sent to any server other than the AI provider's API endpoint
- The `anthropic-dangerous-direct-browser-access` header enables direct browser-to-Anthropic calls without a backend proxy
- Users are informed that their API key is stored locally and only sent to the AI provider

### 6.2 Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.anthropic.com https://api.openai.com;
  worker-src 'self' blob:;
  img-src 'self' data: blob:;
```

- `wasm-unsafe-eval` is required for sql.js WASM execution
- `connect-src` is limited to the AI provider API endpoints
- No CDN resources; all assets are self-hosted

### 6.3 XSS Prevention

- All user-generated content rendered through TipTap's built-in sanitization
- Markdown content is parsed through a safe markdown parser  [no raw HTML injection]
- React's JSX escaping prevents injection in non-editor contexts
- AI responses are rendered as text/markdown, never as raw HTML

### 6.4 Data Safety

- All data is local; no server to breach
- Auto-backup every 5 minutes  [max 3 rotations]  provides recovery from corruption
- Export functionality from day 1 ensures users can always extract their data
- No analytics, tracking, or telemetry in MVP
- `Clear All Data` requires typing "DELETE" to confirm  [prevents accidental data loss]

### 6.5 Input Validation

- All user inputs validated with Zod schemas before database operations
- File paths are never constructed from user input  [pure client-side app]
- SQL queries use parameterized statements exclusively  [no string interpolation]
- Tag names restricted to alphanumeric, hyphens, and underscores via regex validation

---

## 7. Performance Targets

### 7.1 Performance Budget

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Initial page load | < 2s on 3G | Lighthouse, WebPageTest |
| Time to interactive | < 3s on 3G | Lighthouse |
| Spark capture  [click to saved] | < 500ms | Custom timing |
| AI first token latency | < 3s  [p95] | Custom timing |
| Search results display | < 200ms | Custom timing |
| Auto-save persistence | < 500ms | Custom timing |
| Database load from IndexedDB | < 100ms  [up to 10MB] | Custom timing |
| FTS5 search query | < 50ms  [1000 ideas] | Custom timing |

### 7.2 Bundle Size Budget

| Chunk | Max Size  [gzipped] |
|-------|--------------------|
| vendor-react | 45KB |
| vendor-editor | 80KB |
| vendor-ai | 30KB |
| vendor-ui | 25KB |
| Application code | 50KB |
| **Total JS** | **< 230KB** |
| sql.js WASM | ~500KB  [async] |
| **Total first load** | **< 800KB** |

### 7.3 SQLite Performance Benchmarks

Target benchmarks with sql.js  [to be validated in Week 1 spike] :

| Operation | Target  [1000 ideas] |
|-----------|---------------------|
| Single INSERT | < 5ms |
| Single SELECT by ID | < 1ms |
| SELECT with JOIN  [idea + tags] | < 10ms |
| FTS5 MATCH query | < 50ms |
| Full database export | < 200ms |
| IndexedDB persist  [5MB] | < 200ms |

### 7.4 Runtime Performance

- React re-renders: Use `React.memo` for idea cards in list/grid views
- TipTap: Debounce onChange to 1s for auto-save; do not re-render on every keystroke
- Zustand: Use selectors to prevent unnecessary re-renders  [subscribe to specific state slices]
- Virtual scrolling: Implement for ideas list when count exceeds 100  [using @tanstack/react-virtual]
- AI streaming: Batch DOM updates for streaming tokens  [requestAnimationFrame]

---

## 8. Deployment Architecture

### 8.1 Deployment Target: Vercel  [Primary]  or Cloudflare Pages  [Alternative]

**Decision**: Deploy as a static SPA to Vercel.

**Rationale**: Zero server management, automatic HTTPS, global CDN, preview deployments for PRs, generous free tier.

**Configuration**:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 22.x

**Alternative**: Cloudflare Pages offers similar features with a Cloudflare Worker available for the AI proxy fallback if needed.

### 8.2 Cloudflare Worker  [Optional AI Proxy]

If direct browser-to-Anthropic calls are not viable  [CORS issues, user preference] , a lightweight Cloudflare Worker serves as a proxy:

```typescript
// workers/ai-proxy.ts  [Cloudflare Worker]
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
      });
    }

    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return new Response('API key required', {
        status: 401,
      });
    }

    const body = await request.text();
    const response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body,
      }
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') ??
          'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
```

### 8.3 CI/CD Pipeline  [GitHub Actions]

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          TOTAL=$(du -sb dist/ | cut -f1)
          MAX=5242880
          if [ "$TOTAL" -gt "$MAX" ]; then
            echo "Bundle size exceeds 5MB limit"
            exit 1
          fi
```

---

## 9. Testing Strategy

### 9.1 Test Pyramid

| Level | Tool | Coverage Target | What to Test |
|-------|------|-----------------|--------------|
| Unit | Vitest | 80%+ | Services, repositories, utilities, Zod schemas, error classes |
| Component | Vitest + Testing Library | Key components | Spark form, AI chat panel, search input, idea card |
| E2E | Playwright | Critical paths | Spark capture flow, AI chat flow, search, export, settings |

### 9.2 Unit Test Examples

```typescript
// src/database/repositories/__tests__/idea-repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '@/test-utils/database';
import { IdeaRepository } from '../idea-repository';

describe('IdeaRepository', () => {
  let repo: IdeaRepository;

  beforeEach(async () => {
    const db = await createTestDatabase();
    repo = new IdeaRepository(db);
  });

  it('creates an idea with generated UUID', async () => {
    const idea = await repo.create({
      title: 'Test Idea',
      content: 'Some content',
      status: 'spark',
    });

    expect(idea.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    expect(idea.title).toBe('Test Idea');
    expect(idea.status).toBe('spark');
  });

  it('finds ideas by status', async () => {
    await repo.create({
      title: 'Spark 1',
      status: 'spark',
    });
    await repo.create({
      title: 'Developing 1',
      status: 'developing',
    });
    await repo.create({
      title: 'Spark 2',
      status: 'spark',
    });

    const sparks = await repo.findByStatus('spark');
    expect(sparks).toHaveLength(2);
  });

  it('performs full-text search', async () => {
    await repo.create({
      title: 'Machine Learning Project',
      content: 'Training neural networks',
    });
    await repo.create({
      title: 'Garden Planning',
      content: 'Planting tomatoes in spring',
    });

    const results = await repo.search('neural');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe(
      'Machine Learning Project'
    );
  });
});
```

### 9.3 AI Mocking Strategy

```typescript
// src/test-utils/ai-mock.ts
import { vi } from 'vitest';

export function createMockAIStream(response: string) {
  const chunks = response
    .split(' ')
    .map(word => word + ' ');

  return {
    textStream: {
      async *[Symbol.asyncIterator]() {
        for (const chunk of chunks) {
          yield chunk;
        }
      },
    },
    usage: Promise.resolve({
      promptTokens: 100,
      completionTokens:
        response.split(' ').length * 2,
    }),
  };
}

// Usage in tests:
vi.mock('ai', () => ({
  streamText: vi.fn(() =>
    createMockAIStream(
      'This is a mock AI response.'
    )
  ),
}));
```

### 9.4 E2E Test Example

```typescript
// e2e/spark-capture.spec.ts
import { test, expect } from '@playwright/test';

test('captures a new spark idea', async ({ page }) => {
  await page.goto('/');

  // Click "New Spark" button
  await page.click(
    '[data-testid="new-spark-button"]'
  );

  // Fill in the spark form
  await page.fill(
    '[data-testid="spark-title-input"]',
    'AI-powered recipe suggestions'
  );
  await page.fill(
    '[data-testid="spark-description-input"]',
    'Use food photos to suggest recipes'
  );

  // Save the spark
  await page.click(
    '[data-testid="spark-save-button"]'
  );

  // Verify toast notification
  await expect(
    page.locator('[data-testid="toast"]')
  ).toContainText('Spark captured');

  // Verify idea appears in the list
  await expect(
    page.locator('[data-testid="idea-card"]').first()
  ).toContainText('AI-powered recipe suggestions');
});

test('AI chat responds with idea context', async ({
  page,
}) => {
  await page.goto('/ideas/test-idea-id');

  // Open AI chat panel
  await page.click(
    '[data-testid="ai-chat-toggle"]'
  );

  // Verify context indicator shows idea title
  await expect(
    page.locator(
      '[data-testid="ai-context-indicator"]'
    )
  ).toBeVisible();

  // Send a message
  await page.fill(
    '[data-testid="chat-input"]',
    'What are the main risks?'
  );
  await page.click(
    '[data-testid="chat-send-button"]'
  );

  // Wait for AI response
  await expect(
    page.locator(
      '[data-testid="chat-message-assistant"]'
    )
  ).toBeVisible({ timeout: 10000 });
});
```

---

## 10. Validation Schemas  [Zod]

```typescript
// src/lib/validation.ts

import { z } from 'zod';

export const CreateIdeaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title too long')
    .trim(),
  description: z.string().optional().default(''),
  tags: z
    .array(
      z
        .string()
        .max(50, 'Tag too long')
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          'Invalid tag characters'
        )
    )
    .optional()
    .default([]),
});

export const UpdateIdeaSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .trim()
    .optional(),
  content: z.string().optional(),
  status: z
    .enum([
      'spark',
      'developing',
      'refined',
      'parked',
      'archived',
    ])
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const AIConfigSchema = z.object({
  provider: z.enum(['anthropic', 'openai']),
  apiKey: z
    .string()
    .min(1, 'API key is required'),
  model: z.string().min(1, 'Model is required'),
});

export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(2, 'Search query too short')
    .max(200),
});

export type CreateIdeaInput = z.infer<
  typeof CreateIdeaSchema
>;
export type UpdateIdeaInput = z.infer<
  typeof UpdateIdeaSchema
>;
export type AIConfigInput = z.infer<
  typeof AIConfigSchema
>;
```

---

## 11. Dependencies

### 11.1 Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | React DOM renderer |
| react-router | ^7.0.0 | Client-side routing |
| typescript | ^5.7.0 | Type safety |
| zustand | ^5.0.0 | State management |
| sql.js | ^1.11.0 | SQLite-in-WASM |
| @tiptap/react | ^2.10.0 | Rich text editor  [React bindings] |
| @tiptap/starter-kit | ^2.10.0 | Editor essentials |
| tiptap-markdown | ^0.8.0 | Markdown serialization |
| @tiptap/extension-placeholder | ^2.10.0 | Editor placeholder text |
| @tiptap/extension-link | ^2.10.0 | Link detection |
| @tiptap/extension-code-block-lowlight | ^2.10.0 | Syntax-highlighted code blocks |
| ai | ^4.0.0 | Vercel AI SDK core |
| @ai-sdk/anthropic | ^1.0.0 | Claude provider |
| @ai-sdk/openai | ^1.0.0 | OpenAI provider |
| @radix-ui/react-dialog | ^1.1.0 | Accessible modal dialogs |
| @radix-ui/react-dropdown-menu | ^2.1.0 | Dropdown menus |
| @radix-ui/react-popover | ^1.1.0 | Popover for tag autocomplete |
| @radix-ui/react-tooltip | ^1.1.0 | Tooltips |
| @radix-ui/react-toast | ^1.2.0 | Toast notifications |
| @radix-ui/react-slot | ^1.1.0 | Component composition |
| zod | ^3.24.0 | Runtime validation |
| class-variance-authority | ^0.7.0 | Type-safe CSS variants |
| clsx | ^2.1.0 | Conditional class names |
| tailwind-merge | ^3.0.0 | Merge Tailwind classes |
| lucide-react | ^0.470.0 | Icon library |
| lowlight | ^3.2.0 | Syntax highlighting |
| date-fns | ^4.1.0 | Date formatting |

### 11.2 Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6.1.0 | Build tool |
| @vitejs/plugin-react | ^4.3.0 | React Fast Refresh for Vite |
| tailwindcss | ^4.0.0 | Utility-first CSS |
| vitest | ^3.0.0 | Unit/component testing |
| @testing-library/react | ^16.0.0 | React component testing |
| @testing-library/jest-dom | ^6.0.0 | DOM matchers |
| @playwright/test | ^1.50.0 | E2E testing |
| eslint | ^9.0.0 | Linting |
| @typescript-eslint/eslint-plugin | ^8.0.0 | TypeScript linting rules |
| prettier | ^3.4.0 | Code formatting |
| @tanstack/react-virtual | ^3.11.0 | Virtual scrolling for long lists |

---

## 12. Implementation Sequence

### Week 1-2: Foundation

**Goal**: Application shell, database layer, and first CRUD operations.

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Project scaffold: Vite + React + TS + Tailwind + ESLint + Prettier | Working dev server with hot reload |
| 2 | Design tokens: globals.css with full light/dark mode tokens from design system | Themed app shell renders |
| 3 | sql.js integration: DatabaseManager with IndexedDB persistence | Database creates, persists, reloads across sessions |
| 4 | Schema v1: Run initial migration, verify all tables and FTS5 | All tables exist, FTS5 triggers fire |
| 5 | Repositories: IdeaRepository, TagRepository  [CRUD operations] | Can create, read, update, delete ideas and tags |
| 6 | Zustand store: IdeaSlice with basic operations | Store connects to repositories, UI can list ideas |
| 7-8 | App Shell: Sidebar, header, routing, responsive layout | Navigate between ideas, search, settings  [empty views] |
| 8 | Unit tests for database layer | 80%+ coverage on repositories |

**Spike  [Day 1-2] **: Validate sql.js performance with 1000 ideas, FTS5 search latency, IndexedDB persistence speed.

### Week 2-3: Spark Capture

| Day | Task | Deliverable |
|-----|------|-------------|
| 9-10 | SparkCaptureModal: form, validation, tag input with autocomplete | Can capture sparks with title, description, tags |
| 11 | Keyboard shortcut  [Ctrl+N]  for spark capture | Works from anywhere in the app |
| 12 | Toast notifications: Radix UI toast system | "Spark captured!" confirmation |

### Week 3-5: Idea Canvas

| Day | Task | Deliverable |
|-----|------|-------------|
| 13-15 | TipTap editor: setup, markdown mode, basic formatting | Rich editing with markdown storage |
| 16 | Auto-save: 1s debounce, saved indicator | Changes persist without manual save |
| 17-18 | Metadata panel: status dropdown, tags, dates | Full idea metadata visible and editable |
| 19 | Section inserter: slash command or button for structured sections | Optional Problem/Solution/Evidence/Next Steps headings |
| 20-21 | Canvas layout: editor + metadata sidebar, responsive | Three-panel layout on desktop, stacked on mobile |

### Week 5-8: AI Integration

| Day | Task | Deliverable |
|-----|------|-------------|
| 22-23 | AIService: Vercel AI SDK setup, provider configuration | API calls to Claude work from browser |
| 24-25 | AIChatPanel: streaming UI, message history, context indicator | Real-time AI responses with idea context |
| 26 | Context builder: system prompt, idea content, truncation | AI receives relevant idea context |
| 27 | Cost tracker: token counting, cost estimation, ai_interactions table | Every AI call tracked with cost |
| 28 | Privacy notice: first-time notice, Settings > Privacy section | Users informed about data handling |
| 29-30 | AI error handling: offline, rate limits, timeouts, retry | Graceful failures with clear user messaging |
| 31-32 | AI chat persistence: conversation history per idea | Chat history survives panel close/reopen |

### Week 8-9: Search and Status

| Day | Task | Deliverable |
|-----|------|-------------|
| 33-34 | SearchView: FTS5 search, tag search, result highlighting | Instant search across all ideas |
| 35 | Keyboard shortcut  [Ctrl+K]  for search | Quick search from anywhere |
| 36-37 | Ideas dashboard: list/grid view, status filters, sort options | Full idea management view |
| 38 | Status workflow: status changes in metadata panel and list view | Status badges, filter by status |

### Week 10-12: Polish and Launch Prep

| Day | Task | Deliverable |
|-----|------|-------------|
| 39-40 | Onboarding: 3-step welcome flow  [capture, canvas, AI] | New users reach first value in < 3 minutes |
| 41-42 | Export: JSON and Markdown export from Settings and per-idea | Data portability from day 1 |
| 43 | Settings page: AI config, data management, clear all data | Full settings experience |
| 44-45 | Error handling: error boundary, offline banner, retry UI | Resilient user experience |
| 46 | Keyboard shortcuts: remaining shortcuts, cheat sheet | Power user efficiency |
| 47 | Auto-backup: 5-minute backup cycle, 3-rotation pruning | Data safety net |
| 48-50 | E2E tests: critical flows, cross-browser  [Chrome, Firefox, Safari] | Confidence for launch |
| 51-52 | Performance audit: Lighthouse, bundle size, load time | Meet all performance targets |

---

## 13. Open Questions for Week 1 Spike

| Question | How to Resolve | Decision Criteria |
|----------|---------------|-------------------|
| sql.js performance with 1000+ ideas | Create test database, benchmark CRUD and FTS5 | < 50ms for FTS5 search, < 200ms for full export |
| TipTap markdown fidelity | Test roundtrip: markdown -> TipTap -> markdown | No content loss on save/reload cycle |
| Direct browser-to-Anthropic CORS | Test with `anthropic-dangerous-direct-browser-access` header | If blocked, implement Cloudflare Worker proxy |
| IndexedDB storage limits by browser | Test with 10MB, 50MB, 100MB databases | Must work up to 50MB without browser warnings |
| sql.js WASM bundle size impact | Measure with and without sql.js in Lighthouse | WASM must load asynchronously, not block initial render |

---

## 14. Alternatives Considered  [Summary]

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| Framework | React 19 | SolidJS, Svelte 5, Next.js | Ecosystem compatibility with TipTap, Radix, Vercel AI SDK |
| Styling | Tailwind 4 + CVA | CSS Modules, Styled Components | Speed of development, design token alignment |
| State | Zustand 5 | Redux Toolkit, Jotai | Minimal boilerplate, works outside React |
| Database | sql.js  [SQLite WASM] | Dexie.js, PGlite | SQL queries, FTS5, migration support |
| Editor | TipTap 2 | Milkdown, BlockNote, CodeMirror | Ecosystem, React bindings, markdown support |
| AI SDK | Vercel AI SDK 4 | LangChain.js, direct fetch | Provider abstraction, streaming, TypeScript |
| UI Primitives | Radix UI | Headless UI, shadcn/ui | Most components, unstyled, accessible |
| Testing | Vitest + Playwright | Jest + Cypress | Vite integration, WASM support |
| AI Access | Direct browser calls | Backend proxy only | Simpler architecture, no server to maintain |
| Content format | Markdown in SQLite | ProseMirror JSON, plain text | Portable, human-readable, exportable |

---

## 15. Confidence Assessment

**Overall Confidence**: HIGH

| Area | Confidence | Notes |
|------|------------|-------|
| React + TypeScript + Vite | HIGH | Well-understood stack, extensive documentation |
| sql.js + IndexedDB | MEDIUM | Need to validate performance at scale in Week 1 spike |
| TipTap markdown roundtrip | MEDIUM | Need to validate fidelity in Week 1 spike |
| Vercel AI SDK streaming | HIGH | Well-documented, widely used |
| Direct browser-to-Anthropic | MEDIUM | `anthropic-dangerous-direct-browser-access` header may have limitations |
| Bundle size budget | HIGH | Manual chunks + lazy loading should keep within targets |
| 12-week timeline | MEDIUM | Achievable with strict scope discipline; buffer in weeks 11-12 |

**What would increase confidence**:
- Week 1 spike results for sql.js performance, TipTap roundtrip, and CORS viability
- Prototype of DatabaseManager with full persistence lifecycle
- Bundle size measurement with all dependencies installed

---

## 16. Consequences

### Positive

- **Local-first architecture** ensures zero data loss risk from server outages and maximum user privacy
- **sql.js with FTS5** provides SQL query power and full-text search without additional dependencies
- **Single AI mode  [contextual chat] ** delivers 80% of value with 20% of engineering effort
- **Feature-based directory structure** scales cleanly as new features are added
- **Provider abstraction via Vercel AI SDK** prevents vendor lock-in on AI providers
- **Markdown storage** ensures data portability and human-readable exports
- **CVA + Tailwind** enables rapid UI development with type-safe design system variants

### Negative

- **sql.js WASM bundle** adds ~500KB to initial load  [mitigated by async loading]
- **No server-side storage** means no cross-device sync in MVP  [mitigated by export]
- **Direct browser API calls** expose the network request pattern  [mitigated by user's own API key]
- **Single developer** means no code review process  [mitigated by TypeScript strict mode, linting, and comprehensive tests]

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| sql.js performance insufficient at scale | LOW | HIGH | Week 1 spike validates; fallback to Dexie.js with MiniSearch |
| TipTap markdown roundtrip loses content | LOW | MEDIUM | Week 1 spike validates; fallback to plain markdown editor  [CodeMirror] |
| Anthropic blocks direct browser calls | MEDIUM | LOW | Cloudflare Worker proxy ready as fallback  [< 50 lines] |
| IndexedDB storage quota exceeded | LOW | MEDIUM | Detect and warn; prompt user to export and clean up old data |
| AI costs exceed estimates | MEDIUM | MEDIUM | Cost tracking from day 1; model tiering; configurable limits |
| Scope creep extends timeline | MEDIUM | HIGH | Strict phase boundaries; defer all non-P0 to Phase 1.5 |

---

*This ADR is the implementation blueprint for IdeaForge MVP. All architectural decisions are provisional and subject to validation in the Week 1 spike. Updates will be documented as amendments with version tracking.*

**File Location**: `docs/architecture/adr.md`
**Related Documents**:
- PRD: `docs/product/prd.md`
- Constraint Analysis: `docs/strategy/constraint-analysis.md`
- Feature Breakdown: `docs/product/feature-breakdown.md`
- Design System: `docs/design/design-system.md`
