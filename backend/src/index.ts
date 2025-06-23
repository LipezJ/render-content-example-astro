import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

import authApp from './apps/auth.js'
import menusApp from './apps/menus-api.js'
import contentApp from './apps/content-api.js'

export type App = {
  Variables: {
    role: string
  }
}

const app = new Hono<App>()

app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4321'],
  allowMethods: ['GET', 'POST', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.route('/', authApp)
app.route('/api/content', contentApp)
app.route('/api/menus', menusApp)

app.use('/*', serveStatic({ root: './static' }));

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
