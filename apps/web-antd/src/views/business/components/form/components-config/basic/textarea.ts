import type { FormComponentConfig } from '../../types';

import { Textarea } from 'ant-design-vue';

export default {
  type: 'textarea',
  name: '多行文本',
  component: Textarea,
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
          default: '多行文本',
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
