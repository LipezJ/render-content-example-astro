import db from './db.js';

interface Content {
  id?: number;
  title: string;
  description: string;
  content: string;
  path: string;
}

export const getContent = async (path: string): Promise<Content> => {
  const contentQuery = "SELECT * FROM content WHERE path = ?";
  
  return new Promise((resolve, reject) => {
    db.get(contentQuery, path, (err, row: Content) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export const getAllContent = async (): Promise<Content[]> => {
  const contentQuery = "SELECT * FROM content";
  return new Promise((resolve, reject) => {
    db.all(contentQuery, [], (err, rows: Content[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export const createContent = async (form: FormData) => {
  const content: Content = {
    title: form.get('title') as string,
    description: form.get('description') as string,
    content: form.get('content') as string,
    path: form.get('path') as string,
  };

  const contentQuery = db.prepare(`INSERT INTO content (title, description, content, path) VALUES (?, ?, ?, ?)`);
  const result = contentQuery.run(content.title, content.description, content.content, content.path);
  contentQuery.finalize();

  return result;
}

export const updateContent = async (content: Content) => {
  const contentQuery = db.prepare(`UPDATE content SET title = ?, description = ?, content = ?, path = ? WHERE path = ?`);
  const result = contentQuery.run(content.title, content.description, content.content, content.path, content.path);
  contentQuery.finalize();

  return result;
}