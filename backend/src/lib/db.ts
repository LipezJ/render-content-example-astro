import Database from 'better-sqlite3';

const dbPath = './database.db';

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    path TEXT NOT NULL,
    protected BOOLEAN DEFAULT FALSE
  );
`);

export default db;