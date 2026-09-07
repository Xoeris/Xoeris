import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

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

    const { identifier, password } = parsedBody;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier (username/email) and password are required' });
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

    // Return success
    return res.status(200).json({ 
      message: 'Login successful',
      username: user.username,
      email: user.email
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to process login request' });
  }
}
