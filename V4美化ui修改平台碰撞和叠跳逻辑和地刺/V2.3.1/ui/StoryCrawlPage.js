/**
 * StoryCrawlPage.js
 *
 * extends Page
 * 属性（类图）：
 *   - float crawlScrollY  文字当前滚动Y坐标
 *   - boolean isFinished  动画是否播放完毕
 * 方法（类图）：
 *   + StoryCrawlPage(function onFinished)
 *   + init()
 *   + draw()   每帧向上移动 crawlScrollY，播完后调用 onFinished
 *   + reset()  重置滚动位置，供重新播放使用
 *
 * 内容：使用 JS-cutscene.js 里定义的 starWarsStory 和 crawlSpeed
 *       星星背景、顶部渐隐、呼吸灯跳过提示，完全还原原版效果
 */
class StoryCrawlPage extends Page {

  constructor(onFinished) {
    super(null, null); // 背景在 draw() 里手动绘制
    this.onFinished   = onFinished;
    this.crawlScrollY = 0;
    this.isFinished   = false;
  }

  init() {
    this.children = [];
    this.reset();
  }

  // 重置滚动位置，供重新进入时调用
  reset() {
    this.crawlScrollY = height;
    this.isFinished   = false;
  }

  draw() {
    // 深色宇宙背景
    background(0, 5, 25);

    // 随机星星（randomSeed 保证每帧位置一致，不闪烁）
    fill(255);
    noStroke();
    randomSeed(99);
    for (let i = 0; i < 50; i++) {
      ellipse(random(width), random(height), random(1, 3));
    }

    // 文字逐行绘制，顶部渐隐效果
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    noStroke();

    const lineHeight = 28;
    let currentY = this.crawlScrollY;

    for (let i = 0; i < starWarsStory.length; i++) {
      // 顶部渐隐
      let alpha = currentY < 150 ? map(currentY, 0, 150, 0, 255) : 255;
      fill(255, 220, 20, alpha);

      // 标题行（第0行和第2行）用大字号
      textSize(i === 0 || i === 2 ? 28 : 20);
      text(starWarsStory[i], width / 2, currentY);
      currentY += lineHeight;
    }

    // 每帧向上滚动
    this.crawlScrollY -= (typeof crawlSpeed !== 'undefined' ? crawlSpeed : 0.8);

    // 文字完全滚出顶部后触发回调
    const totalHeight = starWarsStory.length * lineHeight;
    if (this.crawlScrollY + totalHeight < -100 && !this.isFinished) {
      this.isFinished = true;
      if (typeof this.onFinished === 'function') this.onFinished();
    }

    // 左上角跳过提示（呼吸灯效果）
    push();
    fill(255, 255, 255, 205 + sin(frameCount * 0.08) * 50);
    textAlign(LEFT, TOP);
    textSize(18);
    textStyle(BOLD);
    text('Press [ENTER] to Skip >>', 20, 20);
    pop();
  }

  // Enter 键跳过
  keyPressed(k) {
    if (k === 'Enter' && !this.isFinished) {
      this.isFinished = true;
      if (typeof this.onFinished === 'function') this.onFinished();
    }
  }

  isMouseOver(mx, my) { return true; }
}