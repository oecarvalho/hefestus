const aliasMap: Record<string, string> = {
  // JavaScript
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'javascript.js': 'JavaScript',
  
  // TypeScript
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  
  // Node.js
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'node.js': 'Node.js',
  
  // SQL / PostgreSQL
  'sql': 'SQL',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  
  // React Hook Form
  'rhf': 'React Hook Form',
  'react-hook-form': 'React Hook Form',
  'react hook form': 'React Hook Form',
  
  // CSS
  'css': 'CSS',
  'css3': 'CSS',
  
  // HTML
  'html': 'HTML',
  'html5': 'HTML',
  
  // CI/CD
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  
  // Outros frameworks / bibliotecas
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'tailwindcss': 'Tailwind CSS',
  'tailwind': 'Tailwind CSS',
  'prisma': 'Prisma ORM',
  'nestjs': 'NestJS',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'clean code': 'Clean Code',
  'git': 'Git',
  'nosql': 'NoSQL',
  'docker': 'Docker',
};

export function normalizeSkillName(skill: string): string {
  const trimmed = skill.trim().toLowerCase();
  
  // Se está no mapa de aliases
  if (aliasMap[trimmed]) {
    return aliasMap[trimmed];
  }
  
  // Caso contrário, capitaliza cada palavra (ex: "clean architecture" -> "Clean Architecture")
  return skill
    .split(/\s+/)
    .map(word => {
      if (!word) return '';
      // Casos especiais como siglas pequenas (ex: "ui", "ux", "api")
      const lower = word.toLowerCase();
      if (lower === 'ui' || lower === 'ux' || lower === 'api') {
        return lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(' ');
}
