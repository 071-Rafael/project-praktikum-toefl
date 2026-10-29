import jwt from 'jsonwebtoken';

const DEFAULT_JWT_SECRET =
  '54e98fc6cb6452306d260e2a77501cc8daa5195fe6b4e18f633793d105237a50b45a217c282bfcdb8efac192c6e36917';

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

  const jwtSecret =
    process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32
      ? process.env.JWT_SECRET
      : DEFAULT_JWT_SECRET;

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