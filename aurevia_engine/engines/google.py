import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import urllib.parse
from engines.base import BaseEngine
from utils.user_agents import get_random_user_agent

class GoogleEngine(BaseEngine):
    @property
    def name(self) -> str:
        return "Google"

    async def search(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        results = []
        try:
            start = (page - 1) * 10
            url = f"https://www.google.com/search?q={urllib.parse.quote(query)}&start={start}"
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
            
            # Google results are typically in div.g
            for result_div in soup.find_all("div", class_="g"):
                link = result_div.find("a")
                title_h3 = result_div.find("h3")
                
                if not link or not title_h3:
                    continue
                    
                url_href = link.get("href")
                if not url_href or not url_href.startswith("http"):
                    continue
                    
                title_text = title_h3.text.strip()
                
                # Finding snippet is tricky due to Google's dynamic classes
                snippet_text = ""
                # A common class for snippets in google is 'VwiC3b'
                snippet_div = result_div.find("div", class_="VwiC3b")
                if snippet_div:
                    snippet_text = snippet_div.text.strip()
                
                results.append({
                    "title": title_text,
                    "url": url_href,
                    "snippet": snippet_text,
                    "source": self.name
                })
        except Exception as e:
            print(f"Google error: {e}")
        
        return results
