import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  const { username } = req.query || {};
  if (!username) {
    res.status(400).json({ error: 'Username required' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT username, email FROM Users WHERE username = ${username}`;
      if (rows.length === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const { email, password_hash, otp } = body || {};
      if (!email || !password_hash || !otp) {
        res.status(400).json({ error: 'Missing data' });
        return;
      }

      const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${email}`;
      if (otpRows.length === 0) {
        res.status(400).json({ error: 'Invalid OTP' });
        return;
      }

      const otpData = otpRows[0];
      if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
        res.status(400).json({ error: 'Invalid or expired OTP' });
        return;
      }

      await sql`INSERT INTO Users (username, email, password_hash) VALUES (${username}, ${email}, ${password_hash}) ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash`;
      await sql`DELETE FROM OTPs WHERE email = ${email}`;
      
      res.status(200).json({ message: 'Success', username, email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Error' });
    }
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
