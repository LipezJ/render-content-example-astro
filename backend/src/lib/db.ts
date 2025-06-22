import Database from 'better-sqlite3';

const dbPath = './database.db';

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    path TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    parent INTEGER,
    role TEXT NOT NULL DEFAULT 'guest'
  );

  INSERT OR IGNORE INTO permissions (id, path, role) VALUES
    (1, '/admin/*', 'admin');

  INSERT OR IGNORE INTO menus (id, name, path, parent, role) VALUES
    (1, 'Dashboard', '/admin', NULL, 'admin'),
    (2, 'Manage content', '/admin/manage-contet', 1, 'admin'),
    (3, 'Content', '/complete-page', NULL, 'all'),
    (4, 'Guest content', '/content', NULL, 'guest'),
    (5, 'Content inside', '/complete-page', 4, 'guest');
`);


export default db;