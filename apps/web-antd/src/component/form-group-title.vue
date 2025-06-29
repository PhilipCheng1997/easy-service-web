<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="form-group-title">
    <span class="line"></span>
    <span class="title-text">{{ title }}</span>
  </div>
</template>

<style scoped>
.form-group-title {
  display: flex;
  align-items: center;

  .line {
    width: 4px;
    height: 16px;
    margin-right: 8px;
    background-color: #2f54eb; /* 蓝色 */
    border-radius: 2px;
  }

  .title-text {
    font-size: 16px;
    font-weight: 700;
    color: #000;
  }
}
</style>
