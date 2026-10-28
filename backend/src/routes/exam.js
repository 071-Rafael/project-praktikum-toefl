import { Router } from 'express';

const router = Router();

router.get('/sessions', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Data sesi ujian belum tersedia'
  });
});

router.post('/submit', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Fitur pengumpulan ujian belum dibuat'
  });
});

export default router;