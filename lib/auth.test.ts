import { expect, test, describe, beforeAll } from 'vitest';

let hashPassword: (password: string) => Promise<string>;
let verifyPassword: (password: string, storedValue: string) => Promise<boolean>;

beforeAll(async () => {
  process.env.SESSION_SECRET = 'suachavesecretamuitolonga32caracteres!';
  const authModule = await import('./auth');
  hashPassword = authModule.hashPassword;
  verifyPassword = authModule.verifyPassword;
});

describe('Criptografia e Hashing de Senha', () => {
  test('deve gerar um hash e verificar a senha correspondente', async () => {
    const password = 'minhasenha123';
    const hash = await hashPassword(password);

    expect(hash).toContain(':');
    const parts = hash.split(':');
    expect(parts).toHaveLength(2);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('senhaerrada', hash);
    expect(isInvalid).toBe(false);
  });

  test('deve rejeitar hashes mal formatados ou tamanhos incorretos', async () => {
    const isValidNull = await verifyPassword('senha', '');
    expect(isValidNull).toBe(false);

    const isValidMalformed = await verifyPassword('senha', 'salt:hash');
    expect(isValidMalformed).toBe(false);
  });
});
