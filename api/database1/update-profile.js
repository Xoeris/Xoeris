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
    const { email, otp, newUsername, newEmail, newPassword } = body || {};
    if (!email || !otp) {
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

    const userRows = await sql('SELECT * FROM Users WHERE email = $1', [email]);
    if (userRows.length === 0) {
      return jsonResponse({ error: 'User not found' }, 404);
    }

    const currentUser = userRows[0];
    const finalUsername = (newUsername && newUsername.trim()) || currentUser.username;
    const finalEmail = (newEmail && newEmail.trim()) || currentUser.email;
    const finalPassword = (newPassword && newPassword.trim()) || currentUser.password_hash;

    await sql('UPDATE Users SET username = $1, email = $2, password_hash = $3 WHERE email = $4', [finalUsername, finalEmail, finalPassword, email]);
    await sql('DELETE FROM OTPs WHERE email = $1', [email]);

    return jsonResponse({ message: 'Success', username: finalUsername, email: finalEmail });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'Internal Error' }, 500);
  }
}
