import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Holiday',
    path: '/holiday/index',
    component: () => import('#/views/holiday/index.vue'),
    meta: {
      icon: 'carbon:calendar-heat-map',
      title: '休假日历',
      order: 9999,
    },
  },
];

export default routes;
