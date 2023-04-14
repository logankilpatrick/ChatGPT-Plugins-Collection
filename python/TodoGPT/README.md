# TodoGPT (Python)

## Overview

TodoGPT is a plugin for ChatGPT that allows users to manage their to-do items. With this plugin, users can create, retrieve, and delete their to-do items.

## Setup and Run

1. Navigate to the root directory of the TodoGPT (Python) plugin.

2. Install the required dependencies by running `pip install quart quart-cors`.

3. Start the server by running `python server.py`.

The application will be accessible at the specified address and port (default is 0.0.0.0:5002).

## How It Works

The TodoGPT plugin provides endpoints to manage to-do items. The main code for the application is in the `server.py` file. Here are some of the available endpoints:

- `POST /todos/:username`: Create a new to-do item for the specified user.
- `GET /todos/:username`: Retrieve a list of all to-do items for the specified user.
- `DELETE /todos/:username`: Delete an existing to-do item for the specified user based on the index provided in the request body.

When a user interacts with these endpoints, the application performs the corresponding actions on the to-do items.

## Setting Up the Plugin with ChatGPT

To set up the TodoGPT (Python) plugin as a ChatGPT plugin, follow the instructions provided in the "Develop your own plugin" section of the ChatGPT API documentation. Input the URL of the TodoGPT plugin to set it up as a plugin.

Once the plugin is set up, you can interact with it through ChatGPT. For example, you can send messages to create, retrieve, and delete to-do items, and ChatGPT will interact with the TodoGPT plugin to perform the requested actions.
