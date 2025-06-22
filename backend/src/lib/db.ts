import sqlite from 'sqlite3';
const dbPath = './database.db';

const db = new sqlite.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      path TEXT NOT NULL
    );
  `);  
});

export default db;