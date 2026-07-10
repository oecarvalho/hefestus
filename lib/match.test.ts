import { expect, test, describe } from 'vitest';
import { calculateMatch } from './match';

describe('calculateMatch', () => {
  test('deve retornar matchScore 100 se todas as habilidades baterem com casing e formatação originais', () => {
    const result = calculateMatch({
      jobSkills: ['React', 'TypeScript', 'Node.js'],
      curriculumSkills: ['react', 'typescript', 'node.js', 'postgres']
    });

    expect(result.matchScore).toBe(100);
    expect(result.matchingSkills).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(result.missingSkills).toEqual([]);
  });

  test('deve calcular matchScore proporcionalmente mantendo grafia original da vaga', () => {
    const result = calculateMatch({
      jobSkills: ['React', 'TypeScript', 'Node.js', 'Docker'],
      curriculumSkills: ['React', 'TypeScript']
    });

    expect(result.matchScore).toBe(50);
    expect(result.matchingSkills).toEqual(['React', 'TypeScript']);
    expect(result.missingSkills).toEqual(['Node.js', 'Docker']);
  });

  test('deve lidar com arrays vazios', () => {
    const result = calculateMatch({
      jobSkills: [],
      curriculumSkills: ['React']
    });

    expect(result.matchScore).toBe(0);
    expect(result.matchingSkills).toEqual([]);
    expect(result.missingSkills).toEqual([]);
  });

  test('deve dar match com aliases comuns (react.js, reactjs, ts, postgresql, aws, etc)', () => {
    const result = calculateMatch({
      jobSkills: ['React', 'NodeJS', 'TypeScript', 'PostgreSQL', 'AWS'],
      curriculumSkills: ['react.js', 'node.js', 'ts', 'postgres', 'amazon web services']
    });

    expect(result.matchScore).toBe(100);
    expect(result.matchingSkills).toEqual(['React', 'NodeJS', 'TypeScript', 'PostgreSQL', 'AWS']);
    expect(result.missingSkills).toEqual([]);
  });

  test('deve dar match ignorando versões específicas de tecnologias', () => {
    const result = calculateMatch({
      jobSkills: ['Python 3', 'Java 17', 'Angular 12'],
      curriculumSkills: ['python', 'java', 'angular']
    });

    expect(result.matchScore).toBe(100);
    expect(result.matchingSkills).toEqual(['Python 3', 'Java 17', 'Angular 12']);
    expect(result.missingSkills).toEqual([]);
  });

  test('deve deduplicar habilidades repetidas ou sinônimas na vaga para não distorcer a nota', () => {
    const result = calculateMatch({
      jobSkills: ['React', 'React.js', 'reactjs', 'Docker'],
      curriculumSkills: ['react']
    });

    // React (único canônico) e Docker (faltante) -> 1 de 2 bateram = 50%
    expect(result.matchScore).toBe(50);
    expect(result.matchingSkills).toEqual(['React']);
    expect(result.missingSkills).toEqual(['Docker']);
  });
});
