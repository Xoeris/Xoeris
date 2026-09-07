import asyncio
from typing import List, Dict, Any
from engines.duckduckgo import DuckDuckGoEngine
from engines.google import GoogleEngine
from engines.bing import BingEngine
from engines.wikipedia import WikipediaEngine
from utils.cleaner import strip_tracking_params, format_display_url

class Aggregator:
    def __init__(self):
        self.engines = [
            DuckDuckGoEngine(),
            GoogleEngine(),
            BingEngine(),
            WikipediaEngine()
        ]

    async def search(self, query: str, category: str = "all", page: int = 1) -> Dict[str, Any]:
        tasks = []
        for engine in self.engines:
            tasks.append(engine.search(query, page))
        
        # Gather all results concurrently
        raw_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Merge results
        merged = []
        for i, res in enumerate(raw_results):
            if isinstance(res, Exception):
                engine_name = self.engines[i].name
                print(f"Engine {engine_name} failed: {res}")
                continue
            merged.extend(res)
            
        # Deduplicate and Clean
        seen_urls = set()
        unique_results = []
        
        # Prioritize Wikipedia/Reference first if we want, or just round-robin
        # For simplicity, we just iterate and dedup
        for item in merged:
            clean_url = strip_tracking_params(item["url"])
            if clean_url not in seen_urls:
                seen_urls.add(clean_url)
                item["url"] = clean_url
                item["displayUrl"] = format_display_url(clean_url)
                unique_results.append(item)
        
        # Simple sorting: we can keep the order from gather, which is DDG -> Google -> Bing -> Wiki.
        # But we might want Wikipedia at the top. Let's pull Reference items to the top.
        references = [r for r in unique_results if r.get("source") == "Reference"]
        others = [r for r in unique_results if r.get("source") != "Reference"]
        
        final_results = references + others
        
        return {
            "query": query,
            "category": category,
            "page": page,
            "totalResults": len(final_results) * 10, # Fake total for UI
            "results": final_results[:10] # Return top 10 for the page
        }
