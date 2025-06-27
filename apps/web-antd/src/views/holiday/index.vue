<script setup lang="ts">
import type { CalendarApi } from '#/api/calendar';

import { computed, onMounted, ref, watch } from 'vue';

import { confirm, Page, prompt } from '@vben/common-ui';

import { Calendar, RadioGroup } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { listCalendarData } from '#/api/calendar';
import { deleteHoliday, saveHoliday } from '#/api/holiday';

import CalendarHeader from './calendar-header.vue';
import DateCell from './date-cell.vue';

const today = dayjs().format('YYYY-MM-DD');

const calendarDataList = ref<Array<CalendarApi.CalendarData>>([]);
const loadCalendarData = (date: Dayjs = dayjs()) => {
  const startDate = date
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD');
  const endDate = date.add(1, 'month').endOf('month').format('YYYY-MM-DD');
  listCalendarData({ startDate, endDate }).then(
    (data) => (calendarDataList.value = data),
  );
};

const value = ref<Dayjs>();
const handleSaveHoliday = (content: string, value: Dayjs) => {
  prompt({ content, componentProps: { placeholder: '请输入备注' } })
    .then((v) => {
      saveHoliday({ date: value.format('YYYY-MM-DD'), remark: v }).then(() => {
        loadCalendarData(value);
      });
    })
    .catch(() => {});
};
const handleSelect = (value: Dayjs, { source }: any) => {
  if (source === 'customize') {
    return;
  }
  const date = value?.format('YYYY-MM-DD');
  const hasHoliday = calendarDataMap.value[date]?.some(
    (item: any) => item.type === 'error' && item.date === date,
  );
  if (hasHoliday) {
    prompt({
      content: '请选择操作',
      component: RadioGroup,
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '删除休假日期', value: 1 },
          { label: '修改备注', value: 2 },
        ],
      },
      modelPropName: 'value',
    }).then((val) => {
      if (val === 1) {
        confirm({ content: `确定要删除休假日期${date}？` }).then(() => {
          deleteHoliday(date).then(() => {
            loadCalendarData(value);
          });
        });
      } else if (val === 2) {
        handleSaveHoliday(`请输入休假日期${date}的备注：`, value);
      }
    });
  } else {
    handleSaveHoliday(`确定要指定日期${date}为休假日期？`, value);
  }
};

const calendarDataMap = computed(() => {
  const map: Record<string, CalendarApi.CalendarData[]> = {};
  if (calendarDataList.value) {
    for (const calendarData of calendarDataList.value) {
      (map[calendarData.date] ??= []).push(calendarData);
    }
  }
  return map;
});

onMounted(() => {
  loadCalendarData();
});

watch(
  () => value.value?.month(),
  () => loadCalendarData(value.value),
);
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background min-w-[800px] p-5">
      <Calendar v-model:value="value" @select="handleSelect">
        <template #headerRender="slotProps">
          <CalendarHeader :slot-props="slotProps" />
        </template>
        <template #dateFullCellRender="{ current }">
          <div
            class="ant-picker-cell-inner ant-picker-calendar-date"
            :class="{
              'ant-picker-calendar-date-today':
                current.format('YYYY-MM-DD') === today,
              'disabled-cell': calendarDataMap[
                current.format('YYYY-MM-DD')
              ]?.some((item) => item.type === 'error'),
            }"
          >
            <div class="ant-picker-calendar-date-value">
              {{ current.date() }}
            </div>
            <div class="ant-picker-calendar-date-content">
              <DateCell
                :current="current"
                :calendar-data-list="
                  calendarDataMap[current.format('YYYY-MM-DD')] || []
                "
              />
            </div>
          </div>
        </template>
      </Calendar>
    </div>
  </Page>
</template>

<style lang="scss" scoped>
.ant-picker-calendar-date-today {
  background: rgb(255 220 40 / 15%);
}

.disabled-cell {
  background: #f4f4f4b8;
}
</style>
