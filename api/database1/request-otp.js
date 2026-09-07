import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

export const config = {
  runtime: 'edge'
};

const sql = neon(process.env.POSTGRES_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Levelist-App-Secret'
    }
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Levelist-App-Secret'
      }
    });
  }

  const appSecret = req.headers.get('x-levelist-app-secret');
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  try {
    const body = await req.json();
    const email = body?.email;
    if (!email) {
      return jsonResponse({ error: 'Email is required' }, 400);
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql('INSERT INTO OTPs (email, code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at', [email, otpCode, expiresAt]);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Account OTP',
      html: 'Your OTP is: ' + otpCode
    });

    if (data.error) {
      console.error('Resend Error:', data.error);
      return jsonResponse({ error: 'Failed to send email' }, 500);
    }

    return jsonResponse({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'Internal Error' }, 500);
  }
}
