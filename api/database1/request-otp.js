import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const sql = neon(process.env.POSTGRES_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    await sql`CREATE TABLE IF NOT EXISTS OTPs (email VARCHAR(255) PRIMARY KEY, code VARCHAR(6) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL)`;
  } catch (e) {
    console.error('Init error:', e);
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const email = body?.email;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql`INSERT INTO OTPs (email, code, expires_at) VALUES (${email}, ${otpCode}, ${expiresAt}) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`;

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Account OTP',
      html: 'Your OTP is: ' + otpCode
    });

    if (data.error) {
      console.error('Resend Error:', data.error);
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Error' });
  }
}
