import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'System',
    path: '/system',
    meta: {
      icon: 'ion:settings-outline',
      order: 9997,
      title: '系统设置',
    },
    children: [
      {
        name: 'SystemMenu',
        path: 'menu/index',
        component: () => import('#/views/system/menu/index.vue'),
        meta: {
          icon: 'charm:organisation',
          title: '菜单管理',
        },
      },
      {
        name: 'AddSystemMenu',
        path: 'menu/add',
        component: () => import('#/views/system/menu/component/form.vue'),
        meta: {
          title: '添加菜单',
          hideInMenu: true,
          hideInTab: true,
          activePath: '/system/menu/index',
        },
      },
      {
        name: 'EditSystemMenu',
        path: 'menu/edit/:id',
        component: () => import('#/views/system/menu/component/form.vue'),
        meta: {
          title: '修改菜单',
          hideInMenu: true,
          hideInTab: true,
          activePath: '/system/menu/index',
        },
      },
    ],
  },
];

export default routes;
