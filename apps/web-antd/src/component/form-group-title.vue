<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="form-group-title">
      <span class="line bg-primary"></span>
      <span class="title-text">{{ title }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.form-group-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .line {
    width: 4px;
    height: 16px;
    margin-right: 8px;
    border-radius: 2px;
  }

  .title-text {
    font-size: 16px;
    font-weight: 700;
    color: #000;
  }
}
</style>
