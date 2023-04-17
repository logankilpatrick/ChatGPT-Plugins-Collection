# Run the FastAPI server using uvicorn
# You can run this script from the command line using the following command:
# uvicorn script_name:app --reload
# Replace "script_name" with the name of your script (e.g., "main" if your script is named "main.py")

import os
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
import json
import requests

app = FastAPI()

PORT=3333

origins = [
    f"http://localhost:{PORT}",
    "https://chat.openai.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model to specify the expected input format
class QueryInput(BaseModel):
    query: str

def upsert_web(path):
    print(f"Upsert URL: {path}")
    url = 'https://sidekick-server-ezml2kwdva-uc.a.run.app/upsert-web-data'
    headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Authorization": "Bearer 5e2eef94-cad0-46f0-bf1a-a5a14c743fb2",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Host": "sidekick-server-ezml2kwdva-uc.a.run.app",
    "Origin": "https://app.getsidekick.ai",
    "Referer": "https://app.getsidekick.ai/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15",
}

    data = {
    'urls': [path],
    'css_selector': ''
}

    response = requests.post(url, json=data, headers=headers)
    
    # Print the response status code and content (optional)
    print(response.status_code)
    response_json = response.json()
    print(response_json)
    return JSONResponse(response_json)


# Define the /logQuery endpoint
@app.post("/logQuery")
async def log_query(query_input: QueryInput):
    # Extract the query string from the input
    query = query_input.query
    splits  = query.split(";")
    if len(splits) == 1:
        print(f"only query")
    else:
        print(f"URL: {splits[0]}")
        upsert_web(splits[0])
        query = splits[1]

    # Log the query (for demonstration purposes, we'll just print it)
    print(f"Logged query: {query}")
    q = {
  "queries": [
    {
      "query": query
    }
  ],
  "possible_intents": [
    {
      "name": "string",
      "description": "string"
    }
  ]
}
    # Call sidekick with the query
    url = 'https://sidekick-server-ezml2kwdva-uc.a.run.app'
    ask_lmm_endpoint = url + '/ask-llm'
    headers = {
    "Authorization": "Bearer 5e2eef94-cad0-46f0-bf1a-a5a14c743fb2",
    "accept": "application/json",
    "Content-Type": "application/json"
    }
    # Define the data to be sent in the POST request
    
    data_json = json.dumps(q)
    
    # Send the POST request to the endpoint and store the response
    response = requests.post(ask_lmm_endpoint, data=data_json, headers=headers)
    response_json = response.json()
    
    # Print the response status code and content
    print(response_json["results"][0]["answer"])

    # Return a response
    return JSONResponse({"answer": response_json["results"][0]["answer"]})


@app.get("/.well-known/ai-plugin.json", include_in_schema=False)
async def ai_plugin():
    try:
        with open(".well-known/ai-plugin.json", "r") as f:
            content = json.load(f)
        return JSONResponse(content=content)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@app.route("/.well-known/logo.png")
async def get_logo(request):
    file_path = "./.well-known/logo.png"
    return FileResponse(file_path, media_type="text/json")


@app.route("/.well-known/openapi.yaml")
async def get_openapi(request):
    file_path = "./.well-known/openapi.yaml"
    return FileResponse(file_path, media_type="text/json")


# Include a '__main__' section to run the app using uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=3333)
