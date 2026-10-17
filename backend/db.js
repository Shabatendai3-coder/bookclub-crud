const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'meetings.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_title VARCHAR(150) NOT NULL,
    book_title VARCHAR(200) NOT NULL,
    meeting_date DATE NOT NULL,
    location VARCHAR(150),
    organizer VARCHAR(120),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Check if we already have data
  db.get("SELECT COUNT(*) as count FROM meetings", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(`INSERT INTO meetings 
        (meeting_title, book_title, meeting_date, location, organizer, description) 
        VALUES (?, ?, ?, ?, ?, ?)`);

      const sample = [
        ["January Meet", "Things Fall Apart", "2026-01-15", "Library Hall", "Sarah Banda", "Discussion on Chinua Achebe classic"],
        ["February Meet", "Born a Crime", "2026-02-10", "Room B2", "John Mwanza", "Trevor Noah memoir review"],
        ["March Meet", "The Alchemist", "2026-03-12", "Online Zoom", "Grace Phiri", "Paulo Coelho inspiring journey"],
        ["April Meet", "Half of a Yellow Sun", "2026-04-08", "Main Hall", "David Tembo", "Chimamanda Ngozi Adichie"],
        ["May Meet", "Atomic Habits", "2026-05-20", "Library Hall", "Esther Zulu", "Self improvement book"],
        ["June Meet", "Rich Dad Poor Dad", "2026-06-18", "Room B2", "Peter Mwape", "Financial literacy"],
        ["July Meet", "Becoming", "2026-07-15", "Main Hall", "Linda Chilufya", "Michelle Obama autobiography"],
        ["August Meet", "The Great Gatsby", "2026-08-12", "Library", "Moses Kunda", "F. Scott Fitzgerald classic"],
        ["September Meet", "Purple Hibiscus", "2026-09-10", "Room B2", "Faith Mulenga", "Another Adichie book"],
        ["October Meet", "Educated", "2026-10-19", "Main Hall", "You", "Tara Westover memoir - current meeting"]
      ];

      sample.forEach(s => stmt.run(s));
      stmt.finalize();
      console.log("10 sample meetings inserted");
    }
  });
});

module.exports = db;