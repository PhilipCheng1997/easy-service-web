<script setup lang="ts">
import type { CalendarApi } from '#/api/calendar';

import { defineProps } from 'vue';

import { Badge } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

defineProps<{
  calendarDataList: CalendarApi.CalendarData[];
  current: Dayjs;
}>();
</script>

<template>
  <ul class="events" v-if="calendarDataList">
    <li v-for="item in calendarDataList" :key="item.content">
      <Badge :status="item.type">
        <template #text>
          <span v-if="item.time" class="mr-1">{{ item.time }}</span>
          <span class="font-bold">{{ item.content }}</span>
        </template>
      </Badge>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.events {
  padding: 0;
  margin: 0;
  list-style: none;

  .ant-badge-status {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>
