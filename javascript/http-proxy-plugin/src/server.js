const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5002;
const path = require("path");
const axios = require("axios");

app.use(express.json());
app.use(cors({ origin: "https://chat.openai.com" }));

app.post("/proxy", async (req, res) => {
  const { url, method, headers, body } = req.body;
  console.log(
    "Proxying request to",
    url,
    "with method",
    method,
    "and headers",
    headers,
    "and body",
    body
  );

  if (!url || !method) {
    return res.status(400).send("URL and method are required");
  }

  try {
    console.log("Making request to", url);

    const response = await axios({
      url,
      method,
      headers,
      data: body,
    });

    console.log("Received response from", url);

    res.json({
      status: response.status,
      headers: response.headers,
      body: response.data,
    });
  } catch (error) {
    console.error("Received error from", url);

    if (error.response) {
      res.status(500).json({
        status: error.response.status,
        headers: error.response.headers,
        body: error.response.data,
      });
    } else {
      res.status(500).send("Error proxying request");
    }
  }
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

// app.get("/openapi.json", (req, res) => {
//   const host = req.headers.host;

//   fs.readFile("openapi.json", "utf8", (err, buf) => {
//     let text = buf.toString();
//     if (err) {
//       res.status(404).send("Not found");
//     } else {
//       text = text.replace("PLUGIN_HOSTNAME", `http://${host}`);

//       res.status(200).type("text/json").send(text);
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
