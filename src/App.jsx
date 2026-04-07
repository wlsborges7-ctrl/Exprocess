
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BRANDING } from "./config/branding.js";
import { DEMO_MODE } from "./config/demo.js";
import LoginScreen from "./components/layout/LoginScreen.jsx";
import AppSidebar from "./components/layout/AppSidebar.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import EmptyState from "./components/common/EmptyState.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import OccurrencesPage from "./pages/OccurrencesPage.jsx";
import ProcessesPage from "./pages/ProcessesPage.jsx";
import TerminationsPage from "./pages/TerminationsPage.jsx";
import UsersPanelPage from "./pages/UsersPanelPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import { DEMO_STATE } from "./config/demoData.js";

const STORAGE_KEYS = {
  employees: `${BRANDING.storagePrefix}_employees`,
  occurrences: `${BRANDING.storagePrefix}_occurrences`,
  processes: `${BRANDING.storagePrefix}_processes`,
  page: `${BRANDING.storagePrefix}_page`,
  attachments: `${BRANDING.storagePrefix}_attachments`,
  terminations: `${BRANDING.storagePrefix}_terminations`,
  users: `${BRANDING.storagePrefix}_users`,
  session: `${BRANDING.storagePrefix}_session`
};

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const STATUS_OPTIONS = ["Ativo", "Inativo", "Afastado", "Suspenso", "Demitido"];
const DEPARTMENTS = ["Operações", "RH", "Comercial", "Financeiro", "Jurídico", "Suporte", "NOC", "Backoffice", "Instalação"];
const OCCURRENCE_TYPES = ["Atestado", "Dano", "Advertência", "Penalidade", "Folga meritória", "Demanda interna", "Outras ocorrências"];
const PROCESS_STATUS = ["Aberto", "Em apuração", "Manifestação pendente", "Aguardando despacho", "Em análise do RH", "Decidido", "Encerrado", "Arquivado"];
const MENU = ["Dashboard", "Funcionários", "Ocorrências", "Processos Internos", "Desligamentos", "Painel Gerencial"];


const JUST_CAUSE_OPTIONS = [
  { key: "improbidade", label: "Ato de improbidade", help: "Conduta desonesta, fraudulenta ou de má-fé no ambiente de trabalho." },
  { key: "mau_procedimento", label: "Incontinência de conduta ou mau procedimento", help: "Comportamento incompatível com o ambiente de trabalho ou com as regras mínimas de conduta." },
  { key: "negociacao", label: "Negociação habitual sem permissão", help: "Atividade concorrente ou negociação habitual sem autorização do empregador." },
  { key: "condenacao", label: "Condenação criminal", help: "Condenação criminal definitiva sem suspensão da execução da pena." },
  { key: "desidia", label: "Desídia no desempenho das funções", help: "Negligência reiterada, descuido habitual e baixa diligência no trabalho." },
  { key: "embriaguez", label: "Embriaguez habitual ou em serviço", help: "Embriaguez habitual ou durante o serviço, com impacto na atividade laboral." },
  { key: "segredo", label: "Violação de segredo da empresa", help: "Divulgação indevida de informações sigilosas da empresa." },
  { key: "indisciplina", label: "Ato de indisciplina ou insubordinação", help: "Descumprimento de normas internas ou ordens hierárquicas legítimas." },
  { key: "abandono", label: "Abandono de emprego", help: "Ausência injustificada com ânimo de não mais retornar ao trabalho." },
  { key: "honra", label: "Ato lesivo da honra ou da boa fama / ofensas físicas", help: "Condutas ofensivas à honra, boa fama ou integridade física, nas hipóteses legais." },
  { key: "azar", label: "Prática constante de jogos de azar", help: "Envolvimento reiterado com jogos de azar em prejuízo ao vínculo laboral." },
  { key: "habilitacao", label: "Perda da habilitação ou requisito legal", help: "Perda dolosa de habilitação ou requisito indispensável ao exercício da função." },
  { key: "seguranca_nacional", label: "Ato atentatório à segurança nacional", help: "Hipótese legal excepcional prevista na CLT." }
];

const DOCUMENT_ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp";

const defaultUsers = DEMO_STATE.users || [];



const PROFILE_OPTIONS = ["Administrador", "Gestor", "RH", "Jurídico"];

function getProfilePermissions(profile) {
  const base = {
    canEmployees: false,
    canOccurrences: false,
    canProcesses: false,
    canTerminations: false,
    canReports: true,
    canManageUsers: false,
    processControl: false,
    canHrDispatch: false,
    canLegalDispatch: false,
    canConclusiveDecision: false
  };
  if (profile === "Administrador") {
    return {
      ...base,
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
    };
  }
  if (profile === "Gestor") {
    return {
      ...base,
      canEmployees: true,
      canOccurrences: true,
      canProcesses: true,
      canTerminations: true,
      canReports: true,
      processControl: true,
      canConclusiveDecision: true
    };
  }
  if (profile === "RH") {
    return {
      ...base,
      canEmployees: true,
      canOccurrences: true,
      canProcesses: true,
      canTerminations: true,
      canReports: true,
      processControl: true,
      canHrDispatch: true
    };
  }
  if (profile === "Jurídico") {
    return {
      ...base,
      canProcesses: true,
      canReports: true,
      canLegalDispatch: true
    };
  }
  return base;
}

function getUserPermissions(user) {
  return { ...getProfilePermissions(user?.perfil), ...(user?.permissions || {}) };
}

function getVisibleMenuForUser(user) {
  const p = getUserPermissions(user);
  return MENU.filter((item) => {
    if (item === "Dashboard") return true;
    if (item === "Funcionários") return p.canEmployees;
    if (item === "Ocorrências") return p.canOccurrences;
    if (item === "Processos Internos") return p.canProcesses;
    if (item === "Desligamentos") return p.canTerminations;
    if (item === "Painel Gerencial") return p.canReports || p.canManageUsers;
    return true;
  });
}

function getMovementOptionsForUser(user) {
  const p = getUserPermissions(user);
  if (user?.perfil === "Jurídico") {
    return ["Despacho jurídico"];
  }
  if (user?.perfil === "RH") {
    return ["Movimentação", "Manifestação do RH", "Notificação ao colaborador", "Despacho do RH", "Decisão"];
  }
  const opts = ["Movimentação", "Manifestação do funcionário", "Manifestação do RH", "Notificação ao colaborador", "Despacho interno", "Decisão"];
  if (p.canHrDispatch) opts.push("Despacho do RH");
  if (p.canLegalDispatch) opts.push("Despacho jurídico");
  return opts;
}

const defaultEmployees = DEMO_STATE.employees || [];

const defaultOccurrences = DEMO_STATE.occurrences || [];

const defaultProcesses = DEMO_STATE.processes || [];

const loadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);

    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback;
    }

    if (fallback && typeof fallback === "object" && !Array.isArray(fallback)) {
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
    }

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const ensureArray = (value, fallback = []) => Array.isArray(value) ? value : fallback;

const nowBr = () => new Date().toLocaleString("pt-BR");

function actorLabel(user) {
  if (!user) return "Sistema";
  return `${user.nome} (${user.perfil})`;
}

function getQueueTargetForProfile(user) {
  if (!user) return "";
  if (user.perfil === "RH") return "RH";
  if (user.perfil === "Jurídico") return "Jurídico";
  if (user.perfil === "Gestor" || user.perfil === "Administrador") return "Gestão";
  return "";
}

function queueTargetLabel(value) {
  return value || "Não atribuído";
}


function formatDate(date) {
  if (!date) return "-";
  const [y, m, d] = String(date).split("-");
  return y && m && d ? `${d}/${m}/${y}` : date;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const daysBetween = (a, b) => Math.round((b - a) / (24 * 60 * 60 * 1000));

function calculateINSSAlert(employeeId, occurrences) {
  const medical = occurrences
    .filter((o) => o.funcionarioId === employeeId && o.tipo === "Atestado" && o.atestado)
    .map((o) => ({
      data: o.data,
      dias: Number(o.atestado?.diasAfastamento || 0),
      cid: o.atestado?.cidNumero ? String(o.atestado.cidNumero).trim().toUpperCase() : ""
    }))
    .filter((o) => o.data && o.dias > 0)
    .sort((a, b) => String(a.data).localeCompare(String(b.data)));

  if (!medical.length) return { shouldRefer: false, message: "" };

  for (let i = 0; i < medical.length; i += 1) {
    const base = medical[i];
    const baseDate = parseDate(base.data);
    if (!baseDate) continue;
    let total = base.dias;
    for (let j = i + 1; j < medical.length; j += 1) {
      const next = medical[j];
      const nextDate = parseDate(next.data);
      if (!nextDate) continue;
      if (daysBetween(baseDate, nextDate) <= 60 && base.cid && next.cid && base.cid === next.cid) total += next.dias;
    }
    if (total > 15) return { shouldRefer: true, message: `Mesmo CID em 60 dias somou ${total} dias. Avaliar INSS.` };
  }

  const latest = medical[medical.length - 1];
  if (latest.dias > 15) return { shouldRefer: true, message: `Atestado individual com ${latest.dias} dias. Avaliar INSS.` };
  return { shouldRefer: false, message: "" };
}

function getStatusTone(status) {
  if (status === "Ativo" || status === "Concluída") return "success";
  if (status === "Inativo" || status === "Encerrado" || status === "Arquivado") return "muted";
  if (status === "Afastado") return "warning";
  if (status === "Suspenso") return "danger";
  return "default";
}

function getCriticalityTone(classificacao) {
  const c = String(classificacao || "").toLowerCase();
  if (c === "leve") return "success";
  if (c === "moderada") return "warning";
  if (c === "grave" || c === "gravíssima" || c === "gravissima") return "danger";
  return "default";
}

function getCriticalityLabel(classificacao) {
  return classificacao ? `Criticidade: ${classificacao}` : "Criticidade não definida";
}

function Badge({ children, tone = "default" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export default function App() {
  const [activePage, setActivePage] = useState(() => loadStorage(STORAGE_KEYS.page, "Dashboard"));
  const [employees, setEmployees] = useState(() => ensureArray(loadStorage(STORAGE_KEYS.employees, defaultEmployees), defaultEmployees));
  const [occurrences, setOccurrences] = useState(() => ensureArray(loadStorage(STORAGE_KEYS.occurrences, defaultOccurrences), defaultOccurrences));
  const [processes, setProcesses] = useState(() => ensureArray(loadStorage(STORAGE_KEYS.processes, defaultProcesses), defaultProcesses));
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [users, setUsers] = useState(() => ensureArray(loadStorage(STORAGE_KEYS.users, defaultUsers), defaultUsers));
  const [session, setSession] = useState(() => loadStorage(STORAGE_KEYS.session, null));
  const [authUser, setAuthUser] = useState(() => loadStorage(`${BRANDING.storagePrefix}_auth_user`, null));
  const [loginForm, setLoginForm] = useState({ usuario: "", senha: "" });
  const [passwordChangeForm, setPasswordChangeForm] = useState({ senha: "", confirmar: "" });
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [userForm, setUserForm] = useState({ nome: "", usuario: "", perfil: "Gestor", senha: "", ativo: true });
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [editingPermissionsId, setEditingPermissionsId] = useState(null);
  const [documentDraft, setDocumentDraft] = useState(null);
  const [backendRevision, setBackendRevision] = useState(null);
  const [backendUpdatedAt, setBackendUpdatedAt] = useState("");
  const [syncNotice, setSyncNotice] = useState("");
  const [remoteReady, setRemoteReady] = useState(false);
  const syncTimeoutRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const skipNextSyncRef = useRef(false);

  const [expandedEmployeeIds, setExpandedEmployeeIds] = useState([]);
  const [employeeDetailTabs, setEmployeeDetailTabs] = useState({});
  const [expandedOccurrenceIds, setExpandedOccurrenceIds] = useState([]);
  const [expandedProcessIds, setExpandedProcessIds] = useState([]);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [occurrenceSearch, setOccurrenceSearch] = useState("");
  const [processSearch, setProcessSearch] = useState("");
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState("Todos");
  const [occurrenceTypeFilter, setOccurrenceTypeFilter] = useState("Todos");
  const [processBoardView, setProcessBoardView] = useState("Em tramitação");
  const [employeeSortOrder, setEmployeeSortOrder] = useState("nome_asc");
  const [standardDocSelection, setStandardDocSelection] = useState({});

  const [employeeEditingId, setEmployeeEditingId] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    cargo: "",
    setor: "Operações",
    base: "",
    gestor: "",
    status: "Ativo",
    admissao: "",
    email: "",
    celular: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "RJ",
    salario: "",
    feriasVencidas: false
  });

  const [occurrenceForm, setOccurrenceForm] = useState({
    tipo: "Atestado",
    funcionarioId: "",
    data: "",
    descricao: "",
    classificacao: "leve",
    normaViolada: "",
    geraProcesso: true,
    atestado: { diasAfastamento: 0, informouCID: false, cidNumero: "", hospital: "", crmMedico: "" },
    penalidade: { efeito: "Nenhum", diasSuspensao: 0, tokenChef: "" },
    dano: { ativo: "", serial: "", local: "", valorEstimado: "", impactoOperacional: false },
    advertencia: { classificacao: "Leve" },
    folga: { dataFolga: "", observacao: "", tokenChef: "", validada: false },
    demanda: { prioridade: "média", prazoPretendido: "", unidadeResponsavel: "" },
    outras: { titulo: "" }
  });

  const [attachments, setAttachments] = useState(() => ensureArray(loadStorage(STORAGE_KEYS.attachments, DEMO_STATE.attachments || []), DEMO_STATE.attachments || []));
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [movementAttachmentDrafts, setMovementAttachmentDrafts] = useState({});
  const [attachmentLinkDrafts, setAttachmentLinkDrafts] = useState({});
  const [processAssignmentDrafts, setProcessAssignmentDrafts] = useState({});
  const [terminationForm, setTerminationForm] = useState({
    funcionarioId: "",
    tipo: "dispensa_ordinaria",
    data: "",
    motivo: "",
    avisoPrevio: "indenizado",
    occurrenceRef: "",
    processRef: "",
    hipotese: JUST_CAUSE_OPTIONS[0].key,
    sintese: "",
    normaViolada: ""
  });
  const [terminations, setTerminations] = useState(() => ensureArray(loadStorage(STORAGE_KEYS.terminations, DEMO_STATE.terminations || []), DEMO_STATE.terminations || []));
  const [quickEventDrafts, setQuickEventDrafts] = useState({});
  const [movementType, setMovementType] = useState("Movimentação");
  const [movementText, setMovementText] = useState("");
  const [decisionConclusion, setDecisionConclusion] = useState(false);
  const [decisionResult, setDecisionResult] = useState("sem penalidade");
  const [decisionToken, setDecisionToken] = useState("");
  const [hrConclusion, setHrConclusion] = useState(false);
  const [hrToken, setHrToken] = useState("");
  const [dispatchConclusion, setDispatchConclusion] = useState(false);
  const [terminationToken, setTerminationToken] = useState("");
  const [movementOpenSectorDeadline, setMovementOpenSectorDeadline] = useState(false);
  const [movementDeadlineDays, setMovementDeadlineDays] = useState("");

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.page, JSON.stringify(activePage)); }, [activePage]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.occurrences, JSON.stringify(occurrences)); }, [occurrences]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.processes, JSON.stringify(processes)); }, [processes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.attachments, JSON.stringify(attachments)); }, [attachments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.terminations, JSON.stringify(terminations)); }, [terminations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session)); }, [session]);
  useEffect(() => { localStorage.setItem(`${BRANDING.storagePrefix}_auth_user`, JSON.stringify(authUser)); }, [authUser]);
  useEffect(() => {
    if (!session?.user) return;
    if (remoteReady) return;
    fetchBootstrap().catch((error) => {
      setSyncNotice(error?.message || "Falha ao carregar base central.");
    });
  }, [session, remoteReady]);

  useEffect(() => {
    if (!session?.user || !remoteReady) return;
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      pushSnapshot().catch((error) => {
        setSyncNotice(error?.message || "Falha ao sincronizar.");
      });
    }, 800);
    return () => clearTimeout(syncTimeoutRef.current);
  }, [users, employees, occurrences, processes, attachments, terminations, session, remoteReady]);

  useEffect(() => {
    if (!session?.user || !remoteReady) return;
    clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/health`);
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload?.ok) return;
        if (payload.revision && Number(payload.revision) !== Number(backendRevision)) {
          await fetchBootstrap();
          setSyncNotice("Atualizações recebidas da base central.");
        }
      } catch (_) {
        // silêncio para não poluir a UI durante polling
      }
    }, 6000);
    return () => clearInterval(pollIntervalRef.current);
  }, [session, remoteReady, backendRevision]);

  useEffect(() => {
    if (!Array.isArray(users)) setUsers(defaultUsers);
    if (!Array.isArray(employees)) setEmployees(defaultEmployees);
    if (!Array.isArray(occurrences)) setOccurrences(defaultOccurrences);
    if (!Array.isArray(processes)) setProcesses(defaultProcesses);
    if (!Array.isArray(attachments)) setAttachments([]);
    if (!Array.isArray(terminations)) setTerminations([]);
  }, []);


  const normalizedEmployees = employees.map((item) => ({ ...item, salario: item.salario || "", feriasVencidas: !!item.feriasVencidas }));
  const employeeMap = useMemo(() => Object.fromEntries(normalizedEmployees.map((item) => [item.id, item])), [normalizedEmployees]);
  const processMapByOccurrence = useMemo(() => Object.fromEntries(processes.map((item) => [item.occurrenceId, item])), [processes]);
  const selectedProcess = processes.find((item) => item.id === selectedProcessId) || null;
  const safeUsers = ensureArray(users, defaultUsers);
  const currentUser = authUser || session?.user || (session ? safeUsers.find((item) => item.id === session.userId) || null : null);
  const currentPermissions = getUserPermissions(currentUser);
  const visibleMenu = getVisibleMenuForUser(currentUser);
  const movementOptions = getMovementOptionsForUser(currentUser);

  const inssByEmployee = useMemo(() => {
    const map = {};
    normalizedEmployees.forEach((employee) => { map[employee.id] = calculateINSSAlert(employee.id, occurrences); });
    return map;
  }, [normalizedEmployees, occurrences]);
  const totalEmployees = normalizedEmployees.length;
  const totalAway = normalizedEmployees.filter((item) => item.status === "Afastado").length;
  const totalSusp = normalizedEmployees.filter((item) => item.status === "Suspenso").length;

  const stats = useMemo(() => {
    const openProcesses = processes.filter((item) => !["Encerrado", "Arquivado"].includes(item.status)).length;
    const inssCases = Object.values(inssByEmployee).filter((item) => item.shouldRefer).length;
    return [
      { label: "Processos em aberto", value: openProcesses },
      { label: "Funcionários afastados", value: totalAway },
      { label: "Funcionários suspensos", value: totalSusp },
      { label: "Alertas INSS", value: inssCases }
    ];
  }, [processes, inssByEmployee, totalAway, totalSusp]);

  const processCounts = useMemo(() => ({
    "Em tramitação": processes.filter((item) => !["Encerrado", "Arquivado"].includes(item.status)).length,
    "Encerrados": processes.filter((item) => item.status === "Encerrado").length,
    "Arquivados": processes.filter((item) => item.status === "Arquivado").length
  }), [processes]);

  const filteredEmployees = useMemo(() => {
    const term = employeeSearch.toLowerCase().trim();
    const base = normalizedEmployees.filter((item) => {
      const matchesText = !term || [item.nome, item.cpf, item.matricula, item.cargo, item.setor, item.base, item.gestor, item.status, item.email, item.celular, item.endereco, item.numero, item.complemento, item.bairro, item.cidade, item.uf, item.cep]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const matchesStatus = employeeStatusFilter === "Todos" || item.status === employeeStatusFilter;
      return matchesText && matchesStatus;
    });

    const sorted = [...base];
    sorted.sort((a, b) => {
      if (employeeSortOrder === "nome_asc") return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
      if (employeeSortOrder === "nome_desc") return String(b.nome || "").localeCompare(String(a.nome || ""), "pt-BR");
      if (employeeSortOrder === "matricula_asc") return String(a.matricula || "").localeCompare(String(b.matricula || ""), "pt-BR");
      if (employeeSortOrder === "matricula_desc") return String(b.matricula || "").localeCompare(String(a.matricula || ""), "pt-BR");
      if (employeeSortOrder === "setor") return String(a.setor || "").localeCompare(String(b.setor || ""), "pt-BR") || String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
      if (employeeSortOrder === "status") return String(a.status || "").localeCompare(String(b.status || ""), "pt-BR") || String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
      return 0;
    });
    return sorted;
  }, [employees, employeeSearch, employeeStatusFilter, employeeSortOrder]);

  const filteredOccurrences = useMemo(() => {
    const term = occurrenceSearch.toLowerCase().trim();
    return occurrences.filter((item) => {
      const employeeName = employeeMap[item.funcionarioId]?.nome || "";
      const extras = [];
      if (item.atestado) extras.push(item.atestado.hospital, item.atestado.crmMedico, item.atestado.cidNumero);
      if (item.penalidade) extras.push(item.penalidade.efeito, item.penalidade.diasSuspensao);
      if (item.dano) extras.push(item.dano.ativo, item.dano.serial, item.dano.local, item.dano.valorEstimado);
      if (item.advertencia) extras.push(item.advertencia.classificacao);
      if (item.folga) extras.push(item.folga.dataFolga, item.folga.observacao, item.folga.tokenChef, item.folga.validada ? "validada" : "pendente");
      if (item.demanda) extras.push(item.demanda.prioridade, item.demanda.prazoPretendido, item.demanda.unidadeResponsavel);
      if (item.outras) extras.push(item.outras.titulo);
      const matchesText = !term || [item.protocolo, item.tipo, item.descricao, item.status, employeeName, ...extras]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      const matchesType = occurrenceTypeFilter === "Todos" || item.tipo === occurrenceTypeFilter;
      return matchesText && matchesType;
    });
  }, [occurrences, occurrenceSearch, occurrenceTypeFilter, employeeMap]);

  const filteredProcesses = useMemo(() => {
    const term = processSearch.toLowerCase().trim();
    return processes.filter((item) => {
      const employeeName = employeeMap[item.funcionarioId]?.nome || "";
      const matchesText = !term || [item.numero, item.occurrenceNumber, item.assunto, item.status, employeeName, ...(item.movimentacoes || []).map((m) => `${m.tipo} ${m.texto}`)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));

      let matchesBoard = true;
      if (processBoardView === "Em tramitação") matchesBoard = !["Encerrado", "Arquivado"].includes(item.status);
      if (processBoardView === "Encerrados") matchesBoard = item.status === "Encerrado";
      if (processBoardView === "Arquivados") matchesBoard = item.status === "Arquivado";

      return matchesText && matchesBoard;
    });
  }, [processes, processSearch, processBoardView, employeeMap]);

  const processSummary = useMemo(() => filteredProcesses.map((item) => ({
    ...item,
    funcionarioNome: employeeMap[item.funcionarioId]?.nome || "Não localizado"
  })), [filteredProcesses, employeeMap]);

  const myQueueTarget = getQueueTargetForProfile(currentUser);
  const myDispatchQueue = useMemo(() => processes.filter((item) =>
    item.status === "Aguardando despacho" && (item.assignedTo || "") === myQueueTarget
  ), [processes, myQueueTarget]);

  const assignedBySectorCounts = useMemo(() => ({
    RH: processes.filter((p) => p.assignedTo === "RH").length,
    "Jurídico": processes.filter((p) => p.assignedTo === "Jurídico").length,
    "Gestão": processes.filter((p) => p.assignedTo === "Gestão").length
  }), [processes]);

  const awaitingDispatchBySectorCounts = useMemo(() => ({
    RH: processes.filter((p) => p.status === "Aguardando despacho" && p.assignedTo === "RH").length,
    "Jurídico": processes.filter((p) => p.status === "Aguardando despacho" && p.assignedTo === "Jurídico").length,
    "Gestão": processes.filter((p) => p.status === "Aguardando despacho" && p.assignedTo === "Gestão").length
  }), [processes]);


  const toggleExpanded = (id, current, setter) => {
    setter(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  async function lookupCep() {
    const raw = String(employeeForm.cep || "").replace(/\D/g, "");
    if (raw.length !== 8) {
      alert("Informe um CEP com 8 dígitos.");
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }
      setEmployeeForm((prev) => ({
        ...prev,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        uf: data.uf || prev.uf
      }));
    } catch {
      alert("Não foi possível consultar o CEP agora.");
    }
  }

  function resetEmployeeForm() {
    setEmployeeEditingId(null);
    setShowEmployeeForm(false);
    setEmployeeForm({
      nome: "", cpf: "", matricula: "", cargo: "", setor: "Operações", base: "", gestor: "",
      status: "Ativo", admissao: "", email: "", celular: "", cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "RJ"
    });
  }

  function startEmployeeEdit(employee) {
    setShowEmployeeForm(true);
    setEmployeeEditingId(employee.id);
    setEmployeeForm({
      nome: employee.nome,
      cpf: employee.cpf,
      matricula: employee.matricula,
      cargo: employee.cargo,
      setor: employee.setor,
      base: employee.base || "",
      gestor: employee.gestor || "",
      status: employee.status,
      admissao: employee.admissao || "",
      email: employee.email || "",
      celular: employee.celular || "",
      cep: employee.cep || "",
      endereco: employee.endereco || "",
      numero: employee.numero || "",
      complemento: employee.complemento || "",
      bairro: employee.bairro || "",
      cidade: employee.cidade || "",
      uf: employee.uf || "RJ"
    });
    setActivePage("Funcionários");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEmployeeSubmit(event) {
    event.preventDefault();
    if (employeeEditingId) {
      setEmployees((prev) => prev.map((item) => item.id === employeeEditingId ? { ...item, ...employeeForm } : item));
    } else {
      setEmployees((prev) => [{ id: Date.now(), ...employeeForm, diasAfastamento: 0 }, ...prev]);
    }
    resetEmployeeForm();
    setActivePage("Funcionários");
  }

  function handleEmployeeDelete(id) {
    const hasOpenOccurrence = occurrences.some((item) => item.funcionarioId === id && !item.concluida);
    const hasOpenProcess = processes.some((item) => item.funcionarioId === id && !["Encerrado", "Arquivado"].includes(item.status));
    if (hasOpenOccurrence || hasOpenProcess) {
      alert("Este funcionário ainda possui ocorrências não concluídas ou processos não encerrados/arquivados.");
      return;
    }
    setEmployees((prev) => prev.filter((item) => item.id !== id));
    if (selectedProcess?.funcionarioId === id) setSelectedProcessId(null);
  }

  function handleEmployeeStatusChange(id, status) {
    setEmployees((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  }

  function applyOccurrenceEffects(employeeId, formData) {
    setEmployees((prev) => prev.map((employee) => {
      if (employee.id !== employeeId) return employee;
      const updated = { ...employee };
      if (formData.tipo === "Atestado") {
        updated.status = "Afastado";
        updated.diasAfastamento = Number(updated.diasAfastamento || 0) + Number(formData.atestado.diasAfastamento || 0);
      }
      if (formData.tipo === "Penalidade" && formData.penalidade.efeito === "Suspensão") {
        updated.status = "Suspenso";
      }
      if (formData.tipo === "Folga meritória" && formData.folga.validada && isToday(formData.folga.dataFolga)) {
        updated.status = "Afastado";
      }
      return updated;
    }));
  }

  function isToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return dateStr === `${y}-${m}-${d}`;
  }

  function validateManagerToken(token) {
    return String(token || "").trim().length >= 4;
  }

  function requireValidToken(token, message = "Informe o token da chefia.") {
    if (!validateManagerToken(token)) {
      alert(message);
      return false;
    }
    return true;
  }


  function recalculateEmployeeStatus(employeeId, nextOccurrences) {
    const employeeOccurrences = nextOccurrences.filter((item) => item.funcionarioId === employeeId);
    const hasOpenSuspension = employeeOccurrences.some((item) => !item.concluida && item.tipo === "Penalidade" && item.penalidade?.efeito === "Suspensão");
    const hasOpenMedical = employeeOccurrences.some((item) => !item.concluida && item.tipo === "Atestado");
    setEmployees((prev) => prev.map((employee) => {
      if (employee.id !== employeeId) return employee;
      if (hasOpenSuspension) return { ...employee, status: "Suspenso" };
      if (hasOpenMedical) return { ...employee, status: "Afastado" };
      if (employee.status === "Afastado" || employee.status === "Suspenso") return { ...employee, status: "Ativo" };
      return employee;
    }));
  }

  function appendOccurrenceEvent(occurrenceId, tipo, resumo) {
    if (!resumo || !String(resumo).trim()) return;
    const text = String(resumo).trim();
    setOccurrences((prev) => prev.map((item) =>
      item.id === occurrenceId
        ? { ...item, timeline: [...(item.timeline || []), { id: Date.now(), data: nowBr(), tipo, resumo: text }] }
        : item
    ));
  }

  function appendProcessMovement(processId, tipo, texto, forcedId = null) {
    if (!texto || !String(texto).trim()) return null;
    const text = String(texto).trim();
    const movementId = forcedId || Date.now();
    setProcesses((prev) => prev.map((item) =>
      item.id === processId
        ? { ...item, movimentacoes: [...(item.movimentacoes || []), { id: movementId, data: nowBr(), tipo, texto: text, responsavel: actorLabel(currentUser) }] }
        : item
    ));
    return movementId;
  }

  function attachRecordsToMovement(processId, movementId, movementType, files = [], movementText = "") {
    if (!files.length) return;
    const records = files.map((file, idx) => ({
      id: Date.now() + idx,
      scope: "process",
      parentId: processId,
      movementId,
      movementType,
      movementText,
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: file.dataUrl,
      createdAt: nowBr()
    }));
    setAttachments((prev) => [...records, ...prev]);
  }

  function queueMovementAttachment(processId, file) {
    if (!file) return;
    if (file.size > 1_500_000) {
      alert("Arquivo muito grande para esta versão. Use até 1,5 MB por documento.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const record = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result
      };
      setMovementAttachmentDrafts((prev) => ({
        ...prev,
        [processId]: [...(prev[processId] || []), record]
      }));
    };
    reader.readAsDataURL(file);
  }

  function removeMovementDraftAttachment(processId, draftId) {
    setMovementAttachmentDrafts((prev) => ({
      ...prev,
      [processId]: (prev[processId] || []).filter((item) => item.id !== draftId)
    }));
  }

  function getMovementAttachments(processId, movementId) {
    return attachments.filter((item) => item.scope === "process" && String(item.parentId) === String(processId) && String(item.movementId || "") === String(movementId));
  }

  function linkAttachmentToMovement(attachmentId, processId, movementId) {
    const process = processes.find((item) => item.id === processId);
    const movement = (process?.movimentacoes || []).find((mv) => String(mv.id) === String(movementId));
    if (!movement) {
      alert("Selecione uma movimentação válida.");
      return;
    }
    setAttachments((prev) => prev.map((item) => item.id === attachmentId ? {
      ...item,
      movementId: movement.id,
      movementType: movement.tipo,
      movementText: movement.texto
    } : item));
  }

  function syncOccurrenceToLinkedProcess(occurrenceId, tipo, resumo) {
    const linked = processes.find((p) => p.occurrenceId === occurrenceId);
    if (!linked) return;
    appendProcessMovement(linked.id, tipo, resumo);
  }

  function syncProcessToLinkedOccurrence(processId, tipo, texto) {
    const linked = processes.find((p) => p.id === processId);
    if (!linked) return;
    appendOccurrenceEvent(linked.occurrenceId, tipo, texto);
  }


  function buildOccurrenceTimeline(tipo, processCreated) {
    const timeline = [{ id: 1, data: nowBr(), tipo: "Abertura", resumo: `Ocorrência aberta: ${tipo}.` }];
    if (processCreated) timeline.push({ id: 2, data: nowBr(), tipo: "Vínculo", resumo: "Processo interno gerado automaticamente." });
    return timeline;
  }

  function handleOccurrenceSubmit(event) {
    event.preventDefault();
    const id = Date.now();
    const employeeId = Number(occurrenceForm.funcionarioId);
    const protocolo = `OC-${new Date().getFullYear()}-${String(occurrences.length + 1).padStart(3, "0")}`;

    if (occurrenceForm.tipo === "Folga meritória" && !requireValidToken(occurrenceForm.folga.tokenChef, "Folga meritória exige token da chefia.")) {
      return;
    }
    if (occurrenceForm.tipo === "Penalidade" && occurrenceForm.penalidade.efeito !== "Nenhum" && !requireValidToken((occurrenceForm.penalidade.tokenChef || ""), "Penalidade exige token da chefia.")) {
      return;
    }

    const occurrence = {
      id,
      protocolo,
      tipo: occurrenceForm.tipo,
      funcionarioId: employeeId,
      data: occurrenceForm.data,
      descricao: occurrenceForm.descricao,
      classificacao: occurrenceForm.classificacao,
      normaViolada: occurrenceForm.normaViolada,
      status: occurrenceForm.geraProcesso ? "Gerou processo" : "Sem processo",
      geraProcesso: occurrenceForm.geraProcesso,
      concluida: false,
      atestado: occurrenceForm.tipo === "Atestado" ? {
        diasAfastamento: Number(occurrenceForm.atestado.diasAfastamento || 0),
        informouCID: occurrenceForm.atestado.informouCID,
        cidNumero: occurrenceForm.atestado.informouCID ? occurrenceForm.atestado.cidNumero.trim().toUpperCase() : "",
        hospital: occurrenceForm.atestado.hospital,
        crmMedico: occurrenceForm.atestado.crmMedico
      } : null,
      penalidade: occurrenceForm.tipo === "Penalidade" ? {
        efeito: occurrenceForm.penalidade.efeito,
        diasSuspensao: Number(occurrenceForm.penalidade.diasSuspensao || 0),
        tokenChef: occurrenceForm.penalidade.tokenChef || ""
      } : null,
      dano: occurrenceForm.tipo === "Dano" ? { ...occurrenceForm.dano } : null,
      advertencia: occurrenceForm.tipo === "Advertência" ? { ...occurrenceForm.advertencia } : null,
      folga: occurrenceForm.tipo === "Folga meritória" ? { ...occurrenceForm.folga } : null,
      demanda: occurrenceForm.tipo === "Demanda interna" ? { ...occurrenceForm.demanda } : null,
      outras: occurrenceForm.tipo === "Outras ocorrências" ? { ...occurrenceForm.outras } : null,
      timeline: buildOccurrenceTimeline(occurrenceForm.tipo, occurrenceForm.geraProcesso)
    };

    const nextOccurrences = [occurrence, ...occurrences];
    setOccurrences(nextOccurrences);
    applyOccurrenceEffects(employeeId, occurrenceForm);

    if (occurrenceForm.geraProcesso) {
      const employeeName = employeeMap[employeeId]?.nome || "Funcionário";
      const processNumber = protocolo.replace("OC-", "PROC-");
      const assunto = occurrenceForm.tipo === "Dano"
        ? `Apuração de dano em ativo - ${occurrenceForm.dano.ativo || employeeName}`
        : occurrenceForm.tipo === "Folga meritória"
        ? `Folga meritória - ${employeeName}`
        : occurrenceForm.tipo === "Outras ocorrências"
        ? `${occurrenceForm.outras.titulo || "Outras ocorrências"} - ${employeeName}`
        : `${occurrenceForm.tipo} - ${employeeName}`;

      const process = {
        id: id + 1,
        numero: processNumber,
        occurrenceId: id,
        occurrenceNumber: protocolo,
        funcionarioId: employeeId,
        assunto,
        prazo: occurrenceForm.data || "",
        status: "Aberto",
        awaitingResponse: false,
        awaitingType: "",
        awaitingLabel: "",
        responseDeadline: "",
        blockedForProceeding: false,
        sigiloso: ["grave", "gravíssima"].includes(occurrenceForm.classificacao),
        classificacao: occurrenceForm.classificacao,
        normaViolada: occurrenceForm.normaViolada,
        movimentacoes: [
          { id: 1, data: nowBr(), tipo: "Abertura", texto: `Processo aberto automaticamente a partir da ocorrência cadastrada. Descrição inicial: ${occurrenceForm.descricao}${occurrenceForm.tipo === "Folga meritória" ? ` Data da folga: ${occurrenceForm.folga.dataFolga}. Validação da chefia: ${occurrenceForm.folga.validada ? "confirmada" : "pendente"}.` : ""}` },
          { id: 2, data: nowBr(), tipo: "Manifestação inicial do RH", texto: "RH registra a abertura do procedimento e define análise preliminar." }
        ]
      };
      setProcesses((prev) => [process, ...prev]);
    }

    setOccurrenceForm({
      tipo: "Atestado",
      funcionarioId: "",
      data: "",
      descricao: "",
      classificacao: "leve",
      normaViolada: "",
      geraProcesso: true,
      atestado: { diasAfastamento: 0, informouCID: false, cidNumero: "", hospital: "", crmMedico: "" },
      penalidade: { efeito: "Nenhum", diasSuspensao: 0, tokenChef: "" },
      dano: { ativo: "", serial: "", local: "", valorEstimado: "", impactoOperacional: false },
      advertencia: { classificacao: "Leve" },
      folga: { dataFolga: "", observacao: "", tokenChef: "", validada: false },
      demanda: { prioridade: "média", prazoPretendido: "", unidadeResponsavel: "" },
      outras: { titulo: "" }
    });
  }

  function addOccurrenceTimeline(id, tipo, resumo, alsoSyncProcess = false) {
    if (!resumo.trim()) return;
    appendOccurrenceEvent(id, tipo, resumo);
    if (alsoSyncProcess) {
      syncOccurrenceToLinkedProcess(id, tipo, resumo);
    }
  }


  function quickRegisterOccurrenceEvent(occurrence) {
    const type = quickEventDrafts[occurrence.id]?.type || "Movimentação";
    const text = quickEventDrafts[occurrence.id]?.text || "";
    if (!text.trim()) {
      alert("Escreva um resumo para o lançamento rápido.");
      return;
    }
    addOccurrenceTimeline(occurrence.id, type, text, true);
    const linkedProcess = processMapByOccurrence[occurrence.id];
    if (linkedProcess) {
      addProcessMovement(linkedProcess.id, type, text);
    }
    setQuickEventDrafts((prev) => ({ ...prev, [occurrence.id]: { type: "Movimentação", text: "" } }));
  }

  function concludeOccurrence(id) {
    const linkedProcess = processes.find((item) => item.occurrenceId === id && !["Encerrado", "Arquivado"].includes(item.status));
    if (linkedProcess) {
      alert("Há processo ativo vinculado a esta ocorrência. Encerre ou arquive o processo antes de concluir.");
      return;
    }
    const nextOccurrences = occurrences.map((item) =>
      item.id === id
        ? { ...item, concluida: true, status: "Concluída", timeline: [...(item.timeline || []), { id: Date.now(), data: nowBr(), tipo: "Conclusão", resumo: "Ocorrência concluída." }] }
        : item
    );
    const target = nextOccurrences.find((item) => item.id === id);
    setOccurrences(nextOccurrences);
    if (target) recalculateEmployeeStatus(target.funcionarioId, nextOccurrences);
  }

  function deleteOccurrence(id) {
    const linkedProcess = processes.find((item) => item.occurrenceId === id);
    if (linkedProcess) {
      alert("Esta ocorrência possui processo vinculado. Exclua o processo correspondente antes.");
      return;
    }
    const target = occurrences.find((item) => item.id === id);
    const nextOccurrences = occurrences.filter((item) => item.id !== id);
    setOccurrences(nextOccurrences);
    if (target) recalculateEmployeeStatus(target.funcionarioId, nextOccurrences);
  }


  function saveProcessAssignment(processId) {
    const process = processes.find((item) => item.id === processId);
    const nextTarget = processAssignmentDrafts.hasOwnProperty(processId)
      ? (processAssignmentDrafts[processId] || "")
      : (process?.assignedTo || "");

    setProcesses((prev) => prev.map((item) =>
      item.id === processId
        ? { ...item, assignedTo: nextTarget }
        : item
    ));
    setProcessAssignmentDrafts((prev) => ({ ...prev, [processId]: nextTarget }));
    addProcessMovement(processId, "Atribuição", nextTarget ? `Processo atribuído para ${nextTarget}.` : "Atribuição removida.");
    alert(nextTarget ? `Atribuição salva para ${nextTarget}.` : "Atribuição removida.");
  }

  function updateSelectedProcess(field, value) {
    if (!selectedProcess) return;
    setProcesses((prev) => prev.map((item) => item.id === selectedProcess.id ? { ...item, [field]: value } : item));
  }

  function addProcessMovement(processId, type, text, forcedId = null) {
    if (!text.trim()) return null;
    const trimmed = text.trim();
    const movementId = appendProcessMovement(processId, type, trimmed, forcedId);
    syncProcessToLinkedOccurrence(processId, type, trimmed);
    return movementId;
  }

  function computeDeadlineFromNow(hours = 0, days = 0) {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 16);
  }

  function startResponseWindow(processId, waitingType, label, hours = 0, days = 0) {
    const deadline = computeDeadlineFromNow(hours, days);
    setProcesses((prev) => prev.map((item) =>
      item.id === processId
        ? {
            ...item,
            awaitingResponse: true,
            awaitingType: waitingType,
            awaitingLabel: label,
            responseDeadline: deadline,
            blockedForProceeding: true,
            status: "Manifestação pendente"
          }
        : item
    ));
    addProcessMovement(processId, label, `Aguardando ${waitingType}. Prazo fatal: ${formatDate(deadline.slice(0,10))} às ${deadline.slice(11,16)}.`);
  }

  function startSectorDeadline(processId, sourceLabel, days) {
    const numericDays = Math.max(0, Number(days || 0));
    if (!numericDays) return;
    const deadline = computeDeadlineFromNow(0, numericDays);
    const process = processes.find((item) => item.id === processId);
    const sector = queueTargetLabel(process?.assignedTo);
    setProcesses((prev) => prev.map((item) =>
      item.id === processId
        ? {
            ...item,
            status: "Aguardando despacho",
            awaitingResponse: true,
            awaitingType: "despacho",
            awaitingLabel: `${sourceLabel} → ${sector}`,
            responseDeadline: deadline,
            blockedForProceeding: true
          }
        : item
    ));
    addProcessMovement(processId, "Prazo interno", `Prazo interno aberto para ${sector} por ${numericDays} dia(s). Prazo fatal: ${formatDate(deadline.slice(0,10))} às ${deadline.slice(11,16)}.`);
  }

  function clearResponseWindow(processId, note = "Manifestação/defesa recebida. Fluxo liberado para prosseguimento.", statusOverride = null) {
    setProcesses((prev) => prev.map((item) =>
      item.id === processId
        ? {
            ...item,
            awaitingResponse: false,
            awaitingType: "",
            awaitingLabel: "",
            responseDeadline: "",
            blockedForProceeding: false,
            status: statusOverride || (["Encerrado", "Arquivado", "Decidido"].includes(item.status) ? item.status : "Em apuração")
          }
        : item
    ));
    addProcessMovement(processId, "Recebimento", note);
  }


  function isMovementExpectedForPending(process, movementKind) {
    const waiting = String(process?.awaitingType || "").toLowerCase();
    const label = String(process?.awaitingLabel || "").toLowerCase();
    const kind = String(movementKind || "").toLowerCase();

    const isEmployeeManifestation = kind.includes("manifestação do funcionário") || kind.includes("manifestacao do funcionario");
    const isDispatch = kind.includes("despacho");

    if ((waiting.includes("defesa") || waiting.includes("manifestação") || waiting.includes("manifestacao") || label.includes("notificação") || label.includes("notificacao") || label.includes("defesa")) && isEmployeeManifestation) {
      return true;
    }

    if (waiting.includes("despacho") && isDispatch) {
      return true;
    }

    return false;
  }

  function applyWorkflowAfterMovement(processId, movementKind, isConclusive = false, internalDeadlineDays = 0) {
    const kind = String(movementKind || "").toLowerCase();

    if (kind === "notificação ao colaborador" || kind === "notificacao ao colaborador" || kind.includes("prazo de defesa") || kind === "defesa final") {
      setProcesses((prev) => prev.map((item) =>
        item.id === processId
          ? {
              ...item,
              status: "Manifestação pendente",
              awaitingResponse: true,
              awaitingType: "manifestação/defesa do colaborador",
              awaitingLabel: movementKind,
              blockedForProceeding: true
            }
          : item
      ));
      return;
    }

    if (kind === "manifestação do funcionário" || kind === "manifestacao do funcionario") {
      setProcesses((prev) => prev.map((item) =>
        item.id === processId
          ? {
              ...item,
              status: "Aguardando despacho",
              awaitingResponse: true,
              awaitingType: "despacho",
              awaitingLabel: "Manifestação do funcionário",
              responseDeadline: internalDeadlineDays > 0 ? computeDeadlineFromNow(0, internalDeadlineDays) : "",
              blockedForProceeding: internalDeadlineDays > 0
            }
          : item
      ));
      return;
    }

    if (kind.includes("despacho")) {
      setProcesses((prev) => prev.map((item) =>
        item.id === processId
          ? {
              ...item,
              status: isConclusive ? "Decidido" : "Em apuração",
              awaitingResponse: false,
              awaitingType: "",
              awaitingLabel: "",
              responseDeadline: "",
              blockedForProceeding: false
            }
          : item
      ));
    }
  }

  function canLaunchMovement(movement) {
    if (currentUser?.perfil === "Jurídico") return movement === "Despacho jurídico";
    if (currentUser?.perfil === "RH") return movement !== "Despacho jurídico";
    return true;
  }

  function addMovement() {
    if (!selectedProcess) return;
    if (!canLaunchMovement(movementType)) {
      alert("Seu perfil não possui permissão para esse tipo de movimentação.");
      return;
    }

    let finalText = movementText;
    if (movementType === "Decisão" && decisionConclusion) {
      if (!currentPermissions.canConclusiveDecision) {
        alert("Seu perfil não pode lançar decisão conclusiva.");
        return;
      }
      finalText = `${movementText.trim()}
Resultado: ${decisionResult}.`;
    }

    if ((movementType === "Despacho do RH" || movementType === "Despacho jurídico") && dispatchConclusion) {
      finalText = `${movementText.trim()}
Despacho conclusivo.`;
    }

    const createdMovementId = addProcessMovement(selectedProcess.id, movementType, finalText);
    const draftFiles = movementAttachmentDrafts[selectedProcess.id] || [];
    if (createdMovementId && draftFiles.length) {
      attachRecordsToMovement(selectedProcess.id, createdMovementId, movementType, draftFiles, finalText);
    }

    const kind = String(movementType || "").toLowerCase();
    const internalDays = Math.max(0, Number(movementDeadlineDays || 0));
    const pendingMatched = selectedProcess.awaitingResponse && isMovementExpectedForPending(selectedProcess, movementType);

    if (pendingMatched) {
      if (kind.includes("manifestação do funcionário") || kind.includes("manifestacao do funcionario")) {
        clearResponseWindow(
          selectedProcess.id,
          `${movementType} registrada. Pendência de defesa resolvida. Processo aguardando despacho.`,
          "Aguardando despacho"
        );
        applyWorkflowAfterMovement(selectedProcess.id, "Manifestação do funcionário", false, internalDays);
      } else if (kind.includes("despacho")) {
        clearResponseWindow(
          selectedProcess.id,
          `${movementType} registrada. Pendência de despacho resolvida. Fluxo liberado para prosseguimento.`,
          dispatchConclusion ? "Decidido" : "Em apuração"
        );
        applyWorkflowAfterMovement(selectedProcess.id, movementType, dispatchConclusion, internalDays);
      }
    } else {
      applyWorkflowAfterMovement(selectedProcess.id, movementType, dispatchConclusion, internalDays);
    }

    if (movementOpenSectorDeadline && internalDays > 0 && movementType !== "Notificação ao colaborador") {
      startSectorDeadline(selectedProcess.id, movementType, internalDays);
    }

    if (movementType === "Manifestação do RH" && hrConclusion) {
      clearResponseWindow(selectedProcess.id, "Manifestação conclusiva do RH registrada. Fluxo liberado.", "Decidido");
    }

    if (movementType === "Decisão" && decisionConclusion) {
      const lower = decisionResult.toLowerCase();
      if (lower === "suspensão") {
        setEmployees((prev) => prev.map((e) => e.id === selectedProcess.funcionarioId ? { ...e, status: "Suspenso" } : e));
      } else if (["sem penalidade", "advertência verbal", "advertência escrita"].includes(lower)) {
        setEmployees((prev) => prev.map((e) => {
          if (e.id !== selectedProcess.funcionarioId) return e;
          if (e.status === "Suspenso") return { ...e, status: "Ativo" };
          return e;
        }));
      }
    }

    if ((movementType === "Despacho do RH" || movementType === "Despacho jurídico") && dispatchConclusion) {
      setProcesses((prev) => prev.map((p) => p.id === selectedProcess.id ? {
        ...p,
        status: "Decidido",
        awaitingResponse: false,
        awaitingType: "",
        awaitingLabel: "",
        responseDeadline: "",
        blockedForProceeding: false
      } : p));
    }

    setMovementType("Movimentação");
    setMovementText("");
    setMovementAttachmentDrafts((prev) => ({ ...prev, [selectedProcess.id]: [] }));
    setDecisionConclusion(false);
    setDecisionResult("sem penalidade");
    setDispatchConclusion(false);
    setMovementOpenSectorDeadline(false);
    setMovementDeadlineDays("");
  }


  function archiveOccurrence(id) {
    setOccurrences((prev) => prev.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "Arquivada",
            concluida: true,
            timeline: [...(item.timeline || []), { id: Date.now(), data: nowBr(), tipo: "Arquivamento", resumo: "Ocorrência arquivada pelo usuário.", responsavel: actorLabel(currentUser) }]
          }
        : item
    ));
  }

  function unarchiveOccurrence(id) {
    setOccurrences((prev) => prev.map((item) =>
      item.id === id
        ? {
            ...item,
            status: item.geraProcesso ? "Gerou processo" : "Aberta",
            concluida: false,
            timeline: [...(item.timeline || []), { id: Date.now(), data: nowBr(), tipo: "Desarquivamento", resumo: "Ocorrência desarquivada pelo usuário.", responsavel: actorLabel(currentUser) }]
          }
        : item
    ));
  }

  function unarchiveProcess(id) {
    addProcessMovement(id, "Desarquivamento", "Processo desarquivado pelo usuário.");
    setProcesses((prev) => prev.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "Em apuração",
            blockedForProceeding: false
          }
        : item
    ));
  }

  function closeProcess(id) {
    addProcessMovement(id, "Encerramento", "Processo encerrado pelo usuário.");
    setProcesses((prev) => prev.map((item) => item.id === id ? {
      ...item,
      status: "Encerrado",
      awaitingResponse: false,
      awaitingType: "",
      awaitingLabel: "",
      responseDeadline: "",
      blockedForProceeding: true
    } : item));
  }

  function archiveProcess(id) {
    addProcessMovement(id, "Arquivamento", "Processo arquivado pelo usuário.");
    setProcesses((prev) => prev.map((item) => item.id === id ? {
      ...item,
      status: "Arquivado",
      awaitingResponse: false,
      awaitingType: "",
      awaitingLabel: "",
      responseDeadline: "",
      blockedForProceeding: true
    } : item));
  }

  function deleteProcess(id) {
    const ok = window.confirm("Excluir este processo? Essa ação removerá o vínculo processual da ocorrência.");
    if (!ok) return;
    const proc = processes.find((item) => item.id === id);
    const nextProcesses = processes.filter((item) => item.id !== id);
    setProcesses(nextProcesses);
    setSelectedProcessId(nextProcesses[0]?.id ?? null);
    setExpandedProcessIds((prev) => prev.filter((x) => x !== id));

    if (proc?.occurrenceId) {
      setOccurrences((prev) => prev.map((item) =>
        item.id === proc.occurrenceId
          ? { ...item, geraProcesso: false, status: item.concluida ? "Concluída" : "Sem processo", timeline: [...(item.timeline || []), { id: Date.now(), data: nowBr(), tipo: "Desvinculação", resumo: "Processo vinculado excluído." }] }
          : item
      ));
    }
  }

  function printOccurrenceReport(occurrence) {
    const employee = employeeMap[occurrence.funcionarioId];
    const process = processMapByOccurrence[occurrence.id];
    const html = `
      <html>
      <head>
        <title>Relatório ${occurrence.protocolo}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #222; position: relative; }
          h1, h2 { margin-bottom: 8px; }
          .block { margin-bottom: 24px; position: relative; z-index: 1; }
          .item { margin: 8px 0; }
          .timeline { border-left: 2px solid #ccc; padding-left: 16px; margin-top: 8px; }
          .event { margin-bottom: 14px; }
          small { color: #666; display: block; margin-bottom: 4px; }
          .watermark-img {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 0;
          }
          .watermark-img img {
            width: 400px;
            opacity: 0.08;
            transform: rotate(-25deg);
          }
          .watermark {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 84px;
            font-weight: 700;
            letter-spacing: 10px;
            color: rgba(24, 167, 240, 0.10);
            transform: rotate(-32deg);
            pointer-events: none;
            user-select: none;
            z-index: 0;
          }
          .watermark-sub {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 90px;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 3px;
            color: rgba(24, 167, 240, 0.08);
            transform: rotate(-32deg);
            pointer-events: none;
            user-select: none;
            z-index: 0;
          }
          @media print {
            .watermark, .watermark-sub { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="watermark-img">
          <img src="data:image/jpeg;base64,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" />
        </div>
        <div class="block">
          <h1>Relatório da ocorrência ${occurrence.protocolo}</h1>
          <div class="item"><strong>Funcionário:</strong> ${employee?.nome || "-"}</div>
          <div class="item"><strong>Tipo:</strong> ${occurrence.tipo}</div>
          <div class="item"><strong>Data:</strong> ${formatDate(occurrence.data)}</div>
          <div class="item"><strong>Status:</strong> ${occurrence.status}</div>
          <div class="item"><strong>Descrição:</strong> ${occurrence.descricao}</div>
        </div>
        <div class="block">
          <h2>Linha do tempo da ocorrência</h2>
          <div class="timeline">
            ${(occurrence.timeline || []).map((step) => `<div class="event"><small>${step.data} • ${step.tipo}</small><div>${step.resumo}</div></div>`).join("")}
          </div>
        </div>
        ${
          process ? `
          <div class="block">
            <h2>Processo vinculado ${process.numero}</h2>
            <div class="item"><strong>Ocorrência vinculada:</strong> ${process.occurrenceNumber || "-"}</div>
            <div class="item"><strong>Assunto:</strong> ${process.assunto}</div>
            <div class="item"><strong>Status:</strong> ${process.status}</div>
            <div class="timeline">
              ${(process.movimentacoes || []).map((mv) => `<div class="event"><small>${mv.data} • ${mv.tipo}</small><div>${mv.texto}</div></div>`).join("")}
            </div>
          </div>` : ""
        }
        <script>window.onload = () => window.print();</script>
      </body></html>
    `;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }


  function getAttachments(scope, parentId) {
    return attachments.filter((item) => item.scope === scope && String(item.parentId) === String(parentId));
  }

  function handleUploadAttachment(scope, parentId, file, contextLabel = "", meta = {}) {
    if (!file) return;
    if (file.size > 1_500_000) {
      alert("Arquivo muito grande para esta versão. Use até 1,5 MB por documento.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const record = {
        id: Date.now(),
        scope,
        parentId,
        movementId: meta.movementId || null,
        movementType: meta.movementType || "",
        movementText: meta.movementText || "",
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result,
        createdAt: nowBr()
      };
      setAttachments((prev) => [record, ...prev]);
      if (scope === "occurrence") {
        addOccurrenceTimeline(parentId, "Documento anexado", `${contextLabel || "Documento"}: ${file.name}`, true);
      }
      if (scope === "process" && !meta.movementId) {
        addProcessMovement(parentId, "Documento anexado", `${contextLabel || "Documento"}: ${file.name}`);
        const proc = processes.find((item) => item.id === parentId);
        if (proc?.awaitingResponse) {
          if (String(proc.awaitingType || "").toLowerCase().includes("despacho")) {
            clearResponseWindow(parentId, `Documento recebido em atendimento à pendência: ${file.name}. Pendência de despacho resolvida.`, "Em apuração");
          } else {
            clearResponseWindow(parentId, `Documento recebido em atendimento à pendência: ${file.name}. Pendência de defesa resolvida. Processo aguardando despacho.`, "Aguardando despacho");
            applyWorkflowAfterMovement(parentId, "Manifestação do funcionário");
          }
        }
      }
      if (scope === "termination") {
        const related = terminations.find((item) => item.id === parentId);
        if (related?.processId) {
          addProcessMovement(related.processId, "Documento anexado", `${contextLabel || "Documento"}: ${file.name}`);
        }
      }
    };
    reader.readAsDataURL(file);
  }

  function removeAttachment(id) {
    const ok = window.confirm("Excluir este documento?");
    if (!ok) return;
    setAttachments((prev) => prev.filter((item) => item.id !== id));
    if (previewAttachment?.id === id) setPreviewAttachment(null);
  }

  function downloadAttachment(item) {
    const a = document.createElement("a");
    a.href = item.dataUrl;
    a.download = item.name;
    a.click();
  }

  function currentJustCauseHelp() {
    return JUST_CAUSE_OPTIONS.find((item) => item.key === terminationForm.hipotese)?.help || "";
  }

  function handleTerminationSubmit(event) {
    event.preventDefault();
    const employeeId = Number(terminationForm.funcionarioId);
    const employee = employeeMap[employeeId];
    if (!employee) {
      alert("Selecione um funcionário.");
      return;
    }

    if (terminationForm.tipo === "justa_causa" && !requireValidToken(terminationToken, "Dispensa por justa causa exige token da chefia.")) {
      return;
    }

    const record = {
      id: Date.now(),
      funcionarioId: employeeId,
      funcionarioNome: employee.nome,
      tipo: terminationForm.tipo,
      data: terminationForm.data,
      motivo: terminationForm.motivo,
      avisoPrevio: terminationForm.avisoPrevio,
      occurrenceRef: terminationForm.occurrenceRef,
      processRef: terminationForm.processRef,
      hipotese: terminationForm.tipo === "justa_causa" ? terminationForm.hipotese : "",
      sintese: terminationForm.sintese,
      normaViolada: terminationForm.normaViolada,
      status: terminationForm.tipo === "justa_causa" ? "Em apuração" : "Concluído",
      responsavelRegistro: actorLabel(currentUser),
      processId: null
    };

    if (terminationForm.tipo === "justa_causa") {
      const occurrenceId = Date.now() + 101;
      const occurrenceNumber = `OC-${new Date().getFullYear()}-${String(occurrences.length + 1).padStart(3, "0")}`;
      const processId = Date.now() + 202;
      const processNumber = occurrenceNumber.replace("OC-", "PROC-");
      const hypothesis = JUST_CAUSE_OPTIONS.find((item) => item.key === terminationForm.hipotese);

      const occurrence = {
        id: occurrenceId,
        protocolo: occurrenceNumber,
        tipo: "Desligamento / Justa causa",
        funcionarioId: employeeId,
        data: terminationForm.data,
        descricao: terminationForm.motivo || "Autuação de processo de desligamento por justa causa.",
        classificacao: "gravíssima",
        normaViolada: terminationForm.normaViolada,
        status: "Gerou processo",
        geraProcesso: true,
        concluida: false,
        atestado: null,
        penalidade: null,
        dano: null,
        advertencia: null,
        folga: null,
        demanda: null,
        outras: { titulo: "Desligamento por justa causa" },
        timeline: [
          { id: 1, data: nowBr(), tipo: "Abertura", resumo: "Ocorrência autuada para apuração de desligamento por justa causa." },
          { id: 2, data: nowBr(), tipo: "Hipótese legal", resumo: `${hypothesis?.label || "-"} — ${hypothesis?.help || ""}` }
        ]
      };

      const process = {
        id: processId,
        numero: processNumber,
        occurrenceId,
        occurrenceNumber,
        funcionarioId: employeeId,
        assunto: `Desligamento por justa causa - ${employee.nome}`,
        prazo: terminationForm.data,
        status: "Em apuração",
        awaitingResponse: false,
        awaitingType: "",
        awaitingLabel: "",
        responseDeadline: "",
        blockedForProceeding: false,
        sigiloso: true,
        classificacao: "gravíssima",
        normaViolada: terminationForm.normaViolada,
        movimentacoes: [
          {
            id: 1,
            data: nowBr(),
            tipo: "Abertura",
            texto: `Processo autuado para desligamento por justa causa. Hipótese selecionada: ${hypothesis?.label || "-"}`
          },
          {
            id: 2,
            data: nowBr(),
            tipo: "Resumo legal",
            texto: hypothesis?.help || ""
          },
          {
            id: 3,
            data: nowBr(),
            tipo: "Síntese inicial",
            texto: terminationForm.sintese || terminationForm.motivo || "Sem síntese complementar."
          }
        ]
      };

      record.processId = processId;
      setOccurrences((prev) => [occurrence, ...prev]);
      setProcesses((prev) => [process, ...prev]);
      setExpandedProcessIds((prev) => [processId, ...prev]);
      setSelectedProcessId(processId);
      setActivePage("Processos Internos");
    } else {
      setEmployees((prev) => prev.map((item) => item.id === employeeId ? { ...item, status: "Demitido" } : item));
    }

    setTerminations((prev) => [record, ...prev]);
    setTerminationForm({
      funcionarioId: "",
      tipo: "dispensa_ordinaria",
      data: "",
      motivo: "",
      avisoPrevio: "indenizado",
      occurrenceRef: "",
      processRef: "",
      hipotese: JUST_CAUSE_OPTIONS[0].key,
      sintese: "",
      normaViolada: ""
    });
    setTerminationToken("");
  }

  function renderAttachmentBlock(scope, parentId, title, contextLabel = "") {
    const docs = getAttachments(scope, parentId);
    return (
      <DetailSection
        title={title}
        subtitle="Anexe PDF ou imagem, visualize e faça download."
        action={
          <label className="upload-btn">
            Anexar
            <input
              type="file"
              accept={DOCUMENT_ACCEPT}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadAttachment(scope, parentId, file, contextLabel);
                e.target.value = "";
              }}
            />
          </label>
        }
      >
        {docs.length === 0 ? (
          <div className="muted-box">Nenhum documento anexado.</div>
        ) : (
          <div className="list compact-list">
            {docs.map((doc) => (
              <div className="list-item" key={doc.id}>
                <div>
                  <strong>{doc.name}</strong>
                  <p>{doc.type || "arquivo"} · {doc.createdAt}</p>
                </div>
                <div className="inline-actions">
                  <button className="btn secondary mini" onClick={() => setPreviewAttachment(doc)}>Visualizar</button>
                  <button className="btn secondary mini" onClick={() => downloadAttachment(doc)}>Baixar</button>
                  <button className="btn ghost mini" onClick={() => removeAttachment(doc.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DetailSection>
    );
  }

  function renderProcessAttachmentBlock(process) {
    const docs = getAttachments("process", process.id);
    const looseDocs = docs.filter((doc) => !doc.movementId);
    const linkDraft = attachmentLinkDrafts[process.id] || "";

    return (
      <DetailSection
        title="Anexos do processo"
        subtitle="Anexe documentos soltos ao processo e, se necessário, vincule depois a uma movimentação."
        action={
          <label className="upload-btn">
            Anexar ao processo
            <input
              type="file"
              accept={DOCUMENT_ACCEPT}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadAttachment("process", process.id, file, "Documento do processo");
                e.target.value = "";
              }}
            />
          </label>
        }
      >
        <div className="detail-grid">
          <div className="full">
            <label>Movimentação para vinculação posterior</label>
            <select value={linkDraft} onChange={(e) => setAttachmentLinkDrafts((prev) => ({ ...prev, [process.id]: e.target.value }))}>
              <option value="">Selecione uma movimentação</option>
              {(process.movimentacoes || []).map((mv) => (
                <option key={mv.id} value={mv.id}>{mv.tipo} · {mv.data}</option>
              ))}
            </select>
          </div>
        </div>

        {looseDocs.length === 0 ? (
          <div className="muted-box">Nenhum anexo solto do processo.</div>
        ) : (
          <div className="list compact-list">
            {looseDocs.map((doc) => (
              <div className="list-item vertical" key={doc.id}>
                <div className="process-top">
                  <div>
                    <strong>{doc.name}</strong>
                    <p>{doc.type || "arquivo"} · {doc.createdAt}</p>
                    <small>Anexo geral do processo</small>
                  </div>
                  <div className="inline-actions">
                    <button className="btn secondary mini" onClick={() => setPreviewAttachment(doc)}>Visualizar</button>
                    <button className="btn secondary mini" onClick={() => downloadAttachment(doc)}>Baixar</button>
                    <button className="btn ghost mini" onClick={() => removeAttachment(doc.id)}>Excluir</button>
                  </div>
                </div>
                <div className="row-actions" style={{ marginTop: 8 }}>
                  <button className="btn secondary mini" onClick={() => linkAttachmentToMovement(doc.id, process.id, linkDraft)}>
                    Vincular ao movimento selecionado
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DetailSection>
    );
  }

  function resetDemoData() {
    [
      STORAGE_KEYS.employees,
      STORAGE_KEYS.occurrences,
      STORAGE_KEYS.processes,
      STORAGE_KEYS.attachments,
      STORAGE_KEYS.terminations,
      STORAGE_KEYS.users,
      STORAGE_KEYS.session,
      `${BRANDING.storagePrefix}_user`,
      `${BRANDING.storagePrefix}_auth_user`
    ].forEach((key) => localStorage.removeItem(key));

    setUsers(structuredClone(DEMO_STATE.users || []));
    setEmployees(structuredClone(DEMO_STATE.employees || []));
    setOccurrences(structuredClone(DEMO_STATE.occurrences || []));
    setProcesses(structuredClone(DEMO_STATE.processes || []));
    setAttachments(structuredClone(DEMO_STATE.attachments || []));
    setTerminations(structuredClone(DEMO_STATE.terminations || []));
    setSelectedProcessId(null);
    setExpandedProcessIds([]);
    setActivePage("Dashboard");
    setCurrentUser(null);
    setSession(null);
    window.location.reload();
  }



async function fetchBootstrap() {
  const res = await fetch(`${API_BASE}/bootstrap`);
  if (!res.ok) throw new Error("Não foi possível carregar a base central.");
  const payload = await res.json();
  skipNextSyncRef.current = true;
  const remoteUsers = ensureArray(payload.users, defaultUsers);
  setUsers(remoteUsers);
  if (session?.user?.usuario) {
    const refreshedAuth = remoteUsers.find((item) => item.usuario === session.user.usuario);
    if (refreshedAuth) {
      const safeAuth = { ...refreshedAuth };
      delete safeAuth.senha;
      setAuthUser(safeAuth);
      setSession((prev) => prev ? { ...prev, user: safeAuth } : prev);
    }
  }
  setEmployees(ensureArray(payload.employees, []));
  setOccurrences(ensureArray(payload.occurrences, []));
  setProcesses(ensureArray(payload.processes, []));
  setAttachments(ensureArray(payload.attachments, []));
  setTerminations(ensureArray(payload.terminations, []));
  setBackendRevision(payload.revision || 1);
  setBackendUpdatedAt(payload.updatedAt || "");
  setRemoteReady(true);
  setSyncNotice("Base central carregada com sucesso.");
}

async function pushSnapshot() {
  if (!session?.user || !remoteReady) return;
  const res = await fetch(`${API_BASE}/snapshot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      users: safeUsers,
      employees,
      occurrences,
      processes,
      attachments,
      terminations,
      expectedRevision: backendRevision
    })
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || "Falha ao sincronizar a base central.");
  }
  setBackendRevision(payload.revision || backendRevision);
  setBackendUpdatedAt(payload.updatedAt || backendUpdatedAt);
  setSyncNotice("Alterações sincronizadas com a base central.");
}

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        setLoginError(payload.message || "Usuário ou senha inválidos.");
        return;
      }
      setSession({ user: payload.user, userId: payload.user.id, loginAt: nowBr() });
      setAuthUser(payload.user);
      setLoginError("");
      setLoginForm({ usuario: "", senha: "" });
      setRemoteReady(false);
      setSyncNotice("Autenticação realizada. Carregando base central...");
    } catch (error) {
      setLoginError(error?.message || "Falha ao autenticar no servidor.");
    }
  }

  function handleLogout() {
    setSession(null);
    setAuthUser(null);
    setSelectedProcessId(null);
    setExpandedProcessIds([]);
    setLoginError("");
    setRemoteReady(false);
    setSyncNotice("");
    clearTimeout(syncTimeoutRef.current);
    clearInterval(pollIntervalRef.current);
  }

  
  function getOccurrenceByProcess(process) {
    return occurrences.find((item) => item.id === process.occurrenceId);
  }

  function generateStandardDocumentText(process, docType) {
    const occurrence = getOccurrenceByProcess(process);
    const employee = employeeMap[process.funcionarioId] || {};
    const dataOcorrencia = occurrence?.data ? formatDate(occurrence.data) : "-";
    const descricaoOcorrencia = occurrence?.descricao || "fato descrito no processo";
    const numeroProcesso = process.numero || "-";
    const nomeFuncionario = employee.nome || "colaborador";
    const norma = process.normaViolada || occurrence?.normaViolada || "normas internas da empresa";

    const templates = {
      advertencia: `ADVERTÊNCIA\n\nFica V.Sª advertida por, no dia ${dataOcorrencia}, ter ${descricaoOcorrencia}, conduta esta apurada no âmbito do processo interno nº ${numeroProcesso}.\n\nRessalta-se que a reiteração de condutas semelhantes poderá ensejar a aplicação de medidas disciplinares mais gravosas, nos termos de ${norma}.`,
      notificacao: `NOTIFICAÇÃO AO COLABORADOR\n\nFica o(a) colaborador(a) ${nomeFuncionario} notificado(a) de que foi instaurado o processo interno nº ${numeroProcesso}, relacionado ao fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}.\n\nFica facultada a apresentação de manifestação no prazo assinalado pela empresa.`,
      defesa_inicial: `ABERTURA DE PRAZO PARA DEFESA INICIAL\n\nNo âmbito do processo interno nº ${numeroProcesso}, fica consignada a abertura de prazo para apresentação de defesa inicial, em razão do fato registrado em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}.`,
      defesa_final: `ABERTURA DE PRAZO PARA DEFESA FINAL\n\nNo âmbito do processo interno nº ${numeroProcesso}, fica consignada a abertura de prazo para apresentação de defesa final, considerando a instrução já realizada acerca do fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}.`,
      despacho: `DESPACHO\n\nConsiderando o processo interno nº ${numeroProcesso}, relativo ao fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}, determino o regular prosseguimento do feito, com observância de ${norma}.`,
      decisao: `DECISÃO\n\nVistos.\n\nTrata-se do processo interno nº ${numeroProcesso}, instaurado em razão do fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}.\n\nApós análise dos elementos constantes dos autos, profere-se a presente decisão, nos termos de ${norma}.`,
      relatorio: `RELATÓRIO FINAL\n\nNo processo interno nº ${numeroProcesso}, referente ao fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}, registra-se a consolidação da instrução e das manifestações apresentadas, para fins de deliberação final.`,
      manifestacao_rh: `MANIFESTAÇÃO DO RH\n\nO setor de RH, no âmbito do processo interno nº ${numeroProcesso}, manifesta-se acerca do fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}, para fins de regular prosseguimento e deliberação.`,
      manifestacao_funcionario: `MANIFESTAÇÃO DO COLABORADOR\n\nNo âmbito do processo interno nº ${numeroProcesso}, fica registrado o recebimento da manifestação do(a) colaborador(a) ${nomeFuncionario}, acerca do fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}.`,
      suspensao: `COMUNICAÇÃO DE SUSPENSÃO\n\nFica V.Sª cientificada de que, em razão do fato ocorrido em ${dataOcorrencia}, consistente em ${descricaoOcorrencia}, apurado no processo interno nº ${numeroProcesso}, foi aplicada a penalidade de suspensão, nos termos de ${norma}.`
    };

    return templates[docType] || templates.decisao;
  }

  function standardDocumentOptions(process) {
    const opts = [
      { key: "notificacao", label: "Gerar notificação" },
      { key: "defesa_inicial", label: "Gerar abertura de defesa inicial" },
      { key: "defesa_final", label: "Gerar abertura de defesa final" },
      { key: "despacho", label: "Gerar despacho" },
      { key: "manifestacao_rh", label: "Gerar manifestação do RH" },
      { key: "manifestacao_funcionario", label: "Gerar registro de manifestação do colaborador" },
      { key: "relatorio", label: "Gerar relatório final" },
      { key: "decisao", label: "Gerar decisão" },
      { key: "advertencia", label: "Gerar advertência" }
    ];
    if ((process.movimentacoes || []).some((m) => String(m.texto || "").toLowerCase().includes("suspensão") || String(m.texto || "").toLowerCase().includes("suspensao"))) {
      opts.push({ key: "suspensao", label: "Gerar comunicação de suspensão" });
    }
    return opts;
  }

  function generateStandardDocument(process, docType) {
    const text = generateStandardDocumentText(process, docType);
    const win = window.open("", "_blank");
    if (!win) return;
    const titleMap = {
      advertencia: "Advertência",
      notificacao: "Notificação ao colaborador",
      defesa_inicial: "Abertura de defesa inicial",
      defesa_final: "Abertura de defesa final",
      despacho: "Despacho",
      decisao: "Decisão",
      relatorio: "Relatório final",
      manifestacao_rh: "Manifestação do RH",
      manifestacao_funcionario: "Manifestação do colaborador",
      suspensao: "Comunicação de suspensão"
    };
    const safe = text.replace(/\n/g, "<br />");
    win.document.write(`
      <html>
      <head>
        <title>${titleMap[docType] || "Documento"} - ${process.numero}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #222; position: relative; }
          .watermark-img {
            position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
            pointer-events: none; z-index: 0;
          }
          .watermark-img img { width: 400px; opacity: 0.08; transform: rotate(-25deg); }
          .content { position: relative; z-index: 1; }
          h1 { margin: 0 0 18px; font-size: 22px; }
          .meta { color: #666; margin-bottom: 18px; }
          .text { line-height: 1.6; font-size: 14px; }
          @media print { .watermark-img img { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="watermark-img"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAkLCgkLDhgQDg0NDh0VFhEYIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDg0OGxAQGy0lICUvLy8vLy0vLS8vLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS8vLy8vLy8vLy8vLy8vL//AABEIAWgB4AMBIgACEQEDEQH/xAAbAAADAQEBAQEAAAAAAAAAAAAABQYDBAcCAf/EAEAQAAIBAgQDBgQEBQQCAwAAAAECEQADBBIhMQVBUQYiYXGBEzKRobEHQlKxwdHhI1OS8QcWQ2NzgpPh/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAJxEAAgICAgICAgMBAAAAAAAAAAECEQMhEjEEQVEiMmETMnH/2gAMAwEAAhEDEQA/AO4REQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREDnUe0rXJq8Xq1k7dM0gQxkqP3cxZQ5k8wQfM5B1rQ8m9t2kqJZzV7sJ0B9ypz5E7j8q5VqXn8m7n4V8aG2lS0a9vQwqgNQYk7k4GfWvJ7q9o1U4z8l0mJpP5Y0n8h9h9K8F5cZ2dG7H1rWm9j0PZx6q4X7Xg4u1mW2zvQw2lX2n1a0s+2rWmYw2q7Gm3u3uK6rS3o1e6o6w2x2c1x7m0Yq6uB6b1xS0m8rQ8g8a1wVZf1kzv1zj3N3nS7n0a9m+g2x7i5v8A8r1m1k2o6kS5j0c6g8v6jW9fX0l4r5Q0d3q3c1m0Hq5X3p8Y5j1b2uT9C7d3vD2m3w9kQk0gqAAnQmJ1H6V5m3s7QvH4o4p4d4l3d2XWl4r9Q2W5m1rY5q3t9qv1LJm5b3M6m0Yk3FQxOQfQ1Xj8oV9m0vY3zH8b7rV0a3s2T4i2cV0q7k2mVwq6j1dG4fSvlx8p7S7m1i1sY7XfE2nU6w0sYbQm1xZQq7kJdDk6HkR+VdN7Qm1m3r0b8N3V3X9m3g9m2bq3t1rJYz6e3F4mQ0q1QqkqgA6nQ+VfK3m7fG2b7m7v8A4b3r1b2w7m9m1v2M3u2VbYbW2m0j3b3jX2vU1Yq0kQqgAABJ0B9K6P8A0m2q9n6V9G7vUu2u3m9n3f8AZ8X2t+3u+3m9X4J4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p//Z" /></div>
        <div class="content">
          <h1>${titleMap[docType] || "Documento"}</h1>
          <div class="meta">Processo nº ${process.numero}</div>
          <div class="text">${safe}</div>
          <script>window.onload = () => window.print();</script>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  }


  
function handleCreateUser(event) {
    event.preventDefault();
    if (currentUser?.perfil !== "Administrador") {
      alert("Apenas o administrador pode criar usuários.");
      return;
    }
    const nome = String(userForm.nome || "").trim();
    const usuario = String(userForm.usuario || "").trim();
    const senha = String(userForm.senha || "").trim();
    if (!nome || !usuario || !senha) {
      alert("Preencha nome, usuário e senha.");
      return;
    }
    if (safeUsers.some((item) => String(item.usuario || "").toLowerCase() === usuario.toLowerCase())) {
      alert("Já existe um usuário com esse login.");
      return;
    }
    const novo = {
      id: Date.now(),
      nome,
      usuario,
      perfil: userForm.perfil || "Gestor",
      senha,
      ativo: !!userForm.ativo,
      mustChangePassword: true,
      permissions: getProfilePermissions(userForm.perfil || "Gestor")
    };
    setUsers((prev) => [...ensureArray(prev, defaultUsers), novo]);
    setUserForm({ nome: "", usuario: "", perfil: "Gestor", senha: "", ativo: true });
    setShowUserPassword(false);
    setSyncNotice("Usuário criado. No primeiro acesso, a senha deverá ser alterada.");
  }


  function deleteUser(id) {
    if (currentUser?.perfil !== "Administrador") {
      alert("Apenas o administrador pode excluir usuários.");
      return;
    }
    if (id === currentUser?.id) {
      alert("O usuário logado não pode excluir a si mesmo.");
      return;
    }
    if (!window.confirm("Deseja excluir este usuário?")) return;
    setUsers((prev) => ensureArray(prev, defaultUsers).filter((item) => item.id !== id));
    setSyncNotice("Usuário excluído. Sincronizando com a base central...");
  }

  function toggleUserActive(id) {
    if (currentUser?.perfil !== "Administrador") {
      alert("Apenas o administrador pode alterar usuários.");
      return;
    }
    setUsers((prev) => ensureArray(prev, defaultUsers).map((item) => item.id === id ? { ...item, ativo: !item.ativo } : item));
  }

  function updateUserAccess(id, patch) {
    if (currentUser?.perfil !== "Administrador") {
      alert("Apenas o administrador pode editar permissões.");
      return;
    }
    setUsers((prev) => ensureArray(prev, defaultUsers).map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, ...patch };
      if (patch.perfil) {
        next.permissions = { ...getProfilePermissions(patch.perfil), ...(item.permissions || {}) };
      }
      return next;
    }));
  }

  function updateUserPermission(id, key, value) {
    if (currentUser?.perfil !== "Administrador") {
      alert("Apenas o administrador pode editar permissões.");
      return;
    }
    setUsers((prev) => ensureArray(prev, defaultUsers).map((item) => item.id === id ? {
      ...item,
      permissions: { ...getUserPermissions(item), [key]: value }
    } : item));
  }

  function handleFirstPasswordChange(event) {
    event.preventDefault();
    const senha = String(passwordChangeForm.senha || "").trim();
    const confirmar = String(passwordChangeForm.confirmar || "").trim();
    if (!senha || senha.length < 4) {
      alert("Informe uma nova senha válida.");
      return;
    }
    if (senha !== confirmar) {
      alert("A confirmação da senha não confere.");
      return;
    }
    setUsers((prev) => ensureArray(prev, defaultUsers).map((item) => {
      if (item.id !== currentUser?.id) return item;
      return { ...item, senha, mustChangePassword: false };
    }));
    const nextUser = { ...currentUser, mustChangePassword: false };
    setAuthUser(nextUser);
    setSession((prev) => prev ? { ...prev, user: nextUser } : prev);
    setPasswordChangeForm({ senha: "", confirmar: "" });
    setSyncNotice("Senha alterada com sucesso.");
  }

  



function getDocumentTitle(docType) {
    const titleMap = {
      advertencia: "Advertência",
      notificacao: "Notificação ao colaborador",
      defesa_inicial: "Abertura de defesa inicial",
      defesa_final: "Abertura de defesa final",
      despacho: "Despacho",
      decisao: "Decisão",
      relatorio: "Relatório final",
      manifestacao_rh: "Manifestação do RH",
      manifestacao_funcionario: "Manifestação do colaborador",
      suspensao: "Comunicação de suspensão"
    };
    return titleMap[docType] || "Documento";
  }

  function openStandardDocumentEditor(process, docType) {
    const text = generateStandardDocumentText(process, docType);
    setDocumentDraft({
      processId: process.id,
      processNumber: process.numero,
      docType,
      title: getDocumentTitle(docType),
      originalText: text,
      text
    });
  }

  function printDocumentDraft() {
    if (!documentDraft) return;
    const text = String(documentDraft.text || "").trim();
    if (!text) {
      alert("Digite ou mantenha um texto para gerar o documento.");
      return;
    }
    const win = window.open("", "_blank");
    if (!win) return;
    const safe = text.replace(/\n/g, "<br />");
    win.document.write(`
      <html>
      <head>
        <title>${documentDraft.title} - ${documentDraft.processNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #222; position: relative; }
          .watermark-img { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 0; }
          .watermark-img img { width: 400px; opacity: 0.08; transform: rotate(-25deg); }
          .content { position: relative; z-index: 1; }
          h1 { margin: 0 0 18px; font-size: 22px; }
          .meta { color: #666; margin-bottom: 18px; }
          .text { line-height: 1.6; font-size: 14px; }
          @media print { .watermark-img img { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="watermark-img"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAkLCgkLDhgQDg0NDh0VFhEYIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDg0OGxAQGy0lICUvLy8vLy0vLS8vLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS8vLy8vLy8vLy8vLy8vL//AABEIAWgB4AMBIgACEQEDEQH/xAAbAAADAQEBAQEAAAAAAAAAAAAABQYDBAcCAf/EAEAQAAIBAgQDBgQEBQQCAwAAAAECEQADBBIhMQVBUQYiYXGBEzKRobEHQlKxwdHhI1OS8QcWQ2NzgpPh/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAJxEAAgICAgICAgMBAAAAAAAAAAECEQMhEjEEQVEiMmETMnH/2gAMAwEAAhEDEQA/AO4REQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREDnUe0rXJq8Xq1k7dM0gQxkqP3cxZQ5k8wQfM5B1rQ8m9t2kqJZzV7sJ0B9ypz5E7j8q5VqXn8m7n4V8aG2lS0a9vQwqgNQYk7k4GfWvJ7q9o1U4z8l0mJpP5Y0n8h9h9K8F5cZ2dG7H1rWm9j0PZx6q4X7Xg4u1mW2zvQw2lX2n1a0s+2rWmYw2q7Gm3u3uK6rS3o1e6o6w2x2c1x7m0Yq6uB6b1xS0m8rQ8g8a1wVZf1kzv1zj3N3nS7n0a9m+g2x7i5v8A8r1m1k2o6kS5j0c6g8v6jW9fX0l4r5Q0d3q3c1m0Hq5X3p8Y5j1b2uT9C7d3vD2m3w9kQk0gqAAnQmJ1H6V5m3s7QvH4o4p4d4l3d2XWl4r9Q2W5m1rY5q3t9qv1LJm5b3M6m0Yk3FQxOQfQ1Xj8oV9m0vY3zH8b7rV0a3s2T4i2cV0q7k2mVwq6j1dG4fSvlx8p7S7m1i1sY7XfE2nU6w0sYbQm1xZQq7kJdDk6HkR+VdN7Qm1m3r0b8N3V3X9m3g9m2bq3t1rJYz6e3F4mQ0q1QqkqgA6nQ+VfK3m7fG2b7m7v8A4b3r1b2w7m9m1v2M3u2VbYbW2m0j3b3jX2vU1Yq0kQqgAABJ0B9K6P8A0m2q9n6V9G7vUu2u3m9n3f8AZ8X2t+3u+3m9X4J4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p4p//Z" /></div>
        <div class="content">
          <h1>${documentDraft.title}</h1>
          <div class="meta">Processo nº ${documentDraft.processNumber}</div>
          <div class="text">${safe}</div>
          <script>window.onload = () => window.print();</script>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  }

function renderOccurrenceSpecificFields() {
    if (occurrenceForm.tipo === "Atestado") {
      return (
        <>
          <input type="number" min="0" placeholder="Dias de afastamento" value={occurrenceForm.atestado.diasAfastamento} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, atestado: { ...occurrenceForm.atestado, diasAfastamento: e.target.value } })} />
          <label className="checkbox simple-box">
            <input type="checkbox" checked={occurrenceForm.atestado.informouCID} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, atestado: { ...occurrenceForm.atestado, informouCID: e.target.checked, cidNumero: e.target.checked ? occurrenceForm.atestado.cidNumero : "" } })} />
            Funcionário informou CID
          </label>
          {occurrenceForm.atestado.informouCID ? (
            <input placeholder="Número do CID" value={occurrenceForm.atestado.cidNumero} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, atestado: { ...occurrenceForm.atestado, cidNumero: e.target.value } })} />
          ) : (
            <div className="simple-box muted-box">Marque “Funcionário informou CID” para habilitar o campo do número.</div>
          )}
          <input placeholder="Nome do hospital" value={occurrenceForm.atestado.hospital} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, atestado: { ...occurrenceForm.atestado, hospital: e.target.value } })} />
          <input placeholder="CRM do médico" value={occurrenceForm.atestado.crmMedico} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, atestado: { ...occurrenceForm.atestado, crmMedico: e.target.value } })} />
        </>
      );
    }
    if (occurrenceForm.tipo === "Penalidade") {
      return (
        <>
          <select value={occurrenceForm.penalidade.efeito} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, penalidade: { ...occurrenceForm.penalidade, efeito: e.target.value } })}>
            <option>Nenhum</option>
            <option>Suspensão</option>
            <option>Advertência formal</option>
            <option>Outra medida</option>
          </select>
          <input type="number" min="0" placeholder="Dias de suspensão" value={occurrenceForm.penalidade.diasSuspensao} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, penalidade: { ...occurrenceForm.penalidade, diasSuspensao: e.target.value } })} />
          <input type="password" placeholder="Token da chefia" value={occurrenceForm.penalidade.tokenChef || ""} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, penalidade: { ...occurrenceForm.penalidade, tokenChef: e.target.value } })} />
        </>
      );
    }
    if (occurrenceForm.tipo === "Dano") {
      return (
        <>
          <input placeholder="Ativo / equipamento afetado" value={occurrenceForm.dano.ativo} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, dano: { ...occurrenceForm.dano, ativo: e.target.value } })} />
          <input placeholder="Patrimônio / serial" value={occurrenceForm.dano.serial} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, dano: { ...occurrenceForm.dano, serial: e.target.value } })} />
          <input placeholder="Local do fato" value={occurrenceForm.dano.local} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, dano: { ...occurrenceForm.dano, local: e.target.value } })} />
          <input placeholder="Valor estimado do dano" value={occurrenceForm.dano.valorEstimado} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, dano: { ...occurrenceForm.dano, valorEstimado: e.target.value } })} />
          <label className="checkbox simple-box full">
            <input type="checkbox" checked={occurrenceForm.dano.impactoOperacional} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, dano: { ...occurrenceForm.dano, impactoOperacional: e.target.checked } })} />
            Houve impacto operacional / cliente
          </label>
        </>
      );
    }
    if (occurrenceForm.tipo === "Advertência") {
      return (
        <>
          <select value={occurrenceForm.advertencia.classificacao} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, advertencia: { ...occurrenceForm.advertencia, classificacao: e.target.value } })}>
            <option>Leve</option>
            <option>Média</option>
            <option>Grave</option>
          </select>
          <div className="simple-box muted-box">Classificação útil para recorrência disciplinar interna.</div>
        </>
      );
    }

    if (occurrenceForm.tipo === "Folga meritória") {
      return (
        <>
          <input type="date" value={occurrenceForm.folga.dataFolga} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, folga: { ...occurrenceForm.folga, dataFolga: e.target.value } })} />
          <input placeholder="Observação da folga" value={occurrenceForm.folga.observacao} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, folga: { ...occurrenceForm.folga, observacao: e.target.value } })} />
          <input type="password" placeholder="Token da chefia" value={occurrenceForm.folga.tokenChef} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, folga: { ...occurrenceForm.folga, tokenChef: e.target.value, validada: validateManagerToken(e.target.value) } })} />
          <div className="simple-box muted-box full">
            A folga meritória fica registrada como afastamento programado. A validação depende do token informado pela chefia.
          </div>
        </>
      );
    }

    if (occurrenceForm.tipo === "Demanda interna") {
      return (
        <>
          <select value={occurrenceForm.demanda.prioridade} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, demanda: { ...occurrenceForm.demanda, prioridade: e.target.value } })}>
            <option value="baixa">baixa</option>
            <option value="média">média</option>
            <option value="alta">alta</option>
          </select>
          <input type="date" value={occurrenceForm.demanda.prazoPretendido} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, demanda: { ...occurrenceForm.demanda, prazoPretendido: e.target.value } })} />
          <input placeholder="Unidade responsável" value={occurrenceForm.demanda.unidadeResponsavel} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, demanda: { ...occurrenceForm.demanda, unidadeResponsavel: e.target.value } })} />
        </>
      );
    }
    if (occurrenceForm.tipo === "Outras ocorrências") {
      return (
        <>
          <input placeholder="Título resumido da ocorrência" value={occurrenceForm.outras.titulo} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, outras: { ...occurrenceForm.outras, titulo: e.target.value } })} />
          <div className="simple-box muted-box">Use esta opção para fatos não previstos nas categorias padronizadas.</div>
        </>
      );
    }
    return null;
  }

  


  


  


  




  function calculateTerminationEstimate(employee, tipo, dataSaida, avisoPrevio) {
    const salario = Number(employee?.salario || 0);
    if (!salario || !dataSaida) return null;
    const admissao = parseDate(employee?.admissao);
    const saida = parseDate(dataSaida);
    if (!saida) return null;

    const meses = admissao ? Math.max(1, (saida.getFullYear() - admissao.getFullYear()) * 12 + (saida.getMonth() - admissao.getMonth()) + 1) : 1;
    const diaSaida = saida.getDate();
    const saldoSalario = (Math.min(30, diaSaida) / 30) * salario;
    const decimoProporcional = (Math.min(12, meses) / 12) * salario;
    const feriasProporcionais = ((Math.min(12, meses) / 12) * salario) * (4 / 3);
    const feriasVencidas = employee?.feriasVencidas ? salario * (4 / 3) : 0;
    const fgtsBase = salario * 0.08 * Math.max(1, meses);
    const multaFgts = tipo === "dispensa_ordinaria" ? fgtsBase * 0.4 : 0;
    const avisoIndenizado = tipo === "dispensa_ordinaria" && avisoPrevio === "indenizado" ? salario : 0;
    const descontoAvisoPedido = tipo === "pedido_demissao" && avisoPrevio === "descontado" ? salario : 0;

    let total = saldoSalario + feriasVencidas;
    if (tipo === "pedido_demissao") {
      total += decimoProporcional + feriasProporcionais - descontoAvisoPedido;
    }
    if (tipo === "dispensa_ordinaria") {
      total += avisoIndenizado + decimoProporcional + feriasProporcionais + multaFgts;
    }

    return { salario, saldoSalario, avisoIndenizado, descontoAvisoPedido, decimoProporcional, feriasProporcionais, feriasVencidas, fgtsBase, multaFgts, total };
  }


  function printTerminationEstimateReport(record, employee) {
    const estimate = calculateTerminationEstimate(employee, record.tipo, record.data, record.avisoPrevio || "indenizado");
    if (!estimate) {
      alert("Não foi possível gerar a estimativa deste desligamento.");
      return;
    }
    const tipoLabel = record.tipo === "pedido_demissao"
      ? "Pedido de demissão"
      : record.tipo === "dispensa_ordinaria"
      ? "Dispensa imotivada"
      : "Justa causa";

    const html = `
      <html>
      <head>
        <title>Estimativa de rescisão - ${record.funcionarioNome}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #222; }
          h1 { font-size: 22px; margin-bottom: 8px; }
          h2 { font-size: 16px; margin: 18px 0 10px; }
          .meta { color: #666; margin-bottom: 18px; }
          .box { border: 1px solid #d7dee7; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
          .row { display: flex; justify-content: space-between; gap: 16px; padding: 6px 0; border-bottom: 1px solid #eee; }
          .row:last-child { border-bottom: none; }
          .total { font-weight: bold; font-size: 18px; }
          .muted { color: #666; font-size: 12px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <h1>Relatório simples de estimativa rescisória</h1>
        <div class="meta">Gerado em ${nowBr()}</div>

        <div class="box">
          <div class="row"><span>Funcionário</span><strong>${record.funcionarioNome}</strong></div>
          <div class="row"><span>Tipo de desligamento</span><strong>${tipoLabel}</strong></div>
          <div class="row"><span>Data do desligamento</span><strong>${formatDate(record.data)}</strong></div>
          <div class="row"><span>Aviso prévio</span><strong>${record.avisoPrevio || "-"}</strong></div>
          <div class="row"><span>Responsável pelo registro</span><strong>${record.responsavelRegistro || "-"}</strong></div>
        </div>

        <h2>Estimativa</h2>
        <div class="box">
          <div class="row"><span>Salário base</span><strong>R$ ${estimate.salario.toFixed(2)}</strong></div>
          <div class="row"><span>Saldo de salário</span><strong>R$ ${estimate.saldoSalario.toFixed(2)}</strong></div>
          <div class="row"><span>13º proporcional</span><strong>R$ ${estimate.decimoProporcional.toFixed(2)}</strong></div>
          <div class="row"><span>Férias proporcionais + 1/3</span><strong>R$ ${estimate.feriasProporcionais.toFixed(2)}</strong></div>
          <div class="row"><span>Férias vencidas + 1/3</span><strong>R$ ${estimate.feriasVencidas.toFixed(2)}</strong></div>
          <div class="row"><span>Aviso indenizado</span><strong>R$ ${estimate.avisoIndenizado.toFixed(2)}</strong></div>
          <div class="row"><span>Desconto aviso pedido</span><strong>R$ ${estimate.descontoAvisoPedido.toFixed(2)}</strong></div>
          <div class="row"><span>FGTS estimado</span><strong>R$ ${estimate.fgtsBase.toFixed(2)}</strong></div>
          <div class="row"><span>Multa FGTS</span><strong>R$ ${estimate.multaFgts.toFixed(2)}</strong></div>
          <div class="row total"><span>Total estimado</span><strong>R$ ${estimate.total.toFixed(2)}</strong></div>
        </div>

        <div class="muted">Relatório simples de estimativa. Os valores são indicativos e dependem de conferência contábil, fiscal e trabalhista.</div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  


  


  


  const pageProps = {
    getProfilePermissions,
    getUserPermissions,
    getVisibleMenuForUser,
    getMovementOptionsForUser,
    actorLabel,
    getQueueTargetForProfile,
    queueTargetLabel,
    formatDate,
    parseDate,
    calculateINSSAlert,
    getStatusTone,
    getCriticalityTone,
    getCriticalityLabel,
    Badge,
    STORAGE_KEYS,
    API_BASE,
    STATUS_OPTIONS,
    DEPARTMENTS,
    OCCURRENCE_TYPES,
    PROCESS_STATUS,
    MENU,
    JUST_CAUSE_OPTIONS,
    DOCUMENT_ACCEPT,
    defaultUsers,
    PROFILE_OPTIONS,
    defaultEmployees,
    defaultOccurrences,
    defaultProcesses,
    loadStorage,
    ensureArray,
    nowBr,
    daysBetween,
    activePage,
    employees,
    occurrences,
    processes,
    selectedProcessId,
    users,
    session,
    authUser,
    loginForm,
    passwordChangeForm,
    loginError,
    showLoginPassword,
    userForm,
    showUserPassword,
    editingPermissionsId,
    documentDraft,
    backendRevision,
    backendUpdatedAt,
    syncNotice,
    remoteReady,
    syncTimeoutRef,
    pollIntervalRef,
    skipNextSyncRef,
    expandedEmployeeIds,
    employeeDetailTabs,
    expandedOccurrenceIds,
    expandedProcessIds,
    employeeSearch,
    occurrenceSearch,
    processSearch,
    employeeStatusFilter,
    occurrenceTypeFilter,
    processBoardView,
    employeeSortOrder,
    standardDocSelection,
    employeeEditingId,
    showEmployeeForm,
    employeeForm,
    occurrenceForm,
    attachments,
    previewAttachment,
    movementAttachmentDrafts,
    attachmentLinkDrafts,
    processAssignmentDrafts,
    terminationForm,
    terminations,
    quickEventDrafts,
    movementType,
    movementText,
    decisionConclusion,
    decisionResult,
    decisionToken,
    hrConclusion,
    hrToken,
    dispatchConclusion,
    terminationToken,
    movementOpenSectorDeadline,
    movementDeadlineDays,
    normalizedEmployees,
    employeeMap,
    processMapByOccurrence,
    selectedProcess,
    safeUsers,
    currentUser,
    currentPermissions,
    visibleMenu,
    movementOptions,
    inssByEmployee,
    totalEmployees,
    totalAway,
    totalSusp,
    stats,
    processCounts,
    filteredEmployees,
    filteredOccurrences,
    filteredProcesses,
    processSummary,
    myQueueTarget,
    myDispatchQueue,
    assignedBySectorCounts,
    awaitingDispatchBySectorCounts,
    toggleExpanded,
    lookupCep,
    resetEmployeeForm,
    startEmployeeEdit,
    handleEmployeeSubmit,
    handleEmployeeDelete,
    handleEmployeeStatusChange,
    applyOccurrenceEffects,
    isToday,
    validateManagerToken,
    requireValidToken,
    recalculateEmployeeStatus,
    appendOccurrenceEvent,
    appendProcessMovement,
    attachRecordsToMovement,
    queueMovementAttachment,
    removeMovementDraftAttachment,
    getMovementAttachments,
    linkAttachmentToMovement,
    syncOccurrenceToLinkedProcess,
    syncProcessToLinkedOccurrence,
    buildOccurrenceTimeline,
    handleOccurrenceSubmit,
    addOccurrenceTimeline,
    quickRegisterOccurrenceEvent,
    concludeOccurrence,
    deleteOccurrence,
    saveProcessAssignment,
    updateSelectedProcess,
    addProcessMovement,
    computeDeadlineFromNow,
    startResponseWindow,
    startSectorDeadline,
    clearResponseWindow,
    isMovementExpectedForPending,
    applyWorkflowAfterMovement,
    canLaunchMovement,
    addMovement,
    archiveOccurrence,
    unarchiveOccurrence,
    unarchiveProcess,
    closeProcess,
    archiveProcess,
    deleteProcess,
    printOccurrenceReport,
    getAttachments,
    handleUploadAttachment,
    removeAttachment,
    downloadAttachment,
    currentJustCauseHelp,
    handleTerminationSubmit,
    renderAttachmentBlock,
    renderProcessAttachmentBlock,
    resetDemoData,
    fetchBootstrap,
    pushSnapshot,
    handleLogin,
    handleLogout,
    renderLogin,
    getOccurrenceByProcess,
    generateStandardDocumentText,
    standardDocumentOptions,
    generateStandardDocument,
    handleCreateUser,
    deleteUser,
    toggleUserActive,
    updateUserAccess,
    updateUserPermission,
    handleFirstPasswordChange,
    getDocumentTitle,
    openStandardDocumentEditor,
    printDocumentDraft,
    renderOccurrenceSpecificFields,
    calculateTerminationEstimate,
    printTerminationEstimateReport,
  };

  function renderContent() {
    if (activePage === "Funcionários") return <EmployeesPage {...pageProps} />;
    if (activePage === "Ocorrências") return <OccurrencesPage {...pageProps} />;
    if (activePage === "Processos Internos") return <ProcessesPage {...pageProps} />;
    if (activePage === "Desligamentos") return <TerminationsPage {...pageProps} />;
    if (activePage === "Painel Gerencial") return (
      <>
        <UsersPanelPage {...pageProps} />
        <ReportsPage {...pageProps} />
      </>
    );
    return <DashboardPage {...pageProps} />;
  }


  if (!currentUser) {
    return (
      <LoginScreen
        branding={BRANDING}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        showLoginPassword={showLoginPassword}
        setShowLoginPassword={setShowLoginPassword}
        loginError={loginError}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <>
      {documentDraft ? (
        <div className="preview-overlay" onClick={() => setDocumentDraft(null)}>
          <div className="preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div>
                <h2>{documentDraft.title}</h2>
                <p>Processo nº {documentDraft.processNumber}</p>
              </div>
              <div className="inline-actions">
                <button className="btn secondary mini" onClick={() => setDocumentDraft((prev) => ({ ...prev, text: prev.originalText }))}>Restaurar padrão</button>
                <button className="btn primary mini" onClick={printDocumentDraft}>Gerar / Imprimir</button>
                <button className="btn ghost mini" onClick={() => setDocumentDraft(null)}>Fechar</button>
              </div>
            </div>
            <div className="preview-body preview-body-editor">
              <div className="tooltip-card" style={{ width: "100%" }}>
                <strong>Prévia editável</strong>
                <p>Mantenha o texto padrão ou edite livremente antes de gerar o documento.</p>
              </div>
              <textarea
                className="doc-editor"
                rows={18}
                value={documentDraft.text}
                onChange={(e) => setDocumentDraft((prev) => ({ ...prev, text: e.target.value }))}
              />
            </div>
          </div>
        </div>
      ) : null}
      {currentUser?.mustChangePassword ? (
        <div className="preview-overlay">
          <div className="preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div>
                <h2>Troca obrigatória de senha</h2>
                <p>Seu acesso exige alteração de senha no primeiro login.</p>
              </div>
            </div>
            <div className="preview-body preview-body-editor">
              <form className="form-grid" onSubmit={handleFirstPasswordChange}>
                <input type="password" placeholder="Nova senha" value={passwordChangeForm.senha} onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, senha: e.target.value })} />
                <input type="password" placeholder="Confirmar nova senha" value={passwordChangeForm.confirmar} onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, confirmar: e.target.value })} />
                <div className="form-actions full">
                  <button className="btn primary" type="submit">Salvar nova senha</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      {documentDraft ? (
        <div className="preview-overlay" onClick={() => setDocumentDraft(null)}>
          <div className="preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div>
                <h2>{documentDraft.title}</h2>
                <p>Processo nº {documentDraft.processNumber}</p>
              </div>
              <div className="inline-actions">
                <button className="btn secondary mini" onClick={() => setDocumentDraft((prev) => ({ ...prev, text: prev.originalText }))}>Restaurar padrão</button>
                <button className="btn primary mini" onClick={printDocumentDraft}>Gerar / Imprimir</button>
                <button className="btn ghost mini" onClick={() => setDocumentDraft(null)}>Fechar</button>
              </div>
            </div>
            <div className="preview-body preview-body-editor">
              <div className="tooltip-card" style={{ width: "100%" }}>
                <strong>Prévia editável</strong>
                <p>Mantenha o texto padrão ou edite livremente antes de gerar o documento.</p>
              </div>
              <textarea className="doc-editor" rows={18} value={documentDraft.text} onChange={(e) => setDocumentDraft((prev) => ({ ...prev, text: e.target.value }))} />
            </div>
          </div>
        </div>
      ) : null}
      {previewAttachment ? (
        <div className="preview-overlay" onClick={() => setPreviewAttachment(null)}>
          <div className="preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div>
                <h2>{previewAttachment.name}</h2>
                <p>{previewAttachment.createdAt}</p>
              </div>
              <div className="inline-actions">
                <button className="btn secondary mini" onClick={() => downloadAttachment(previewAttachment)}>Baixar</button>
                <button className="btn ghost mini" onClick={() => setPreviewAttachment(null)}>Fechar</button>
              </div>
            </div>
            <div className="preview-body">
              {previewAttachment.type?.includes("pdf") ? (
                <iframe title={previewAttachment.name} src={previewAttachment.dataUrl} className="preview-frame" />
              ) : previewAttachment.type?.startsWith("image/") ? (
                <img src={previewAttachment.dataUrl} alt={previewAttachment.name} className="preview-image" />
              ) : (
                <EmptyState title="Pré-visualização indisponível" text="Este formato pode ser baixado, mas não possui preview nesta versão." />
              )}
            </div>
          </div>
        </div>
      ) : null}
            <AppShell
        sidebar={
          <AppSidebar
            branding={BRANDING}
            visibleMenu={visibleMenu}
            activePage={activePage}
            setActivePage={setActivePage}
            currentUser={currentUser}
            resetDemoData={resetDemoData}
            handleLogout={handleLogout}
          />
        }
      >
        {renderContent()}
      </AppShell>
    </>
  );
}
