import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace MenuApi {
  export enum MenuType {
    CATALOG = 1,
    EMBEDDED = 3,
    LINK = 4,
    MENU = 2,
  }
  /** 徽标颜色集合 */
  export const BadgeVariants = [
    'default',
    'destructive',
    'primary',
    'success',
    'warning',
  ] as const;
  /** 徽标类型集合 */
  export const BadgeTypes = ['dot', 'normal'] as const;

  export interface SysMenu {
    [key: string]: any;
    id?: number;
    pid?: number;
    name: string;
    path?: string;
    redirect?: string;
    component?: string;
    enableFlag?: boolean;
    type: MenuType;
    /** 菜单元数据 */
    meta?: {
      [key: string]: any;
      /** 激活时显示的图标 */
      activeIcon?: string;
      /** 作为路由时，需要激活的菜单的Path */
      activePath?: string;
      /** 固定在标签栏 */
      affixTab?: boolean;
      /** 在标签栏固定的顺序 */
      affixTabOrder?: number;
      /** 徽标内容(当徽标类型为normal时有效) */
      badge?: string;
      /** 徽标类型 */
      badgeType?: (typeof BadgeTypes)[number];
      /** 徽标颜色 */
      badgeVariants?: (typeof BadgeVariants)[number];
      /** 在菜单中隐藏下级 */
      hideChildrenInMenu?: boolean;
      /** 在面包屑中隐藏 */
      hideInBreadcrumb?: boolean;
      /** 在菜单中隐藏 */
      hideInMenu?: boolean;
      /** 在标签栏中隐藏 */
      hideInTab?: boolean;
      /** 菜单图标 */
      icon?: string;
      /** 内嵌Iframe的URL */
      iframeSrc?: string;
      /** 是否缓存页面 */
      keepAlive?: boolean;
      /** 外链页面的URL */
      link?: string;
      /** 同一个路由最大打开的标签数 */
      maxNumOfOpenTab?: number;
      /** 无需基础布局 */
      noBasicLayout?: boolean;
      /** 是否在新窗口打开 */
      openInNewWindow?: boolean;
      /** 菜单排序 */
      order?: number;
      /** 额外的路由参数 */
      query?: Recordable<any>;
      /** 菜单标题 */
      title?: string;
    };
  }
}

async function getMenuTree() {
  return requestClient.get<MenuApi.SysMenu>('/system/menu');
}

async function checkMenuNameUnique(menuName: string, menuId?: number) {
  return requestClient.get<boolean>('/system/menu/check-name', {
    params: { menuName, menuId },
  });
}

async function checkMenuPathUnique(menuPath: string, menuId?: number) {
  return requestClient.get<boolean>('/system/menu/check-path', {
    params: { menuPath, menuId },
  });
}

async function getMenu(menuId: number) {
  return requestClient.get<MenuApi.SysMenu>(`/system/menu/${menuId}`);
}

async function addMenu(menu: MenuApi.SysMenu) {
  return requestClient.post<MenuApi.SysMenu>('/system/menu', menu);
}

async function updateMenu(menu: MenuApi.SysMenu) {
  return requestClient.put<MenuApi.SysMenu>('/system/menu', menu);
}

async function toggleMenuStatus(menuId: number) {
  return requestClient.put<MenuApi.SysMenu>(`/system/menu/${menuId}/status`);
}

async function deleteMenu(menuId: number) {
  return requestClient.delete(`/system/menu/${menuId}`);
}

export {
  addMenu,
  checkMenuNameUnique,
  checkMenuPathUnique,
  deleteMenu,
  getMenu,
  getMenuTree,
  toggleMenuStatus,
  updateMenu,
};
