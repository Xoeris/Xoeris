import { allowedOriginFor } from '../_lib/auth.js';
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', allowedOriginFor(req));
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || '';
  return res.status(200).json({ clientId });
}
