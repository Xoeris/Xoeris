import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      const { email, otp, newUsername, newEmail, newPassword } = body || {};
      
      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
      }

      const otpRows = await sql('SELECT code, expires_at FROM OTPs WHERE email = $1', [email]);
      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const { code, expires_at } = otpRows[0];
      if (code !== otp || new Date(expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const userRows = await sql('SELECT username, email, password_hash FROM Users WHERE email = $1', [email]);
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentUser = userRows[0];
      const finalUsername = (newUsername && newUsername.trim()) || currentUser.username;
      const finalEmail = (newEmail && newEmail.trim()) || currentUser.email;
      const finalPassword = (newPassword && newPassword.trim()) || currentUser.password_hash;

      await sql('UPDATE Users SET username = $1, email = $2, password_hash = $3 WHERE email = $4', [finalUsername, finalEmail, finalPassword, email]);
      await sql('DELETE FROM OTPs WHERE email = $1', [email]);

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

  return res.status(405).json({ error: 'Method Not Allowed' });
}
