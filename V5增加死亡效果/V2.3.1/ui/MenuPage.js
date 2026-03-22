/**
 * MenuPage.js
 *
 * extends Page
 * 属性：无额外属性（类图）
 * 内容：三个圆形按钮 SETTING / PLAY / CREDITS
 *       位置按背景图原始尺寸 2350×1322 缩放
 *       PLAY → 故事动画，其余 → 页面切换
 */
class MenuPage extends Page {

  constructor(onNavigate) {
    super(color(20, 20, 30), null); // bgColor 兜底，背景图通过 setBgImage() 传入
    this.onNavigate = onNavigate;
  }

  // 在 setup() 里调用，此时 width/height 已就绪
  init() {
    this.children = [];

    const scaleX = width  / 2350;
    const scaleY = height / 1322;

    const configs = [
      { id: 'setting', label: 'SETTING', x: 910  * scaleX, y: 1150 * scaleY, r: 75 * scaleX, textSizeRatio: 0.4  },
      { id: 'play',    label: 'PLAY',    x: 1175 * scaleX, y: 1140 * scaleY, r: 95 * scaleX, textSizeRatio: 0.75 },
      { id: 'credits', label: 'CREDITS', x: 1440 * scaleX, y: 1150 * scaleY, r: 75 * scaleX, textSizeRatio: 0.4  },
    ];

    for (const cfg of configs) {
      this.addChild(new _MenuCircleButton(
        cfg.x, cfg.y, cfg.r, cfg.label, cfg.textSizeRatio,
        () => this._handleNav(cfg.id)
      ));
    }
  }

  setBgImage(img) { this.bgImage = img; }

  // ── 私有 ──────────────────────────────────────
  _handleNav(id) {
    if (id === 'play') {
      gameState     = ST_STORY_CRAWL;
      crawlScrollY  = height;
      crawlFinished = false;
      if (typeof currentBGM !== 'undefined' && currentBGM) currentBGM.stop();
    } else {
      this.onNavigate(id); // 'setting' | 'credits'
    }
  }
}

// ── _MenuCircleButton ─────────────────────────
// 菜单专用圆形按钮，还原原代码绘制风格
// （内部辅助类，不对外暴露）
class _MenuCircleButton extends CircleButton {

  constructor(x, y, r, label, textSizeRatio, callback) {
    super(x, y, r, label, callback);
    this.textSizeRatio = textSizeRatio;
  }

  draw() {
    const h = this.isHovered;

    // 悬停白色光晕
    if (h) {
      fill(255, 255, 255, 40);
      noStroke();
      ellipse(this.x, this.y, this.r * 2.2, this.r * 2.2);
    }

    // 文字
    if (typeof customFont !== 'undefined' && customFont) textFont(customFont);
    textSize(this.r * this.textSizeRatio);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    fill(h ? color(128, 0, 128) : color(100, 0, 100));
    stroke(h ? 255 : 0);
    strokeWeight(h ? 1.2 : 0.8);
    text(this.label, this.x, this.y);
    noStroke();
  }
}