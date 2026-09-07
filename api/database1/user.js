import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { username } = req.query || {};
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const postgresUrl = process.env.POSTGRES_URL;
  if (!postgresUrl) {
    return res.status(500).json({ error: 'Server configuration error: POSTGRES_URL is missing' });
  }

  try {
    const sql = neon(postgresUrl);

    if (req.method === 'GET') {
      const rows = await sql`SELECT username, email FROM Users WHERE username = ${username}`;
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      const { email, password_hash, otp } = body || {};

      if (!email || !password_hash || !otp) {
        return res.status(400).json({ error: 'Email, password, and OTP are required' });
      }

      const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${email}`;
      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const { code, expires_at } = otpRows[0];
      if (code !== otp || new Date(expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await sql`INSERT INTO Users (username, email, password_hash) VALUES (${username}, ${email}, ${password_hash}) ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash`;
      await sql`DELETE FROM OTPs WHERE email = ${email}`;
      
      return res.status(200).json({ message: 'User updated successfully', username, email });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
