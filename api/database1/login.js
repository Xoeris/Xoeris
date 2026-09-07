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
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  try {
    const body = await req.json();
    const { identifier, password, device_id, otp, remember_device } = body || {};

    if (!identifier || !password) {
      return jsonResponse({ error: 'Identifier and password are required' }, 400);
    }

    const rows = await sql('SELECT username, email, password_hash FROM Users WHERE username = $1 OR email = $2', [identifier, identifier]);

    if (rows.length === 0) {
      return jsonResponse({ error: 'User not found' }, 401);
    }

    const user = rows[0];
    if (user.password_hash !== password) {
      return jsonResponse({ error: 'Invalid password' }, 401);
    }

    if (otp) {
      const otpRows = await sql('SELECT code, expires_at FROM OTPs WHERE email = $1', [user.email]);
      if (otpRows.length === 0) {
        return jsonResponse({ error: 'No OTP found' }, 400);
      }
      
      const otpData = otpRows[0];
      if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
        return jsonResponse({ error: 'Invalid or expired OTP' }, 400);
      }

      await sql('DELETE FROM OTPs WHERE email = $1', [user.email]);

      if (remember_device && device_id) {
        await sql('INSERT INTO TrustedDevices (username, device_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user.username, device_id]);
      }

      return jsonResponse({ message: 'Success', username: user.username, email: user.email });
    }

    const trustRows = device_id ? await sql('SELECT username FROM TrustedDevices WHERE username = $1 AND device_id = $2', [user.username, device_id]) : [];

    if (trustRows.length > 0) {
      return jsonResponse({ message: 'Success', username: user.username, email: user.email });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql('INSERT INTO OTPs (email, code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at', [user.email, otpCode, expiresAt]);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Login OTP',
      html: 'Your OTP is: ' + otpCode
    });

    return jsonResponse({ require_otp: true, email: user.email });

  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'Internal Error', details: error.message }, 500);
  }
}
