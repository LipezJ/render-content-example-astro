import db  from './db.js';

export interface Menu {
  id: number;
  path: string;
  parent: number | null;
  role: string;
}

export interface ComposedMenu extends Menu {
  children: Menu[];
}


const getMenus = async (): Promise<Menu[]> => {
  const menusQuery = db.prepare(`SELECT * FROM menus`);
  const menus = menusQuery.all() as Menu[];

  if (!menus) {
    throw new Error('Menus not found');
  }

  return menus;
};

export class MenusManager {
  private menus: Menu[] | null;

  constructor() {
    this.menus = null;
  }

  public async loadMenus(): Promise<void> {
    this.menus = await getMenus();
  }

  public async getMenuByRole(role: string, parentMenu?: number): Promise<ComposedMenu[]> {
    if (!this.menus) {
      await this.loadMenus();
    }

    if (!this.menus) {
      throw new Error('Menus not loaded');
    }
   
    const composedMenus: ComposedMenu[] = this.menus.reduce((acc: ComposedMenu[], menu: Menu) => {
      if (menu.parent === null  && (menu.role === role || menu.role === 'all')) {
        const newMenu: ComposedMenu = {
          ...menu,
          children: this.menus ? this.menus.filter(childMenu => 
            childMenu.parent === menu.id && (childMenu.role === role || childMenu.role === 'all')
          ) : [],
        };
        acc.push(newMenu);
      }

      return acc;
    }, [] as ComposedMenu[]);

    return composedMenus;
  }
}
