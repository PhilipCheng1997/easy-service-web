import type { FormComponentConfigGroup } from '../types';

import { markRaw } from 'vue';

export default function importComponentsGroup(
  modules: Record<string, any>,
  groupKey: string,
  groupName: string,
  order: number = 0,
) {
  const group: FormComponentConfigGroup = {
    groupKey,
    groupName,
    components: [],
    order,
  };

  for (const path in modules) {
    if (path === './index.js') continue; // 跳过自己
    const mod = modules[path] as any;
    if (mod.default) {
      group.components = group.components || [];
      group.components.push({
        ...mod.default,
        component: markRaw(mod.default.component),
        group: groupKey,
      });
    }
  }

  return group;
}
