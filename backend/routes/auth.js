import 'dotenv/config';
import { Router } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../db/connection.js';
import { users } from '../db/schema.js';

const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isDuplicateEmailError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ER_DUP_ENTRY'
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Nama, email, dan password wajib diisi.'
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

  if (
    cleanEmail.length > 191 ||
    !emailPattern.test(cleanEmail)
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_EMAIL',
      message: 'Format email tidak valid.'
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
  } catch (error: unknown) {
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
  const { email, password } = req.body ?? {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Email dan password wajib diisi.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (
    cleanEmail.length > 191 ||
    !emailPattern.test(cleanEmail) ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Format email atau password tidak valid.'
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    console.error('JWT_SECRET belum dikonfigurasi dengan benar.');

    return res.status(500).json({
      success: false,
      code: 'SERVER_CONFIG_ERROR',
      message: 'Konfigurasi autentikasi server belum siap.'
    });
  }

  try {
    const foundUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role
      })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    const user = foundUsers[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email atau password salah.'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email atau password salah.'
      });
    }

    const token = jwt.sign(
      {
        sub: String(user.id),
        role: user.role
      },
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
  } catch (error: unknown) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan pada server.'
    });
  }
});

export default router;