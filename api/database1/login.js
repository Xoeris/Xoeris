import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const sql = neon(process.env.POSTGRES_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security Check: Ensure request comes from the Levelist App
  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return res.status(403).json({ error: 'Unauthorized: Invalid App Secret' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let parsedBody = req.body;
    if (typeof req.body === 'string') {
      parsedBody = JSON.parse(req.body);
    }

    // Initialize TrustedDevices table if it doesn't exist
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS TrustedDevices (
          username VARCHAR(255),
          device_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (username, device_id)
        );
      `;
    } catch (e) {
      console.error('Error creating TrustedDevices:', e);
    }

    const { identifier, password, device_id, otp, remember_device } = parsedBody;

    if (!identifier || !password || !device_id) {
      return res.status(400).json({ error: 'Identifier, password, and device_id are required' });
    }

    // Query database for user with matching username or email
    const rows = await sql`
      SELECT username, email, password_hash 
      FROM Users 
      WHERE username = ${identifier} OR email = ${identifier}
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or email' });
    }

    const user = rows[0];

    // Verify password (plain text compare for now based on the signup logic)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // If OTP is provided, verify it
    if (otp) {
      const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${user.email}`;
      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      const { code, expires_at } = otpRows[0];
      if (code !== otp || new Date(expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // OTP valid, delete it
      await sql`DELETE FROM OTPs WHERE email = ${user.email}`;

      // Trust device if requested
      if (remember_device) {
        await sql`
          INSERT INTO TrustedDevices (username, device_id)
          VALUES (${user.username}, ${device_id})
          ON CONFLICT DO NOTHING
        `;
      }

      return res.status(200).json({ message: 'Login successful', username: user.username, email: user.email });
    }

    // Check if device is trusted
    const trustRows = await sql`
      SELECT * FROM TrustedDevices WHERE username = ${user.username} AND device_id = ${device_id}
    `;

    if (trustRows.length > 0) {
      // Trusted device, bypass OTP
      return res.status(200).json({ message: 'Login successful', username: user.username, email: user.email });
    }

    // Device not trusted, send OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    await sql`
      INSERT INTO OTPs (email, code, expires_at) 
      VALUES (${user.email}, ${otpCode}, ${expiresAt})
      ON CONFLICT (email) DO UPDATE 
      SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at;
    `;

    await resend.emails.send({
      from: 'Levelist Security <security@xoeris.com>',
      to: user.email,
      subject: 'Your Levelist Login OTP',
      html: \`
        <h1>Levelist Sign In</h1>
        <p>A new login was detected from an untrusted device. Here is your One-Time Password (OTP):</p>
        <h2 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; display: inline-block;">\${otpCode}</h2>
        <p>This code will expire in 10 minutes.</p>
      \`
    });

    return res.status(200).json({ require_otp: true, email: user.email });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to process login request' });
  }
}
