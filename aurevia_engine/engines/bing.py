import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import urllib.parse
from engines.base import BaseEngine
from utils.user_agents import get_random_user_agent

class BingEngine(BaseEngine):
    @property
    def name(self) -> str:
        return "Bing"

    async def search(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        results = []
        try:
            first = (page - 1) * 10 + 1
            url = f"https://www.bing.com/search?q={urllib.parse.quote(query)}&first={first}"
            headers = {
                "User-Agent": get_random_user_agent(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            }
            
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, headers=headers)
            
            if res.status_code != 200:
                return results

            soup = BeautifulSoup(res.text, "html.parser")
            
            for result_li in soup.find_all("li", class_="b_algo"):
                title_h2 = result_li.find("h2")
                if not title_h2:
                    continue
                
                link = title_h2.find("a")
                if not link:
                    continue
                    
                url_href = link.get("href")
                title_text = link.text.strip()
                
                snippet_div = result_li.find("div", class_="b_caption")
                snippet_text = ""
                if snippet_div:
                    p_tag = snippet_div.find("p")
                    if p_tag:
                        snippet_text = p_tag.text.strip()
                
                if url_href and title_text:
                    results.append({
                        "title": title_text,
                        "url": url_href,
                        "snippet": snippet_text,
                        "source": self.name
                    })
        except Exception as e:
            print(f"Bing error: {e}")
        
        return results
