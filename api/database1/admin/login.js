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

    const { email = '', pin = '' } = body || {};
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const configuredAdminPin = (process.env.ADMIN_PIN || '').trim();

    if (!configuredAdminPin || !configuredAdminEmail) {
      return res.status(500).json({ error: 'ADMIN_EMAIL or ADMIN_PIN environment variable is not configured.' });
    }

    if (!email || email.trim().toLowerCase() !== configuredAdminEmail) {
      return res.status(401).json({ error: 'Invalid admin email or PIN.' });
    }

    if (!pin || String(pin).trim() !== configuredAdminPin) {
      return res.status(401).json({ error: 'Invalid admin email or PIN.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'xoeris-admin-secure-vault-key-2026';
    const adminToken = jwt.sign(
      {
        sub: 'xoeris-admin',
        email: configuredAdminEmail,
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
        email: configuredAdminEmail,
        role: 'admin',
        authenticatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Admin login processing failed', details: error.message });
  }
}
