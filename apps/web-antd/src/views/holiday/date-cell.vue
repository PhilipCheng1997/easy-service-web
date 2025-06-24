<script setup lang="ts">
import type { CalendarApi } from '#/api/calendar';

import { computed, defineProps } from 'vue';

import { Badge } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

const props = defineProps<{
  calendarDataList: CalendarApi.CalendarData[];
  current: Dayjs;
}>();

const calendarDataMap = computed(() => {
  const map: Record<string, CalendarApi.CalendarData[]> = {};
  if (props.calendarDataList) {
    for (const calendarData of props.calendarDataList) {
      (map[calendarData.date] ??= []).push(calendarData);
    }
  }
  return map;
});
const dateStr = computed(() => {
  return props.current?.format('YYYY-MM-DD') || '';
});
</script>

<template>
  <ul class="events" v-if="dateStr && calendarDataMap[dateStr]">
    <li v-for="item in calendarDataMap[dateStr]" :key="item.content">
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
  list-style: none;
  margin: 0;
  padding: 0;

  .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
  }
}
</style>
