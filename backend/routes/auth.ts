import { Router } from 'express';

const router = Router();

router.post('/register', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Fitur register belum dibuat'
  });
});

router.post('/login', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Fitur login belum dibuat'
  });
});

export default router;