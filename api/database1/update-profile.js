import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

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
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { email, otp, newUsername, newEmail, newPassword } = body || {};
    if (!email || !otp) {
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

    const userRows = await sql`SELECT * FROM Users WHERE email = ${email}`;
    if (userRows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const currentUser = userRows[0];
    const finalUsername = (newUsername && newUsername.trim()) || currentUser.username;
    const finalEmail = (newEmail && newEmail.trim()) || currentUser.email;
    const finalPassword = (newPassword && newPassword.trim()) || currentUser.password_hash;

    await sql`UPDATE Users SET username = ${finalUsername}, email = ${finalEmail}, password_hash = ${finalPassword} WHERE email = ${email}`;
    await sql`DELETE FROM OTPs WHERE email = ${email}`;

    res.status(200).json({ message: 'Success', username: finalUsername, email: finalEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Error' });
  }
}
