require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/meetings -> List all
app.get('/api/meetings', (req, res) => {
  db.all("SELECT * FROM meetings ORDER BY meeting_date DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/meetings/:id -> Get one
app.get('/api/meetings/:id', (req, res) => {
  db.get("SELECT * FROM meetings WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Meeting not found" });
    res.json(row);
  });
});

// POST /api/meetings -> Create
app.post('/api/meetings', (req, res) => {
  const { meeting_title, book_title, meeting_date, location, organizer, description } = req.body;
  if (!meeting_title || !book_title || !meeting_date) {
    return res.status(400).json({ message: "meeting_title, book_title, meeting_date are required" });
  }
  const sql = `INSERT INTO meetings (meeting_title, book_title, meeting_date, location, organizer, description) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [meeting_title, book_title, meeting_date, location, organizer, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM meetings WHERE id = ?", [this.lastID], (err, row) => {
      res.status(201).json(row);
    });
  });
});

// PUT /api/meetings/:id -> Update
app.put('/api/meetings/:id', (req, res) => {
  const { meeting_title, book_title, meeting_date, location, organizer, description } = req.body;
  const sql = `UPDATE meetings SET meeting_title=?, book_title=?, meeting_date=?, location=?, organizer=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`;
  db.run(sql, [meeting_title, book_title, meeting_date, location, organizer, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Meeting not found" });
    db.get("SELECT * FROM meetings WHERE id = ?", [req.params.id], (err, row) => {
      res.json(row);
    });
  });
});

// DELETE /api/meetings/:id -> Delete
app.delete('/api/meetings/:id', (req, res) => {
  db.run("DELETE FROM meetings WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Meeting not found" });
    res.json({ message: "Deleted successfully", id: req.params.id });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/meetings`);
});