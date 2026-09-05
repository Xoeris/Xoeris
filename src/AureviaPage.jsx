import React, { useState, useEffect, useRef } from "react";
import { AureviaSearchService } from "./services/AureviaSearchService";

export default function AureviaPage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  // Initialize from URL parameters
  useEffect(() => {
    const parseUrlParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlQuery = searchParams.get("q") || "";
      const urlCategory = searchParams.get("category") || "all";
      const urlPage = parseInt(searchParams.get("page") || "1", 10);

      setQuery(urlQuery);
      setActiveQuery(urlQuery);
      setCategory(urlCategory);
      setPage(urlPage);

      if (urlQuery.trim()) {
        executeSearch(urlQuery.trim(), urlCategory, urlPage);
      } else {
        setSearchData(null);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    parseUrlParams();

    const handlePopState = () => {
      parseUrlParams();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Execute Search
  const executeSearch = async (searchTerm, searchCategory, pageNumber) => {
    if (!searchTerm.trim()) {
      setSearchData(null);
      setActiveQuery("");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await AureviaSearchService.search({
        query: searchTerm,
        category: searchCategory,
        page: pageNumber,
      });
      setSearchData(data);
      setActiveQuery(searchTerm);
    } catch (err) {
      setError("Unable to complete search request. Please verify network connectivity.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const newUrl = buildSearchUrl(trimmed, category, 1);
    window.history.pushState(null, "", newUrl);

    setPage(1);
    setActiveQuery(trimmed);
    executeSearch(trimmed, category, 1);
  };

  // Direct Jump Handler ("Quick Match")
  const handleDirectJump = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const data = await AureviaSearchService.search({
        query: trimmed,
        category,
        page: 1,
      });
      if (data && data.results && data.results.length > 0) {
        window.open(data.results[0].url, "_blank", "noopener,noreferrer");
      } else {
        handleSearchSubmit();
      }
    } catch {
      handleSearchSubmit();
    } finally {
      setLoading(false);
    }
  };

  // Category Switch Handler
  const handleCategoryChange = (newCategory) => {
    if (newCategory === category) return;
    setCategory(newCategory);
    setPage(1);

    if (activeQuery.trim()) {
      const newUrl = buildSearchUrl(activeQuery, newCategory, 1);
      window.history.pushState(null, "", newUrl);
      executeSearch(activeQuery, newCategory, 1);
    }
  };

  // Pagination Handler
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const newUrl = buildSearchUrl(activeQuery, category, newPage);
    window.history.pushState(null, "", newUrl);
    executeSearch(activeQuery, category, newPage);
  };

  // Return to Homepage
  const handleResetToHome = () => {
    setQuery("");
    setActiveQuery("");
    setSearchData(null);
    setPage(1);
    const basePath = window.location.hostname.includes("aurevia.xoeris.com") ? "/" : "/aurevia";
    window.history.pushState(null, "", basePath);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const buildSearchUrl = (q, cat, p) => {
    const basePath = window.location.hostname.includes("aurevia.xoeris.com")
      ? "/search"
      : "/aurevia/search";
    const params = new URLSearchParams();
    params.set("q", q);
    if (cat !== "all") params.set("category", cat);
    if (p > 1) params.set("page", p.toString());
    return `${basePath}?${params.toString()}`;
  };

  const isSerpMode = Boolean(activeQuery.trim());

  return (
    <div className="min-h-screen bg-[#070709] text-[#F3F4F6] selection:bg-[#FFDE00]/30 selection:text-[#FFDE00] flex flex-col font-sans">
      {/* ── TOP UTILITY BAR ── */}
      <header className="border-b border-[#1A1A24] bg-[#0A0A0F]/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate ? onNavigate("xoeris") : (window.location.href = "https://xoeris.com")}
            className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-[#32F18A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Xoeris Core</span>
          </button>
          <span className="text-[#2A2A38] text-xs">|</span>
          <span className="text-[11px] uppercase tracking-widest text-[#FFDE00] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#32F18A] animate-pulse"></span>
            Aurevia Engine
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="hidden sm:inline bg-[#14141E] border border-[#222230] px-2.5 py-1 rounded-full text-[11px] text-gray-300">
            Zero Tracking • No Ads
          </span>
          <a
            href="https://xoeris.com/developers"
            className="hover:text-white transition-colors"
          >
            Documentation
          </a>
        </div>
      </header>

      {/* ── SERP HEADER (When query is active) ── */}
      {isSerpMode && (
        <div className="border-b border-[#1A1A24] bg-[#0A0A0F] px-4 sm:px-8 py-3 sticky top-[49px] z-20 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
            {/* Logo */}
            <button
              onClick={handleResetToHome}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left shrink-0"
              title="Return to Aurevia Search Home"
            >
              <AureviaLogoIcon className="w-7 h-7" />
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-[#FFDE00] to-[#32F18A] bg-clip-text text-transparent">
                AUREVIA
              </span>
            </button>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the web freely and privately..."
                className="w-full bg-[#12121A] border border-[#232332] focus:border-[#FFDE00] focus:ring-1 focus:ring-[#FFDE00] text-sm text-white placeholder-gray-500 rounded-full px-5 py-2.5 pr-20 outline-none transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-full"
                    title="Clear query"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="p-1.5 bg-[#FFDE00] hover:bg-[#F9CB43] text-black rounded-full transition-transform active:scale-95"
                  title="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Category Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  category === "all"
                    ? "bg-[#1E1E2C] text-[#FFDE00] border border-[#FFDE00]/30"
                    : "text-gray-400 hover:text-white hover:bg-[#14141E]"
                }`}
              >
                🌐 All
              </button>
              <button
                onClick={() => handleCategoryChange("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  category === "code"
                    ? "bg-[#1E1E2C] text-[#32F18A] border border-[#32F18A]/30"
                    : "text-gray-400 hover:text-white hover:bg-[#14141E]"
                }`}
              >
                💻 Code & Dev
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 1: HOMEPAGE (When no query is active) ── */}
      {!isSerpMode && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-4xl mx-auto w-full text-center z-10">
          {/* Hero Brand Mark */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FFDE00]/20 via-[#32F18A]/20 to-transparent blur-2xl group-hover:scale-110 transition-transform"></div>
            <AureviaLogoIcon className="w-20 h-20 mx-auto relative drop-shadow-[0_0_25px_rgba(255,222,0,0.3)]" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-2">
            <span className="bg-gradient-to-r from-[#FFDE00] via-[#F9CB43] to-[#32F18A] bg-clip-text text-transparent">
              AUREVIA
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto mb-8">
            The independent, privacy-first search engine engineered for developers and creators.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative mb-6">
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-[#FFDE00]/40 via-[#32F18A]/40 to-transparent shadow-2xl focus-within:from-[#FFDE00] focus-within:to-[#32F18A] transition-all">
              <div className="relative bg-[#0E0E15] rounded-2xl flex items-center px-5 py-4">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code, references, architectures, and the web..."
                  className="w-full bg-transparent border-none text-base sm:text-lg text-white placeholder-gray-500 outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 text-gray-500 hover:text-white mr-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFDE00] hover:bg-[#F9CB43] text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#FFDE00]/20"
              >
                Aurevia Search
              </button>
              <button
                type="button"
                onClick={handleDirectJump}
                className="px-6 py-2.5 bg-[#161622] hover:bg-[#1E1E2C] text-gray-200 hover:text-white border border-[#2A2A38] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                Direct Jump
              </button>
            </div>
          </form>

          {/* Value Props */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 w-full max-w-2xl">
            <FeaturePill title="Zero Tracking" desc="No profiles or cookies" icon="🛡️" />
            <FeaturePill title="Ad-Free Surface" desc="Pure organic signal" icon="🚫" />
            <FeaturePill title="Developer Index" desc="GitHub, docs & API" icon="💻" />
            <FeaturePill title="Horizone Sync" desc="Native IDE omnibox" icon="⚡" />
          </div>
        </main>
      )}

      {/* ── VIEW 2: SERP RESULTS (When query is active) ── */}
      {isSerpMode && (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 z-10">
          {/* Search Metrics Bar */}
          {searchData && !loading && (
            <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pb-2 border-b border-[#161620]">
              <div>
                About <span className="text-gray-300 font-medium">{searchData.totalResults?.toLocaleString()}</span> results
                ({searchData.searchTime} seconds)
              </div>
              <div className="text-[11px] text-[#32F18A] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#32F18A]"></span>
                URL tracking stripped
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-[#0E0E14] border border-[#1A1A24] rounded-xl p-5 animate-pulse">
                  <div className="h-3 w-48 bg-[#1E1E2C] rounded mb-2"></div>
                  <div className="h-5 w-3/4 bg-[#28283A] rounded mb-3"></div>
                  <div className="h-4 w-full bg-[#181822] rounded mb-1"></div>
                  <div className="h-4 w-2/3 bg-[#181822] rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-6 text-center my-6">
              <p className="text-red-400 text-sm mb-3">{error}</p>
              <button
                onClick={() => executeSearch(activeQuery, category, page)}
                className="px-4 py-2 bg-red-800/40 hover:bg-red-800/60 text-red-200 text-xs rounded-lg transition-colors"
              >
                Retry Search
              </button>
            </div>
          )}

          {/* Results List */}
          {!loading && searchData && searchData.results && searchData.results.length > 0 && (
            <div className="space-y-5">
              {searchData.results.map((item, idx) => (
                <article
                  key={idx}
                  className="group bg-[#0D0D14] hover:bg-[#11111B] border border-[#1A1A26] hover:border-[#2E2E3E] rounded-xl p-5 transition-all shadow-sm"
                >
                  {/* Source Badge & Display URL */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {item.source && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#1A1A26] text-[#FFDE00] border border-[#FFDE00]/20">
                        {item.source}
                      </span>
                    )}
                    <span className="text-xs text-[#32F18A] font-mono truncate max-w-md">
                      {item.displayUrl || item.url}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-[#60A5FA] group-hover:text-[#FFDE00] transition-colors mb-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus:underline focus:outline-none"
                    >
                      {item.title}
                    </a>
                  </h2>

                  {/* Snippet */}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.snippet}
                  </p>
                </article>
              ))}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-[#1A1A24] mt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 bg-[#12121A] hover:bg-[#1A1A24] disabled:opacity-40 disabled:pointer-events-none text-xs text-gray-300 font-semibold rounded-lg border border-[#222230] transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-xs text-gray-500 font-mono">
                  Page <strong className="text-white">{page}</strong>
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 bg-[#12121A] hover:bg-[#1A1A24] text-xs text-gray-300 font-semibold rounded-lg border border-[#222230] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Empty Results State */}
          {!loading && searchData && (!searchData.results || searchData.results.length === 0) && (
            <div className="bg-[#0E0E14] border border-[#1C1C28] rounded-2xl p-10 text-center my-8">
              <div className="w-12 h-12 rounded-full bg-[#1A1A24] text-[#FFDE00] flex items-center justify-center mx-auto mb-4 text-xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                No matching results found for "{activeQuery}"
              </h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
                Try refining your query, checking for spelling typos, or switching between the "All" and "Code & Dev" filters.
              </p>
              <button
                onClick={handleResetToHome}
                className="px-5 py-2 bg-[#FFDE00] text-black text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-[#F9CB43] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </main>
      )}

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-[#161622] bg-[#07070A] py-6 px-4 sm:px-8 text-center text-xs text-gray-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Aurevia Search Engine • Independent Provider Architecture by{" "}
            <span className="text-gray-300 font-medium">Xoeris</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Zero Data Profiling</span>
            <span>•</span>
            <span>Default in Horizone IDE</span>
            <span>•</span>
            <button onClick={handleResetToHome} className="hover:text-white transition-colors">
              Search Home
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Subcomponents ──

function FeaturePill({ title, desc, icon }) {
  return (
    <div className="bg-[#0E0E14] border border-[#1A1A24] rounded-xl p-3 text-left">
      <div className="text-base mb-1">{icon}</div>
      <div className="text-xs font-bold text-white">{title}</div>
      <div className="text-[11px] text-gray-500 leading-tight">{desc}</div>
    </div>
  );
}

function AureviaLogoIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <linearGradient id="aur-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDE00" />
          <stop offset="100%" stopColor="#32F18A" />
        </linearGradient>
        <linearGradient id="aur-grad-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#32F18A" />
          <stop offset="100%" stopColor="#FFDE00" />
        </linearGradient>
      </defs>
      {/* Outer Diamond / Compass */}
      <polygon
        points="50,6 94,50 50,94 6,50"
        stroke="url(#aur-grad-primary)"
        strokeWidth="5"
        fill="rgba(14, 14, 21, 0.9)"
      />
      {/* Inner Inverted Diamond */}
      <polygon
        points="50,22 78,50 50,78 22,50"
        stroke="url(#aur-grad-secondary)"
        strokeWidth="3"
        fill="rgba(255, 222, 0, 0.08)"
      />
      {/* Central Core Dot */}
      <circle cx="50" cy="50" r="7" fill="url(#aur-grad-primary)" />
      {/* Crosshairs */}
      <line x1="50" y1="10" x2="50" y2="20" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="80" x2="50" y2="90" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="50" x2="20" y2="50" stroke="#32F18A" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="50" x2="90" y2="50" stroke="#32F18A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
