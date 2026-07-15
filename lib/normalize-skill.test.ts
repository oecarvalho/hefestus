import { expect, test, describe } from 'vitest';
import { normalizeSkillName } from './normalize-skill';

describe('normalizeSkillName', () => {
  test('deve converter aliases comuns para a grafia padrão', () => {
    expect(normalizeSkillName('js')).toBe('JavaScript');
    expect(normalizeSkillName('javascript')).toBe('JavaScript');
    expect(normalizeSkillName('ts')).toBe('TypeScript');
    expect(normalizeSkillName('typescript')).toBe('TypeScript');
    expect(normalizeSkillName('nodejs')).toBe('Node.js');
    expect(normalizeSkillName('node.js')).toBe('Node.js');
  });

  test('deve tratar termos com espaços e maiúsculas/minúsculas', () => {
    expect(normalizeSkillName('  reactjs  ')).toBe('React');
    expect(normalizeSkillName('react hook form')).toBe('React Hook Form');
    expect(normalizeSkillName('rhf')).toBe('React Hook Form');
    expect(normalizeSkillName('postgres')).toBe('PostgreSQL');
    expect(normalizeSkillName('postgresql')).toBe('PostgreSQL');
  });

  test('deve capitalizar corretamente palavras desconhecidas', () => {
    expect(normalizeSkillName('python')).toBe('Python');
    expect(normalizeSkillName('ruby on rails')).toBe('Ruby On Rails');
    expect(normalizeSkillName('clean architecture')).toBe('Clean Architecture');
  });

  test('deve tratar siglas pequenas especiais como maiúsculas', () => {
    expect(normalizeSkillName('ui')).toBe('UI');
    expect(normalizeSkillName('ux')).toBe('UX');
    expect(normalizeSkillName('api')).toBe('API');
    expect(normalizeSkillName('rest api')).toBe('Rest API');
  });
});
