/**
 * CreditsPage.js
 *
 * extends Page
 * 属性：无额外属性（类图）
 * 内容：粉紫色标题 + 白色正文三行 + 返回按钮
 */
class CreditsPage extends Page {

  constructor(onNavigate) {
    super(color(20, 20, 40), null);
    this.onNavigate = onNavigate;
  }

  init() {
    this.children = [];

    this.addChild(new RectButton(
      width / 2, height - 80, 120, 50, 'BACK',
      () => {
        this.onNavigate('menu');
        if (typeof changeBGM === 'function' && typeof menuBGM !== 'undefined') {
          changeBGM(menuBGM);
        }
      }
    ));
  }

  draw() {
    background(20, 20, 40);

    fill(255, 200, 255);
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    text('CREDITS', width / 2, height / 2 - 100);

    fill(255);
    textSize(18);
    text('Game Developed By You',           width / 2, height / 2 - 40);
    text('Art & Sound: Open Source Assets', width / 2, height / 2);
    text('Engine: p5.js',                   width / 2, height / 2 + 40);

    super.draw(); // 绘制返回按钮
  }
}