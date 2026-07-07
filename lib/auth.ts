import { cookies } from 'next/headers';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('A variável de ambiente SESSION_SECRET não está definida no arquivo .env.');
}

const SECRET_KEY = crypto.scryptSync(sessionSecret, 'salt', 32);
const IV_LENGTH = 12;

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
  expiresAt: string;
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${encrypted}:${tag}`;
}

function decrypt(text: string): string {
  const parts = text.split(':');
  if (parts.length !== 3) throw new Error('Formato de sessão inválido');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const tag = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function createSession(userId: string, email: string, name?: string | null) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const payload: SessionPayload = { userId, email, name, expiresAt };
  const encrypted = encrypt(JSON.stringify(payload));
  const cookieStore = await cookies();
  cookieStore.set('session', encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const decrypted = decrypt(sessionCookie);
    const payload = JSON.parse(decrypted) as SessionPayload;
    if (new Date(payload.expiresAt) < new Date()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Funções de Hashing de Senha (Scrypt Assíncrono com Parâmetros Explícitos)
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

function scryptAsync(password: string, salt: string, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, SCRYPT_OPTIONS, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedValue: string): Promise<boolean> {
  if (!storedValue || !storedValue.includes(':')) {
    return false;
  }
  const parts = storedValue.split(':');
  if (parts.length !== 2) {
    return false;
  }
  const [salt, hash] = parts;
  if (!salt || !hash) {
    return false;
  }

  // Validar tamanho e formato hexadecimal do salt (32 caracteres / 16 bytes) e hash (128 caracteres / 64 bytes)
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (salt.length !== 32 || !hexRegex.test(salt) || hash.length !== 128 || !hexRegex.test(hash)) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, 64);
  const hashBuffer = Buffer.from(hash, 'hex');

  if (hashBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, derivedKey);
}
