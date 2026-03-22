// MyPageMenu.js
class MyPageMenu extends MyPage {
  constructor(manager) {
    super(); // 现在 this.elements = [] 已存在

    this.manager = manager;

    // 创建“开始”按钮，直接使用 this.addElement 或 this.elements.push
    const startBtn = new MyButton('PLAY', 0.461 * width, 0.8 * height, () => {
      this.manager.switchTo(() => new MyPageOpeningScene(this.manager));
    }, 'start-button');
    startBtn.btn.style('width', 0.088 * width + 'px');
    startBtn.btn.style('height', 0.155 * height + 'px');
    this.elements.push(startBtn); // 存入以便清理

    const settingsBtn = new MyButton('SETTINGS', 0.362 * width, 0.822 * height, () => {
      this.manager.switchTo(() => new MyPageSettings(this.manager));
    }, 'settings-button');
    settingsBtn.btn.style('width', 0.06 * width + 'px');
    settingsBtn.btn.style('height', 0.11 * height + 'px');
    this.elements.push(settingsBtn);

    const creditsBtn = new MyButton('Credits', 0.588 * width, 0.822 * height, () => {
      this.manager.switchTo(() => new MyPageCredits(this.manager));
    }, 'credits-button');
    creditsBtn.btn.style('width', 0.06 * width + 'px');
    creditsBtn.btn.style('height', 0.11 * height + 'px');
    this.elements.push(creditsBtn);

    // 创建跟随图片模块
    this.follower = new FollowImage(
      followerImg1,           // 图片
      width * 0.5,           // 圆心 X
      height * 0.11,          // 圆心 Y
      0.047*width,                   // 半径
      80                     // 图片显示大小（可选）
    );
  }

  draw() {
    if (bgImageMenu) {
      image(bgImageMenu, 0, 0, width, height);
    } else {
      background(200, 255, 200);
    }

    // 更新并绘制跟随模块
    this.follower.update();
    this.follower.draw();
  }

}