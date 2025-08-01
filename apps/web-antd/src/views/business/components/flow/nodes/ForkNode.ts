import Icon from '#/asserts/flow/fork.svg?raw';

import SvgNode from './SvgNode';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class ForkNode extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class ForkNodeModel extends SvgNode.model {}

export default {
  type: 'fork',
  view: ForkNode,
  model: ForkNodeModel,
};
