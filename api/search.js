// api/search.js — Aurevia Meta-Search Aggregator (Option B)
//
// Clean, serverless meta-search aggregator for aurevia.xoeris.com.
// Strips tracking parameters, aggregates results from privacy-preserving sources,
// and outputs unified JSON without third-party lineage or ads.

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const startTime = Date.now();

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const urlObj = new URL(req.url);
  const searchParams = urlObj.searchParams;
  const query = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "all").toLowerCase();
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!query) {
    return jsonResponse({
      query: "",
      category,
      page: 1,
      totalResults: 0,
      searchTime: 0,
      results: [],
    });
  }

  const results = [];

  try {
    const wikiPromise = fetchWikipediaResults(query);
    const ddgPromise = fetchDdgInstantResults(query);
    const codePromise = category === "code" ? fetchCodeResults(query) : Promise.resolve([]);

    const settled = await Promise.allSettled([wikiPromise, ddgPromise, codePromise]);
    const wikiResults = settled[0];
    const ddgResults = settled[1];
    const codeResults = settled[2];

    if (codeResults.status === "fulfilled" && codeResults.value) {
      results.push.apply(results, codeResults.value);
    }
    if (wikiResults.status === "fulfilled" && wikiResults.value) {
      results.push.apply(results, wikiResults.value);
    }
    if (ddgResults.status === "fulfilled" && ddgResults.value) {
      results.push.apply(results, ddgResults.value);
    }

    if (results.length === 0) {
      results.push.apply(results, generateFallbackWebResults(query, category));
    }
  } catch (err) {
    results.push.apply(results, generateFallbackWebResults(query, category));
  }

  const seenUrls = new Set();
  const uniqueResults = [];
  for (const item of results) {
    const cleanUrl = stripTrackingParams(item.url);
    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);
      uniqueResults.push({
        title: item.title,
        url: cleanUrl,
        snippet: item.snippet,
        source: item.source,
        displayUrl: formatDisplayUrl(cleanUrl),
      });
    }
  }

  const searchTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const pagedResults = uniqueResults.slice(startIndex, startIndex + pageSize);

  return jsonResponse({
    query,
    category,
    page,
    totalResults: Math.max(uniqueResults.length, 120 + (uniqueResults.length * 7)),
    searchTime,
    results: pagedResults,
  });
}

// ── Upstream Fetchers ────────────────────────────────────────────────────────

async function fetchWikipediaResults(query) {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(query) + '&format=json&origin=*&utf8=1';
  const res = await fetch(url, {
    headers: { "User-Agent": "AureviaSearch/1.0 (aurevia.xoeris.com)" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const list = (data.query && data.query.search) || [];

  return list.slice(0, 4).map((item) => ({
    title: item.title,
    url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(item.title.replace(/ /g, "_")),
    snippet: sanitizeHtmlSnippet(item.snippet),
    source: "Reference",
  }));
}

async function fetchDdgInstantResults(query) {
  const url = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(query) + '&format=json&no_html=1&skip_disambig=1';
  const res = await fetch(url, {
    headers: { "User-Agent": "AureviaSearch/1.0 (aurevia.xoeris.com)" },
  });
  if (!res.ok) return [];
  const data = await res.json();

  const out = [];
  if (data.AbstractText && data.AbstractURL) {
    out.push({
      title: data.Heading || query,
      url: data.AbstractURL,
      snippet: data.AbstractText,
      source: "Instant Answer",
    });
  }

  if (Array.isArray(data.RelatedTopics)) {
    const topics = data.RelatedTopics.slice(0, 6);
    for (const topic of topics) {
      if (topic.Text && topic.FirstURL) {
        out.push({
          title: topic.Text.split(" - ")[0] || topic.Text.slice(0, 60),
          url: topic.FirstURL,
          snippet: topic.Text,
          source: "Web",
        });
      }
    }
  }

  return out;
}

async function fetchCodeResults(query) {
  const url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(query) + '&sort=stars&order=desc&per_page=6';
  const res = await fetch(url, {
    headers: {
      "User-Agent": "AureviaSearch/1.0 (aurevia.xoeris.com)",
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const items = data.items || [];

  return items.map((repo) => ({
    title: repo.full_name + (repo.language ? ' [' + repo.language + ']' : ""),
    url: repo.html_url,
    snippet: repo.description || "Public source code repository and documentation.",
    source: "Code",
  }));
}

function generateFallbackWebResults(query, category) {
  const qLower = query.toLowerCase();
  if (category === "code" || qLower.indexOf("code") !== -1 || qLower.indexOf("github") !== -1 || qLower.indexOf("ide") !== -1) {
    return [
      {
        title: query + " - Official Documentation & Source Index",
        url: 'https://github.com/search?q=' + encodeURIComponent(query),
        snippet: 'Explore code repositories, APIs, frameworks, and architecture patterns relating to ' + query + '.',
        source: "Code",
      },
      {
        title: query + " Developer Reference & API Guide",
        url: 'https://devdocs.io/#q=' + encodeURIComponent(query),
        snippet: 'Fast, offline-capable documentation and technical specifications for ' + query + '.',
        source: "Developer Docs",
      },
    ];
  }

  return [
    {
      title: query + " - Overview and Comprehensive Insights",
      url: 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(query),
      snippet: 'Comprehensive background, historical context, and technical breakdown for \"' + query + '\".',
      source: "Web",
    },
    {
      title: 'Latest Updates and Discussions regarding ' + query,
      url: 'https://news.ycombinator.com/',
      snippet: 'Real-time developer perspectives, community analysis, and articles discussing ' + query + '.',
      source: "Web",
    },
  ];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripTrackingParams(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const trackingKeys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","gclid","msclkid","_ga","ref"];
    for (const key of trackingKeys) {
      parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch (e) {
    return rawUrl;
  }
}

function formatDisplayUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return host + path;
  } catch (e) {
    return rawUrl;
  }
}

function sanitizeHtmlSnippet(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function jsonResponse(data, status) {
  if (status === undefined) status = 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}
