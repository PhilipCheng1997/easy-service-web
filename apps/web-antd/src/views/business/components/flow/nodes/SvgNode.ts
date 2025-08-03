import LogicFlow, { HtmlNode, HtmlNodeModel } from '@logicflow/core';

class SvgNode extends HtmlNode {
  getHref() {
    return '';
  }

  override setHtml(rootEl: any) {
    const el = document.createElement('div');
    el.innerHTML = `<img src="${this.getHref()}" draggable="false" style="max-width: 100%; max-height: 100%;" />`;
    rootEl.innerHTML = '';
    rootEl.append(el);
  }
}

class SvgNodeModel extends HtmlNodeModel {
  override initNodeData(data: LogicFlow.NodeConfig) {
    data.text = {
      value: '',
      x: data.x,
      y: data.y + 30,
    };
    super.initNodeData(data);
    this.width = 40;
    this.height = 40;
  }

  override getDefaultAnchor() {
    const { width, height, x, y, id } = this;
    return [
      {
        x: x - width / 2 + 2,
        y,
        name: 'left',
        id: `${id}_anchor_left`,
      },
      {
        x: x + width / 2 - 2,
        y,
        name: 'right',
        id: `${id}_anchor_right`,
      },
      {
        x,
        y: y - height / 2 + 2,
        name: 'top',
        id: `${id}_anchor_top`,
      },
      {
        x,
        y: y + height / 2 - 2,
        name: 'bottom',
        id: `${id}_anchor_bottom`,
      },
    ];
  }
}

export default {
  type: 'svg',
  view: SvgNode,
  model: SvgNodeModel,
};
