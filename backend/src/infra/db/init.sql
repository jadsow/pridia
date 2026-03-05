CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  idea TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS prds (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,

  CONSTRAINT fk_project
  FOREIGN KEY (project_id)
  REFERENCES projects(id)
  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS discovery_answers (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,

  CONSTRAINT fk_project_discovery
  FOREIGN KEY (project_id)
  REFERENCES projects(id)
  ON DELETE CASCADE
);