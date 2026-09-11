import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { isValidAppSecret } from '../_lib/auth.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isValidAppSecret(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const postgresUrl = process.env.POSTGRES_URL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!postgresUrl) {
    return res.status(500).json({ error: 'Server config error: POSTGRES_URL is missing' });
  }
  if (!resendApiKey) {
    return res.status(500).json({ error: 'Server config error: RESEND_API_KEY is missing' });
  }

  try {
    const sql = neon(postgresUrl);
    const resend = new Resend(resendApiKey);

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const email = body?.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Init table
    try {
      await sql`CREATE TABLE IF NOT EXISTS OTPs (email VARCHAR(255) PRIMARY KEY, code VARCHAR(6) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL)`;
    } catch (e) {}

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql`INSERT INTO OTPs (email, code, expires_at) VALUES (${email}, ${otpCode}, ${expiresAt}) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`;

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Levelist Account OTP',
      html: `<h1>Levelist Account Management</h1><p>You requested to change your account details. Here is your One-Time Password (OTP):</p><h2 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; display: inline-block;">${otpCode}</h2><p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>`
    });

    if (data.error) {
      console.error('Resend Error:', data.error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
