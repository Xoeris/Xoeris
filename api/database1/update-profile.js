import { neon } from '@neondatabase/serverless';
import { isValidAppSecret } from '../_lib/auth.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret');

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
  if (!postgresUrl) {
    return res.status(500).json({ error: 'Server configuration error: POSTGRES_URL is missing' });
  }

  try {
    const sql = neon(postgresUrl);

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const { email, otp, newUsername, newEmail, newPassword } = body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${email}`;
    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const { code, expires_at } = otpRows[0];
    if (code !== otp || new Date(expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const userRows = await sql`SELECT username, email, password_hash FROM Users WHERE email = ${email}`;
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = userRows[0];
    const finalUsername = (newUsername && newUsername.trim()) || currentUser.username;
    const finalEmail = (newEmail && newEmail.trim()) || currentUser.email;
    const finalPassword = (newPassword && newPassword.trim()) || currentUser.password_hash;

    await sql`UPDATE Users SET username = ${finalUsername}, email = ${finalEmail}, password_hash = ${finalPassword} WHERE email = ${email}`;
    await sql`DELETE FROM OTPs WHERE email = ${email}`;

    return res.status(200).json({
      message: 'Profile updated successfully',
      username: finalUsername,
      email: finalEmail
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
