# ExceProcess v2.6 — demo comercial

Versão da ExceProcess com todos os recursos atualmente implantados na linha 2.6 da Glink, adaptada para ambiente de demonstração.

## O que vem nesta versão
- ordenação de funcionários
- ocorrências com arquivar/desarquivar
- processos com arquivar/desarquivar/encerrar e bloqueios por status
- anexos organizados por movimentação
- peças e documentos padrão reorganizados
- atribuição por setor
- fila de despacho por setor
- automação de prazos internos por movimentação
- desligamentos com estimativa PDF

## Estrutura modular
- `src/config/branding.js`
- `src/config/demo.js`
- `src/config/demoData.js`

## Usuários demo
- admin / Demo@123
- gestor / Demo@123
- rh / Demo@123
- juridico / Demo@123

## Deploy no Render
Build:
npm install --include=dev && npm run build

Start:
npm run render:start


## v3.0.0 início da refatoração estrutural
- App.jsx quebrado em páginas:
  - DashboardPage
  - EmployeesPage
  - OccurrencesPage
  - ProcessesPage
  - TerminationsPage
  - UsersPanelPage
  - ReportsPage
- renderização central migrada para componentes de página
- objetivo: preparar roteamento real, components e services na próxima etapa


## v3.0.1 correção de runtime
- corrigida referência a `DEMO_MODE` na `DashboardPage`
