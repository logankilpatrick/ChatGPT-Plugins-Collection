import json
import os
import quart
import quart_cors
from quart import request
from pathlib import Path

app = quart_cors.cors(quart.Quart(__name__), allow_origin=["https://chat.openai.com"])

_NOTES_DIR = "notes"

# Create the notes directory if it doesn't exist
os.makedirs(_NOTES_DIR, exist_ok=True)

# This is the endpoint that OpenAI Chat will call to add a note
@app.post("/notes/<string:username>")
async def add_note(username):
    request = await quart.request.get_json(force=True)
    note_title = request["title"]
    note_content = request["content"]

    with open(f"{_NOTES_DIR}/{username}_{note_title}.md", "w") as f:
        f.write(note_content)

    return quart.Response(response='OK', status=200)

# This is the endpoint that OpenAI Chat will call to get the list of notes
@app.get("/notes/<string:username>")
async def get_notes(username):
    notes = []

    for file in Path(_NOTES_DIR).glob(f"{username}_*.md"):
        with open(file, "r") as f:
            content = f.read()
            notes.append({"title": file.stem[len(username) + 1:], "content": content})

    return quart.Response(response=json.dumps(notes), status=200)

# This is the endpoint that OpenAI Chat will call to delete a note
@app.delete("/notes/<string:username>")
async def delete_note(username):
    request = await quart.request.get_json(force=True)
    note_title = request["title"]

    note_path = Path(f"{_NOTES_DIR}/{username}_{note_title}.md")
    if note_path.exists():
        os.remove(note_path)

    return quart.Response(response='OK', status=200)

@app.get("/logo.png")
async def plugin_logo():
    filename = 'logo.png'
    return await quart.send_file(filename, mimetype='image/png')

@app.get("/.well-known/ai-plugin.json")
async def plugin_manifest():
    with open("./.well-known/ai-plugin.json") as f:
        text = f.read()
        return quart.Response(text, mimetype="text/json")

@app.get("/openapi.yaml")
async def openapi_spec():
    with open("openapi.yaml") as f:
        text = f.read()
        return quart.Response(text, mimetype="text/yaml")

def main():
    app.run(debug=True, host="0.0.0.0", port=5003)

if __name__ == "__main__":
    main()
