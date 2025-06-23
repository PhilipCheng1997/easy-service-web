<script setup lang="ts">
import { defineProps } from 'vue';

import { Button, message, Select, SelectOption, Upload } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

import { importHoliday } from '#/api/holiday';

import 'dayjs/plugin/localeData';

defineProps({
  slotProps: {
    type: Object,
    default: () => {},
  },
});

const getMonths = (value: Dayjs) => {
  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(localeData.monthsShort(value.month(i)));
  }
  return months;
};

const getYears = (value: Dayjs) => {
  const year = value.year();
  const years = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    years.push(i);
  }
  return years;
};

const customUpload = async (uploadFileParams: any) => {
  try {
    await importHoliday(uploadFileParams.file);
    message.success('导入成功');
  } catch (error) {
    console.error('导入假期失败', error);
    message.error('导入失败');
  }
};
</script>

<template>
  <div class="flex justify-end pb-3 pt-3">
    <Upload
      class="mr-2"
      accept=".json"
      :show-upload-list="false"
      :custom-request="customUpload"
    >
      <Button size="small" type="primary">导入</Button>
    </Upload>
    <Select
      class="mr-2"
      size="small"
      :dropdown-match-select-width="false"
      :value="String(slotProps.value.year())"
      @change="
        (newYear) => {
          slotProps.onChange(slotProps.value.year(newYear));
        }
      "
    >
      <SelectOption
        v-for="val in getYears(slotProps.value)"
        :key="String(val)"
        class="year-item"
      >
        {{ val }}
      </SelectOption>
    </Select>
    <Select
      size="small"
      :dropdown-match-select-width="false"
      :value="String(slotProps.value.month())"
      @change="
        (selectedMonth) => {
          slotProps.onChange(
            slotProps.value.month(parseInt(String(selectedMonth), 10)),
          );
        }
      "
    >
      <SelectOption
        v-for="(val, index) in getMonths(slotProps.value)"
        :key="String(index)"
        class="month-item"
      >
        {{ val }}
      </SelectOption>
    </Select>
  </div>
</template>

<style scoped lang="scss"></style>
