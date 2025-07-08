import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { h } from 'vue';

import { confirm } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { z } from '#/adapter/form';
import {
  checkMenuNameUnique,
  checkMenuPathUnique,
  getMenuTree,
  MenuApi,
  toggleMenuStatus,
} from '#/api/system';
import { componentKeys } from '#/router/routes';

const debouncedCheckMenuNameUnique = useDebounceFn((value, id, callback) => {
  checkMenuNameUnique(value, id).then(callback);
}, 300);
function checkMenuNameUniqueDebounced(value: string, id: number | undefined) {
  return new Promise((resolve) => {
    debouncedCheckMenuNameUnique(value, id, resolve);
  });
}

const debouncedCheckMenuPathUnique = useDebounceFn((value, id, callback) => {
  checkMenuPathUnique(value, id).then(callback);
}, 300);
function checkMenuPathUniqueDebounced(value: string, id: number | undefined) {
  return new Promise((resolve) => {
    debouncedCheckMenuPathUnique(value, id, resolve);
  });
}

const getBasicGroup = (id: number | undefined): VbenFormSchema[] => {
  return [
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
      rules: z
        .string()
        .min(2, '菜单标识最少2个字符')
        .max(30, '菜单标识最多30个字符')
        .refine(async (v) => {
          return await checkMenuNameUniqueDebounced(v, id);
        }, '菜单标识已存在'),
      formFieldProps: {
        validateOnChange: false,
        validateOnModelUpdate: false,
        validateOnInput: false,
        validateOnMount: false,
        validateOnValueUpdate: false,
      },
    },
    {
      component: 'Input',
      fieldName: 'meta.title',
      label: '菜单标题',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'path',
      label: '菜单路径',
      dependencies: {
        if: (values) => {
          return [
            MenuApi.MenuType.CATALOG,
            MenuApi.MenuType.EMBEDDED,
            MenuApi.MenuType.MENU,
          ].includes(values.type);
        },
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .min(2, '菜单路径最少2个字符')
        .refine(async (v) => {
          return await checkMenuPathUniqueDebounced(v, id);
        }, '菜单路径已存在'),
    },
    {
      component: 'Input',
      fieldName: 'meta.activePath',
      label: '激活路径',
      help: '当前激活的菜单，有时候不想激活现有菜单，需要激活父级菜单时使用',
      dependencies: {
        show: (values) => {
          return [MenuApi.MenuType.EMBEDDED, MenuApi.MenuType.MENU].includes(
            values.type,
          );
        },
        triggerFields: ['type'],
      },
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
      rules: z.string().url('请输入有效的链接地址'),
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
        placeholder: '请选择父级菜单',
        class: 'w-full',
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
      component: 'AutoComplete',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption(input: string, option: { value: string }) {
          return option.value.toLowerCase().includes(input.toLowerCase());
        },
        options: componentKeys.map((v) => ({ value: v })),
        placeholder: '请选择页面组件',
      },
      dependencies: {
        show: (values) => {
          return values.type === MenuApi.MenuType.MENU;
        },
        triggerFields: ['type'],
      },
      rules: 'required',
      fieldName: 'component',
      label: '页面组件',
    },
    {
      component: 'InputNumber',
      fieldName: 'meta.order',
      label: '排序',
    },
    {
      component: 'Input',
      fieldName: 'redirect',
      label: '重定向',
      dependencies: {
        show: (values) => {
          return values.type === MenuApi.MenuType.CATALOG;
        },
        triggerFields: ['type'],
      },
      rules: z.string().min(2, '重定向路径最少2个字符').nullable(),
    },
  ];
};
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
    dependencies: {
      show: (values) => {
        return values.type !== MenuApi.MenuType.LINK;
      },
      triggerFields: ['type'],
    },
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
    component: 'Checkbox',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    fieldName: 'meta.hideInMenu',
    label: '不在菜单中显示',
  },
  {
    component: 'Checkbox',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    fieldName: 'meta.hideInTab',
    label: '不在标签页中显示',
  },
  {
    component: 'Checkbox',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    fieldName: 'meta.hideInBreadcrumb',
    label: '不在面包屑中显示',
  },
  {
    component: 'Checkbox',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
      optionType: 'button',
    },
    fieldName: 'meta.hideChildrenInMenu',
    label: '子菜单不在菜单中显示',
  },
  {
    component: 'Checkbox',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      optionType: 'button',
    },
    fieldName: 'meta.openInNewWindow',
    label: '是否新窗口打开',
  },
  {
    component: 'Checkbox',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      optionType: 'button',
    },
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

export function useSchema(id: number | undefined): VbenFormSchema[] {
  return [...getBasicGroup(id), ...iconGroup, ...badgeGroup, ...displayGroup];
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
      minWidth: 100,
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
        options: getMenuTypeOptions(),
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
        attrs: {
          beforeChange: async (value: boolean, row: MenuApi.SysMenu) => {
            const action = value ? '启用' : '禁用';
            try {
              await confirm(`确定${action}菜单吗？`);
              await toggleMenuStatus(row.id as number);
              message.success(`${action}成功`);
              return true;
            } catch {
              return false;
            }
          },
        },
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
      width: 220,
    },
  ];
}

export function getMenuTypeOptions() {
  return [
    { value: MenuApi.MenuType.CATALOG, label: '目录' },
    { value: MenuApi.MenuType.MENU, label: '菜单', color: 'green' },
    { value: MenuApi.MenuType.EMBEDDED, label: '内嵌', color: 'cyan' },
    { value: MenuApi.MenuType.LINK, label: '外链', color: 'orange' },
  ];
}
