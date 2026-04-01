import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const PORT = Number(process.env.PORT || 10000);

const defaultUsers = [
  { id: 1, nome: "Administrador Demo", usuario: "admin", perfil: "Administrador", senha: "Demo@123", ativo: true, mustChangePassword: false, permissions: { canEmployees: true, canOccurrences: true, canProcesses: true, canTerminations: true, canReports: true, canManageUsers: true, processControl: true, canHrDispatch: true, canLegalDispatch: true, canConclusiveDecision: true } },
  { id: 2, nome: "Gestor Demo", usuario: "gestor", perfil: "Gestor", senha: "Demo@123", ativo: true, mustChangePassword: false, permissions: { canEmployees: true, canOccurrences: true, canProcesses: true, canTerminations: true, canReports: true, canManageUsers: false, processControl: true, canHrDispatch: false, canLegalDispatch: false, canConclusiveDecision: true } },
  { id: 3, nome: "RH Demo", usuario: "rh", perfil: "RH", senha: "Demo@123", ativo: true, mustChangePassword: false, permissions: { canEmployees: true, canOccurrences: true, canProcesses: true, canTerminations: true, canReports: true, canManageUsers: false, processControl: true, canHrDispatch: true, canLegalDispatch: false, canConclusiveDecision: false } },
  { id: 4, nome: "Jurídico Demo", usuario: "juridico", perfil: "Jurídico", senha: "Demo@123", ativo: true, mustChangePassword: false, permissions: { canEmployees: false, canOccurrences: false, canProcesses: true, canTerminations: false, canReports: true, canManageUsers: false, processControl: true, canHrDispatch: false, canLegalDispatch: true, canConclusiveDecision: false } }
];

const state = {
  meta: { appName: "ExceProcess", version: "2.6.0-demo", revision: 1, updatedAt: new Date().toISOString() },
  users: structuredClone(defaultUsers),
  employees: [],
  occurrences: [],
  processes: [],
  attachments: [],
  terminations: []
};

const app = express();
app.use(express.json({ limit: "25mb" }));

function touchMeta() {
  state.meta.revision = Number(state.meta.revision || 0) + 1;
  state.meta.updatedAt = new Date().toISOString();
}

app.get("/api/health", async (_, res) => res.json({ ok: true, app: state.meta.appName, version: state.meta.version, revision: state.meta.revision, updatedAt: state.meta.updatedAt, database: "demo-memory" }));

app.post("/api/auth/login", async (req, res) => {
  const { usuario, senha } = req.body || {};
  const found = state.users.find((item) => item.ativo && item.usuario === usuario && item.senha === senha);
  if (!found) return res.status(401).json({ ok: false, message: "Usuário ou senha inválidos." });
  res.json({ ok: true, user: { id: found.id, nome: found.nome, usuario: found.usuario, perfil: found.perfil, permissions: found.permissions || {}, mustChangePassword: !!found.mustChangePassword, ativo: found.ativo } });
});

app.get("/api/bootstrap", async (_, res) => res.json({ ok: true, revision: state.meta.revision, updatedAt: state.meta.updatedAt, users: state.users, employees: state.employees, occurrences: state.occurrences, processes: state.processes, attachments: state.attachments, terminations: state.terminations }));

app.post("/api/snapshot", async (req, res) => {
  const { users, employees, occurrences, processes, attachments, terminations, expectedRevision } = req.body || {};
  if (expectedRevision && Number(expectedRevision) !== Number(state.meta.revision)) return res.status(409).json({ ok: false, message: "A base demo foi alterada. Recarregue a página.", revision: state.meta.revision, updatedAt: state.meta.updatedAt });
  state.users = Array.isArray(users) ? users : state.users;
  state.employees = Array.isArray(employees) ? employees : state.employees;
  state.occurrences = Array.isArray(occurrences) ? occurrences : state.occurrences;
  state.processes = Array.isArray(processes) ? processes : state.processes;
  state.attachments = Array.isArray(attachments) ? attachments : state.attachments;
  state.terminations = Array.isArray(terminations) ? terminations : state.terminations;
  touchMeta();
  res.json({ ok: true, revision: state.meta.revision, updatedAt: state.meta.updatedAt });
});

app.get("/backup", async (_, res) => res.json(state));

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`EXCEPROCESS DEMO no ar na porta ${PORT}`);
  console.log("Base demo em memória (sem persistência definitiva)");
});
