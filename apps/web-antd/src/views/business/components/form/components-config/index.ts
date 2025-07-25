import type { Component } from 'vue';

import type { FormComponentConfigGroup, PropsConfigGroup } from '../types';

const modules = import.meta.glob('./*/**/index.ts', { eager: true });

const componentsConfig: FormComponentConfigGroup[] = [];
const schemaMapping: Record<string, PropsConfigGroup[]> = {};
const componentMapping: Record<string, Component | string> = {};

for (const path in modules) {
  const mod = modules[path] as any;
  if (mod.default) {
    if (mod.default.components) {
      for (const componentConfig of mod.default.components) {
        schemaMapping[componentConfig.type] = componentConfig.propsConfig || [];
        componentMapping[componentConfig.type] = componentConfig.component;
        const props: Record<string, any> = {};
        if (componentConfig.propsConfig) {
          for (const group of componentConfig.propsConfig) {
            if (group.props) {
              for (const item of group.props) {
                if (item.name) {
                  props[item.name] = item.default || null;
                }
              }
            }
          }
        }
        delete componentConfig.propsConfig;
        delete componentConfig.component;
        componentConfig.props = props;
      }
    }
    componentsConfig.push(mod.default);
  }
}

export { componentMapping, componentsConfig, schemaMapping };
