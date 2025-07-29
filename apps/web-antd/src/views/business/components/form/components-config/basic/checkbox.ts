import type { FormComponentConfig } from '../../types';

import { Checkbox } from 'ant-design-vue';

export default {
  type: 'checkbox',
  name: '勾选',
  component: Checkbox,
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
          default: '勾选',
        },
        {
          name: 'content',
          label: '内容',
          type: 'textarea',
          default: '内容',
        },
      ],
    },
  ],
} as FormComponentConfig;
