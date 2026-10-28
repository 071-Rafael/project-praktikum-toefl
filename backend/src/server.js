import express from 'express';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exam.js';
import { db } from '../db/connection.js';
import { sql } from 'drizzle-orm';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

app.get('/api/health/db', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);

    res.json({
      success: true,
      message: 'Koneksi database TOEFL berhasil'
    });
  } catch (error) {
    console.error('Database error:', error);

    res.status(500).json({
      success: false,
      message: 'Koneksi database gagal'
    });
  }
});

app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`);
});