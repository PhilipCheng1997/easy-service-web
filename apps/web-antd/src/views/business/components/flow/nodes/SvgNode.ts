import { HtmlNode, HtmlNodeModel } from '@logicflow/core';

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
  override setAttributes() {
    this.width = 40;
    this.height = 40;
  }
}

export default {
  type: 'svg',
  view: SvgNode,
  model: SvgNodeModel,
};
