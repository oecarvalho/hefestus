import { gemini } from "./gemini";
import { canonicalizeSkill } from "./match";

export interface ExtractedVacancyData {
  hardSkills: string[];
  softSkills: string[];
  languages: string[];
  frameworks: string[];
  libraries: string[];
  tools: string[];
  databases: string[];
  cloud: string[];
  tests: string[];
  devops: string[];
  methodologies: string[];
  otherTech: string[];
  workModel: "presencial" | "hibrido" | "remoto" | "não especificado";
  seniority: "estágio" | "júnior" | "pleno" | "sênior" | "não especificado";
  benefits: string[];
}

export async function extractMarketVacancyData(
  description: string
): Promise<ExtractedVacancyData> {
  const defaultData: ExtractedVacancyData = {
    hardSkills: [],
    softSkills: [],
    languages: [],
    frameworks: [],
    libraries: [],
    tools: [],
    databases: [],
    cloud: [],
    tests: [],
    devops: [],
    methodologies: [],
    otherTech: [],
    workModel: "não especificado",
    seniority: "não especificado",
    benefits: [],
  };

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analise a descrição de vaga abaixo e extraia as informações de forma estruturada.
Padronize todas as tecnologias e habilidades técnicas em letras minúsculas.

Normalizações recomendadas para manter a consistência de tecnologias:
- Use 'react' em vez de 'ReactJS', 'React.js' ou 'React JS'.
- Use 'node.js' em vez de 'NodeJS', 'Node.js' ou 'Node'.
- Use 'next.js' em vez de 'NextJS', 'Next.js' ou 'Next'.
- Use 'nestjs' em vez de 'NestJS', 'Nest.js' ou 'Nest'.
- Use 'typescript' em vez de 'TS'.
- Use 'javascript' em vez de 'JS'.
- Use 'postgresql' ou 'postgres'.
- Use 'aws' em vez de 'Amazon Web Services'.
- Use 'docker' em vez de 'Docker Containers'.
- Use 'rest' em vez de 'REST API', 'RESTful'.
- Se houver versão (ex: 'Java 17', 'Python 3.9'), extraia apenas o nome da tecnologia básica (ex: 'java', 'python').

Categorias para classificação:
- hardSkills: Habilidades técnicas gerais (ex: clean code, solid, design patterns, arquitetura de software).
- softSkills: Competências comportamentais (ex: comunicação, trabalho em equipe, proatividade).
- languages: Linguagens de programação ou marcação (ex: javascript, typescript, python, java, html, css).
- frameworks: Frameworks principais (ex: react, next.js, angular, vue, nestjs, spring boot, django, laravel).
- libraries: Bibliotecas e pacotes (ex: redux, tailwind css, lodash, pandas, rxjs, prisma).
- tools: Ferramentas de desenvolvimento, design e produtividade (ex: git, github, jira, figma, vscode).
- databases: Bancos de dados (ex: postgresql, mysql, mongodb, redis, sql server).
- cloud: Serviços de nuvem (ex: aws, azure, gcp, firebase, vercel).
- tests: Ferramentas e frameworks de testes (ex: jest, cypress, playwright, junit, testing library).
- devops: Ferramentas/conceitos de DevOps (ex: docker, kubernetes, github actions, jenkins, terraform, ci/cd).
- methodologies: Metodologias e práticas (ex: scrum, kanban, agile, safe, xp).
- otherTech: Outras tecnologias ou ferramentas relevantes que não caibam perfeitamente nas categorias anteriores.
- workModel: Modelo de trabalho. Classifique unicamente como 'presencial', 'hibrido', 'remoto' ou 'não especificado'.
- seniority: Senioridade. Classifique unicamente como 'estágio', 'júnior', 'pleno', 'sênior' ou 'não especificado'.
- benefits: Benefícios explicitamente encontrados (ex: vale refeição, plano de saúde, seguro de vida, auxílio home office).

Descrição da Vaga:
${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            hardSkills: { type: "array", items: { type: "string" } },
            softSkills: { type: "array", items: { type: "string" } },
            languages: { type: "array", items: { type: "string" } },
            frameworks: { type: "array", items: { type: "string" } },
            libraries: { type: "array", items: { type: "string" } },
            tools: { type: "array", items: { type: "string" } },
            databases: { type: "array", items: { type: "string" } },
            cloud: { type: "array", items: { type: "string" } },
            tests: { type: "array", items: { type: "string" } },
            devops: { type: "array", items: { type: "string" } },
            methodologies: { type: "array", items: { type: "string" } },
            otherTech: { type: "array", items: { type: "string" } },
            workModel: { type: "string", enum: ["presencial", "hibrido", "remoto", "não especificado"] },
            seniority: { type: "string", enum: ["estágio", "júnior", "pleno", "sênior", "não especificado"] },
            benefits: { type: "array", items: { type: "string" } },
          },
          required: [
            "hardSkills", "softSkills", "languages", "frameworks", "libraries",
            "tools", "databases", "cloud", "tests", "devops", "methodologies",
            "otherTech", "workModel", "seniority", "benefits"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return defaultData;
    }

    const parsed = JSON.parse(text.trim());

    // Pós-processamento e normalização via canonicalizeSkill
    const normalizeList = (arr: unknown): string[] => {
      if (!Array.isArray(arr)) return [];
      return Array.from(
        new Set(
          arr
            .map((val) => typeof val === "string" ? val.trim().toLowerCase() : "")
            .filter((val) => val.length > 0)
        )
      );
    };

    return {
      hardSkills: normalizeList(parsed.hardSkills),
      softSkills: normalizeList(parsed.softSkills),
      languages: normalizeList(parsed.languages),
      frameworks: normalizeList(parsed.frameworks),
      libraries: normalizeList(parsed.libraries),
      tools: normalizeList(parsed.tools),
      databases: normalizeList(parsed.databases),
      cloud: normalizeList(parsed.cloud),
      tests: normalizeList(parsed.tests),
      devops: normalizeList(parsed.devops),
      methodologies: normalizeList(parsed.methodologies),
      otherTech: normalizeList(parsed.otherTech),
      workModel: parsed.workModel || "não especificado",
      seniority: parsed.seniority || "não especificado",
      benefits: normalizeList(parsed.benefits),
    };
  } catch (error) {
    console.error("Erro ao extrair informações da vaga via Gemini:", error);
    return defaultData;
  }
}
