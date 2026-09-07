import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const sql = neon(process.env.POSTGRES_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Initialize OTPs table
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS OTPs (
        email VARCHAR(255) PRIMARY KEY,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;
  } catch (error) {
    console.error('Error creating OTPs table:', error);
  }

  if (req.method === 'POST') {
    try {
      let parsedBody = req.body;
      if (typeof req.body === 'string') {
        parsedBody = JSON.parse(req.body);
      }
      
      const { email } = parsedBody;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      // Expiration time: 10 minutes from now
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

      // Upsert the OTP in the database
      await sql`
        INSERT INTO OTPs (email, code, expires_at) 
        VALUES (${email}, ${otpCode}, ${expiresAt})
        ON CONFLICT (email) DO UPDATE 
        SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at;
      `;

      // Send the OTP via Resend
      const data = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your Levelist Account OTP',
        html: \`
          <h1>Levelist Account Management</h1>
          <p>You requested to change your account details. Here is your One-Time Password (OTP):</p>
          <h2 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; display: inline-block;">\${otpCode}</h2>
          <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        \`
      });

      if (data.error) {
        console.error('Resend Error:', data.error);
        return res.status(500).json({ error: 'Failed to send email' });
      }

      return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
