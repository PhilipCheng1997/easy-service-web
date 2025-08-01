import Icon from '#/asserts/flow/start.svg?raw';

import SvgNode from './SvgNode';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class StartNode extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class StartNodeModel extends SvgNode.model {}

export default {
  type: 'start',
  view: StartNode,
  model: StartNodeModel,
};
