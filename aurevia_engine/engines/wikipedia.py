import httpx
from typing import List, Dict, Any
import urllib.parse
from engines.base import BaseEngine

class WikipediaEngine(BaseEngine):
    @property
    def name(self) -> str:
        return "Wikipedia"

    async def search(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        results = []
        try:
            # We use the wikipedia api directly
            url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json&origin=*&utf8=1"
            headers = {
                "User-Agent": "AureviaSearch/1.0 (aurevia.xoeris.com)"
            }
            
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, headers=headers)
            
            if res.status_code != 200:
                return results

            data = res.json()
            list_items = data.get("query", {}).get("search", [])
            
            # Wikipedia API returns paginated results in a single call, we'll just slice it for demo
            # Real pagination would use sroffset
            for item in list_items[:5]:
                title = item.get("title", "")
                url_href = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                
                snippet_html = item.get("snippet", "")
                # Simple strip HTML
                snippet = snippet_html.replace('<span class="searchmatch">', '').replace('</span>', '')
                
                results.append({
                    "title": title,
                    "url": url_href,
                    "snippet": snippet,
                    "source": "Reference"
                })
        except Exception as e:
            print(f"Wikipedia error: {e}")
        
        return results
