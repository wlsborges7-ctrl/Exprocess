# ExceProcess v2 — demo comercial

Base white-label e de demonstração da plataforma ExceProcess.

## Estrutura modular
- `src/config/branding.js` → nome, logo, textos e identidade
- `src/config/demo.js` → controle do modo demo
- `src/config/demoData.js` → dados de demonstração carregados automaticamente

## O que já vem pronto
- branding ExceProcess
- logo aplicada
- dados demo carregados
- botão para resetar a demonstração
- ambiente isolado da Glink
- backend em memória, sem dependência de PostgreSQL

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
