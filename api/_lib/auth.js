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

const ALLOWED_ORIGINS = [
  'https://xoeris.com',
  'https://www.xoeris.com',
  'https://api.xoeris.com',
  'https://xalme.xoeris.com',
  'http://localhost:5173',
];

// Registered app secrets, one row per app:
// [request header name (lowercase), env var holding the secret, dev fallback]
const APP_SECRETS = [
  ['x-levelist-app-secret', 'LEVELIST_APP_SECRET'],
  ['x-mova-app-secret', 'MOVA_APP_SECRET'],
  ['x-musify-app-secret', 'MUSIFY_APP_SECRET'],
  ['x-apex-app-secret', 'APEX_APP_SECRET'],
  ['x-horizone-app-secret', 'HORIZONE_APP_SECRET'],
];

export function isValidAppSecret(req) {
  const headers = req.headers || {};
  return APP_SECRETS.some(([header, envVar]) => {
    const sent = headers[header];
    const expected = process.env[envVar];
    // Fail closed: if the env var is missing, nothing matches.
    if (!sent || !expected) return false;
    return sent === expected;
  });
}

// Display name of the calling app for user-facing copy (OTP emails, etc.).
// Falls back to the legacy name when the request carries no app header.
export function getAppDisplayName(req) {
  const headers = (req && req.headers) || {};
  if (headers['x-musify-app-secret']) return 'Musify';
  if (headers['x-mova-app-secret']) return 'MOVA';
  if (headers['x-apex-app-secret']) return 'APEX';
  if (headers['x-horizone-app-secret']) return 'Horizone';
  return 'Levelist';
}

export function setCorsHeaders(res, methods = 'POST, OPTIONS', req = null) {
  const origin = (req && req.headers && req.headers.origin) ? req.headers.origin : '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, X-Apex-App-Secret, X-Horizone-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export function requireJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters');
  }
  return secret;
}

export function allowedOriginFor(req) {
  const origin = (req && req.headers && req.headers.origin) || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

// Fixed-window attempt limiter backed by Upstash Redis.
// Fails closed if Redis is configured but unreachable.
export async function attemptAllowed(key, maxAttempts = 5, windowSec = 900) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return true; // limiter not configured
  const k = `attempts:${key}`;
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['INCR', k], ['EXPIRE', k, windowSec]]),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return Number(data[0]?.result) <= maxAttempts;
}

export function clientIp(req) {
  const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket?.remoteAddress || 'unknown';
}
