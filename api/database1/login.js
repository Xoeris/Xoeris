import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const sql = neon(process.env.POSTGRES_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const { identifier, password, device_id, otp, remember_device } = body || {};

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Use regular function call instead of tagged template for maximum compatibility
    const rows = await sql('SELECT username, email, password_hash FROM Users WHERE username = $1 OR email = $2', [identifier, identifier]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = rows[0];
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (otp) {
      const otpRows = await sql('SELECT code, expires_at FROM OTPs WHERE email = $1', [user.email]);
      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      const { code, expires_at } = otpRows[0];
      if (code !== otp || new Date(expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await sql('DELETE FROM OTPs WHERE email = $1', [user.email]);

      if (remember_device && device_id) {
        await sql('INSERT INTO TrustedDevices (username, device_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user.username, device_id]);
      }

      return res.status(200).json({ message: 'Login successful', username: user.username, email: user.email });
    }

    const trustRows = device_id ? await sql('SELECT username FROM TrustedDevices WHERE username = $1 AND device_id = $2', [user.username, device_id]) : [];

    if (trustRows.length > 0) {
      return res.status(200).json({ message: 'Login successful', username: user.username, email: user.email });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql('INSERT INTO OTPs (email, code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET code = $2, expires_at = $3', [user.email, otpCode, expiresAt]);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Your Levelist Login OTP',
      html: '<h1>Levelist Sign In</h1><p>A new login was detected from an untrusted device. Here is your One-Time Password (OTP):</p><h2 style=\"letter-spacing: 4px; background: #f4f4f4; padding: 10px; display: inline-block;\">' + otpCode + '</h2><p>This code will expire in 10 minutes.</p>'
    });

    return res.status(200).json({ require_otp: true, email: user.email });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
