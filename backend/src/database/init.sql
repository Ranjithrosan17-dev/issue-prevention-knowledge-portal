-- Knowledge Portal: PostgreSQL initialization
-- Full-text search indexes for high-performance search

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Full-text search index on content_items
CREATE INDEX IF NOT EXISTS idx_content_fts
  ON content_items
  USING GIN (to_tsvector('english', title || ' ' || COALESCE(summary, '') || ' ' || COALESCE(body, '')));

-- Composite index for common filter queries
CREATE INDEX IF NOT EXISTS idx_content_status_type ON content_items (status, type);
CREATE INDEX IF NOT EXISTS idx_content_team ON content_items (affected_team);
CREATE INDEX IF NOT EXISTS idx_analytics_user_event ON analytics_events (user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_type, entity_id);
