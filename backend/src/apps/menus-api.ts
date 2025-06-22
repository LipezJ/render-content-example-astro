import { Hono } from 'hono';

import type { App } from '../index.js';
import { MenusManager } from '../lib/menus.js';

const app = new Hono<App>();

const menusManager = new MenusManager();

app.get('/', async (c) => {
  const role = c.get('role') || 'guest';
  const parentMenu = c.req.query('parentMenu');

  const menu = await menusManager.getMenuByRole(role,  parentMenu ? parseInt(parentMenu) : undefined);
  return c.json(menu);
});

export default app;
