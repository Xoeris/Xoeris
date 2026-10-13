import { neon } from '@neondatabase/serverless';
import { verifySessionToken, normalizeEmail, setCorsHeaders } from '../_lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res, 'GET, POST, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization || '';
  let token = authHeader.replace(/^Bearer\s+/i, '') || req.query?.token || (req.body && req.body.token);

  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)(?:xoeris_token|xoeris_session_token|xoeris_admin_token)=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!postgresUrl) {
    return res.status(500).json({ error: 'DATABASE_URL missing' });
  }

  try {
    const payload = verifySessionToken(token);
    const sql = neon(postgresUrl);

    const email = payload.email ? normalizeEmail(payload.email) : '';
    const sub = String(payload.sub || '');
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@xoeris.com').trim().toLowerCase();
    const isAdmin = payload.role === 'admin' || payload.sub === 'xoeris-admin' || (email && email === configuredAdminEmail);

    let rows = [];
    if (email || sub) {
      rows = await sql`
        SELECT id, username, email, name, avatar_url, auth_provider, email_verified, created_at,
               COALESCE(subscription_tier, 'free') as subscription_tier,
               COALESCE(subscription_status, 'active') as subscription_status,
               subscription_cycle, subscription_expires_at
        FROM users
        WHERE (email IS NOT NULL AND LOWER(email) = LOWER(${email}))
           OR (username IS NOT NULL AND LOWER(username) = LOWER(${sub}))
           OR id::text = ${sub}
        LIMIT 1
      `.catch((e) => {
        console.warn('Database query fallback:', e.message);
        return [];
      });
    }

    // Admin has all privileges across all endpoints
    if (isAdmin) {
      let adminUser = rows[0] ? { ...rows[0] } : {
        id: 'xoeris-admin',
        username: 'admin',
        email: email || configuredAdminEmail,
        name: 'Administrator',
        avatar_url: null,
        created_at: new Date().toISOString()
      };

      adminUser.role = 'admin';
      adminUser.is_admin = true;
      adminUser.subscription_tier = 'ultra';
      adminUser.subscription_status = 'active';
      adminUser.subscription_cycle = 'permanent';
      adminUser.email_verified = true;

      return res.status(200).json({ user: adminUser, token });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let user = rows[0];

    // Check if user's registered email matches configured admin email
    if (user.email && normalizeEmail(user.email) === configuredAdminEmail) {
      user.role = 'admin';
      user.is_admin = true;
      user.subscription_tier = 'ultra';
      user.subscription_status = 'active';
      user.subscription_cycle = 'permanent';
      return res.status(200).json({ user, token });
    }

    // Auto reset to free if subscription expiration has passed (non-admins only)
    if (user.subscription_expires_at && user.subscription_tier !== 'free') {
      const expirationDate = new Date(user.subscription_expires_at);
      if (!isNaN(expirationDate.getTime()) && expirationDate <= new Date()) {
        await sql`
          UPDATE users
          SET subscription_tier = 'free',
              subscription_status = 'expired'
          WHERE id = ${user.id}
        `.catch((e) => console.warn('Could not reset expired tier:', e.message));

        user.subscription_tier = 'free';
        user.subscription_status = 'expired';
      }
    }

    user.role = user.role || 'user';
    user.is_admin = Boolean(user.role === 'admin');
    user.subscription_tier = (user.subscription_tier || 'free').toLowerCase();

    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
}
