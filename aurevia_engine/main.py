import time
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from aggregator import Aggregator

app = FastAPI(title="Aurevia Search API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aggregator = Aggregator()

@app.get("/api/search")
async def search(
    q: str = Query(..., min_length=1),
    category: str = Query("all"),
    page: int = Query(1, ge=1)
):
    start_time = time.time()
    
    results = await aggregator.search(q, category, page)
    
    search_time = round(time.time() - start_time, 2)
    results["searchTime"] = search_time
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
