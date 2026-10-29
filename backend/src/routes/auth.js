import 'dotenv/config';
import { Router } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../../db/connection.js';
import { users } from '../../db/schema.js';

const router = Router();

// Gunakan JWT_SECRET dari .env, atau otomatis pakai secret default ini jika .env tidak terbaca
const DEFAULT_JWT_SECRET =
  '54e98fc6cb6452306d260e2a77501cc8daa5195fe6b4e18f633793d105237a50b45a217c282bfcdb8efac192c6e36917';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowedEmailDomains = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.id',
  'ymail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'proton.me',
  'protonmail.com',
  'zoho.com'
]);

function isOfficialEmail(email) {
  if (!emailPattern.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  return (
    allowedEmailDomains.has(domain) ||
    domain.endsWith('.ac.id') ||
    domain.endsWith('.sch.id') ||
    domain.endsWith('.edu')
  );
}

function isDuplicateEmailError(error) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ER_DUP_ENTRY'
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Nama, email, password, dan konfirmasi password wajib diisi.'
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_NAME',
      message: 'Nama harus terdiri dari 2 sampai 100 karakter.'
    });
  }

  if (cleanEmail.length > 191 || !emailPattern.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_EMAIL',
      message: 'Format email tidak valid.'
    });
  }

  if (!isOfficialEmail(cleanEmail)) {
    return res.status(400).json({
      success: false,
      code: 'UNSUPPORTED_EMAIL_DOMAIN',
      message: 'Gunakan email resmi (seperti @gmail.com, @yahoo.com, @outlook.com, @icloud.com, atau email kampus .ac.id).'
    });
  }

  if (
    password.length < 8 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_PASSWORD',
      message: 'Password minimal 8 karakter.'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      code: 'PASSWORD_MISMATCH',
      message: 'Password dan konfirmasi password tidak sama.'
    });
  }

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      name: cleanName,
      email: cleanEmail,
      passwordHash
    });

    return res.status(201).json({
      success: true,
      code: 'REGISTERED',
      message: 'Pendaftaran akun berhasil! Silakan login.'
    });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return res.status(409).json({
        success: false,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.'
      });
    }

    console.error('Register error:', error);

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan pada server.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, name, password } = req.body ?? {};

  const identifier =
    typeof email === 'string' && email.trim()
      ? email.trim()
      : typeof name === 'string'
        ? name.trim()
        : '';

  if (!identifier || typeof password !== 'string' || !password) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Email atau nama dan password wajib diisi.'
    });
  }

  if (
    identifier.length > 191 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Email/nama atau password tidak valid.'
    });
  }

  const jwtSecret =
    process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32
      ? process.env.JWT_SECRET
      : DEFAULT_JWT_SECRET;

  try {
    const isEmail = identifier.includes('@');

    const foundUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role
      })
      .from(users)
      .where(
        isEmail
          ? eq(users.email, identifier.toLowerCase())
          : eq(users.name, identifier)
      )
      .limit(1);

    const user = foundUsers[0];

    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email/nama atau password salah.'
      });
    }

    const token = jwt.sign(
      { sub: String(user.id), role: user.role },
      jwtSecret,
      {
        expiresIn: '2h',
        issuer: 'toefl-api',
        audience: 'toefl-app'
      }
    );

    return res.status(200).json({
      success: true,
      code: 'LOGIN_SUCCESS',
      message: 'Login berhasil.',
      data: {
        token,
        tokenType: 'Bearer',
        expiresIn: 7200,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan pada server.'
    });
  }
});

export default router;