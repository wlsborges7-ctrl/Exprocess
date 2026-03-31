export const DEMO_STATE = {
  users: [
    {
      id: 1,
      nome: "Administrador Demo",
      usuario: "admin",
      perfil: "Administrador",
      senha: "Demo@123",
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
      nome: "Gestor Demo",
      usuario: "gestor",
      perfil: "Gestor",
      senha: "Demo@123",
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
      nome: "RH Demo",
      usuario: "rh",
      perfil: "RH",
      senha: "Demo@123",
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
        canHrDispatch: true,
        canLegalDispatch: false,
        canConclusiveDecision: false
      }
    },
    {
      id: 4,
      nome: "Jurídico Demo",
      usuario: "juridico",
      perfil: "Jurídico",
      senha: "Demo@123",
      ativo: true,
      mustChangePassword: false,
      permissions: {
        canEmployees: false,
        canOccurrences: false,
        canProcesses: true,
        canTerminations: false,
        canReports: true,
        canManageUsers: false,
        processControl: true,
        canHrDispatch: false,
        canLegalDispatch: true,
        canConclusiveDecision: false
      }
    }
  ],
  employees: [
    {
      id: 101,
      nome: "João Victor Almeida",
      cpf: "111.222.333-44",
      matricula: "EXC-001",
      cargo: "Supervisor Operacional",
      setor: "Operações",
      base: "Matriz",
      gestor: "Renata Moura",
      status: "Ativo",
      admissao: "2024-02-10",
      email: "joao@exceprocess.com.br",
      celular: "(21) 99999-0001",
      cep: "20000-000",
      endereco: "Av. Central",
      numero: "120",
      complemento: "Sala 402",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      salario: "4200",
      feriasVencidas: false
    },
    {
      id: 102,
      nome: "Mariana Costa",
      cpf: "222.333.444-55",
      matricula: "EXC-002",
      cargo: "Analista de RH",
      setor: "RH",
      base: "Matriz",
      gestor: "Renata Moura",
      status: "Ativo",
      admissao: "2023-08-01",
      email: "mariana@exceprocess.com.br",
      celular: "(21) 99999-0002",
      cep: "20000-000",
      endereco: "Av. Central",
      numero: "120",
      complemento: "Sala 405",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      salario: "3800",
      feriasVencidas: true
    },
    {
      id: 103,
      nome: "Carlos Eduardo Rocha",
      cpf: "333.444.555-66",
      matricula: "EXC-003",
      cargo: "Técnico Externo",
      setor: "Operações",
      base: "Filial Norte",
      gestor: "João Victor Almeida",
      status: "Suspenso",
      admissao: "2022-01-15",
      email: "carlos@exceprocess.com.br",
      celular: "(21) 99999-0003",
      cep: "20000-000",
      endereco: "Rua das Torres",
      numero: "88",
      complemento: "",
      bairro: "Benfica",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      salario: "2600",
      feriasVencidas: false
    }
  ],
  occurrences: [
    {
      id: 201,
      protocolo: "OC-2026-001",
      tipo: "Advertência",
      funcionarioId: 103,
      data: "2026-03-20",
      descricao: "Descumprimento de procedimento operacional e atraso recorrente no início do turno.",
      classificacao: "moderada",
      normaViolada: "Procedimento interno de operação",
      status: "Gerou processo",
      responsavelRegistro: "Mariana Costa (RH)",
      geraProcesso: true,
      sigiloso: false,
      processoId: 301,
      timeline: [
        {
          id: 1,
          data: "31/03/2026 09:10",
          tipo: "Abertura",
          resumo: "Ocorrência aberta: Advertência.",
          responsavel: "Mariana Costa (RH)"
        },
        {
          id: 2,
          data: "31/03/2026 09:12",
          tipo: "Vínculo",
          resumo: "Processo interno gerado automaticamente.",
          responsavel: "Mariana Costa (RH)"
        }
      ]
    },
    {
      id: 202,
      protocolo: "OC-2026-002",
      tipo: "Atestado",
      funcionarioId: 101,
      data: "2026-03-25",
      descricao: "Apresentação de atestado médico de 5 dias.",
      classificacao: "leve",
      normaViolada: "",
      status: "Aberta",
      responsavelRegistro: "Mariana Costa (RH)",
      geraProcesso: false,
      sigiloso: false,
      timeline: [
        {
          id: 1,
          data: "31/03/2026 09:30",
          tipo: "Abertura",
          resumo: "Ocorrência aberta: Atestado.",
          responsavel: "Mariana Costa (RH)"
        }
      ],
      atestado: {
        diasAfastamento: 5,
        informouCID: true,
        cidNumero: "J11",
        hospital: "Hospital Central",
        crmMedico: "123456-RJ"
      }
    }
  ],
  processes: [
    {
      id: 301,
      numero: "PAI-2026-001",
      occurrenceId: 201,
      occurrenceNumber: "OC-2026-001",
      funcionarioId: 103,
      assunto: "Apuração por descumprimento de procedimento e atrasos recorrentes",
      status: "Aguardando despacho",
      prazo: "2026-04-05",
      classificacao: "moderada",
      normaViolada: "Procedimento interno de operação",
      sigiloso: false,
      awaitingResponse: true,
      awaitingType: "despacho",
      awaitingLabel: "Manifestação do funcionário",
      responseDeadline: "2026-04-02T17:00",
      blockedForProceeding: false,
      assignedTo: "RH",
      movimentacoes: [
        {
          id: 1,
          data: "31/03/2026 09:15",
          tipo: "Notificação ao colaborador",
          texto: "Colaborador notificado para ciência dos fatos e apresentação de manifestação.",
          responsavel: "Gestor Demo (Gestor)"
        },
        {
          id: 2,
          data: "31/03/2026 09:40",
          tipo: "Manifestação do funcionário",
          texto: "Colaborador apresentou justificativa escrita e anexou documentos comprobatórios.",
          responsavel: "Administrador Demo (Administrador)"
        }
      ]
    },
    {
      id: 302,
      numero: "PAI-2026-002",
      occurrenceId: null,
      occurrenceNumber: "-",
      funcionarioId: 101,
      assunto: "Análise interna de fluxo de advertências e plano de melhoria",
      status: "Em apuração",
      prazo: "2026-04-10",
      classificacao: "leve",
      normaViolada: "",
      sigiloso: false,
      awaitingResponse: false,
      awaitingType: "",
      awaitingLabel: "",
      responseDeadline: "",
      blockedForProceeding: false,
      assignedTo: "Jurídico",
      movimentacoes: [
        {
          id: 1,
          data: "31/03/2026 10:05",
          tipo: "Despacho jurídico",
          texto: "Emitida orientação preventiva para formalização do fluxo interno.",
          responsavel: "Jurídico Demo (Jurídico)"
        }
      ]
    }
  ],
  attachments: [
    {
      id: 401,
      scope: "process",
      parentId: 301,
      movementId: 2,
      movementType: "Manifestação do funcionário",
      movementText: "Colaborador apresentou justificativa escrita e anexou documentos comprobatórios.",
      name: "justificativa-colaborador.pdf",
      type: "application/pdf",
      size: 184000,
      dataUrl: "data:application/pdf;base64,RGVtbw==",
      createdAt: "31/03/2026 09:42"
    }
  ],
  terminations: [
    {
      id: 501,
      funcionarioId: 103,
      funcionarioNome: "Carlos Eduardo Rocha",
      tipo: "dispensa_ordinaria",
      data: "2026-03-29",
      motivo: "Demonstração de cálculo rescisório e fluxo de desligamento.",
      avisoPrevio: "indenizado",
      occurrenceRef: "",
      processRef: "PAI-2026-001",
      status: "Concluído",
      responsavelRegistro: "Mariana Costa (RH)"
    }
  ]
};
