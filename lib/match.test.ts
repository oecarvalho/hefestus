import { expect, test, describe } from 'vitest';
import { calculateMatch } from './match';

describe('calculateMatch', () => {
  test('deve retornar matchScore 100 se todas as habilidades baterem', () => {
    const result = calculateMatch({
      jobSkills: ['React', 'TypeScript', 'Node.js'],
      curriculumSkills: ['react', 'typescript', 'node.js', 'postgres']
    });

    expect(result.matchScore).toBe(100);
    expect(result.matchingSkills).toEqual(['react', 'typescript', 'node.js']);
    expect(result.missingSkills).toEqual([]);
  });

  test('deve calcular matchScore proporcionalmente', () => {
    const result = calculateMatch({
      jobSkills: ['React', 'TypeScript', 'Node.js', 'Docker'],
      curriculumSkills: ['React', 'TypeScript']
    });

    expect(result.matchScore).toBe(50);
    expect(result.matchingSkills).toEqual(['react', 'typescript']);
    expect(result.missingSkills).toEqual(['node.js', 'docker']);
  });

  test('deve lidar com arrays vazios', () => {
    const result = calculateMatch({
      jobSkills: [],
      curriculumSkills: ['React']
    });

    expect(result.matchScore).toBe(0);
  });
});
