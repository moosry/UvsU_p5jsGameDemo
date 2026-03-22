/**
 * UIComponent.js —— 所有UI元素的抽象基类
 */
class UIComponent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    throw new Error(`${this.constructor.name} 必须实现 draw()`);
  }

  isMouseOver(mx, my) {
    throw new Error(`${this.constructor.name} 必须实现 isMouseOver()`);
  }

  onMousePressed(mx, my)  { return false; }
  onMouseDragged(mx, my)  { return false; }
  onMouseReleased(mx, my) { return false; }
}
