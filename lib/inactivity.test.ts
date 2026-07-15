import { expect, test, describe } from 'vitest';
import { getInactivityDays, getAlertCycle, shouldAutoCancel } from './inactivity-utils';

describe('inactivity-utils', () => {
  describe('getInactivityDays', () => {
    test('deve calcular corretamente 0 dias se a última atividade foi hoje', () => {
      const now = new Date('2026-07-15T12:00:00Z');
      const lastActivity = new Date('2026-07-15T08:00:00Z');
      expect(getInactivityDays(lastActivity, now)).toBe(0);
    });

    test('deve calcular corretamente a diferença em dias inteiros', () => {
      const now = new Date('2026-07-15T12:00:00Z');
      const lastActivity = new Date('2026-07-08T12:00:00Z'); // 7 dias atrás
      expect(getInactivityDays(lastActivity, now)).toBe(7);
    });

    test('deve desconsiderar frações de dias (arredondando para baixo)', () => {
      const now = new Date('2026-07-15T12:00:00Z');
      const lastActivity = new Date('2026-07-08T18:00:00Z'); // 6.75 dias atrás
      expect(getInactivityDays(lastActivity, now)).toBe(6);
    });
  });

  describe('getAlertCycle', () => {
    test('deve retornar ciclo 0 para inatividades menores que 7 dias', () => {
      expect(getAlertCycle(0)).toBe(0);
      expect(getAlertCycle(5)).toBe(0);
      expect(getAlertCycle(6)).toBe(0);
    });

    test('deve retornar ciclo 1 para inatividades de 7 a 13 dias', () => {
      expect(getAlertCycle(7)).toBe(1);
      expect(getAlertCycle(10)).toBe(1);
      expect(getAlertCycle(13)).toBe(1);
    });

    test('deve retornar ciclo 2 para inatividades de 14 a 20 dias', () => {
      expect(getAlertCycle(14)).toBe(2);
      expect(getAlertCycle(18)).toBe(2);
      expect(getAlertCycle(20)).toBe(2);
    });

    test('deve retornar ciclo 3 para inatividades de 21 a 27 dias', () => {
      expect(getAlertCycle(21)).toBe(3);
      expect(getAlertCycle(25)).toBe(3);
      expect(getAlertCycle(27)).toBe(3);
    });

    test('deve retornar ciclo 4 para inatividades de 28 a 29 dias', () => {
      expect(getAlertCycle(28)).toBe(4);
      expect(getAlertCycle(29)).toBe(4);
    });

    test('deve retornar ciclo 0 para inatividades de 30 dias ou mais (já que é cancelada e não entra mais em ciclos de alerta ativos)', () => {
      expect(getAlertCycle(30)).toBe(0);
      expect(getAlertCycle(45)).toBe(0);
    });
  });

  describe('shouldAutoCancel', () => {
    test('deve retornar false para menos de 30 dias de inatividade', () => {
      expect(shouldAutoCancel(0)).toBe(false);
      expect(shouldAutoCancel(29)).toBe(false);
    });

    test('deve retornar true para 30 dias ou mais de inatividade', () => {
      expect(shouldAutoCancel(30)).toBe(true);
      expect(shouldAutoCancel(45)).toBe(true);
    });
  });
});
