const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 4001;
const bodyParser = require("body-parser");

app.use(express.json());
// app.use(bodyParser.json());
app.use(cors({ origin: "https://chat.openai.com" }));

const commands = {
  search: {
    description: "Searches for content, people, or groups based on the query",
    schema: {
      query: "Your search query here",
    },
  },

  // ...add more commands here with schemas
};

app.get("/help", (req, res) => {
  res.status(200).json({
    instructions:
      "to use any of these, you must use the runCommand operation and provide the schema as the data field in the request body.",
    commands,
  });
});

app.post("/run-command", (req, res) => {
  const { commandName, data } = req.body;

  console.log(data);

  const command = commands[commandName.toLowerCase()];

  if (!command) {
    return res.status(404).json({ error: "Command not found" });
  }

  // Mock data for each command
  const mockData = {
    search: {
      result: [
        {
          title: "Search result 1",
          description: "Description of search result 1",
        },
      ],
    },
    //...add mock data here
  };

  const result =
    mockData[commandName] || `Command ${commandName} executed successfully`;

  res.status(200).json({ result });
});

app.get("/.well-known/ai-plugin.json", (req, res) => {
  console.log("Trying to load plugin.json");
  const host = req.headers.host;
  fs.readFile("./.well-known/ai-plugin.json", (err, buf) => {
    let text = buf.toString();
    if (err) {
      res.status(404).send("Not found");
    } else {
      text = text.replace("PLUGIN_HOSTNAME", `http://${host}`);
      res.status(200).type("text/json").send(text);
    }
  });
});

app.get("/openapi.yaml", (req, res) => {
  const host = req.headers.host;
  fs.readFile("openapi.yaml", "utf8", (err, buf) => {
    let text = buf.toString();
    if (err) {
      res.status(404).send("Not found");
    } else {
      text = text.replace("PLUGIN_HOSTNAME", `http://${host}`);
      res.status(200).type("text/yaml").send(text);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
