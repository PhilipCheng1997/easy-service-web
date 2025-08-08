import Icon from '#/asserts/flow/end.svg?raw';

import SvgNode from './svg';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class End extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class EndNodeModel extends SvgNode.model {}

export default {
  type: 'end',
  view: End,
  model: EndNodeModel,
  icon: iconUrl,
  label: '结束',
};
