import { RectNode, RectNodeModel } from '@logicflow/core';

import Icon from '#/asserts/flow/task.svg?raw';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class Task extends RectNode {}

class TaskNodeModel extends RectNodeModel {
  // 设置矩形的形状属性：大小和圆角
  override initNodeData(data) {
    super.initNodeData(data);
    this.width = 100;
    this.height = 60;
    this.radius = 5;
  }
}

export default {
  type: 'task',
  view: Task,
  model: TaskNodeModel,
  icon: iconUrl,
  label: '节点',
};
