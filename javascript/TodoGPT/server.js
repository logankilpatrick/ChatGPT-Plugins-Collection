const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5003;

app.use(express.json());
app.use(cors({ origin: 'https://chat.openai.com' }));

const todos = {};

app.post('/todos/:username', (req, res) => {
  const username = req.params.username;
  const todo = req.body.todo;

  if (!todos[username]) {
    todos[username] = [];
  }

  todos[username].push(todo);
  res.status(200).send('OK');
});

app.get('/todos/:username', (req, res) => {
  const username = req.params.username;
  res.status(200).json(todos[username] || []);
});

app.delete('/todos/:username', (req, res) => {
  const username = req.params.username;
  const todoIdx = req.body.todo_idx;

  if (todos[username] && 0 <= todoIdx && todoIdx < todos[username].length) {
    todos[username].splice(todoIdx, 1);
  }

  res.status(200).send('OK');
});

app.get('/logo.png', (req, res) => {
  res.sendFile('logo.png', { root: __dirname }, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.get('/.well-known/ai-plugin.json', (req, res) => {
  console.log("Trying to load plugin.json");
  const host = req.headers.host;
  fs.readFile('./.well-known/ai-plugin.json', (err, text) => {
    if (err) {
      res.status(404).send('Not found');
    } else {
      text = text.replace('PLUGIN_HOSTNAME', `http://${host}`);
      res.status(200).type('text/json').send(text);
    }
  });
});

app.get('/openapi.yaml', (req, res) => {
  const host = req.headers.host;
  fs.readFile('openapi.yaml', 'utf8', (err, text) => {
    if (err) {
      res.status(404).send('Not found');
    } else {
      text = text.replace('PLUGIN_HOSTNAME', `http://${host}`);
      res.status(200).type('text/yaml').send(text);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
