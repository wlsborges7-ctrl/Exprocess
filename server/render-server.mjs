import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import pg from "pg";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const PORT = Number(process.env.PORT || 10000);
const DATABASE_URL = process.env.DATABASE_URL || "";

if (!DATABASE_URL) {
  console.error("DATABASE_URL não configurada. Crie um banco PostgreSQL no Render e defina a variável de ambiente DATABASE_URL.");
  process.exit(1);
}

const defaultUsers = [
  {
    id: 1,
    nome: "William Borges",
    usuario: "admin",
    perfil: "Administrador",
    senha: "Glink@Admin#8427",
    ativo: true,
    mustChangePassword: false,
    permissions: {
      canEmployees: true,
      canOccurrences: true,
      canProcesses: true,
      canTerminations: true,
      canReports: true,
      canManageUsers: true,
      processControl: true,
      canHrDispatch: true,
      canLegalDispatch: true,
      canConclusiveDecision: true
    }
  },
  {
    id: 2,
    nome: "Gestor 1",
    usuario: "gestor1",
    perfil: "Gestor",
    senha: "Glink@Gestor#5184",
    ativo: true,
    mustChangePassword: false,
    permissions: {
      canEmployees: true,
      canOccurrences: true,
      canProcesses: true,
      canTerminations: true,
      canReports: true,
      canManageUsers: false,
      processControl: true,
      canHrDispatch: false,
      canLegalDispatch: false,
      canConclusiveDecision: true
    }
  },
  {
    id: 3,
    nome: "Gestor 2",
    usuario: "gestor2",
    perfil: "Gestor",
    senha: "Glink@Gestor#9031",
    ativo: true,
    mustChangePassword: false,
    permissions: {
      canEmployees: true,
      canOccurrences: true,
      canProcesses: true,
      canTerminations: true,
      canReports: true,
      canManageUsers: false,
      processControl: true,
      canHrDispatch: false,
      canLegalDispatch: false,
      canConclusiveDecision: true
    }
  }
];

const defaultData = {
  meta: {
    appName: "Glink Process",
    version: "1.9.3.3-pg.1",
    revision: 1,
    updatedAt: new Date().toISOString()
  },
  users: defaultUsers,
  employees: [],
  occurrences: [],
  processes: [],
  attachments: [],
  terminations: []
};

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    )
  `);

  const keys = [
    ["meta", defaultData.meta],
    ["users", defaultData.users],
    ["employees", defaultData.employees],
    ["occurrences", defaultData.occurrences],
    ["processes", defaultData.processes],
    ["attachments", defaultData.attachments],
    ["terminations", defaultData.terminations]
  ];

  for (const [key, value] of keys) {
    await query(
      `INSERT INTO app_state (key, value)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (key) DO NOTHING`,
      [key, JSON.stringify(value)]
    );
  }
}

async function loadState() {
  const { rows } = await query(`SELECT key, value FROM app_state`);
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return {
    meta: byKey.meta || structuredClone(defaultData.meta),
    users: Array.isArray(byKey.users) ? byKey.users : structuredClone(defaultData.users),
    employees: Array.isArray(byKey.employees) ? byKey.employees : [],
    occurrences: Array.isArray(byKey.occurrences) ? byKey.occurrences : [],
    processes: Array.isArray(byKey.processes) ? byKey.processes : [],
    attachments: Array.isArray(byKey.attachments) ? byKey.attachments : [],
    terminations: Array.isArray(byKey.terminations) ? byKey.terminations : []
  };
}

async function saveState(state) {
  const entries = [
    ["meta", state.meta],
    ["users", state.users],
    ["employees", state.employees],
    ["occurrences", state.occurrences],
    ["processes", state.processes],
    ["attachments", state.attachments],
    ["terminations", state.terminations]
  ];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [key, value] of entries) {
      await client.query(
        `INSERT INTO app_state (key, value)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, JSON.stringify(value)]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function touchMeta(meta) {
  return {
    ...meta,
    revision: Number(meta?.revision || 0) + 1,
    updatedAt: new Date().toISOString()
  };
}

await initDb();

const SESSION_TIMEOUT_MS = 10 * 60 * 1000;
const onlineSessions = new Map();

function cleanupOnlineSessions() {
  const now = Date.now();
  for (const [sessionId, session] of onlineSessions.entries()) {
    if ((now - session.lastSeenAt) > SESSION_TIMEOUT_MS) {
      onlineSessions.delete(sessionId);
    }
  }
}

function createOnlineSession(user) {
  cleanupOnlineSessions();
  const sessionId = crypto.randomUUID();
  onlineSessions.set(sessionId, {
    sessionId,
    userId: user.id,
    nome: user.nome,
    usuario: user.usuario,
    perfil: user.perfil,
    loginAt: Date.now(),
    lastSeenAt: Date.now()
  });
  return sessionId;
}

function touchOnlineSession(sessionId) {
  cleanupOnlineSessions();
  const session = onlineSessions.get(sessionId);
  if (!session) return null;
  session.lastSeenAt = Date.now();
  onlineSessions.set(sessionId, session);
  return session;
}

function destroyOnlineSession(sessionId) {
  if (!sessionId) return;
  onlineSessions.delete(sessionId);
}

function listOnlineUsers() {
  cleanupOnlineSessions();
  return Array.from(onlineSessions.values()).map((session) => ({
    sessionId: session.sessionId,
    userId: session.userId,
    nome: session.nome,
    usuario: session.usuario,
    perfil: session.perfil,
    loginAt: new Date(session.loginAt).toISOString(),
    lastSeenAt: new Date(session.lastSeenAt).toISOString()
  }));
}

const app = express();
app.use(express.json({ limit: "25mb" }));

app.get("/api/health", async (_, res) => {
  try {
    const state = await loadState();
    res.json({
      ok: true,
      app: state.meta.appName,
      version: state.meta.version,
      revision: state.meta.revision,
      updatedAt: state.meta.updatedAt,
      database: "postgres",
      onlineCount: listOnlineUsers().length
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Falha ao consultar o banco PostgreSQL.",
      error: error.message
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const state = await loadState();
    const { usuario, senha } = req.body || {};
    const found = state.users.find((item) => item.ativo && item.usuario === usuario && item.senha === senha);
    if (!found) {
      return res.status(401).json({ ok: false, message: "Usuário ou senha inválidos." });
    }
    const sessionId = createOnlineSession(found);
    res.json({
      ok: true,
      sessionId,
      user: {
        id: found.id,
        nome: found.nome,
        usuario: found.usuario,
        perfil: found.perfil,
        permissions: found.permissions || {},
        mustChangePassword: !!found.mustChangePassword,
        ativo: found.ativo
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Falha no login.", error: error.message });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    destroyOnlineSession(sessionId);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Falha ao encerrar sessão.", error: error.message });
  }
});

app.post("/api/ping", async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    const session = touchOnlineSession(sessionId);
    if (!session) {
      return res.status(401).json({ ok: false, message: "Sessão expirada por inatividade." });
    }
    res.json({ ok: true, onlineCount: listOnlineUsers().length, session });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Falha ao atualizar atividade da sessão.", error: error.message });
  }
});

app.get("/api/online", async (_, res) => {
  try {
    res.json({ ok: true, users: listOnlineUsers() });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Falha ao listar usuários online.", error: error.message });
  }
});

app.get("/api/bootstrap", async (_, res) => {
  try {
    const state = await loadState();
    res.json({
      ok: true,
      revision: state.meta.revision,
      updatedAt: state.meta.updatedAt,
      users: state.users,
      employees: state.employees,
      occurrences: state.occurrences,
      processes: state.processes,
      attachments: state.attachments,
      terminations: state.terminations
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Falha ao carregar a base central.", error: error.message });
  }
});

app.post("/api/snapshot", async (req, res) => {
  try {
    const current = await loadState();
    const { users, employees, occurrences, processes, attachments, terminations, expectedRevision } = req.body || {};

    if (expectedRevision && Number(expectedRevision) !== Number(current.meta.revision)) {
      return res.status(409).json({
        ok: false,
        message: "A base foi alterada por outro usuário. Recarregue a aplicação antes de salvar novamente.",
        revision: current.meta.revision,
        updatedAt: current.meta.updatedAt
      });
    }

    const nextState = {
      meta: touchMeta(current.meta),
      users: Array.isArray(users) ? users : current.users,
      employees: Array.isArray(employees) ? employees : current.employees,
      occurrences: Array.isArray(occurrences) ? occurrences : current.occurrences,
      processes: Array.isArray(processes) ? processes : current.processes,
      attachments: Array.isArray(attachments) ? attachments : current.attachments,
      terminations: Array.isArray(terminations) ? terminations : current.terminations
    };

    await saveState(nextState);

    res.json({
      ok: true,
      revision: nextState.meta.revision,
      updatedAt: nextState.meta.updatedAt
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Falha ao salvar snapshot no PostgreSQL.", error: error.message });
  }
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`GLINK PROCESS no ar na porta ${PORT}`);
  console.log("Base central em PostgreSQL");
});
