import jwt from 'jsonwebtoken';

export function issueSessionToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(
    {
      sub: user.id ?? user.username ?? user.email,
      email: user.email,
      auth_provider: user.auth_provider || 'email',
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifySessionToken(token) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

export function setCorsHeaders(res, methods = 'POST, OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}
