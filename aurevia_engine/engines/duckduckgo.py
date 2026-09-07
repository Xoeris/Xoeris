import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import urllib.parse
from engines.base import BaseEngine
from utils.user_agents import get_random_user_agent

class DuckDuckGoEngine(BaseEngine):
    @property
    def name(self) -> str:
        return "DuckDuckGo"

    async def search(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        results = []
        try:
            # DuckDuckGo HTML version uses a POST request for subsequent pages or a token, 
            # but for simple searches we can use the GET html endpoint
            # Note: pagination on DDG HTML without tokens is tricky, we'll fetch page 1
            url = "https://html.duckduckgo.com/html/"
            headers = {
                "User-Agent": get_random_user_agent(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            }
            data = {"q": query}
            
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, headers=headers, data=data)
            
            if res.status_code != 200:
                return results

            soup = BeautifulSoup(res.text, "html.parser")
            for result_div in soup.find_all("div", class_="result"):
                title_a = result_div.find("a", class_="result__url")
                if not title_a:
                    continue
                url_href = title_a.get("href")
                if url_href and url_href.startswith("//duckduckgo.com/l/?uddg="):
                    # Extract actual URL from DDG redirect
                    parsed = urllib.parse.urlparse(url_href)
                    qs = urllib.parse.parse_qs(parsed.query)
                    if "uddg" in qs:
                        url_href = qs["uddg"][0]
                
                title_text = title_a.text.strip()
                snippet_div = result_div.find("a", class_="result__snippet")
                snippet_text = snippet_div.text.strip() if snippet_div else ""
                
                if url_href and title_text:
                    results.append({
                        "title": title_text,
                        "url": url_href,
                        "snippet": snippet_text,
                        "source": self.name
                    })
        except Exception as e:
            print(f"DuckDuckGo error: {e}")
        
        return results
