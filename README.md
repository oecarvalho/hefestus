````markdown
# ⚒️ Hefestus — Forje a sua carreira!

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/next.js-app-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/typescript-strict-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/tested-playwright-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel" />
</p>

<p align="center">
  Plataforma inteligente para análise de compatibilidade entre currículos e vagas de emprego, com geração automatizada de currículos personalizados utilizando IA.
</p>

---

# 📖 Sobre o Projeto

O **Hefestus** é uma plataforma web desenvolvida para auxiliar profissionais de tecnologia a aumentarem suas chances em processos seletivos através da análise inteligente entre currículos e descrições de vagas.

A aplicação utiliza Inteligência Artificial para identificar aderência entre perfil profissional e requisitos das vagas, além de gerar versões otimizadas do currículo com foco em maximizar o match com recrutadores e sistemas ATS.

O projeto foi desenvolvido priorizando:

- arquitetura moderna,
- escalabilidade,
- experiência do usuário,
- qualidade de código,
- tipagem segura,
- automação de testes,
- e boas práticas do ecossistema React/Next.js.

---

# 🎯 Objetivo

Desenvolver uma plataforma capaz de:

- analisar compatibilidade entre currículos e vagas;
- gerar feedback automatizado;
- identificar gaps técnicos;
- otimizar currículos com IA;
- acompanhar candidaturas;
- e fornecer métricas estratégicas para evolução profissional.

---

# 👥 Público-Alvo

- Desenvolvedores Front-end
- Desenvolvedores Back-end
- Desenvolvedores Full Stack
- Engenheiros de Software
- Profissionais de TI em geral
- Pessoas em transição de carreira para tecnologia

---

# 🚀 Funcionalidades

## 📊 Dashboard Inteligente

- Visualização de métricas gerais
- Gráficos de status de candidaturas
- Controle de progresso das aplicações

## 📄 Gestão de Currículos

- Cadastro de currículo base
- Armazenamento de informações profissionais
- Atualização centralizada de currículo

## 💼 Gestão de Vagas

- Cadastro de vagas de emprego
- Listagem de oportunidades
- Visualização detalhada das vagas
- Organização das candidaturas

## 🤖 Match Inteligente com IA

- Análise de compatibilidade entre currículo e vaga
- Identificação de aderência técnica
- Sugestões automatizadas
- Match percentual entre perfil e vaga

## 🧠 Geração Automática de Currículos

- Currículos personalizados para cada vaga
- Otimização baseada em requisitos
- Ajustes estratégicos utilizando IA
- Exportação em PDF

## 📈 Relatórios Estratégicos

- Habilidades mais exigidas
- Habilidades ausentes no perfil
- Empresas com maior retorno
- Tempo médio de movimentação
- Principais stacks solicitadas
- Identificação de tecnologias obsoletas

---

# 🛠️ Tecnologias Utilizadas

## 🎨 Front-end

- Next.js
- React
- TypeScript
- TailwindCSS
- Shadcn/UI

## ⚙️ Back-end

- Node.js
- Server Actions
- API Routes

## 🧠 Inteligência Artificial

- Gemini API

## 🗄️ Banco de Dados

- PostgreSQL
- Prisma ORM
- Neon Serverless

## 🧪 Testes e Qualidade

- Playwright
- E2E Testing
- BDD
- TDD

## 🐳 DevOps & Infraestrutura

- Docker
- Vercel
- GitHub

## 📄 Geração de Documentos

- react-pdf

## ✅ Validação e Segurança

- Zod

---

# 🧱 Arquitetura do Projeto

O projeto foi estruturado seguindo princípios modernos de aplicações full stack com Next.js App Router.

## Principais conceitos aplicados:

- Componentização
- Server Components
- Client Components
- Server Actions
- Separação de responsabilidades
- Tipagem forte
- Validação centralizada
- Escalabilidade modular

---

# 📂 Estrutura do Projeto

```bash
src/
├── app/
├── components/
├── actions/
├── services/
├── lib/
├── hooks/
├── types/
├── schemas/
├── utils/
└── tests/
```

| Diretório | Responsabilidade |
|---|---|
| `app` | Rotas e páginas da aplicação |
| `components` | Componentes reutilizáveis |
| `actions` | Server Actions |
| `services` | Integrações externas |
| `schemas` | Schemas Zod |
| `types` | Tipagens globais |
| `tests` | Testes automatizados |
| `utils` | Funções auxiliares |

---

# 🧪 Qualidade e Testes

O projeto utiliza estratégias modernas de qualidade de software.

## Estratégias aplicadas:

- ✅ Testes End-to-End
- ✅ BDD
- ✅ TDD
- ✅ Tipagem forte com TypeScript
- ✅ Validação com Zod
- ✅ Estrutura escalável
- ✅ Fluxos críticos automatizados

---

# ⚙️ Como Executar o Projeto

## 📌 Pré-requisitos

Antes de começar, você precisará ter instalado:

- Node.js
- Docker
- PostgreSQL *(opcional localmente)*
- npm ou yarn

---

# 📥 Clone o repositório

```bash
git clone https://github.com/oecarvalho/hefestus.git
```

---

# 📂 Acesse o projeto

```bash
cd hefestus
```

---

# 📦 Instale as dependências

```bash
npm install
```

---

# 🔐 Configure as variáveis de ambiente

Crie um arquivo:

```bash
.env
```

Exemplo:

```env
DATABASE_URL=
GEMINI_API_KEY=
NEXTAUTH_SECRET=
```

---

# ▶️ Execute o projeto

```bash
npm run dev
```

---

# 🧪 Executando os Testes

## Playwright

```bash
npx playwright test
```

---

# 🌐 Deploy

A aplicação está hospedada utilizando:

- ▲ Vercel

---

# 🗄️ Banco de Dados

O projeto utiliza:

- PostgreSQL
- Prisma ORM
- Neon Serverless Database

---

# 🔌 APIs Utilizadas

## Gemini API

Utilizada para:

- análise inteligente de vagas;
- geração de currículos;
- identificação de gaps técnicos;
- otimização de aderência ATS.

---

# 📚 Aprendizados

Durante o desenvolvimento deste projeto foram aprofundados conhecimentos em:

- Arquitetura moderna com Next.js
- Server Components e Client Components
- Server Actions
- TypeScript avançado
- Validação com Zod
- Prisma ORM
- PostgreSQL
- Testes E2E
- Estruturação escalável
- Integração com IA
- Organização de aplicações full stack

---

# 🚀 Melhorias Futuras

- 📱 Melhorias de responsividade
- 🎨 Refinamento visual da interface
- 🤖 Aprimoramento da geração de currículos
- 📊 Relatórios mais avançados
- 📈 Métricas preditivas
- 🔔 Sistema de notificações
- 🧠 Recomendações inteligentes de carreira
- 🌎 Internacionalização (i18n)

---

# 💡 Diferenciais do Projeto

- Integração com IA generativa
- Foco em empregabilidade
- Geração automática de currículos
- Dashboard analítico
- Arquitetura moderna com Next.js
- Testes automatizados
- Tipagem segura
- Estrutura escalável
- Projeto orientado a produto real

---

# 🔗 Links

## GitHub

https://github.com/oecarvalho/hefestus

## LinkedIn

https://www.linkedin.com/in/felipepcarvalho/

## Portfólio

https://ocarvalhodev.vercel.app/

---

# 👨‍💻 Autor

Desenvolvido por **Felipe Carvalho**.

---

# ⭐ Considerações Finais

O **Hefestus** representa a construção de uma aplicação moderna full stack orientada a produto real, aplicando conceitos avançados de arquitetura, inteligência artificial, qualidade de software e experiência do usuário.

Mais do que um projeto de portfólio, o Hefestus demonstra capacidade de desenvolvimento de soluções complexas com foco em escalabilidade, organização e valor real para usuários.

Se este projeto foi útil para você, considere deixar uma ⭐ no repositório.

---
````
