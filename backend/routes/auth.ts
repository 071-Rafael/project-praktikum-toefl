
import { Router } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { db } from '../db/connection.js';
import { users } from '../db/schema.js';

const router = Router();

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

  // Validasi tipe data
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Nama, email, dan password wajib diisi dengan format yang benar.'
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Validasi nama
  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_NAME',
      message: 'Nama harus terdiri dari 2 sampai 100 karakter.'
    });
  }

  // Validasi email
   if (
    cleanEmail.length > 191 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
    message: 'Email tidak valid.'
      });
    }

  // Validasi password untuk batas bcrypt
  if (
    password.length < 8 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_PASSWORD',
      message: 'Password minimal 8 karakter dan maksimal 72 byte UTF-8.'
    });
  }

  try {
    // Periksa apakah email sudah terdaftar
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

    // Hash password sebelum menyimpan ke database
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
      message: 'Terjadi kesalahan pada server. Silakan coba lagi.'
    });
  }
});

export default router;
