const express = require("express");

const app = express();
app.use(express.json());

let notes = [];
let nextId = 1;

app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const note = { id: nextId++, title, content };
  notes.push(note);
  res.status(201).json(note);
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  const note = notes.find((n) => n.id === id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json(note);
});

app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const note = notes.find((n) => n.id === id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  note.title = title;
  note.content = content;
  res.json(note);
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(index, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notes API server running on port ${PORT}`);
});
