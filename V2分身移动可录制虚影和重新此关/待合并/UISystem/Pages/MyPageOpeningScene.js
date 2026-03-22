// MyPageOpeningScene.js
class MyPageOpeningScene extends MyPage {
  constructor(manager) {
    super();
    this.manager = manager;

    // 创建“返回”按钮
    const backBtn = new MyButton('◀', 0.02 * width, 0.03 * height, () => {
      this.manager.switchTo(() => new MyPageMenu(this.manager));
    }, 'back-button');
    backBtn.btn.style('width', 0.040 * width + 'px');
    backBtn.btn.style('height', 0.065 * height + 'px');
    this.elements.push(backBtn);

    // 创建“提示”按钮
    const hintBtn = new MyButton('PRESS [ENTER] TO SKIP', 0.2 * width, 0.03 * height, () => {
      this.manager.switchTo(() => new MyPageLevelChoice(this.manager));
    }, 'hint-button');
    hintBtn.btn.style('width', 0.60 * width + 'px');
    hintBtn.btn.style('height', 0.055 * height + 'px');
    this.elements.push(hintBtn);


    // 创建笔记本按钮（NotebookButton 类）
    const notebookBtn = new NotebookButton('', 0.55 * width, 0.25 * height, () => {
      console.log('笔记本按钮点击');
    }, 'my-custom-class');

    // 设置正面文字（两行）
    notebookBtn.front.html('[HOW TO PLAY]<br>&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;press [R]<br>&nbsp;&nbsp;&nbsp;&nbsp;<br>> Record<br>> End Record<br>> Replay<br>> End Replay');

    // 设置背面文字（也可用 <br> 换行）
    notebookBtn.back.html('&nbsp;use [WASD]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>Enter the door<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>&nbsp;>&nbsp;>&nbsp;WIN&nbsp;<&nbsp;<&nbsp;');
    this.elements.push(notebookBtn); // 存入以便清理



    // 创建滚动字幕模块
    this.scrollModule = new ScrollTextModule(storyTexts, () => {
      this.manager.switchTo(() => new MyPageLevelChoice(this.manager)); },
  {
    speed: 1,
    fadeHeight: 100,
    scrollRect: { x: 0.1 * width, y: 0.25 * height, w: 0.33 * width, h: 0.66 * height }  // 自定义区域
  }
);
  }

  draw() {
    // 绘制背景
    if (bgImageOpeningScene) {
      image(bgImageOpeningScene, 0, 0, width, height);
    } else {
      background(200, 255, 200);
    }

    // 更新并绘制字幕模块
    this.scrollModule.update();
    this.scrollModule.draw();

    // 注意：按钮是 DOM 元素，自动显示在画布上方，无需在 draw 中处理
  }

  handleKeyPress(keyCode, key) {
    if (key === 'Enter' || keyCode === 13) {
      console.log('回车按下，跳过开场');
      this.manager.switchTo(() => new MyPageLevelChoice(this.manager));
    }
  }
}