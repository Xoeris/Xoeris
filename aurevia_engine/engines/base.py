from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseEngine(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    async def search(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        """
        Executes a search and returns a list of dictionaries with:
        {
            "title": str,
            "url": str,
            "snippet": str,
            "source": str
        }
        """
        pass
