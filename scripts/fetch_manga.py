import os
import requests
import json

BASE_URL = "https://api.myanimelist.net/v2/manga/ranking"
OUTPUT = "data/top500manga.json"

api_key = os.getenv("MAL_API_KEY")
if not api_key:
    print("API_KEY not found in environment variables")
    exit(1)

headers = {
    "X-MAL-CLIENT-ID": api_key
}
params = {
    "limit": 500,
    "fields": "genres,ranking"
}

response = requests.get(BASE_URL, headers=headers, params=params)
if response.status_code != 200:
    print(f"Failed to fetch manga: {response.status_code}")
    exit(1)

mangaResponse = response.json()
with open(OUTPUT, "w+") as f:
    json.dump(mangaResponse, f, indent=4)

print("Fetched manga successfully")
