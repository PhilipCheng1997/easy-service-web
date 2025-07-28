import type { FormComponentConfig } from '../../types';

import Group from '../../components/group.vue';

export default {
  type: 'group',
  name: '模块',
  component: Group,
  children: [],
  propsConfig: [
    {
      name: '基本属性',
      props: [
        {
          label: '字段标识',
          type: 'id',
        },
        {
          label: '模块名称',
          type: 'input',
          name: 'groupName',
          default: '模块',
        },
      ],
    },
  ],
} as FormComponentConfig;
