<script setup lang="ts">
import {computed, defineProps, toRefs} from 'vue';

import { AntDesignLeftOutlined, AntDesignRightOutlined } from '@vben/icons';

import {
  Button,
  ButtonGroup,
  message,
  Select,
  SelectOption,
  Upload,
} from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { importHoliday } from '#/api/holiday';

import 'dayjs/plugin/localeData';

const props = defineProps({
  slotProps: {
    type: Object,
    default: () => {},
  },
});

const months = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
];
const yearMonth = computed(() => {
  return `${props.slotProps.value.format('YYYY')}年 ${
    months[props.slotProps.value.month()]
  }月`;
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

const adjustMonth = (offset: number) => {
  props.slotProps.onChange(
    props.slotProps.value.month(props.slotProps.value.month() + offset),
  );
};

const gotoToday = () => {
  props.slotProps.onChange(dayjs());
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
  <div class="grid grid-cols-3 pb-3 pt-3">
    <div class="flex flex-1 align-middle">
      <ButtonGroup>
        <Button type="primary" @click="adjustMonth(-1)">
          <AntDesignLeftOutlined />
        </Button>
        <Button type="primary" @click="adjustMonth(1)">
          <AntDesignRightOutlined />
        </Button>
      </ButtonGroup>
      <Button class="ml-2" @click="gotoToday">今天</Button>
    </div>
    <div class="flex flex-1 justify-center align-middle">
      <b class="text-lg">{{ yearMonth }}</b>
    </div>
    <div class="flex flex-1 justify-end align-middle">
      <Upload
        class="mr-2"
        accept=".json"
        :show-upload-list="false"
        :custom-request="customUpload"
      >
        <Button type="primary">导入</Button>
      </Upload>
      <Select
        class="mr-2"
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
  </div>
</template>

<style scoped lang="scss">
.iconify {
  position: relative;
  top: -2px;
  font-size: 16px;
}
</style>
