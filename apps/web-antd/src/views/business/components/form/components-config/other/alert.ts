import type { FormComponentConfig } from '../../types';

import { Alert } from 'ant-design-vue';

export default {
  type: 'alert',
  name: '提示',
  component: Alert,
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
          label: '提示内容',
          type: 'input',
          name: 'message',
          default: '提示内容',
        },
      ],
    },
  ],
} as FormComponentConfig;
