// MyPageSettings.js
class MyPageSettings extends MyPage {
  constructor(manager) {
    super();
    this.manager = manager;

    // 创建“返回”按钮，直接使用 this.addElement 或 this.elements.push
    const backBtn = new MyButton('◀', 0.02 * width, 0.03 * height, () => {
      this.manager.switchTo(() => new MyPageMenu(this.manager));
    }, 'back-button');
    backBtn.btn.style('width', 0.040 * width + 'px');
    backBtn.btn.style('height', 0.065 * height + 'px');
    this.elements.push(backBtn); // 存入以便清理
  }

  draw() {
    // 直接使用全局变量
    if (bgImageSettings) {
      image(bgImageSettings, 0, 0, width, height);
    } else {
      background(200, 255, 200); // 备用背景
    }


  }
}