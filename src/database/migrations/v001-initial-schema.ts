export const V001_INITIAL_SCHEMA = `
-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now')),
  description TEXT
);

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

-- Connections between ideas
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

-- Application settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Note: FTS5 is not available in the standard sql.js WASM build.
-- Full-text search is implemented via LIKE queries in the search service,
-- which is sufficient for a personal idea tool (hundreds, not millions of rows).

-- Indexes
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
`;
