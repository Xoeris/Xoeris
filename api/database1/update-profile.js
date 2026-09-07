import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Levelist-App-Secret'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // App Secret Verification
  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      let parsedBody = req.body;
      if (typeof req.body === 'string') {
        parsedBody = JSON.parse(req.body);
      }
      
      const { email, otp, newUsername, newEmail, newPassword } = parsedBody;
      
      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
      }

      // Check the OTP in the database
      const otpRows = await sql`
        SELECT code, expires_at FROM OTPs WHERE email = ${email}
      `;

      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const { code, expires_at } = otpRows[0];
      
      // Check expiration and code match
      if (code !== otp || new Date(expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // OTP is valid. Now we update the user's profile.
      // We first need to get the user's current data to update only what changed.
      const userRows = await sql`SELECT * FROM Users WHERE email = ${email}`;
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentUser = userRows[0];
      const finalUsername = newUsername && newUsername.trim() !== '' ? newUsername : currentUser.username;
      const finalEmail = newEmail && newEmail.trim() !== '' ? newEmail : currentUser.email;
      const finalPassword = newPassword && newPassword.trim() !== '' ? newPassword : currentUser.password_hash;

      // Update user details
      await sql`
        UPDATE Users 
        SET username = ${finalUsername}, email = ${finalEmail}, password_hash = ${finalPassword}
        WHERE email = ${email}
      `;

      // Delete the used OTP
      await sql`
        DELETE FROM OTPs WHERE email = ${email}
      `;

      return res.status(200).json({ 
        message: 'Profile updated successfully',
        username: finalUsername,
        email: finalEmail
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
