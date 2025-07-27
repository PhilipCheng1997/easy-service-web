import { ref } from 'vue';

import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', () => {
  const currentForm = ref();
  const currentComponent = ref();
  const moveInTarget = ref('');
  const moveOutTarget = ref('');

  async function getFormConfig(formKey: string, formName: string) {
    currentForm.value = { formKey, formName, groups: [] };
    currentComponent.value = null;
    return currentForm;
  }

  function setCurrentComponent(element: any) {
    currentComponent.value = element;
  }

  function changeMoveInTarget(target: string) {
    moveInTarget.value = target;
  }
  function changeMoveOutTarget(target: string) {
    moveOutTarget.value = target;
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
  };
});
