// MyButton.js
class MyButton {
  constructor(label, x, y, callback, customClass = '') {
    this.btn = createButton(label);
    if (x !== undefined && y !== undefined) {
      this.btn.position(x, y);   // 设置绝对位置
    }
    this.btn.addClass('my-button');
    if (customClass) {
      this.btn.addClass(customClass);
    }
    this.btn.mousePressed(callback);
  }

  get element() {
    return this.btn;
  }

  remove() {
    this.btn.remove();
  }
}