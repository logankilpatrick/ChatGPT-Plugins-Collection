const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5004;
const path = require("path");
const axios = require("axios");
const { exec } = require("child_process");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors({ origin: "https://chat.openai.com" }));

app.post("/run-command", (req, res) => {
  const command = req.body.command;

  if (!command) {
    return res.status(400).json({ error: "No command provided" });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ stdout: stdout, stderr: stderr });
  });
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
