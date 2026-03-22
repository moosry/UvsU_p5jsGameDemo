import { PageBase } from "../PageBase.js";
import { ButtonBase } from "../../components/ButtonBase.js";
import { NotebookButton } from "../../components/NotebookButton.js";
import { ScrollTextModule } from "../../components/ScrollTextModule.js";
import { Assets } from "../../../AssetsManager.js";

export class StaticPageOpeningStory extends PageBase {
  constructor(switcher, p) {
    super(switcher);
    this.p = p;
    this.scrollModule = null;
  }

  enter() {
    const p = this.p;

    // 返回按钮
    const backBtn = new ButtonBase(p, '◀', 0.02 * p.width, 0.03 * p.height, () => {
      this.switcher.showMainMenu(p);
    }, 'back-button');
    backBtn.btn.style('width', 0.040 * p.width + 'px');
    backBtn.btn.style('height', 0.065 * p.height + 'px');
    this.addElement(backBtn);

    // 提示按钮
    const hintBtn = new ButtonBase(p, 'PRESS [ENTER] TO SKIP', 0.2 * p.width, 0.03 * p.height, () => {
      this.switcher.showLevelChoice(p);
    }, 'hint-button');
    hintBtn.btn.style('width', 0.60 * p.width + 'px');
    hintBtn.btn.style('height', 0.055 * p.height + 'px');
    this.addElement(hintBtn);

    // 笔记本翻转按钮
    const notebookBtn = new NotebookButton(p, '', 0.55 * p.width, 0.25 * p.height, () => {
      console.log('笔记本按钮点击');
    }, 'my-custom-class');
    notebookBtn.front.html('[HOW TO PLAY]<br>&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;press [R]<br>&nbsp;&nbsp;&nbsp;&nbsp;<br>> Record<br>> End Record<br>> Replay<br>> End Replay');
    notebookBtn.back.html('&nbsp;use [WASD]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>Enter the door<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>&nbsp;>&nbsp;>&nbsp;WIN&nbsp;<&nbsp;<&nbsp;');
    this.addElement(notebookBtn);

    // 滚动字幕
    const lines = Assets.storyTexts || ['Loading story...'];
    this.scrollModule = new ScrollTextModule(p, lines, () => {
      this.switcher.showLevelChoice(p);
    }, {
      speed: 1,
      fadeHeight: 100,
      scrollRect: { x: 0.1 * p.width, y: 0.25 * p.height, w: 0.33 * p.width, h: 0.66 * p.height }
    });

    // 监听 Enter 键跳过
    this._keyHandler = (e) => {
      if (e.key === 'Enter') {
        this.switcher.showLevelChoice(p);
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  exit() {
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    super.exit();
  }

  update() {
    if (this.scrollModule) this.scrollModule.update();
  }

  draw() {
    const p = this.p;
    if (Assets.bgImageOpeningScene) {
      p.image(Assets.bgImageOpeningScene, 0, 0, p.width, p.height);
    } else {
      p.background(200, 255, 200);
    }
    if (this.scrollModule) this.scrollModule.draw();
  }
}
