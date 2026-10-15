// api.xoeris.com/v1/chat/completions
//
// Thin auth + rate-limit layer in front of the RunPod Serverless XESC
// endpoint. Deployed as a Vercel Edge/Node function. Keeps the RunPod
// endpoint ID and API key server-side — never exposed to callers.

export const config = {
  runtime: "edge",
};

const ALLOWED_ORIGINS = ["https://xoeris.com", "https://www.xoeris.com", "https://xalme.xoeris.com", "https://api.xoeris.com"];
const MAX_TOKENS = 2048;
const RATE_LIMIT_PER_MIN = 20;
const rateBuckets = new Map(); // per-instance fallback; use Upstash/KV for real enforcement

function allowedOrigin(req) {
  const o = req.headers.get("origin") || "";
  if (!o) return ALLOWED_ORIGINS[0];
  if (ALLOWED_ORIGINS.includes(o)) return o;
  try {
    const url = new URL(o);
    if (url.hostname.endsWith(".xoeris.com") || url.hostname === "xoeris.com" || url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return o;
    }
  } catch {}
  return ALLOWED_ORIGINS[0];
}

// Distributed fixed-window limit via Upstash Redis REST (set UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN in Vercel). Falls back to in-memory if unset.
async function rateLimited(key) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const window = Math.floor(Date.now() / 60000);
  if (url && token) {
    const k = `rl:${key}:${window}`;
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", k], ["EXPIRE", k, 120]]),
    });
    if (!res.ok) return true; // fail closed if the limiter is unreachable
    const data = await res.json();
    return Number(data[0]?.result) > RATE_LIMIT_PER_MIN;
  }
  const now = Date.now();
  const bucket = (rateBuckets.get(key) || []).filter((t) => now - t < 60000);
  if (bucket.length >= RATE_LIMIT_PER_MIN) { rateBuckets.set(key, bucket); return true; }
  bucket.push(now);
  rateBuckets.set(key, bucket);
  return false;
}

const RUNPOD_ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID;
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

// TODO: replace with a real store (Vercel KV / Upstash Redis) before going
// public. This in-memory placeholder resets on every cold start and is not
// shared across edge regions — fine for local testing only.
const VALID_KEYS = new Set((process.env.XOERIS_API_KEYS || "").split(",").filter(Boolean));

export default async function handler(req) {
  const origin = allowedOrigin(req);

  // --- CORS preflight ---
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  // --- Auth ---
  const authHeader = req.headers.get("authorization") || "";
  const apiKey = authHeader.replace(/^Bearer\s+/i, "");

  if (!apiKey || !VALID_KEYS.has(apiKey)) {
    return json({ error: "Invalid or missing API key" }, 401, origin);
  }
  if (await rateLimited(apiKey)) {
    return json({ error: "Rate limit exceeded" }, 429, origin);
  }

  // --- Rate limiting placeholder ---
  // TODO: hook up Upstash Redis (sliding window) keyed on apiKey before
  // public launch. Without this, a single key can exhaust your RunPod
  // budget.

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, origin);
  }

  const { messages, temperature, top_k } = body;
  const max_new_tokens = Math.min(Number(body.max_new_tokens) || 512, MAX_TOKENS);
  if (!messages || !Array.isArray(messages)) {
    return json({ error: "`messages` array is required" }, 400, origin);
  }

  // --- Forward to RunPod Serverless (sync endpoint) ---
  const url = 'https://api.runpod.ai/v2/' + RUNPOD_ENDPOINT_ID + '/runsync';
  const runpodRes = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + RUNPOD_API_KEY,
      },
      body: JSON.stringify({
        input: { messages, max_new_tokens, temperature, top_k },
      }),
    }
  );

  if (!runpodRes.ok) {
    return json({ error: "Upstream inference error" }, 502, origin);
  }

  const runpodJson = await runpodRes.json();

  // RunPod wraps your handler's return value in { output: {...} }
  const output = runpodJson.output || {};

  return json(output, 200, origin);
}

function json(obj, status, origin = ALLOWED_ORIGINS[0]) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": origin
    },
  });
}
