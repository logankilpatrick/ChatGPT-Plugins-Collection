const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5003;
const path = require("path");

app.use(express.json());
app.use(cors({ origin: "https://chat.openai.com" }));

const root = "./chatfiles";

// List files and directories
app.post("/fs/list", (req, res) => {
  console.log("Request to list files");

  const { path: reqPath, filename = "" } = req.body;
  const requestedPath = path.join(
    root,
    path.normalize(reqPath),
    path.normalize(filename)
  );

  console.log("Requested path: " + requestedPath);

  fs.stat(requestedPath, (err, stats) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Path not found");
        return res.status(404).send("Path not found");
      }
      console.log("Error accessing path");
      return res.status(500).send("Error accessing path");
    }

    if (stats.isDirectory()) {
      fs.readdir(requestedPath, (err, files) => {
        if (err) {
          console.log("Error reading directory");
          return res.status(500).send("Error reading directory");
        }
        console.log("Files: " + files);
        res.json(files);
      });
    } else {
      console.log("Path is not a directory");
      res.status(400).send("Path is not a directory");
    }
  });
});

// Read a file
app.post("/fs/read", (req, res) => {
  const { path: reqPath } = req.body;
  const fullPath = path.join(root, path.normalize(reqPath));

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).send({ error: "File not found" });
      return;
    }

    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) {
        res.status(500).send({ error: "Error reading file" });
      } else {
        res.send({ content: data });
      }
    });
  });
});

// Append to a file
app.post("/fs/append", (req, res) => {
  const { path: reqPath, content } = req.body;
  const fullPath = path.join(root, path.normalize(reqPath));

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).send({ error: "File not found" });
      return;
    }

    fs.appendFile(fullPath, content, "utf8", (err) => {
      if (err) {
        res.status(500).send({ error: "Error appending to file" });
      } else {
        res.send({ message: "Content successfully appended to file" });
      }
    });
  });
});

// Create a file or directory
app.post("/fs/create", (req, res) => {
  const { path: reqPath, filename = "", type, content } = req.body;
  const requestedPath = path.join(
    root,
    path.normalize(reqPath),
    path.normalize(filename)
  );

  fs.exists(requestedPath, (exists) => {
    if (exists) {
      return res.status(400).send("Path already exists");
    }

    if (type === "file") {
      fs.writeFile(requestedPath, content || "", (err) => {
        if (err) {
          return res.status(500).send("Error creating file");
        }
        res.status(201).send("File created");
      });
    } else if (type === "directory") {
      fs.mkdir(requestedPath, (err) => {
        if (err) {
          return res.status(500).send("Error creating directory");
        }
        res.status(201).send("Directory created");
      });
    } else {
      res.status(400).send("Invalid type");
    }
  });
});

// ---- unused ----

// Upsert a file or directory
app.post("/fs/upsert", (req, res) => {
  const { path: reqPath, content, isDirectory } = req.body;
  const fullPath = path.join(root, path.normalize(reqPath));

  fs.stat(fullPath, (err, stats) => {
    if (err && err.code !== "ENOENT") {
      res.status(500).send({ error: "Error accessing the path" });
      return;
    }

    if (isDirectory) {
      fs.mkdir(fullPath, { recursive: true }, (err) => {
        if (err) {
          res.status(500).send({ error: "Error creating directory" });
        } else {
          res.send({ message: "Directory upserted successfully" });
        }
      });
    } else {
      fs.writeFile(fullPath, content, "utf8", (err) => {
        if (err) {
          res.status(500).send({ error: "Error upserting file" });
        } else {
          res.send({ message: "File upserted successfully" });
        }
      });
    }
  });
});

// Create a file or directory
app.post("/fs/create", (req, res) => {
  const { path: reqPath, filename = "", type, content } = req.body;
  const requestedPath = path.join(
    root,
    path.normalize(reqPath),
    path.normalize(filename)
  );

  fs.exists(requestedPath, (exists) => {
    if (exists) {
      return res.status(400).send("Path already exists");
    }

    if (type === "file") {
      fs.writeFile(requestedPath, content || "", (err) => {
        if (err) {
          return res.status(500).send("Error creating file");
        }
        res.status(201).send("File created");
      });
    } else if (type === "directory") {
      fs.mkdir(requestedPath, (err) => {
        if (err) {
          return res.status(500).send("Error creating directory");
        }
        res.status(201).send("Directory created");
      });
    } else {
      res.status(400).send("Invalid type");
    }
  });
});

// Update a file
app.post("/fs/update", (req, res) => {
  const { path: reqPath, content } = req.body;
  const fullPath = path.join(root, path.normalize(reqPath));

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).send({ error: "File not found" });
      return;
    }

    fs.writeFile(fullPath, content, "utf8", (err) => {
      if (err) {
        res.status(500).send({ error: "Error updating file" });
      } else {
        res.send({ message: "File updated successfully" });
      }
    });
  });
});

app.get("/logo.png", (req, res) => {
  res.sendFile("logo.png", { root: __dirname }, (err) => {
    if (err) res.status(404).send("Not found");
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
