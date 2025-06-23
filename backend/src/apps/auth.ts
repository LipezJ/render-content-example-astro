import { Hono } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { v4 as uuid } from 'uuid'

import type { App } from '../index.js';
import { PermissionManager } from '../lib/permissions.js';

const app = new Hono<App>()

const SECRET = 'secret-key' // Replace with a secure secret key in production
const sessions = new Map<string, string>()
const permissionManager = new PermissionManager();

app.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const role = body.role as string
  const password = body.password

  if (password === '123') {
    const sessionId = uuid()
    sessions.set(sessionId, role)

    await setSignedCookie(c, 'session', sessionId, SECRET, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      domain: 'localhost',
      path: '/',
    })

    const url = new URL(c.req.header('Origin') || c.req.url)
    console.log(`Origin URL: ${url.origin}`)
    return c.redirect(`${url.origin}/`, 303)
  }
  
  return c.text('Invalid credentials', 401)
})

app.get('/logout', async (c) => {
  const sessionId = await getSignedCookie(c, SECRET, 'session')
  if (sessionId) sessions.delete(sessionId)
  c.set('role', 'guest')
  c.header('Set-Cookie', 'session=; Path=/; Max-Age=0; HttpOnly')
  const url = new URL(c.req.header('Origin') || c.req.url)
  return c.redirect(`${url.origin}/login`, 303)
})

app.use('*', async (c, next) => {
  console.log(`Request path: ${c.req.path}`)
  console.log(`Sessions:`, Array.from(sessions.entries()))
  const sessionId = await getSignedCookie(c, SECRET, 'session')
  let role = 'guest'
  console.log(`Session ID: ${sessionId}`)

  if (sessionId && sessions.has(sessionId)) {
    role = sessions.get(sessionId) || 'guest'
  }

  const path = c.req.path
  const isAuthorized = await permissionManager.isAuthorized(path, role)

  if (!isAuthorized) {
    return c.text('Unauthorized', 403)
  }

  c.set('role', role)
  return next()
})

export default app
