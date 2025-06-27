import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '服务列表',
    },
    name: 'Service',
    path: '/service/index',
    component: () => import('#/views/service/index.vue'),
  },
];

export default routes;
