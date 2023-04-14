# AnimalGPT (Julia)

## Overview

AnimalGPT is a plugin for ChatGPT that allows users to manage a virtual zoo of animals. With this plugin, users can create, update, delete, and view animals in the zoo.

## Setup and Run

1. Navigate to the root directory of the AnimalGPT (Julia) plugin.

2. Start the server by running `julia animal.jl`.

The application will be accessible at the specified address and port (default is 0.0.0.0:5002).

## How It Works

The AnimalGPT plugin provides endpoints to manage animals in the zoo. The main code for the application is in the `animal.jl` file. Here are some of the available endpoints:

- `POST /api/zoo/v1/animals`: Create a new animal in the zoo.
- `GET /api/zoo/v1/animals/{id}`: Retrieve information about an animal in the zoo by ID.
- `PUT /api/zoo/v1/animals`: Update information about an animal in the zoo.
- `DELETE /api/zoo/v1/animals/{id}`: Delete an animal from the zoo by ID.

When a user interacts with these endpoints, the application performs the corresponding actions on the animals in the zoo.

## Setting Up the Plugin with ChatGPT

To set up the AnimalGPT (Julia) plugin as a ChatGPT plugin, follow the instructions provided in the "Develop your own plugin" section of the ChatGPT API documentation. Input the URL of the AnimalGPT plugin to set it up as a plugin.

Once the plugin is set up, you can interact with it through ChatGPT. For example, you can send messages to create, update, delete, and view animals in the zoo, and ChatGPT will interact with the AnimalGPT plugin to perform the requested actions.
