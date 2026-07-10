interface CalculateMatchProps {
  jobSkills: string[]
  curriculumSkills: string[]
}

export function canonicalizeSkill(skill: string): string {
  let s = skill.toLowerCase().trim();

  // 1. Tratar exceções conhecidas de nomes com números antes de separar (ex: s3, web3)
  const exceptions: Record<string, string> = {
    's3': 's3',
    'aws s3': 's3',
    'web3': 'web3',
  };

  if (exceptions[s]) {
    return exceptions[s];
  }

  // 2. Separar letras de números no final (ex: html5 -> html 5, css3 -> css 3, java17 -> java 17, es6 -> es 6)
  s = s.replace(/([a-zA-Z]+)(\d+)/g, '$1 $2');

  // 3. Remover sufixos de versão comuns (ex: react 18 -> react, java 17 -> java, angular 12 -> angular)
  s = s.replace(/\b\d+(\.\d+)*\b/g, '').trim();

  // 4. Remover pontuações/separadores comuns para padronizar
  s = s.replace(/[\s\-_.]/g, '');

  // 5. Mapear apelidos/sinônimos comuns e traduções
  const aliases: Record<string, string> = {
    'reactjs': 'react',
    'react': 'react',
    'nodejs': 'node',
    'node': 'node',
    'nextjs': 'next',
    'next': 'next',
    'nestjs': 'nest',
    'nest': 'nest',
    'vuejs': 'vue',
    'vue': 'vue',
    'nuxtjs': 'nuxt',
    'nuxt': 'nuxt',
    'angularjs': 'angular',
    'typescript': 'typescript',
    'ts': 'typescript',
    'javascript': 'javascript',
    'js': 'javascript',
    'postgresql': 'postgres',
    'postgres': 'postgres',
    'amazonwebservices': 'aws',
    'rest': 'rest',
    'restapi': 'rest',
    'restful': 'rest',
    'restfulapi': 'rest',
    'dockercontainers': 'docker',
    'dockercontainer': 'docker',
    'kubernetes': 'k8s',
    'k8s': 'k8s',
    
    // Traduções e normalizações identificadas
    'desenvolvimentoresponsivo': 'responsive',
    'responsivedesign': 'responsive',
    'responsividade': 'responsive',
    'uiux': 'uiux',
    'ui/ux': 'uiux',
    'designuiux': 'uiux',
    'designinterface': 'uiux',
    'designinterfaceusuario': 'uiux',
    'designdeinterface': 'uiux',
    'experienciausuario': 'uiux',
    'userexperience': 'uiux',
    'userinterface': 'uiux',
  };

  if (aliases[s]) {
    return aliases[s];
  }

  // Se terminar com 'js' ou 'ts' e for uma palavra maior, normaliza removendo
  // Ex: reactjs -> react, vuejs -> vue, nestjs -> nest
  if (s.endsWith('js') && s.length > 2) {
    const base = s.slice(0, -2);
    if (aliases[base]) return aliases[base];
    return base;
  }

  return s;
}

export function calculateMatch({
  jobSkills,
  curriculumSkills
}: CalculateMatchProps) {

  if (jobSkills.length === 0) {
    return {
      matchingSkills: [],
      missingSkills: [],
      matchScore: 0
    };
  }

  // 1. Deduplicar as habilidades da vaga com base no valor canônico
  const uniqueJobSkills: string[] = [];
  const seenJobKeys = new Set<string>();

  for (const skill of jobSkills) {
    const key = canonicalizeSkill(skill);
    if (key && !seenJobKeys.has(key)) {
      seenJobKeys.add(key);
      uniqueJobSkills.push(skill);
    }
  }

  // 2. Criar conjunto de chaves canônicas do currículo para comparação rápida
  const canonicalCurriculumSkills = new Set(
    curriculumSkills.map(skill => canonicalizeSkill(skill))
  );

  // 3. Filtrar as habilidades que dão match (preservando o formato original da vaga)
  const matchingSkills = uniqueJobSkills.filter(skill =>
    canonicalCurriculumSkills.has(canonicalizeSkill(skill))
  );

  // 4. Filtrar as habilidades faltantes (preservando o formato original da vaga)
  const missingSkills = uniqueJobSkills.filter(skill =>
    !canonicalCurriculumSkills.has(canonicalizeSkill(skill))
  );

  // 5. Calcular o score com base nos requisitos únicos deduplicados
  const matchScore = uniqueJobSkills.length > 0
    ? Math.round((matchingSkills.length / uniqueJobSkills.length) * 100)
    : 0;

  return {
    matchingSkills,
    missingSkills,
    matchScore
  };
}