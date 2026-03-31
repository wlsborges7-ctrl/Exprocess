-- Estrutura mínima de persistência central no PostgreSQL
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Exemplo de conferência
SELECT key FROM app_state ORDER BY key;
