import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { getMenuTree, MenuApi } from '#/api/system';
import { componentKeys } from '#/router/routes';

const basicGroup: VbenFormSchema[] = [
  {
    component: 'FormGroupTitle',
    componentProps: {
      title: '基本信息',
    },
    fieldName: 'basicGroup',
    formItemClass: 'col-span-2 md:col-span-2 pb-4',
  },
  {
    component: 'RadioGroup',
    fieldName: 'type',
    label: '菜单类型',
    componentProps: {
      buttonStyle: 'solid',
      options: getMenuTypeOptions(),
      optionType: 'button',
    },
    defaultValue: 2,
    rules: 'selectRequired',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'enableFlag',
    label: '启用状态',
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: '菜单标识',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'meta.title',
    label: '菜单标题',
    rules: 'required',
  },
  {
    component: 'ApiTreeSelect',
    fieldName: 'pid',
    label: '父级菜单',
    componentProps: {
      api: getMenuTree,
      allowClear: true,
      treeDefaultExpandAll: true,
      valueField: 'id',
      childrenField: 'children',
      labelField: 'meta.title',
    },
    renderComponentContent() {
      return {
        title({ label, meta }: { label: string; meta: Recordable<any> }) {
          const coms = [];
          if (!label) return '';
          if (meta?.icon) {
            coms.push(h(IconifyIcon, { class: 'size-4', icon: meta.icon }));
          }
          coms.push(h('span', { class: '' }, $t(label || '')));
          return h('div', { class: 'flex items-center gap-1' }, coms);
        },
      };
    },
  },
  {
    component: 'Input',
    fieldName: 'path',
    label: '菜单路径',
  },
  {
    component: 'Input',
    fieldName: 'meta.activePath',
    label: '激活路径',
    help: '当前激活的菜单，有时候不想激活现有菜单，需要激活父级菜单时使用',
    dependencies: {
      show: (values) => {
        return values.type !== MenuApi.MenuType.CATALOG;
      },
      triggerFields: ['type'],
    },
  },
  {
    component: 'InputNumber',
    fieldName: 'meta.order',
    label: '排序',
  },
  {
    component: 'Input',
    fieldName: 'linkSrc',
    label: '链接地址',
    dependencies: {
      show: (values) => {
        return [MenuApi.MenuType.EMBEDDED, MenuApi.MenuType.LINK].includes(
          values.type,
        );
      },
      triggerFields: ['type'],
    },
  },
  {
    component: 'AutoComplete',
    componentProps: {
      allowClear: true,
      class: 'w-full',
      filterOption(input: string, option: { value: string }) {
        return option.value.toLowerCase().includes(input.toLowerCase());
      },
      options: componentKeys.map((v) => ({ value: v })),
      placeholder: '请选择路由组件',
    },
    dependencies: {
      show: (values) => {
        return values.type === MenuApi.MenuType.MENU;
      },
      triggerFields: ['type'],
    },
    fieldName: 'component',
    label: '路由组件',
  },
];
const iconGroup: VbenFormSchema[] = [
  {
    component: 'FormGroupTitle',
    componentProps: {
      title: '图标',
    },
    fieldName: 'iconGroup',
    formItemClass: 'col-span-2 md:col-span-2 pt-4 pb-4',
  },
  {
    component: 'IconPicker',
    label: '图标',
    fieldName: 'meta.icon',
  },
  {
    component: 'IconPicker',
    label: '激活图标',
    fieldName: 'meta.activeIcon',
  },
];
const badgeGroup: VbenFormSchema[] = [
  {
    component: 'FormGroupTitle',
    componentProps: {
      title: '徽标',
    },
    fieldName: 'badgeGroup',
    formItemClass: 'col-span-2 md:col-span-2 pt-4 pb-4',
  },
  {
    component: 'Select',
    fieldName: 'meta.badgeType',
    label: '徽标类型',
    componentProps: {
      allowClear: true,
      options: [
        { value: 'dot', label: '点' },
        { value: 'normal', label: '文字' },
      ],
    },
  },
  {
    component: 'Input',
    fieldName: 'meta.badge',
    label: '徽标内容',
    dependencies: {
      show: (values) => {
        return values.meta?.badgeType === 'normal';
      },
      triggerFields: ['meta'],
    },
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: MenuApi.BadgeVariants.map((v) => ({
        label: v,
        value: v,
      })),
    },
    fieldName: 'meta.badgeVariants',
    label: '徽标类型',
  },
];
const displayGroup: VbenFormSchema[] = [
  {
    component: 'FormGroupTitle',
    componentProps: {
      title: '显示设置',
    },
    fieldName: 'displayGroup',
    formItemClass: 'col-span-2 md:col-span-2 pt-4 pb-4',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'meta.hideInMenu',
    label: '在菜单中隐藏',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'meta.hideInTab',
    label: '在标签页中隐藏',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'meta.hideInBreadcrumb',
    label: '在面包屑中隐藏',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'meta.hideChildrenInMenu',
    label: '子页面在菜单中隐藏',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'meta.openInNewWindow',
    label: '是否新窗口打开',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      optionType: 'button',
    },
    defaultValue: false,
    fieldName: 'meta.affixTab',
    label: '是否固定标签页',
  },
  {
    component: 'InputNumber',
    fieldName: 'meta.affixTabOrder',
    label: '固定标签页的排序',
  },
  {
    component: 'InputNumber',
    fieldName: 'meta.maxNumOfOpenTab',
    label: '标签页最大打开数量',
  },
];

export function useSchema(): VbenFormSchema[] {
  return [...basicGroup, ...iconGroup, ...badgeGroup, ...displayGroup];
}

export function useColumns(): VxeGridPropTypes.Columns<MenuApi.SysMenu> {
  return [
    {
      align: 'left',
      fixed: 'left',
      treeNode: true,
      field: 'title',
      title: '菜单标题',
      slots: { default: 'title' },
    },
    {
      field: 'name',
      title: '菜单名称',
    },
    {
      field: 'type',
      title: '菜单类型',
      cellRender: {
        name: 'CellTag',
        options: [
          {
            value: 1,
            label: '目录',
          },
          {
            value: 2,
            label: '菜单',
            color: 'success',
          },
          {
            value: 3,
            label: '内嵌',
            color: 'warning',
          },
          {
            value: 4,
            label: '外链',
            color: 'progressing',
          },
        ],
      },
    },
    {
      field: 'path',
      title: '路由路径',
    },
    {
      field: 'redirect',
      title: '重定向',
    },
    {
      field: 'component',
      title: '路由组件',
    },
    {
      field: 'enableFlag',
      title: '状态',
      cellRender: {
        name: 'CellSwitch',
      },
    },
    {
      align: 'center',
      field: 'operation',
      slots: {
        default: 'operation',
      },
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: '操作',
      width: 100,
    },
  ];
}

export function getMenuTypeOptions() {
  return [
    { value: MenuApi.MenuType.CATALOG, label: '目录' },
    { value: MenuApi.MenuType.MENU, label: '菜单' },
    { value: MenuApi.MenuType.EMBEDDED, label: '内嵌' },
    { value: MenuApi.MenuType.LINK, label: '外链' },
  ];
}
