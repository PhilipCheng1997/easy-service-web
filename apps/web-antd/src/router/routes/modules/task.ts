import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '任务日志',
    },
    name: 'Task',
    path: '/task/index',
    component: () => import('#/views/task/log/index.vue'),
  },
];

export default routes;
