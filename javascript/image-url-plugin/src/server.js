const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5001;
const path = require("path");
const axios = require("axios");

app.use(express.json());
app.use(cors({ origin: "https://chat.openai.com" }));

app.get('/image', (req, res) => {
  const imageUrl = 'https://www.reddit.com/r/pics/comments/12efpe5/su%C5%82oszowa_poland_has_a_population_of_6000_all_of/';
  res.json({ image_url: imageUrl });
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
