import { ref } from 'vue';

import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', () => {
  const currentForm = ref();
  const currentComponent = ref();
  const moveInTarget = ref('');

  async function getFormConfig(formKey: string, formName: string) {
    currentForm.value = { formKey, formName, components: [] };
    currentComponent.value = null;
    return currentForm;
  }

  function setCurrentComponent(element: any) {
    currentComponent.value = element;
    console.log(currentComponent);
  }

  function changeMoveInTarget(target: string) {
    moveInTarget.value = target;
  }

  return {
    currentForm,
    currentComponent,
    moveInTarget,
    changeMoveInTarget,
    getFormConfig,
    setCurrentComponent,
  };
});
