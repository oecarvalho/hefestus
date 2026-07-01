# ⚒️ Hefestus

> Plataforma inteligente que utiliza Inteligência Artificial para analisar vagas de emprego, identificar compatibilidade com o currículo e gerar versões personalizadas para aumentar as chances em processos seletivos.

<p align="center">

[💻 Código](https://github.com/oecarvalho/hefestus)

</p>

---

## 📸 Preview



**- Dashboard:**
<img width="1331" height="592" alt="image" src="https://github.com/user-attachments/assets/6fa60064-2a64-4d3e-8e46-8243887c25e3" />

**- Curriculo Base:**
<img width="1334" height="577" alt="image" src="https://github.com/user-attachments/assets/7989be9d-b111-4950-93b4-68edd758700d" />

**- Vagas:**
<img width="1320" height="580" alt="image" src="https://github.com/user-attachments/assets/9104b9ba-e327-4f11-8697-fbd224d11d60" />

**- Relatório:**
<img width="1333" height="562" alt="image" src="https://github.com/user-attachments/assets/8dc927a0-8b85-4e5d-a022-78b0f21c9720" />

---

# 💡 O problema

Personalizar um currículo para cada vaga é um processo repetitivo e demorado. Além disso, muitos profissionais têm dificuldade em identificar quais competências são realmente valorizadas pelos recrutadores e pelos sistemas ATS.

---

# 🚀 A solução

O Hefestus centraliza todo o processo de candidatura em uma única plataforma.

A aplicação utiliza Inteligência Artificial para analisar descrições de vagas, identificar competências relevantes, calcular o nível de aderência entre currículo e oportunidade e gerar versões personalizadas do currículo de forma automatizada.

---

# ✨ Principais funcionalidades

- Cadastro e gerenciamento de candidaturas
- Gestão de currículo base
- Extração automática de requisitos utilizando Gemini AI
- Match entre currículo e vaga
- Identificação de competências ausentes
- Geração de currículo personalizado
- Dashboard com métricas das candidaturas
- Testes automatizados dos principais fluxos

---

# 🛠️ Tecnologias

| Categoria | Tecnologias |
|------------|-------------|
| Front-end | Next.js, React, TypeScript |
| UI | Tailwind CSS, Shadcn/UI |
| Banco de Dados | PostgreSQL, Prisma ORM |
| Inteligência Artificial | Gemini API |
| Testes | Playwright |
| Deploy | Vercel |

---

# 🏗️ Arquitetura

A aplicação foi construída utilizando o App Router do Next.js e Server Actions para simplificar a comunicação entre cliente e servidor.

Entre os principais conceitos utilizados estão:

- Componentização
- Server Components
- Client Components
- Server Actions
- Validação com Zod
- Prisma ORM
- Arquitetura modular

---

# 💻 Desafios técnicos

Durante o desenvolvimento alguns desafios exigiram decisões de arquitetura importantes.

### Integração com IA

Estruturei uma camada responsável pela comunicação com a Gemini API para transformar descrições de vagas em informações organizadas e reutilizáveis pela aplicação.

### Organização dos dados

Modelei o banco utilizando Prisma ORM para manter relacionamentos consistentes entre usuários, currículos, experiências, projetos e candidaturas.

### Qualidade da aplicação

Implementei testes End-to-End com Playwright para validar os principais fluxos da plataforma, reduzindo riscos de regressão durante a evolução do sistema.

---

# 🧪 Testes automatizados

Os fluxos críticos da aplicação são validados através de Playwright.

Entre eles:

- Cadastro de vagas
- Gestão de currículos
- Fluxos principais da aplicação

---

# 🚀 Executando localmente

```bash
git clone https://github.com/oecarvalho/hefestus

cd hefestus

npm install

npm run dev
```

Configure também as variáveis de ambiente:

```env
DATABASE_URL=
GEMINI_API_KEY=
NEXTAUTH_SECRET=
```

---

# 🎯 O que aprendi

Durante o desenvolvimento deste projeto aprofundei conhecimentos em:

- Next.js App Router
- Server Actions
- Integração com Inteligência Artificial
- Modelagem de banco utilizando Prisma ORM
- Testes automatizados com Playwright
- Organização de aplicações Full Stack escaláveis

---

# 🔮 Próximos passos

- Exportação avançada de currículos
- Relatórios mais completos
- Sistema de notificações
- Melhorias na experiência mobile

---

# 👨‍💻 Autor

**Felipe Carvalho**

Desenvolvedor Front-End especializado em React, Next.js e TypeScript, com foco em construção de aplicações modernas e qualidade de software através de testes automatizados.

- LinkedIn: https://www.linkedin.com/in/felipepcarvalho/
- GitHub: https://github.com/oecarvalho
- Portfólio: https://ocarvalhodev.vercel.app/
