import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
// @ts-ignore
import { handler as ssrHandler } from '../dist/server/entry.mjs';

const app = Fastify();
const BACKEND_URL = 'http://localhost:3000'

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('../dist/client', import.meta.url)),
  })
  .register(fastifyMiddie);

app.use(async (req, res, next) => {
  const response = await fetch(
    `${BACKEND_URL}/api/auth/check?path=${req.url}`, 
    {
      credentials: 'include',
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    }
  )

  const authData = await response.json()

  if (authData.ok && !authData.is_authotized) {
    res.writeHead(401, "Unathorized")
    return res.end()
  }

  next()
})

app.use(ssrHandler);

app.listen({ port: 8080 });