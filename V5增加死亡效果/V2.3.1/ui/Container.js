/**
 * Container.js —— 组件容器
 * 管理子组件列表，将鼠标事件从后往前分发（顶层优先）
 */
class Container extends UIComponent {
  constructor(x, y) {
    super(x, y);
    this.children = [];
  }

  addChild(child)    { this.children.push(child); }
  removeChild(child) {
    const i = this.children.indexOf(child);
    if (i !== -1) this.children.splice(i, 1);
  }

  isMouseOver(mx, my) {
    return this.children.some(c => c.isMouseOver(mx, my));
  }

  draw() {
    for (const child of this.children) {
      if (child._visible === false) continue;
      if (typeof child.updateHover === 'function') child.updateHover(mouseX, mouseY);
      child.draw();
    }
  }

  onMousePressed(mx, my) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i]._visible === false) continue;
      if (this.children[i].onMousePressed(mx, my)) return true;
    }
    return false;
  }

  onMouseDragged(mx, my) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i]._visible === false) continue;
      if (this.children[i].onMouseDragged(mx, my)) return true;
    }
    return false;
  }

  onMouseReleased(mx, my) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i]._visible === false) continue;
      if (this.children[i].onMouseReleased(mx, my)) return true;
    }
    return false;
  }
}
