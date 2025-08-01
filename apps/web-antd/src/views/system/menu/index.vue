<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { confirm, Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenu, getMenuTree, MenuApi } from '#/api/system';

import { useColumns } from './data';

const router = useRouter();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params) => {
          return await getMenuTree();
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
    treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});

function gotoForm(type: 'add' | 'edit', row: MenuApi.SysMenu | null) {
  if (type === 'edit') {
    router.push({ path: `/system/menu/edit/${row?.id}` });
  } else {
    if (row) {
      router.push({
        path: '/system/menu/add',
        query: { pid: row.id },
      });
    } else {
      router.push({ path: '/system/menu/add' });
    }
  }
}

function handleDelete(row: MenuApi.SysMenu) {
  confirm('确定删除该菜单？').then(() => {
    deleteMenu(row.id as number).then(() => {
      message.success('删除成功');
      gridApi.reload();
    });
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="菜单管理">
      <template #operation="{ row }">
        <Button type="link" size="small" @click="gotoForm('edit', row)">
          编辑
        </Button>
        <Button type="link" size="small" @click="gotoForm('add', row)">
          添加下级
        </Button>
        <Button
          type="link"
          size="small"
          :danger="true"
          @click="handleDelete(row)"
        >
          删除
        </Button>
      </template>
      <template #toolbar-tools>
        <Button type="primary" @click="gotoForm('add', null)" size="small">
          添加菜单
        </Button>
      </template>
      <template #title="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              v-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto">{{ $t(row.meta?.title) }}</span>
          <div class="items-center justify-end"></div>
        </div>
        <MenuBadge
          v-if="row.meta?.badgeType"
          class="menu-badge"
          :badge="row.meta.badge"
          :badge-type="row.meta.badgeType"
          :badge-variants="row.meta.badgeVariants"
        />
      </template>
    </Grid>
  </Page>
</template>

<style lang="scss" scoped>
.menu-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
