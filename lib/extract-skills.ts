import { gemini } from "./gemini";

export async function extractSkills(
  description: string
) {

  try {

    const response =
      await gemini.models.generateContent({

        model: "gemini-2.5-flash",

        contents: `
        Extraia APENAS as hard skills da vaga abaixo.

        Considere:
        - linguagens
        - frameworks
        - bibliotecas
        - cloud
        - banco de dados
        - DevOps
        - ferramentas
        - tecnologias
        - Padrões de projeto (SOLID, TDD, BDD)
        - Boas práticas (Clean Code)
        - Metodologias Ageis

        Obs: Se a vaga pedir HTML5, CSS3 ou alguma tecnologia com versão especifica, considerar somente a tecnologia, por exemplo:
        - HTML5 = HTML
        - CSS3 = CSS
        - JAVA 15 = JAVA
        - REST API OU API RESTFUL = REST

        Retorne SOMENTE um JSON válido.

        Exemplo:

        {
          "skills": [
            "react",
            "typescript",
            "docker"
          ]
        }

        Vaga:
        ${description}
        `
      });

    const text = response.text;

    if (!text) {
      return [];
    }

    const cleanText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanText);

    return parsed.skills ?? [];

  } catch (error) {

    console.log(error);

    return [];
  }
}