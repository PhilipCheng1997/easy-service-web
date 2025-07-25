import type { Component } from 'vue';

export interface PropsConfigItem {
  type: string;
  label?: string;
  name?: string;
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
}
