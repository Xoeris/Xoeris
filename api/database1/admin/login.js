import jwt from 'jsonwebtoken';
import { normalizeEmail, setCorsHeaders } from '../../_lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res, 'GET, POST, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ email: process.env.ADMIN_EMAIL || '' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { pin = '' } = body || {};
    const adminPin = process.env.ADMIN_PIN;
    const adminEmail = process.env.ADMIN_EMAIL || '';

    if (!adminPin) {
      return res.status(500).json({ error: 'ADMIN_PIN environment variable is not configured.' });
    }

    if (!pin || String(pin).trim() !== String(adminPin).trim()) {
      return res.status(401).json({ error: 'Invalid PIN.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'xoeris-admin-secure-vault-key-2026';
    const adminToken = jwt.sign(
      {
        sub: 'xoeris-admin',
        email: adminEmail,
        role: 'admin',
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin authorization granted.',
      token: adminToken,
      admin: {
        email: adminEmail,
        role: 'admin',
        authenticatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Admin login processing failed', details: error.message });
  }
}
