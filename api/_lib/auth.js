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

// Registered app secrets, one row per app:
// [request header name (lowercase), env var holding the secret, dev fallback]
const APP_SECRETS = [
  ['x-levelist-app-secret', 'LEVELIST_APP_SECRET', 'levelist-dev-secret-123'],
  ['x-mova-app-secret', 'MOVA_APP_SECRET', 'mova-dev-secret-123'],
  ['x-musify-app-secret', 'MUSIFY_APP_SECRET', 'musify-dev-secret-123'],
];

export function isValidAppSecret(req) {
  const headers = req.headers || {};
  return APP_SECRETS.some(([header, envVar, fallback]) => {
    const sent = headers[header];
    if (!sent) return false;
    const expected = process.env[envVar];
    return (expected && sent === expected) || sent === fallback;
  });
}

// Display name of the calling app for user-facing copy (OTP emails, etc.).
// Falls back to the legacy name when the request carries no app header.
export function getAppDisplayName(req) {
  const headers = (req && req.headers) || {};
  if (headers['x-musify-app-secret']) return 'Musify';
  if (headers['x-mova-app-secret']) return 'MOVA';
  return 'Levelist';
}

export function setCorsHeaders(res, methods = 'POST, OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}
