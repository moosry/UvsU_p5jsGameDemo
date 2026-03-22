// MyPageLevelChoice.js
class MyPageLevelChoice extends MyPage {
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
    
    // 创建“level1”按钮，直接使用 this.addElement 或 this.elements.push
    const level1Btn = new MyButton(' ', 0.13 * width, 0.448 * height, () => {
      this.manager.switchTo(() => new MyPageOpeningScene(this.manager));
    }, 'level1-button');
    level1Btn.btn.style('width', 0.050 * width + 'px');
    level1Btn.btn.style('height', 0.056 * height + 'px');
    this.elements.push(level1Btn); // 存入以便清理

    // 创建“level2”按钮，直接使用 this.addElement 或 this.elements.push
    const level2Btn = new MyButton(' ', 0.305 * width, 0.449 * height, () => {
      this.manager.switchTo(() => new MyPageOpeningScene(this.manager));
    }, 'level2-button');
    level2Btn.btn.style('width', 0.051 * width + 'px');
    level2Btn.btn.style('height', 0.056 * height + 'px');
    this.elements.push(level2Btn); // 存入以便清理

    // 创建跟随图片模块
    this.follower = new FollowImage(
      followerImg2,           // 图片
      width * 0.5,           // 圆心 X
      height * 0.11,          // 圆心 Y
      0.047*width,                   // 半径
      80                     // 图片显示大小（可选）
    );

}

  draw() {
    // 直接使用全局变量
    if (bgImageLevelChoice) {
      image(bgImageLevelChoice, 0, 0, width, height);
    } else {
      background(200, 255, 200); // 备用背景
    }

    // 更新并绘制跟随模块
    this.follower.update();
    this.follower.draw();
  }

}