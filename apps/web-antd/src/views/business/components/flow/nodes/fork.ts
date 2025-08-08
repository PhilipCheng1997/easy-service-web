import Icon from '#/asserts/flow/fork.svg?raw';

import SvgNode from './svg';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class Fork extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class ForkNodeModel extends SvgNode.model {}

export default {
  type: 'fork',
  view: Fork,
  model: ForkNodeModel,
  icon: iconUrl,
  label: '分支',
};
