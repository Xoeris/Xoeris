import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge'
};

const sql = neon(process.env.POSTGRES_URL);

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Levelist-App-Secret'
    }
  });
}

export default async function handler(req) {
  const url = new URL(req.url);
  const username = url.pathname.split('/').pop();

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Levelist-App-Secret'
      }
    });
  }

  const appSecret = req.headers.get('x-levelist-app-secret');
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  if (!username) {
    return jsonResponse({ error: 'Username required' }, 400);
  }

  if (req.method === 'GET') {
    try {
      const rows = await sql('SELECT username, email FROM Users WHERE username = $1', [username]);
      if (rows.length === 0) {
        return jsonResponse({ error: 'Not found' }, 404);
      }
      return jsonResponse(rows[0]);
    } catch (error) {
      console.error(error);
      return jsonResponse({ error: 'Internal Error' }, 500);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { email, password_hash, otp } = body || {};
      if (!email || !password_hash || !otp) {
        return jsonResponse({ error: 'Missing data' }, 400);
      }

      const otpRows = await sql('SELECT code, expires_at FROM OTPs WHERE email = $1', [email]);
      if (otpRows.length === 0) {
        return jsonResponse({ error: 'Invalid OTP' }, 400);
      }

      const otpData = otpRows[0];
      if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
        return jsonResponse({ error: 'Invalid or expired OTP' }, 400);
      }

      await sql('INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash', [username, email, password_hash]);
      await sql('DELETE FROM OTPs WHERE email = $1', [email]);
      
      return jsonResponse({ message: 'Success', username, email });
    } catch (error) {
      console.error(error);
      return jsonResponse({ error: 'Internal Error' }, 500);
    }
  }

  return jsonResponse({ error: 'Method Not Allowed' }, 405);
}
