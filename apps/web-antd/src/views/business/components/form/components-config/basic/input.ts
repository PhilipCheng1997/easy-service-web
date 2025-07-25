import type { FormComponentConfig } from '../../types';

import { Input } from 'ant-design-vue';

export default {
  type: 'input',
  name: '输入框',
  component: Input,
  propsConfig: [
    {
      name: '基本属性',
      props: [
        {
          label: '字段标识',
          type: 'id',
        },
        {
          name: 'label',
          label: '字段名称',
          type: 'input',
          default: '输入框',
        },
        {
          name: 'placeholder',
          label: '占位',
          type: 'input',
          default: '请输入',
        },
      ],
    },
  ],
} as FormComponentConfig;
