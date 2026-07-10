import { gemini } from "./gemini";

export async function extractSkills(
  description: string
): Promise<string[]> {

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extraia APENAS as hard skills da descrição da vaga abaixo de forma padronizada e em letras minúsculas.

Normalizações recomendadas para manter a consistência:
- Use 'react' em vez de 'ReactJS', 'React.js' ou 'React JS'.
- Use 'node.js' em vez de 'NodeJS', 'Node.js' ou 'Node'.
- Use 'next.js' em vez de 'NextJS', 'Next.js' ou 'Next'.
- Use 'nestjs' em vez de 'NestJS', 'Nest.js' ou 'Nest'.
- Use 'typescript' em vez de 'TS'.
- Use 'javascript' em vez de 'JS'.
- Use 'postgresql' ou 'postgres'.
- Use 'aws' em vez de 'Amazon Web Services'.
- Use 'docker' em vez de 'Docker Containers'.
- Use 'rest' em vez de 'REST API', 'RESTful' ou 'API Restful'.
- Se houver versão (ex: 'Java 17', 'Python 3.9'), extraia apenas o nome da tecnologia básica (ex: 'java', 'python').

Considere:
- linguagens de programação e marcação
- frameworks e bibliotecas
- ferramentas de cloud e banco de dados
- DevOps, containers e infraestrutura
- ferramentas e tecnologias correlatas
- Padrões de projeto (ex: SOLID, TDD, BDD)
- Boas práticas (ex: Clean Code)
- Metodologias Ágeis (ex: Scrum, Kanban)

Descrição da Vaga:
${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Lista de hard skills extraídas e padronizadas de forma consistente."
            }
          },
          required: ["skills"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return [];
    }

    const parsed = JSON.parse(text.trim());
    return parsed.skills ?? [];

  } catch (error) {
    console.error("Erro ao extrair skills via Gemini:", error);
    return [];
  }
}