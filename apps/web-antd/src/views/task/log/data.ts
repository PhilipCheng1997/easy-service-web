import dayjs from 'dayjs';

const formSchema = [
  {
    component: 'DatePicker',
    fieldName: 'date',
    label: '日期',
    defaultValue: dayjs().format('YYYY-MM-DD'),
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    component: 'Select',
    fieldName: 'isExecuted',
    label: '执行状态',
    componentProps: {
      allowClear: true,
      options: [
        { label: '已执行', value: 1 },
        { label: '未执行', value: 0 },
      ],
    },
  },
  {
    component: 'Select',
    fieldName: 'isSuccess',
    label: '执行结果',
    componentProps: {
      allowClear: true,
      options: [
        { label: '成功', value: 1 },
        { label: '失败', value: 0 },
      ],
    },
  },
];

const columns = [
  {
    field: 'executeTime',
    title: '执行时间',
    minWidth: 150,
  },
  {
    field: 'executableTime',
    title: '可执行时间',
    minWidth: 150,
  },
  {
    field: 'executeRange',
    title: '执行范围',
    minWidth: 200,
    slots: { default: 'executeRange' },
  },
  {
    field: 'delayMinutes',
    title: '随机分钟',
    minWidth: 80,
  },
  {
    field: 'delayExecute',
    title: '随机执行时间（毫秒）',
    minWidth: 90,
  },
  {
    field: 'isExecuted',
    title: '是否已执行',
    slots: { default: 'isExecuted' },
    minWidth: 110,
  },
  {
    field: 'isSuccess',
    title: '是否执行成功',
    slots: { default: 'isSuccess' },
    minWidth: 110,
  },
  {
    field: 'scriptOutput',
    title: '脚本输出',
    slots: { default: 'scriptOutput' },
    minWidth: 110,
  },
  {
    field: 'output',
    title: '输出概览',
    slots: { default: 'output' },
    minWidth: 250,
  },
  {
    field: 'error',
    title: '异常',
    slots: { default: 'error' },
    minWidth: 110,
  },
  {
    field: 'isNotified',
    title: '是否已通知',
    slots: { default: 'isNotified' },
    minWidth: 110,
  },
];

export { columns, formSchema };
