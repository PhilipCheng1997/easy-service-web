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
          type: 'textarea',
          name: 'message',
          default: '提示内容',
          rules: [
            {
              required: true,
              message: '请输入提示内容',
            },
          ],
        },
        {
          label: '辅助文字',
          type: 'textarea',
          name: 'description',
          default: '',
        },
        {
          label: '提示样式',
          type: 'select',
          name: 'type',
          default: 'info',
          options: [
            { value: 'success', label: 'success' },
            { value: 'info', label: 'info' },
            { value: 'warning', label: 'warning' },
            { value: 'error', label: 'error' },
          ],
        },
        {
          label: '显示图标',
          type: 'switch',
          name: 'showIcon',
          default: false,
        },
      ],
    },
  ],
} as FormComponentConfig;
