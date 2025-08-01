import Icon from '#/asserts/flow/join.svg?raw';

import SvgNode from './SvgNode';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class JoinNode extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class JoinNodeModel extends SvgNode.model {}

export default {
  type: 'join',
  view: JoinNode,
  model: JoinNodeModel,
};
