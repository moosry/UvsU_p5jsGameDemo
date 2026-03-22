/**
 * LevelSelectPage.js
 *
 * extends Page
 * 属性：无额外属性（类图）
 * 内容：背景图铺满，三个矩形关卡按钮，底部圆形返回按钮
 */
class LevelSelectPage extends Page {

  constructor(onNavigate) {
    super(null, null);
    this.onNavigate    = onNavigate;
    this.unlockedCount = 3; // 默认全解锁，可由外部修改
  }

  init() {
    this.children = [];

    // ── 三个关卡按钮 ──────────────────────────────
    const levelConfigs = [
      { id: 1, label: 'LEVEL 1', x: 145, y: height / 2 - 20, w: 57, h: 32 },
      { id: 2, label: 'LEVEL 2', x: 313, y: height / 2 - 20, w: 57, h: 32 },
      { id: 3, label: 'LEVEL 3', x: 483, y: height / 2 - 20, w: 56, h: 32 },
    ];

    for (const cfg of levelConfigs) {
      const unlocked = cfg.id <= this.unlockedCount;
      const btn = new _LevelButton(
        cfg.x, cfg.y, cfg.w, cfg.h, cfg.label,
        unlocked ? () => this._startLevel(cfg.id) : null
      );
      btn._locked = !unlocked;
      this.addChild(btn);
    }

    // ── 底部圆形返回按钮 ──────────────────────────
    this.addChild(new _LevelBackButton(
      width / 2, height - 5, 34, 'BACK',
      () => this.onNavigate('menu')
    ));
  }

  setBgImage(img) { this.bgImage = img; }

  // ── 私有 ──────────────────────────────────────
  _startLevel(id) {
    currentLevel = id;
    const fnName = 'loadLevel' + id;
    if (typeof window[fnName] === 'function') window[fnName]();
    gameState = 'PLAYING';
    if (typeof currentBGM !== 'undefined' && currentBGM) currentBGM.stop();
    const bgm = window['level' + id + 'BGM'];
    if (typeof changeBGM === 'function' && bgm) changeBGM(bgm);
  }
}

// ── _LevelButton ──────────────────────────────
// 关卡按钮：悬停时显示半透明白色遮罩，无底色
class _LevelButton extends Button {

  constructor(x, y, w, h, label, callback) {
    super(x, y, label, callback); // x, y 为中心坐标
    this.w = w;
    this.h = h;
  }

  isMouseOver(mx, my) {
    return mx > this.x - this.w / 2 && mx < this.x + this.w / 2 &&
           my > this.y - this.h / 2 && my < this.y + this.h / 2;
  }

  draw() {
    if (this.isHovered && !this._locked) {
      fill(255, 255, 255, 80);
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.w, this.h, 10);
    }
  }
}

// ── _LevelBackButton ──────────────────────────
// 底部圆形返回按钮：文字上移 13px，紫色文字，悬停白描边
class _LevelBackButton extends CircleButton {

  draw() {
    const h = this.isHovered;
    fill(h ? color(255, 255, 255, 40) : color(0, 0, 0, 0));
    noStroke();
    ellipse(this.x, this.y, this.r * 2);

    fill(128, 0, 128);
    stroke(h ? 255 : 0);
    strokeWeight(1.2);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y - 13); // 文字上移 13px
    noStroke();
  }
}