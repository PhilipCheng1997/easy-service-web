import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Message',
    path: '/message/index',
    component: () => import('#/views/message/index.vue'),
    meta: {
      icon: 'carbon:chat-launch',
      title: '发送消息',
      order: 9999,
    },
  },
];

export default routes;
