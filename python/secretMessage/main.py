from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(
    title="Secret Message API",
    description="An API that returns a secret message.",
    version="1.0.0",
)

# Enable CORS for https://chat.openai.com/
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chat.openai.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the manifest content from the ai-plugin.json file
with open('ai-plugin.json', 'r') as manifest_file:
    manifest_content = json.load(manifest_file)

# Serve the manifest file at the /.well-known/ai-plugin.json path
@app.get("/.well-known/ai-plugin.json")
async def serve_manifest():
    return manifest_content

@app.get('/secretMessage', description="Return the secret message from this app.")
async def root():
    return {'secret message': 'Hello ChatGPT'}

# Run the application using: uvicorn main:app --reload
