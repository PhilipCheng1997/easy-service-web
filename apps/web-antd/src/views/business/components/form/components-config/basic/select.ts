import type { FormComponentConfig } from '../../types';

import { Select } from 'ant-design-vue';

export default {
  type: 'select',
  name: '下拉框',
  component: Select,
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
          default: '下拉框',
        },
        {
          name: 'placeholder',
          label: '占位',
          type: 'input',
          default: '请选择',
        },
      ],
    },
  ],
} as FormComponentConfig;
