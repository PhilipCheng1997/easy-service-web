import Icon from '#/asserts/flow/join.svg?raw';

import SvgNode from './svg';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class Join extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class JoinNodeModel extends SvgNode.model {}

export default {
  type: 'join',
  view: Join,
  model: JoinNodeModel,
  icon: iconUrl,
  label: '汇合',
};
