import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import { normalizeEmail, setCorsHeaders } from '../../_lib/auth.js';

function verifyAdmin(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

  try {
    const jwtSecret = process.env.JWT_SECRET || 'xoeris-admin-secure-vault-key-2026';
    const payload = jwt.verify(token, jwtSecret);
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!payload || payload.role !== 'admin') return false;
    if (configuredAdminEmail && payload.email && payload.email.toLowerCase() !== configuredAdminEmail) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res, 'POST, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin session required.' });
  }

  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!postgresUrl) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { userEmail: rawEmail = '', userId = null } = body || {};
    const targetEmail = normalizeEmail(rawEmail);

    if (!targetEmail && !userId) {
      return res.status(400).json({ error: 'User email or ID is required to remove account.' });
    }

    const sql = neon(postgresUrl);

    if (userId) {
      await sql`DELETE FROM users WHERE id = ${Number(userId)}`;
    } else {
      await sql`DELETE FROM users WHERE email = ${targetEmail}`;
    }

    return res.status(200).json({
      success: true,
      message: `Account ${targetEmail || userId} removed successfully.`
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user account', details: error.message });
  }
}
