import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '任务管理',
    },
    name: 'Task',
    path: '/task',
    children: [
      {
        meta: {
          title: '任务日志',
        },
        name: 'TaskLogs',
        path: '/task/index',
        component: () => import('#/views/task/index.vue'),
      },
    ],
  },
];

export default routes;
