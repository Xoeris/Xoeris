import jwt from 'jsonwebtoken';
import { normalizeEmail, setCorsHeaders } from '../../_lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res, 'GET, POST, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const targetAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL || 'marcelloemar@gmail.com');
    return res.status(200).json({ email: targetAdminEmail });
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
    const normalizedEmail = normalizeEmail(email);
    const targetAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL || 'marcelloemar@gmail.com');
    const expectedPin = process.env.ADMIN_PIN || '182026';

    if (normalizedEmail !== targetAdminEmail) {
      return res.status(403).json({ error: 'Unauthorized email address.' });
    }

    if (!pin || String(pin).trim() !== String(expectedPin).trim()) {
      return res.status(401).json({ error: 'Invalid PIN.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'xoeris-admin-secure-vault-key-2026';
    const adminToken = jwt.sign(
      {
        sub: 'xoeris-admin',
        email: targetAdminEmail,
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
        email: targetAdminEmail,
        role: 'admin',
        authenticatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Admin login processing failed', details: error.message });
  }
}
