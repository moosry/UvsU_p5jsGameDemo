// PageManager.js

/*
用来管理不同页面的类，负责切换和绘制当前页面。
每个页面都是一个独立的类，具有自己的<div>和绘制逻辑。
*/

class PageManager {
    // 构造函数，初始化当前页面为 null，表示没有页面显示
  constructor() {
    this.currentPage = null;
  }

  // 切换到新页面的方法switchTo
  // 接受一个函数作为参数，这个函数负责创建新页面的实例
  switchTo(pageCreator) {
    // 如果当前有页面，先调用它的 cleanup 方法清理旧页面的 DOM 元素
    if (this.currentPage) {
      this.currentPage.cleanup(); // 移除旧页面的元素
    }
    this.currentPage = pageCreator(); // 创建新页面
  }

  // 绘制当前页面的方法 draw
  draw() {
    // 如果当前有页面，并且这个页面有 draw 方法，就调用它的 draw 方法
    if (this.currentPage && typeof this.currentPage.draw === 'function') {
      this.currentPage.draw();
    } else {
      background(220); // 默认背景
    }
  }
}