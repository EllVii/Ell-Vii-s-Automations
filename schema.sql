CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  source_page TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_created_at
ON conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
ON messages(conversation_id);
