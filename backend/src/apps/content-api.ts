import { Hono } from 'hono';

import { createContent, getAllContent, getContent, updateContent } from '../lib/content.js'
import type { App } from '../index.js';

const app = new Hono<App>();

app.get('/', async (c) => {
  const path = c.req.query('path');
  if (!path) {
    const allContent = await getAllContent();
    return c.json(allContent);
  }
  const content = await getContent(path);
  if (!content) {
    return c.json({ error: 'Content not found' }, 404);
  }
  return c.json(content);
})

app.post('/admin', async (c) => {
  const form = await c.req.formData();
  if (!form.has('title') || !form.has('description') || !form.has('content') || !form.has('path')) {
    return c.json({ error: 'Invalid content' }, 400);
  }
  
  const result = await createContent(form);
  return c.json(result);
})

app.put('/admin', async (c) => {
  const content = await c.req.json();
  const result = updateContent(content);
  return c.json(result);
})

export default app;