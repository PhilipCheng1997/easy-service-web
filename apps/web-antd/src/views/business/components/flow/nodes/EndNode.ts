import Icon from '#/asserts/flow/end.svg?raw';

import SvgNode from './SvgNode';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class EndNode extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class EndNodeModel extends SvgNode.model {}

export default {
  type: 'end',
  view: EndNode,
  model: EndNodeModel,
};
