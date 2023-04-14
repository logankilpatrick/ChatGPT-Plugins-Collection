# SquareGPT (Julia)

## Overview

SquareGPT is a plugin for ChatGPT that calculates the square of a given number. With this plugin, users can input a number and receive the square of that number as the output.

## Setup and Run

1. Navigate to the root directory of the SquareGPT (Julia) plugin.

2. Start the server by running `julia main.jl`.

The application will be accessible at the specified address and port (default is 0.0.0.0:5002).

## How It Works

The SquareGPT plugin provides an endpoint to calculate the square of a given number. The main code for the application is in the `main.jl` file. Here is the available endpoint:

- `POST /api/square`: Calculate the square of the input number provided in the request body.

When a user interacts with this endpoint, the application calculates the square of the input number and returns the result.

## Setting Up the Plugin with ChatGPT

To set up the SquareGPT (Julia) plugin as a ChatGPT plugin, follow the instructions provided in the "Develop your own plugin" section of the ChatGPT API documentation. Input the URL of the SquareGPT plugin to set it up as a plugin.

Once the plugin is set up, you can interact with it through ChatGPT. For example, you can send a message with a number to calculate its square, and ChatGPT will interact with the SquareGPT plugin to perform the calculation and return the result.
