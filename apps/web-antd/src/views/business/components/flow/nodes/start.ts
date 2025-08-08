import Icon from '#/asserts/flow/start.svg?raw';

import SvgNode from './svg';

const iconUrl = `data:image/svg+xml;base64,${btoa(Icon)}`;

class Start extends SvgNode.view {
  override getHref(): string {
    return iconUrl;
  }
}

class StartNodeModel extends SvgNode.model {}

export default {
  type: 'start',
  view: Start,
  model: StartNodeModel,
  icon: iconUrl,
  label: '开始',
};
