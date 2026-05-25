interface BuildResumePromptProps {
    curriculum: any
    job: any
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
            - Inserir as hard skills faltantes, de modo que aumente o ATS
            - Inserir a descrição dos projetos otimizada para ATS

            RETORNE APENAS JSON VÁLIDO.

            FORMATO:

            {
            "summary": "",
            "skills": [],
            "experiences": [],
            "projects": []
            }

            VAGA:
            ${job.description}

            SKILLS DA VAGA:
            ${JSON.stringify(job.extractedSkills)}

            CURRÍCULO:
            ${JSON.stringify(curriculum)}
            `
}