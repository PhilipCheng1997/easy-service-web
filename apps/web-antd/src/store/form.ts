import { isReactive, ref, toRaw } from 'vue';

import { defineStore } from 'pinia';

import { generateShortId } from '#/utils/id-utils';

export const useFormStore = defineStore('form', () => {
  const currentForm = ref();
  const currentComponent = ref();
  const moveInTarget = ref('');
  const moveOutTarget = ref('');

  async function getFormConfig(formKey: string, formName: string) {
    currentForm.value = { formKey, formName, components: [] };
    currentComponent.value = null;
    return currentForm;
  }

  function setCurrentComponent(element: any) {
    // 切换当前组件前，将当前组件更改过的属性同步回表单
    if (currentComponent.value) {
      const matchComponent = findComponentById(currentComponent.value.id);
      if (matchComponent) {
        const component = matchComponent.list[matchComponent.index];
        component.props = { ...currentComponent.value.props };
      }
    }
    currentComponent.value = element;
  }

  function changeMoveInTarget(target: string) {
    moveInTarget.value = target;
  }
  function changeMoveOutTarget(target: string) {
    moveOutTarget.value = target;
  }

  function findComponentById(id: string) {
    if (currentForm.value.components) {
      return recursiveFindComponentById(id, currentForm.value.components);
    }
    return null;
  }
  function recursiveFindComponentById(id: string, components: any[]) {
    if (!id || !components?.length) {
      return null;
    }

    const index = components.findIndex((component) => component.id === id);
    if (index !== -1) {
      return { index, list: components, component: components[index] };
    }

    for (const component of components) {
      if (component.children) {
        const subComponent = recursiveFindComponentById(id, component.children);
        if (subComponent) {
          return subComponent;
        }
      }
    }
    return null;
  }

  function deleteComponentById(id: string) {
    if (currentForm.value.components) {
      recursiveDeleteComponentById(id, currentForm.value.components);
      if (currentComponent.value?.id === id) {
        setCurrentComponent(null);
      }
    }
  }
  function recursiveDeleteComponentById(id: string, components: any[]) {
    if (!id || !components || components.length === 0) {
      return;
    }
    const index = components.findIndex((component) => component.id === id);
    if (index !== -1) {
      components.splice(index, 1);
      return;
    }
    for (const component of components) {
      if (component.children) {
        recursiveDeleteComponentById(id, component.children);
      }
    }
  }

  function deepToRaw(value) {
    if (Array.isArray(value)) {
      // 数组，递归处理每个元素
      return value.map((item) => deepToRaw(item));
    } else if (value !== null && typeof value === 'object') {
      // 对象
      if (isReactive(value)) {
        // 是响应式 Proxy，先转原始对象
        value = toRaw(value);
      }
      // 递归处理对象的每个属性
      const result = {};
      for (const key in value) {
        result[key] = deepToRaw(value[key]);
      }
      return result;
    } else {
      // 基本类型，直接返回
      return value;
    }
  }

  function copyComponentById(id: string) {
    const matchValue = findComponentById(id);
    if (matchValue) {
      const { component, list, index } = matchValue;
      const newComponent = structuredClone(deepToRaw(component));
      newComponent.id = `${newComponent.type}_${generateShortId()}`;
      recursiveUpdateComponentId(newComponent.children);
      list.splice(index + 1, 0, newComponent);
    }
  }
  function recursiveUpdateComponentId(components) {
    if (!components?.length) {
      return;
    }
    for (const component of components) {
      component.id = `${component.type}_${generateShortId()}`;
      if (component.children?.length) {
        recursiveUpdateComponentId(component.children);
      }
    }
  }

  function updateCurrentComponentProp(propName: string, propValue: any) {
    if (currentComponent.value) {
      currentComponent.value.props[propName] = propValue;
    }
  }

  function changeCurrentFormComponents(components) {
    currentForm.value.components = components;
  }

  return {
    currentForm,
    currentComponent,
    moveInTarget,
    moveOutTarget,
    copyComponentById,
    changeMoveInTarget,
    changeMoveOutTarget,
    deleteComponentById,
    getFormConfig,
    setCurrentComponent,
    updateCurrentComponentProp,
    changeCurrentFormComponents,
  };
});
