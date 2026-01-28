-- SQL schema for a pastebin-like application

CREATE TABLE pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NULL,

  max_views INTEGER NULL,
  views_used INTEGER NOT NULL DEFAULT 0
);
