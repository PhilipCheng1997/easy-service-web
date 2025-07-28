import { ref } from 'vue';

import { defineStore } from 'pinia';

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
    if (currentComponent.value) {
      const component = findComponentById(currentComponent.value);
      if (component) {
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
    if (!id || !components || components.length === 0) {
      return null;
    }
    for (const component of components) {
      if (component.id === id) {
        return component;
      }
      if (component.children) {
        const subComponent = recursiveFindComponentById(id, component.children);
        if (subComponent) {
          return subComponent;
        }
      }
    }
    return null;
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
    changeMoveInTarget,
    changeMoveOutTarget,
    getFormConfig,
    setCurrentComponent,
    updateCurrentComponentProp,
    changeCurrentFormComponents,
  };
});
