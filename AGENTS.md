# Hefestus — Instruções para agentes de IA

## Sobre o produto

O Hefestus é uma plataforma para gerenciamento de candidaturas e personalização de currículos.

O sistema permite:

* cadastrar e acompanhar vagas;
* atualizar o status das candidaturas;
* cadastrar um currículo base;
* extrair habilidades da descrição de uma vaga;
* comparar as habilidades da vaga com o currículo;
* calcular aderência;
* gerar currículos personalizados;
* apresentar métricas e relatórios.

## Stack principal

* Next.js com App Router;
* React;
* TypeScript em modo estrito;
* Tailwind CSS;
* shadcn/ui;
* React Hook Form;
* Zod;
* Server Actions;
* Prisma ORM;
* PostgreSQL hospedado no Neon;
* Gemini para funcionalidades de IA;
* Playwright para testes E2E;
* Vercel para deploy.

## Regras gerais

1. Antes de modificar arquivos, analise a implementação atual e explique o plano.
2. Não altere arquivos que não estejam relacionados à tarefa.
3. Não adicione dependências sem explicar a necessidade.
4. Reutilize componentes, tipos, schemas e funções existentes.
5. Prefira Server Components. Use `"use client"` somente quando houver necessidade de estado, eventos, hooks ou APIs do navegador.
6. Não faça alterações no schema do Prisma sem apresentar:

   * motivo;
   * impacto;
   * plano de migração;
   * arquivos afetados.
7. Toda entrada externa deve ser validada com Zod.
8. Server Actions devem validar os dados recebidos e tratar erros.
9. Não utilizar IDs de usuário fixos ou dados simulados em funcionalidades de produção.
10. Toda consulta deve respeitar o usuário autenticado.
11. Não expor informações sensíveis em logs ou respostas.
12. Não inventar experiências, tecnologias, empresas, certificações ou informações profissionais ao gerar currículos com IA.
13. Respostas de IA devem ser validadas antes de serem persistidas.
14. Evite duplicação de código.
15. Prefira funções pequenas e com responsabilidade clara.
16. Preserve a tipagem estrita e evite `any`.
17. Não use `as` apenas para silenciar erros de TypeScript sem justificar.
18. Mantenha os padrões visuais existentes do shadcn/ui e do Tailwind.
19. Toda página deve considerar:

* carregamento;
* erro;
* estado vazio;
* responsividade;
* acessibilidade por teclado;
* feedback das ações.

20. Funcionalidades críticas devem possuir testes.

## Processo de alteração

Para cada tarefa:

1. localizar os arquivos envolvidos;
2. explicar o comportamento atual;
3. apresentar um plano;
4. informar riscos;
5. realizar alterações pequenas;
6. executar lint, verificação de tipos e testes;
7. revisar o diff;
8. resumir o que foi alterado;
9. informar limitações ou itens pendentes.

## Restrições

* Não realizar refatorações gerais durante a implementação de uma funcionalidade pequena.
* Não modificar configurações do Next.js, Prisma, TypeScript, Tailwind ou Vercel sem necessidade comprovada.
* Não substituir Server Actions por uma API REST sem justificativa arquitetural.
* Não criar abstrações prematuras.
* Não alterar o design inteiro da aplicação de uma só vez.
* Não apagar testes para fazer o build passar.
* Não esconder erros com `try/catch` vazio.
* Não modificar arquivos `.env`.
