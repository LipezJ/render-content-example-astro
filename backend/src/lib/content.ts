import db from './db.js';

interface Content {
  id?: number;
  title: string;
  description: string;
  content: string;
  path: string;
}

export const getContent = async (path: string): Promise<Content> => {
  const contentQuery = db.prepare(`SELECT * FROM content WHERE path = ?`);
  const content = contentQuery.get(path) as Content;

  if (!content) {
    throw new Error('Content not found');
  }

  return content;
}

export const getAllContent = async (): Promise<Content[]> => {
  const contentQuery = db.prepare(`SELECT * FROM content`);
  const contentList = contentQuery.all() as Content[];

  return contentList;
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

  if (result.changes === 0) {
    throw new Error('Failed to create content');
  }

  return { ok: true };
}

export const updateContent = async (content: Content) => {
  const contentQuery = db.prepare(`UPDATE content SET title = ?, description = ?, content = ?, path = ? WHERE path = ?`);
  const result = contentQuery.run(content.title, content.description, content.content, content.path, content.path);
  
  if (result.changes === 0) {
    throw new Error('Failed to update content');
  }

  return { ok: true };
}