# Secret Message API

A FastAPI application that serves as a ChatGPT plugin for returning a secret message.

## Setup and Run

1. Navigate to the root directory of the Secret Message API.

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

   or

   ```
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Run the FastAPI application:
   ```
   uvicorn main:app --reload
   ```

The application will be accessible at "http://localhost:8000/".

## How It Works

The Secret Message API is a FastAPI application that serves as a ChatGPT plugin. It provides an endpoint `/secretMessage` that returns a secret message when accessed.

The main code for the application is in the `main.py` file. Here's a snippet of the code that defines the `/secretMessage` endpoint:

```python
@app.get('/secretMessage', description="Return the secret message from this app.")
async def root():
    return {'secret message': 'Hello ChatGPT'}
```

When a user accesses the `/secretMessage` endpoint, the application returns a JSON response containing the secret message "Hello ChatGPT".

The application also serves the manifest file (`ai-plugin.json`) at the `/.well-known/ai-plugin.json` path, which provides information about the plugin to ChatGPT.

The OpenAPI specification for the API is accessible at "http://localhost:8000/openapi.json" and provides details
 
## Setting Up the Plugin with ChatGPT

To set up the Secret Message API as a ChatGPT plugin, follow these steps:

1. Go to the "Develop your own plugin" section of the ChatGPT API documentation.

2. Input the localhost URL of the Secret Message API (e.g., "http://localhost:8000/") to set it up as a plugin.

3. Once the plugin is set up, you can interact with it through ChatGPT. For example, you can send the message "show me the secret message" to ChatGPT, and it will return the secret message provided by the Secret Message API.

The secret message is "Hello ChatGPT," and it will be returned by ChatGPT when you request the secret message.
