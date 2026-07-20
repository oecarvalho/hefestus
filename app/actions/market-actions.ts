'use server'

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { extractMarketVacancyData, ExtractedVacancyData } from "@/lib/extract-market-vacancy";
import { canonicalizeSkill, calculateMatch } from "@/lib/match";
import { gemini } from "@/lib/gemini";

// Schemas de Validação
const createStudySchema = z.object({
  title: z.string().trim().min(1, "O nome da profissão é obrigatório!"),
  description: z.string().trim().optional(),
});

const createVacancySchema = z.object({
  studyId: z.string().cuid("ID do estudo inválido!"),
  enterprise: z.string().trim().min(1, "O nome da empresa é obrigatório!"),
  role: z.string().trim().min(1, "O cargo é obrigatório!"),
  url: z.string().trim().url("URL inválida!").optional().or(z.literal("")),
  description: z.string().min(1, "A descrição da vaga é obrigatória!"),
});

// Tipos para Retornos Estatísticos
export interface RankingItem {
  name: string;
  count: number;
  percentage: number;
}

export interface DistributionItem {
  name: string;
  count: number;
  percentage: number;
}

export interface ComparisonMetrics {
  similarity: number;
  moreValuedByCompany: { name: string; companyPercent: number; marketPercent: number }[];
  lessRelevantForCompany: { name: string; companyPercent: number; marketPercent: number }[];
  exclusiveSkills: string[];
}

export interface ResumeComparisonResult {
  presentSkills: string[];
  missingSkills: string[];
  adherencePercent: number;
}

export interface Roadmap {
  highPriority: string[];
  mediumPriority: string[];
  differentials: string[];
}

export interface CompanyCompatibilityResult {
  compatibilityPercent: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

// 1. Obter estudos de mercado do usuário
export async function getMarketStudies() {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  const studies = await prisma.marketStudy.findMany({
    where: { userId: session.userId },
    include: {
      vacancies: {
        select: {
          enterprise: true,
          updatedAt: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return studies.map((study) => {
    // Obter empresas únicas
    const distinctCompanies = new Set(
      study.vacancies.map((v) => v.enterprise.trim().toLowerCase())
    );

    // Determinar data da última atualização
    let lastUpdate = study.updatedAt;
    study.vacancies.forEach((v) => {
      if (v.updatedAt > lastUpdate) {
        lastUpdate = v.updatedAt;
      }
    });

    return {
      id: study.id,
      title: study.title,
      description: study.description,
      vacanciesCount: study.vacancies.length,
      companiesCount: distinctCompanies.size,
      updatedAt: lastUpdate,
    };
  });
}

// 2. Criar novo estudo
export async function createMarketStudy(data: { title: string; description?: string }) {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  const validated = createStudySchema.parse(data);

  const study = await prisma.marketStudy.create({
    data: {
      userId: session.userId,
      title: validated.title,
      description: validated.description,
    },
  });

  revalidatePath("/mercado");
  return study;
}

// 3. Excluir estudo
export async function deleteMarketStudy(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  const study = await prisma.marketStudy.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!study || study.userId !== session.userId) {
    throw new Error("Estudo não encontrado ou acesso não autorizado.");
  }

  await prisma.marketStudy.delete({
    where: { id },
  });

  revalidatePath("/mercado");
}

// 4. Cadastrar vaga e extrair dados via IA
export async function createMarketVacancy(data: {
  studyId: string;
  enterprise: string;
  role: string;
  url?: string;
  description: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  const validated = createVacancySchema.parse(data);

  // Validar se o estudo pertence ao usuário
  const study = await prisma.marketStudy.findUnique({
    where: { id: validated.studyId },
    select: { userId: true },
  });

  if (!study || study.userId !== session.userId) {
    throw new Error("Estudo não encontrado.");
  }

  // Extração inteligente de dados com o Gemini
  const extractedData = await extractMarketVacancyData(validated.description);

  const vacancy = await prisma.marketVacancy.create({
    data: {
      studyId: validated.studyId,
      enterprise: validated.enterprise,
      role: validated.role,
      url: validated.url || null,
      description: validated.description,
      extractedData: extractedData as any,
    },
  });

  // Atualizar data de modificação do estudo
  await prisma.marketStudy.update({
    where: { id: validated.studyId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/mercado/${validated.studyId}`);
  return vacancy;
}

// 5. Deletar vaga do estudo
export async function deleteMarketVacancy(id: string, studyId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  const vacancy = await prisma.marketVacancy.findUnique({
    where: { id },
    include: { study: { select: { userId: true } } },
  });

  if (!vacancy || vacancy.study.userId !== session.userId) {
    throw new Error("Vaga não encontrada ou acesso não autorizado.");
  }

  await prisma.marketVacancy.delete({
    where: { id },
  });

  await prisma.marketStudy.update({
    where: { id: studyId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/mercado/${studyId}`);
}

// Helper para compilar rankings a partir de arrays de habilidades
function buildRanking(skillsLists: string[][], totalItems: number): RankingItem[] {
  const counts: Record<string, number> = {};
  skillsLists.forEach((list) => {
    // Deduplica por vaga
    const uniqueInVacancy = Array.from(new Set(list.map(s => s.toLowerCase().trim())));
    uniqueInVacancy.forEach((skill) => {
      counts[skill] = (counts[skill] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// Helper para compilar distribuições de texto simples
function buildDistribution(values: string[], totalItems: number): DistributionItem[] {
  const counts: Record<string, number> = {};
  values.forEach((val) => {
    const cleanVal = val.trim();
    if (cleanVal) {
      counts[cleanVal] = (counts[cleanVal] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// 6. Obter os dados estatísticos completos do estudo de mercado
export async function getMarketStudyDetails(studyId: string, companyFilter?: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  const study = await prisma.marketStudy.findUnique({
    where: { id: studyId },
    include: {
      vacancies: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!study || study.userId !== session.userId) {
    throw new Error("Estudo de mercado não encontrado.");
  }

  const allVacancies = study.vacancies;
  const totalMarketVacancies = allVacancies.length;

  // Lista de empresas distintas presentes
  const companiesList = Array.from(
    new Set(allVacancies.map((v) => v.enterprise.trim()))
  ).sort((a, b) => a.localeCompare(b));

  // Filtrar vagas se um filtro de empresa estiver ativo
  const filteredVacancies = companyFilter
    ? allVacancies.filter(
        (v) => v.enterprise.trim().toLowerCase() === companyFilter.trim().toLowerCase()
      )
    : allVacancies;

  const totalFilteredVacancies = filteredVacancies.length;

  // Extrair arrays de dados estruturados
  const extractList = (vKey: keyof Omit<ExtractedVacancyData, "workModel" | "seniority">) => {
    return filteredVacancies.map((v) => {
      const data = v.extractedData as any as ExtractedVacancyData | null;
      return (data?.[vKey] as string[]) || [];
    });
  };

  const extractString = (vKey: "workModel" | "seniority") => {
    return filteredVacancies.map((v) => {
      const data = v.extractedData as any as ExtractedVacancyData | null;
      return data?.[vKey] || "não especificado";
    });
  };

  // Rankings Filtrados
  const hardSkillsRanking = buildRanking(extractList("hardSkills"), totalFilteredVacancies);
  const softSkillsRanking = buildRanking(extractList("softSkills"), totalFilteredVacancies);
  const languagesRanking = buildRanking(extractList("languages"), totalFilteredVacancies);
  const frameworksRanking = buildRanking(extractList("frameworks"), totalFilteredVacancies);
  const librariesRanking = buildRanking(extractList("libraries"), totalFilteredVacancies);
  const toolsRanking = buildRanking(extractList("tools"), totalFilteredVacancies);
  const databasesRanking = buildRanking(extractList("databases"), totalFilteredVacancies);
  const cloudRanking = buildRanking(extractList("cloud"), totalFilteredVacancies);
  const testsRanking = buildRanking(extractList("tests"), totalFilteredVacancies);
  const devopsRanking = buildRanking(extractList("devops"), totalFilteredVacancies);
  const methodologiesRanking = buildRanking(extractList("methodologies"), totalFilteredVacancies);
  const otherTechRanking = buildRanking(extractList("otherTech"), totalFilteredVacancies);

  // Total de tecnologias encontradas na amostra filtrada
  // Unimos todas as tecnologias e extrações técnicas em um set
  const allTechKeys = new Set<string>();
  filteredVacancies.forEach((v) => {
    const data = v.extractedData as any as ExtractedVacancyData | null;
    if (data) {
      [
        ...(data.hardSkills || []),
        ...(data.languages || []),
        ...(data.frameworks || []),
        ...(data.libraries || []),
        ...(data.tools || []),
        ...(data.databases || []),
        ...(data.cloud || []),
        ...(data.tests || []),
        ...(data.devops || []),
        ...(data.otherTech || []),
      ].forEach((t) => {
        const canonical = canonicalizeSkill(t);
        if (canonical) allTechKeys.add(canonical);
      });
    }
  });

  const totalTechnologiesCount = allTechKeys.size;
  const totalFilteredCompanies = new Set(filteredVacancies.map((v) => v.enterprise.trim().toLowerCase())).size;

  // Distribuições
  const seniorityDist = buildDistribution(extractString("seniority"), totalFilteredVacancies);
  const workModelDist = buildDistribution(extractString("workModel"), totalFilteredVacancies);
  
  // Benefícios são guardados em array
  const benefitsLists = filteredVacancies.map((v) => {
    const data = v.extractedData as any as ExtractedVacancyData | null;
    return data?.benefits || [];
  });
  const benefitsDist = buildDistribution(benefitsLists.flat(), totalFilteredVacancies);

  // --- COMPARAÇÃO MERCADO X EMPRESA ---
  let comparisonMetrics: ComparisonMetrics | null = null;

  if (companyFilter && totalMarketVacancies > 0) {
    // Estatísticas da Empresa vs Mercado Geral
    // Mapear frequências de todas as tecnologias no mercado
    const getTechPercentages = (vacs: typeof allVacancies) => {
      const counts: Record<string, number> = {};
      vacs.forEach((v) => {
        const data = v.extractedData as any as ExtractedVacancyData | null;
        if (data) {
          const techs = Array.from(
            new Set(
              [
                ...(data.hardSkills || []),
                ...(data.languages || []),
                ...(data.frameworks || []),
                ...(data.libraries || []),
                ...(data.tools || []),
                ...(data.databases || []),
                ...(data.cloud || []),
                ...(data.tests || []),
                ...(data.devops || []),
                ...(data.otherTech || []),
              ].map(t => canonicalizeSkill(t))
            )
          );
          techs.forEach((t) => {
            if (t) counts[t] = (counts[t] || 0) + 1;
          });
        }
      });
      
      const percentages: Record<string, number> = {};
      Object.entries(counts).forEach(([name, count]) => {
        percentages[name] = Math.round((count / vacs.length) * 100);
      });
      return percentages;
    };

    const companyTechs = getTechPercentages(filteredVacancies);
    const marketTechs = getTechPercentages(allVacancies);

    // Calcular Jaccard Similarity das stacks
    const compKeys = Object.keys(companyTechs);
    const marketKeys = Object.keys(marketTechs);
    const commonKeys = compKeys.filter((k) => marketTechs[k] !== undefined);
    const unionKeys = Array.from(new Set([...compKeys, ...marketKeys]));

    const similarity = unionKeys.length > 0
      ? Math.round((commonKeys.length / unionKeys.length) * 100)
      : 0;

    // Tecnologias mais valorizadas pela empresa (Company % > Market %)
    const moreValuedByCompany = compKeys
      .map((k) => ({
        name: k,
        companyPercent: companyTechs[k] || 0,
        marketPercent: marketTechs[k] || 0,
      }))
      .filter((item) => item.companyPercent > item.marketPercent)
      .sort((a, b) => (b.companyPercent - b.marketPercent) - (a.companyPercent - a.marketPercent))
      .slice(0, 5);

    // Tecnologias menos relevantes (Market % > Company % ou ausente na empresa)
    const lessRelevantForCompany = marketKeys
      .map((k) => ({
        name: k,
        companyPercent: companyTechs[k] || 0,
        marketPercent: marketTechs[k] || 0,
      }))
      .filter((item) => item.marketPercent > item.companyPercent)
      .sort((a, b) => (b.marketPercent - b.companyPercent) - (a.marketPercent - a.companyPercent))
      .slice(0, 5);

    // Competências exclusivas da empresa (aparecem apenas nessa empresa e em nenhuma outra do estudo)
    // Ou seja: frequência da tecnologia na empresa é igual à frequência geral do mercado no estudo
    // E existem outras empresas no estudo
    const otherCompaniesVacancies = allVacancies.filter(
      (v) => v.enterprise.trim().toLowerCase() !== companyFilter.trim().toLowerCase()
    );

    const exclusiveSkills: string[] = [];
    if (otherCompaniesVacancies.length > 0) {
      const otherTechs = getTechPercentages(otherCompaniesVacancies);
      compKeys.forEach((k) => {
        if (!otherTechs[k]) {
          exclusiveSkills.push(k);
        }
      });
    }

    comparisonMetrics = {
      similarity,
      moreValuedByCompany,
      lessRelevantForCompany,
      exclusiveSkills,
    };
  }

  // --- COMPARAÇÃO COM O CURRÍCULO E GAP DE CONHECIMENTO ---
  // Obter currículo do usuário
  const curriculum = await prisma.curriculum.findUnique({
    where: { userId: session.userId },
    select: {
      skills: true,
      tools: true,
    },
  });

  const curriculumSkills = [
    ...(curriculum?.skills || []),
    ...(curriculum?.tools || []),
  ];

  // Agrega todas as tecnologias da amostra filtrada para fazer a comparação de habilidades
  const uniqueTechsInFiltered = Array.from(allTechKeys);

  const curriculumComparison = calculateMatch({
    jobSkills: uniqueTechsInFiltered,
    curriculumSkills,
  });

  // Gap de Conhecimento ordenado por frequência de aparição
  // Mapeamos a frequência no conjunto filtrado para ordenar o gap
  const getTechFrequencyMap = (vacs: typeof filteredVacancies) => {
    const counts: Record<string, { originalName: string; count: number }> = {};
    vacs.forEach((v) => {
      const data = v.extractedData as any as ExtractedVacancyData | null;
      if (data) {
        const skillsList = [
          ...(data.hardSkills || []),
          ...(data.languages || []),
          ...(data.frameworks || []),
          ...(data.libraries || []),
          ...(data.tools || []),
          ...(data.databases || []),
          ...(data.cloud || []),
          ...(data.tests || []),
          ...(data.devops || []),
          ...(data.otherTech || []),
        ];
        
        // Deduplicar por vaga
        const seenInVacancy = new Set<string>();
        skillsList.forEach((skill) => {
          const canonical = canonicalizeSkill(skill);
          if (canonical && !seenInVacancy.has(canonical)) {
            seenInVacancy.add(canonical);
            if (!counts[canonical]) {
              counts[canonical] = { originalName: skill, count: 0 };
            }
            counts[canonical].count += 1;
          }
        });
      }
    });
    return counts;
  };

  const techFreqMap = getTechFrequencyMap(filteredVacancies);

  // Mapear o gap de conhecimento (tecnologias ausentes) e ordenar por frequência
  const gapOfKnowledge = curriculumComparison.missingSkills
    .map((skill) => {
      const canonical = canonicalizeSkill(skill);
      const freqInfo = techFreqMap[canonical];
      return {
        name: freqInfo?.originalName || skill,
        count: freqInfo?.count || 1,
        percentage: totalFilteredVacancies > 0 
          ? Math.round(( (freqInfo?.count || 1) / totalFilteredVacancies ) * 100) 
          : 0,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // --- ROADMAP DE ESTUDOS ---
  // Dividir o gap em Alta, Média e Diferenciais baseado na frequência
  const roadmap: Roadmap = {
    highPriority: [],
    mediumPriority: [],
    differentials: [],
  };

  gapOfKnowledge.forEach((item) => {
    if (item.percentage >= 40) {
      roadmap.highPriority.push(item.name);
    } else if (item.percentage >= 15) {
      roadmap.mediumPriority.push(item.name);
    } else {
      roadmap.differentials.push(item.name);
    }
  });

  // --- COMPATIBILIDADE COM A EMPRESA (se selecionada) ---
  let companyCompatibility: CompanyCompatibilityResult | null = null;
  if (companyFilter && totalFilteredVacancies > 0) {
    const compScore = curriculumComparison.matchScore;
    
    // Recomendações personalizadas
    const recommendations: string[] = [];
    const topMissing = gapOfKnowledge.slice(0, 3);
    const topMatching = curriculumComparison.matchingSkills.slice(0, 3);

    if (compScore >= 75) {
      recommendations.push("Excelente! Seu currículo possui alta compatibilidade com a stack da empresa.");
    } else if (compScore >= 40) {
      recommendations.push("Você possui uma boa base. Focar nas competências ausentes pode te destacar.");
    } else {
      recommendations.push("A stack dessa empresa difere bastante do seu currículo. Recomendamos iniciar o roadmap de estudos.");
    }

    if (topMissing.length > 0) {
      recommendations.push(
        `Priorize o estudo de ${topMissing.map((m) => `"${m.name}"`).join(", ")}, que são muito demandados nesta empresa.`
      );
    }
    if (topMatching.length > 0) {
      recommendations.push(
        `Destaque suas habilidades em ${topMatching.map((m) => `"${m}"`).join(", ")} na sua apresentação ou entrevista.`
      );
    }

    companyCompatibility = {
      compatibilityPercent: compScore,
      matchingSkills: curriculumComparison.matchingSkills,
      missingSkills: curriculumComparison.missingSkills,
      recommendations,
    };
  }

  return {
    study: {
      id: study.id,
      title: study.title,
      description: study.description,
      createdAt: study.createdAt,
      vacancies: study.vacancies,
    },
    companiesList,
    metrics: {
      totalVacancies: totalFilteredVacancies,
      totalCompanies: totalFilteredCompanies,
      totalTechnologies: totalTechnologiesCount,
    },
    rankings: {
      hardSkills: hardSkillsRanking.slice(0, 15),
      softSkills: softSkillsRanking.slice(0, 15),
      languages: languagesRanking.slice(0, 15),
      frameworks: frameworksRanking.slice(0, 15),
      libraries: librariesRanking.slice(0, 15),
      tools: toolsRanking.slice(0, 15),
      databases: databasesRanking.slice(0, 15),
      cloud: cloudRanking.slice(0, 15),
      tests: testsRanking.slice(0, 15),
      devops: devopsRanking.slice(0, 15),
      methodologies: methodologiesRanking.slice(0, 15),
      otherTech: otherTechRanking.slice(0, 15),
    },
    distributions: {
      seniority: seniorityDist,
      workModel: workModelDist,
      benefits: benefitsDist.slice(0, 10),
    },
    comparisonMetrics,
    curriculumComparison: {
      presentSkills: curriculumComparison.matchingSkills,
      missingSkills: curriculumComparison.missingSkills,
      adherencePercent: curriculumComparison.matchScore,
    },
    gapOfKnowledge,
    roadmap,
    companyCompatibility,
  };
}

// 7. Gerar Insights consolidados com IA (Gemini)
export async function getMarketStudyAIInsights(studyId: string, companyFilter?: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado.");
  }

  // 1. Coletar dados determinísticos do estudo para passar à IA
  const studyData = await getMarketStudyDetails(studyId, companyFilter);

  // 2. Montar resumo de dados de entrada
  const dataSummary = {
    profissao: studyData.study.title,
    vagasAnalisadas: studyData.metrics.totalVacancies,
    empresasAnalisadas: studyData.metrics.totalCompanies,
    tecnologiasEncontradas: studyData.metrics.totalTechnologies,
    topHardSkills: studyData.rankings.hardSkills.slice(0, 8).map((r) => `${r.name} (${r.percentage}%)`),
    topSoftSkills: studyData.rankings.softSkills.slice(0, 8).map((r) => `${r.name} (${r.percentage}%)`),
    topLanguages: studyData.rankings.languages.slice(0, 8).map((r) => `${r.name} (${r.percentage}%)`),
    topFrameworks: studyData.rankings.frameworks.slice(0, 8).map((r) => `${r.name} (${r.percentage}%)`),
    topDatabases: studyData.rankings.databases.slice(0, 8).map((r) => `${r.name} (${r.percentage}%)`),
    topCloud: studyData.rankings.cloud.slice(0, 8).map((r) => `${r.name} (${r.percentage}%)`),
    senioridades: studyData.distributions.seniority.map((s) => `${s.name}: ${s.percentage}%`),
    modelosTrabalho: studyData.distributions.workModel.map((w) => `${w.name}: ${w.percentage}%`),
    beneficiosRecorrentes: studyData.distributions.benefits.map((b) => `${b.name}: ${b.percentage}%`),
    empresaSelecionada: companyFilter || "Nenhuma (Visão Geral de Mercado)",
  };

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Você é um analista de talentos experiente e especialista em inteligência de mercado de tecnologia.
Utilizando os dados analíticos estruturados do nosso banco de dados, gere insights inteligentes respondendo detalhadamente e em formato profissional.

Instruções para geração:
1. Resumo Executivo: Visão clara do mercado de trabalho para esta profissão.
2. Análise da Empresa (caso selecionada): Explique a stack, cultura tecnológica e competências esperadas.
3. Responda a perguntas estratégicas de carreira transversais baseando-se no conjunto geral ou específico.

Dados estatísticos das vagas:
${JSON.stringify(dataSummary, null, 2)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            executiveSummary: {
              type: "string",
              description: "Resumo executivo do mercado ou da empresa com conclusões claras. 2-3 parágrafos."
            },
            predominantTechs: {
              type: "array",
              items: { type: "string" },
              description: "Lista de 3 a 5 tecnologias e competências que predominam ou são indispensáveis."
            },
            observedTrends: {
              type: "array",
              items: { type: "string" },
              description: "Lista de 3 a 4 tendências claras observadas (ex: alta de vagas híbridas, migração para cloud X, etc.)."
            },
            careerAdvice: {
              type: "string",
              description: "Conselho prático sobre o que estudar ou focar para ingressar nesta área com base nas vagas."
            },
            ubiquitousTechs: {
              type: "array",
              items: { type: "string" },
              description: "Habilidades técnicas que aparecem em quase 100% das vagas."
            },
            differentialTechs: {
              type: "array",
              items: { type: "string" },
              description: "Tecnologias que raramente aparecem mas são diferenciais de alto valor no perfil."
            },
            companyTechProfile: {
              type: "string",
              description: "Caso haja empresa selecionada, explique em 1-2 parágrafos o perfil tecnológico específico dela. Caso contrário, analise o perfil das empresas de modo geral."
            }
          },
          required: [
            "executiveSummary",
            "predominantTechs",
            "observedTrends",
            "careerAdvice",
            "ubiquitousTechs",
            "differentialTechs",
            "companyTechProfile"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da IA.");
    }

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Erro ao gerar insights com Gemini:", error);
    return {
      executiveSummary: "Não foi possível gerar os insights da IA no momento devido a uma falha na API do Gemini. Por favor, tente novamente.",
      predominantTechs: [],
      observedTrends: [],
      careerAdvice: "Tente recarregar os insights.",
      ubiquitousTechs: [],
      differentialTechs: [],
      companyTechProfile: "Falha na geração de insights."
    };
  }
}
