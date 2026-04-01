# Glink Process — versão pronta com PostgreSQL

Esta versão substitui a persistência em arquivo JSON por PostgreSQL.

## O que muda
- usuários, funcionários, ocorrências, processos, anexos e desligamentos passam a ser salvos no banco
- o backend mantém a mesma API atual do sistema
- pronto para Render com Postgres

## O que você precisa fazer no Render
1. Criar um banco PostgreSQL no Render
2. Copiar a Internal Database URL
3. Definir a variável `DATABASE_URL` no Web Service
4. Fazer deploy desta versão

## Build / Start
Build:
npm install --include=dev && npm run build

Start:
npm run render:start

## Observação importante
Esta versão usa uma tabela `app_state` com JSONB para manter compatibilidade imediata com o frontend atual.
É uma base estável para 150 funcionários e cerca de 10 usuários do sistema.
Em uma próxima etapa, o ideal é normalizar em tabelas específicas.


## revisão pg.2 — atribuição e anexos
- atribuição de processos reintroduzida com seletor e botão salvar
- dashboard e painel gerencial exibem fila de despacho por perfil/atribuição
- anexos da movimentação foram aproximados do evento:
  - anexo na nova movimentação
  - anexo direto em movimentação já existente
  - anexos soltos do processo ficam em área separada para vinculação posterior


## revisão pg.2.1 — correção de build
- removida duplicidade acidental da função resetDemoData que causava erro de EOF no App.jsx


## revisão pg.2.2 — ajuste fino da atribuição
- salvar atribuição agora gera retorno visual e movimento de histórico
- dashboard e painel mostram total por setor e recorte de aguardando despacho
- contagem de fila reforçada para refletir atribuições salvas


## revisão pg.2.3 — ajustes de entrega
- rastreabilidade reforçada nas ocorrências
- arquivar/desarquivar ocorrência e processo
- indicação do setor quando aguardando despacho
- peças e documentos padrão reorganizados
- desligamentos sem justa causa sem hipótese legal indevida
- retorno do botão de estimativa PDF
- ordenação de funcionários por diferentes critérios


## v2.4 ajustes finais de entrega
- ordenação de funcionários por nome, matrícula, setor e status
- processos encerrados e arquivados agora bloqueiam movimentação
- desarquivamento de processo e ocorrência
- área de peças padrão reorganizada com seletor
- desligamentos sem justa causa não exibem hipótese legal e voltam a gerar estimativa PDF


## v2.5 ajustes finais de entrega
- ordenação real de funcionários por nome, matrícula, setor e status
- ocorrência com arquivar e desarquivar
- processos arquivados com desarquivamento e registro em movimentação
- processos encerrados e arquivados bloqueiam movimentação
- painel de pendência informa o setor quando estiver aguardando despacho
- área de peças padrão reorganizada com seletor + geração da peça escolhida
- desligamentos sem justa causa deixam de carregar hipótese legal
- botão de gerar estimativa PDF restaurado na lista de desligamentos cabíveis


## v2.6 automação e bloqueio fino
- ações processuais agora respeitam status encerrado/arquivado
- arquivado: desarquivar, relatório e excluir
- encerrado: apenas relatório
- notificação ao colaborador ajustada para 48h
- movimentações podem abrir prazo interno para o setor atribuído com prazo em dias
- automação de fila de despacho por setor vinculada à atribuição do processo


## v2.7 controle de presença e sessão
- rota `/api/online` para listar usuários online
- rota `/api/ping` para atualizar atividade da sessão
- rota `/api/auth/logout` para encerrar sessão no servidor
- widget de usuários online no dashboard
- encerramento automático de sessão após 10 minutos de inatividade
