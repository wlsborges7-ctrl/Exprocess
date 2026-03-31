# ExceProcess v7

Ajustes aplicados:
- dashboard com gráficos visuais
- setor sem duplicidade no cadastro
- endereço com CEP, número e complemento
- expansão de funcionário apenas para consulta
- edição pelo botão Editar, levando ao formulário
- ocorrências com lançamentos rápidos que entram na ocorrência e no processo vinculado
- geração de relatório via impressão em PDF
- processo com indicação da ocorrência vinculada
- painel direito em branco até seleção de processo

- decisão com opção de marcar conclusiva e resultado
- toda movimentação do processo também atualiza a ocorrência vinculada

- formulário de funcionário recolhido por padrão para manter a tela limpa

- processos arquivados saem da lista principal e ficam na área Arquivados
- processos encerrados saem da lista principal e ficam na área Encerrados
- área principal mostra apenas processos em tramitação

- revisão da comunicação entre ocorrências e processos
- lançamentos rápidos na ocorrência espelham no processo vinculado
- movimentações do processo atualizam a linha do tempo da ocorrência
- filtro de processos ajustado para tramitação, encerrados e arquivados

- processo agora nasce com a descrição inicial da ocorrência no primeiro movimento
- leitura consolidada some ao recolher, encerrar ou arquivar o processo selecionado
- página de funcionários otimizada para ocupar menos espaço quando o formulário estiver recolhido

- área de processos reformulada com abas expostas para tramitação, encerrados e arquivados
- removida a caixa de seleção redundante na aba de processos
- coluna de leitura consolidada ficou mais limpa e menos confusa

- abas de processos migradas para formato lateral mais organizado
- ações rápidas adicionadas no perfil do funcionário (ocorrência, atestado, folga)

- nova ocorrência de Folga meritória
- folga meritória como afastamento programado por data
- validação por token de chefia para confirmação da folga

- integração do regimento interno com classificação da infração, norma violada e sigilo do PAI
- botões rápidos do fluxo do PAI: notificação, defesa inicial, defesa final e relatório
- nova categoria Demanda interna com prioridade, prazo e unidade responsável

- relatórios gerados com marca d'água EXCEPROCESS


## v22 — versão fechada para evolução
Entrou nesta versão:
- redesenho leve das áreas de ocorrências e processos, sem perder a base visual
- nova aba **Desligamentos**
- fluxo de desligamento com:
  - dispensa ordinária
  - pedido de demissão
  - justa causa
- hipóteses de justa causa com explicação curta no formulário
- upload e visualização de documentos por:
  - ocorrência
  - processo
  - desligamento

### Observação
Os documentos desta versão ficam no armazenamento local do navegador, com limite prático. É uma base funcional para evolução posterior com backend centralizado.

- módulo de Funcionários ajustado: expansão em modo leitura organizado por abas (Dados, Ocorrências e Processos)

- correção de JSX no módulo de Funcionários após reorganização por abas

- decisões conclusivas agora exigem token da chefia em campo tipo senha
- folga meritória exige token da chefia em campo tipo senha
- penalidades exigem token da chefia
- manifestação do RH pode ser marcada como conclusiva, com token próprio, para resolver casos sem acionar chefia desnecessariamente

- controles de prazo e prosseguimento em processos
- ao notificar colaborador ou abrir prazo de defesa, o sistema registra prazo fatal e bloqueia prosseguimento
- o fluxo só é liberado após manifestação do funcionário ou anexação do documento esperado
- alerta visual de pendência ativa no cabeçalho e na leitura consolidada do processo


## v27 — fechamento com login
Entrou nesta versão:
- tela de login
- 3 acessos iniciais:
  - admin / Demo@123
  - gestor1 / Demo@123
  - gestor2 / Demo@123
- identificação do usuário logado
- botão sair
- restauração da base demo disponível apenas para administrador

- geração de documentos padrão expandida
- disponibilizados textos-base para: notificação, abertura de defesa inicial/final, despacho, manifestação do RH, registro de manifestação do colaborador, relatório final, decisão, advertência e comunicação de suspensão quando aplicável
- documentos são montados automaticamente com dados da ocorrência e do processo e gerados para impressão com marca d'água EXCEPROCESS

- qualificação visual por criticidade em ocorrências e processos
- cores por criticidade: leve, moderada, grave/gravíssima
- reorganização dos botões de ações processuais em grupos: prazos/comunicações, peças/documentos e encerramento/controle


## v30 — estabilização de execução
Ajustes aplicados:
- servidor Vite estabilizado para abrir tanto em `localhost` quanto no IP da rede
- inclusão de modo de recuperação contra tela branca
- se houver erro por dados antigos/incompatíveis no navegador, a aplicação agora mostra botão para limpar dados locais e recarregar

### Como abrir
```bash
npm install
npm run dev
```

Acesso local:
```bash
http://localhost:5173
```

Acesso em rede:
use o IP que o terminal do Vite mostrar.

### Se aparecer tela branca ou falha de carregamento
A própria aplicação agora deve exibir a tela de recuperação.
Se quiser limpar manualmente:
- abra o navegador
- apague os dados do site / localStorage
- recarregue a página

- estabilização adicional do carregamento do armazenamento local
- correção para dados antigos/incompatíveis de usuários, processos, ocorrências e anexos
- correção específica da falha `users.find is not a function`


Versão v32 preparada para hospedagem no Render com backend central e disco persistente.
