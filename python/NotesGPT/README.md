# NotesGPT (Python)

## Overview

NotesGPT is a plugin for ChatGPT that allows users to manage their notes. With this plugin, users can create, retrieve, and delete notes.

## Setup and Run

1. Navigate to the root directory of the NotesGPT (Python) plugin.

2. Install the required dependencies by running `pip install quart quart-cors`.

3. Start the server by running `python server.py`.

The application will be accessible at the specified address and port (default is 0.0.0.0:5003).

## How It Works

The NotesGPT plugin provides endpoints to manage notes. The main code for the application is in the `server.py` file. Here are some of the available endpoints:

- `POST /notes/:username`: Create a new note for the specified user.
- `GET /notes/:username`: Retrieve a list of all notes for the specified user.
- `DELETE /notes/:username`: Delete an existing note for the specified user based on the title provided in the request body.

When a user interacts with these endpoints, the application performs the corresponding actions on the notes.

## Setting Up the Plugin with ChatGPT

To set up the NotesGPT (Python) plugin as a ChatGPT plugin, follow the instructions provided in the "Develop your own plugin" section of the ChatGPT API documentation. Input the URL of the NotesGPT plugin to set it up as a plugin.

Once the plugin is set up, you can interact with it through ChatGPT. For example, you can send messages to create, retrieve, and delete notes, and ChatGPT will interact with the NotesGPT plugin to perform the requested actions.
