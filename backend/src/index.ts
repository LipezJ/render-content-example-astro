import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'

import { createContent, getAllContent, getContent, updateContent } from './lib/content.js'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT'],
  allowHeaders: ['Content-Type'],
}))

app.get('/api/content', async (c) => {
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

app.post('/api/content', async (c) => {
  const form = await c.req.formData();
  if (!form.has('title') || !form.has('description') || !form.has('content') || !form.has('path')) {
    return c.json({ error: 'Invalid content' }, 400);
  }
  
  const result = await createContent(form);
  return c.json(result);
})

app.put('/api/content', async (c) => {
  const content = await c.req.json();
  const result = updateContent(content);
  return c.json(result);
})

app.use('/*', serveStatic({ root: './static' }))

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
