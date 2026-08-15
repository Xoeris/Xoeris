// api.xoeris.com/v1/chat/completions
//
// Thin auth + rate-limit layer in front of the RunPod Serverless XESC
// endpoint. Deployed as a Vercel Edge/Node function. Keeps the RunPod
// endpoint ID and API key server-side — never exposed to callers.

export const config = {
  runtime: "edge",
};

const RUNPOD_ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID;
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

// TODO: replace with a real store (Vercel KV / Upstash Redis) before going
// public. This in-memory placeholder resets on every cold start and is not
// shared across edge regions — fine for local testing only.
const VALID_KEYS = new Set((process.env.XOERIS_API_KEYS || "").split(",").filter(Boolean));

export default async function handler(req) {
  // --- CORS preflight ---
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // --- Auth ---
  const authHeader = req.headers.get("authorization") || "";
  const apiKey = authHeader.replace(/^Bearer\s+/i, "");

  if (!apiKey || !VALID_KEYS.has(apiKey)) {
    return json({ error: "Invalid or missing API key" }, 401);
  }

  // --- Rate limiting placeholder ---
  // TODO: hook up Upstash Redis (sliding window) keyed on apiKey before
  // public launch. Without this, a single key can exhaust your RunPod
  // budget.

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { messages, max_new_tokens, temperature, top_k } = body;
  if (!messages || !Array.isArray(messages)) {
    return json({ error: "`messages` array is required" }, 400);
  }

  // --- Forward to RunPod Serverless (sync endpoint) ---
  const runpodRes = await fetch(
    `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/runsync`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({
        input: { messages, max_new_tokens, temperature, top_k },
      }),
    }
  );

  if (!runpodRes.ok) {
    // TEMP DEBUG: surface RunPod's actual status/body so we can see why
    // the upstream call failed (bad endpoint ID, bad API key, etc).
    // Remove this once the root cause is confirmed — don't ship raw
    // upstream error bodies to the public API long-term.
    let runpodBody;
    try {
      runpodBody = await runpodRes.text();
    } catch {
      runpodBody = "<could not read body>";
    }
    return json(
      {
        error: "Upstream inference error",
        debug_runpod_status: runpodRes.status,
        debug_runpod_body: runpodBody,
        debug_endpoint_id_set: Boolean(RUNPOD_ENDPOINT_ID),
        debug_api_key_set: Boolean(RUNPOD_API_KEY),
      },
      502
    );
  }

  const runpodJson = await runpodRes.json();

  // RunPod wraps your handler's return value in { output: {...} }
  const output = runpodJson.output || {};

  return json(output, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
  });
}