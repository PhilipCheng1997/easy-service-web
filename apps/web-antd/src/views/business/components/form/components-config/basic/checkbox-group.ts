import type { FormComponentConfig } from '../../types';

import { CheckboxGroup } from 'ant-design-vue';

export default {
  type: 'checkboxGroup',
  name: '复选',
  component: CheckboxGroup,
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
          default: '复选',
        },
        {
          name: 'options',
          label: '选项',
          type: 'options',
          default: [],
        },
      ],
    },
  ],
} as FormComponentConfig;
