interface JobPromptData {
  description: string;
  extractedSkills: unknown;
}

interface BuildResumePromptProps {
    curriculum: unknown;
    job: JobPromptData;
}

export function buildResumePrompt({
    curriculum,
    job,
}: BuildResumePromptProps) {

    return `
            Você é um especialista em currículos ATS.

            Sua tarefa é adaptar o currículo do candidato
            para maximizar compatibilidade com a vaga.

            REGRAS IMPORTANTES:

            - NÃO invente experiências
            - NÃO invente empresas
            - NÃO invente tecnologias
            - NÃO aumente senioridade
            - NÃO crie certificações falsas
            - Use APENAS informações presentes no currículo

            OBJETIVOS:

            - Melhorar ATS
            - Melhorar palavras-chave
            - Melhorar resumo profissional para a vaga
            - Destacar habilidades relevantes
            - Destacar experiências melhorado a descrição delas de modo que seja compativel com a vaga e aumente o ATS
            - Destacar e dar ênfase às hard skills e competências que o candidato possui e que são exigidas pela vaga, sem inventar novas habilidades que o candidato não possui
            - Inserir a descrição dos projetos otimizada para ATS

            RETORNE APENAS JSON VÁLIDO.

            FORMATO:

            {
            "summary": "Resumo profissional adaptado à vaga",
            "skills": ["Habilidade 1", "Habilidade 2"],
            "experiences": [
              {
                "enterpriseName": "Nome da Empresa",
                "job": "Cargo",
                "period": "Período (ex: Jan/2020 - Mar/2023 ou Jan/2020 - Presente)",
                "description": "Descrição detalhada adaptada às palavras-chave da vaga, destacando suas conquistas"
              }
            ],
            "projects": [
              {
                "projectName": "Nome do Projeto",
                "projectDescription": "Descrição otimizada do projeto adaptada à vaga"
              }
            ],
            "educations": [
              {
                "institutionName": "Nome da Instituição",
                "title": "Título do curso/graduação (ex: Bacharelado em Ciência da Computação)",
                "period": "Período de realização (ex: 2018 - 2022)",
                "description": "Opcional: Detalhes, atividades relevantes"
              }
            ],
            "languages": [
              {
                "language": "Idioma (ex: Inglês)",
                "level": "Proficiência (ex: Avançado, Fluente, Intermediário)"
              }
            ]
            }

            VAGA:
            ${job.description}

            SKILLS DA VAGA:
            ${JSON.stringify(job.extractedSkills)}

            CURRÍCULO:
            ${JSON.stringify(curriculum)}
            `
}