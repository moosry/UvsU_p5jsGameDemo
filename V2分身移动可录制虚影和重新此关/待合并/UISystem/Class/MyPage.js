// MyPage.js
class MyPage {
  constructor() {
    this.elements = []; // 存放需要清理的对象（它们必须有 remove 方法）
    // 不再创建容器
  }

  // 可以保留 addElement 但不再自动添加，或者干脆去掉，直接使用 this.elements.push
  // 为了向后兼容，可以保留但不再操作容器
  addElement(obj) {
    this.elements.push(obj);
    return obj;
  }

  cleanup() {
    this.elements.forEach(el => {
      if (el && typeof el.remove === 'function') {
        el.remove();
      }
    });
    this.elements = [];
  }

  draw() {
    // 子类实现
  }
}