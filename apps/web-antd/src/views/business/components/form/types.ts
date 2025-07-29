import type { Rule } from 'ant-design-vue/es/form';

import type { Component } from 'vue';

export interface PropsConfigItem {
  type: string;
  label?: string;
  name?: string;
  rules?: Rule | Rule[];
}

export interface PropsConfigGroup {
  name?: string;
  props?: PropsConfigItem[];
}

export interface FormComponentConfig {
  type: string;
  name: string;
  component?: Component | string;
  props?: Record<string, any>;
  propsConfig?: PropsConfigGroup[];
}

export interface FormComponentConfigGroup {
  groupKey: string;
  groupName?: string;
  components?: FormComponentConfig[];
  order: number;
}
