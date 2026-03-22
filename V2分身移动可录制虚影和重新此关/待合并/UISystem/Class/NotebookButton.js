// NotebookButton.js
class NotebookButton {
  constructor(label, x, y, callback, customClass = '', backLabel = '') {
    // 创建一个容器 div，作为按钮整体
    this.container = createDiv('');
    this.container.position(x, y);
    this.container.addClass('notebook-button');
    if (customClass) {
      this.container.addClass(customClass);
    }

    // 创建翻转容器
    this.flipper = createDiv('');
    this.flipper.addClass('flipper');
    this.container.child(this.flipper);

    // 创建正面
    this.front = createDiv(label);
    this.front.addClass('front');
    this.flipper.child(this.front);

    // 创建背面，设置文字
    this.back = createDiv(backLabel);
    this.back.addClass('back');
    this.flipper.child(this.back);

    // 绑定点击事件（整个容器点击触发回调）
    this.container.mousePressed(callback);
  }

  // 如果需要修改背面文字
  setBackText(text) {
    this.back.html(text);
  }

  // 移除整个按钮
  remove() {
    this.container.remove();
  }
}