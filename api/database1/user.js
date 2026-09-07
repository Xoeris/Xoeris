import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Initialize DB table if it doesn't exist
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS Users (
        username VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (error) {
    console.error('Error creating table:', error);
    return res.status(500).json({ error: 'Failed to create table', details: error.message });
  }

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT username, email FROM Users WHERE username = ${username};`;
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else if (req.method === 'POST') {
    try {
      // In Vercel serverless functions, req.body might need to be parsed
      // If it's a stream, Vercel already parses it if content-type is application/json
      let parsedBody = req.body;
      if (typeof req.body === 'string') {
        parsedBody = JSON.parse(req.body);
      }
      
      const { email, password_hash } = parsedBody;
      
      if (!email || !password_hash) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      await sql`
        INSERT INTO Users (username, email, password_hash) 
        VALUES (${username}, ${email}, ${password_hash})
        ON CONFLICT (username) DO UPDATE 
        SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash;
      `;
      
      return res.status(200).json({ message: 'User created or updated successfully', username, email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create user', details: error.message, stack: error.stack });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
