import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_MISSING',
      message: 'Akses ditolak. Token tidak ditemukan.'
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Token tidak valid atau kedaluwarsa.'
      });
    }
    req.user = user;
    next();
  });
}