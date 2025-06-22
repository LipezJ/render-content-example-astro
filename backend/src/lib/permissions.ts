import db from './db.js';

export interface Permission {
  id?: number;
  path: string; // can be a url or a regex pattern
  role: string;
}

const getPermissions = async (): Promise<Permission[]> => {
  const permissionsQuery = db.prepare(`SELECT * FROM permissions`);
  const permissions = permissionsQuery.all() as Permission[];

  if (!permissions) {
    throw new Error('Permissions not found');
  }

  return permissions;
};

const setPermission = async (permission: Permission): Promise<void> => {
  const { path, role } = permission;
  const insertQuery = db.prepare(`
    INSERT INTO permissions (path, role)
    VALUES (?, ?, ?)
  `);
  insertQuery.run(path, role);
};

export class PermissionManager {
  public permissions: Permission[]  | null;

  constructor() {
    this.permissions = null;
  }

  public async loadPermissions(): Promise<void> {
    this.permissions = await getPermissions();
  }

  public async setPermission(form: FormData): Promise<void> {
    const permission = {
      path: form.get('path') as string,
      role: form.get('role') as string,
      authorized: form.get('authorized') === 'true',
    }

    await setPermission(permission);
    await this.loadPermissions();
  }

  public async isAuthorized(path: string, role: string): Promise<boolean> {
    if (!this.permissions) {
      await this.loadPermissions();
    }
    
    if (!this.permissions) {
      throw new Error('Permissions not loaded');
    }

    const exactMatch = this.permissions.find(p => p.path === path || new RegExp(p.path).test(path));

    if (!exactMatch) return true;
    return exactMatch.role === 'all' || exactMatch.role === role;
  }
}
