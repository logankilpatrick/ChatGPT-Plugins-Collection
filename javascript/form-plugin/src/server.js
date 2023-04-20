const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 4001;
const bodyParser = require("body-parser");

app.use(express.json());
// app.use(bodyParser.json());
app.use(cors({ origin: "https://chat.openai.com" }));

const forms = {
  1: {
    id: 1,
    name: "Form 1",
    fields: [
      {
        id: 1,
        name: "Field 1",
        type: "text",
        required: true,
        question: "What is your name?",
      },
      {
        id: 2,
        name: "Field 2",

        type: "text",
        required: true,
        question: "What is your email?",
      },
      {
        id: 3,

        name: "Field 3",
        type: "text",
        required: true,
        question: "What is your phone number?",
      },
    ],
  },
};

// ChatForm API
// When a plugin needs to request data from a user
// they can return them a chatformid
// this will trigger a chatform plugin to start a session
// and the plugin can then use the session id to submit data
// when the user submits the form, the plugin will be notified and submit the data
// to the form creator's plugin
// the form creator's plugin can then use the session id to retrieve the data
// and do whatever it needs to do with it

let sessionId = 1;
/*
  {
    id: 1,
    formId: number,
    currentQuestionId: number,
    data: {

    }

*/
const sessions = {};

app.post("/create-session", (req, res) => {
  const { form_id } = req.body;
  if (!form_id || !forms[form_id]) {
    return res.status(400).json({ error: "Invalid form_id" });
  }
  const session_id = sessionId++;
  const currentQuestionId = 0;
  const form = forms[form_id];
  const allQuestions = form.fields;

  sessions[session_id] = {
    id: session_id,
    form_id,
    currentQuestionId,
    data: {},
  };

  res.status(201).json({ session_id, currentQuestionId, allQuestions });
});

app.post("/submit-input", (req, res) => {
  const { session_id, user_input } = req.body;

  if (!session_id || !user_input) {
    return res.status(400).json({ error: "Missing session_id or user_input" });
  }

  // check the session id is valid
  if (!sessions[session_id]) {
    return res.status(400).json({ error: "Invalid session_id" });
  }

  const { form_id, currentQuestionId } = sessions[session_id];
  const form = forms[form_id];

  const currentQuestion = form.fields[currentQuestionId];
  const { id: questionId } = currentQuestion;

  // add the user input to the session data
  sessions[session_id].data[questionId] = user_input;

  // Increment the currentQuestionId in the session object
  sessions[session_id].currentQuestionId++;

  // if we have reached the end of the form, return the data
  if (sessions[session_id].currentQuestionId >= form.fields.length) {
    const { data } = sessions[session_id];
    return res.status(200).json({ data });
  }

  // otherwise return the next question
  const nextQuestionId = sessions[session_id].currentQuestionId;
  const nextQuestion = form.fields[nextQuestionId];

  res.status(200).json({ nextQuestionId, nextQuestion });
});

// submit the form!
app.post("/submit-form", (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  // Check if the session ID is valid
  if (!sessions[session_id]) {
    return res.status(400).json({ error: "Invalid session_id" });
  }

  // Retrieve the form and session data
  const formId = sessions[session_id].form_id;
  const form = forms[formId];
  const sessionData = sessions[session_id].data;

  // Perform any desired operations with the collected form data
  // For example, you can store the data, send it to another service, etc.
  console.log(`Form data for form ID ${formId}:`, sessionData);

  // Delete the session after the form has been submitted
  delete sessions[session_id];

  res.status(200).json({ message: "Form submitted successfully!" });
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
