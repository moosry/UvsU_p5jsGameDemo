/**
 * Page.js —— 页面基类 + Sidebar
 */

class Page extends Container {
  constructor(bgColor = null, bgImage = null) {
    super(0, 0);
    this.bgColor = bgColor;
    this.bgImage = bgImage;
  }

  draw() {
    // 先绘制背景
    if (this.bgImage) {
      imageMode(CORNER);
      image(this.bgImage, 0, 0, width, height);
    } else if (this.bgColor !== null) {
      background(this.bgColor);
    }
    // 再绘制子组件
    super.draw();
  }

  // 页面默认覆盖整个画布
  isMouseOver(mx, my) { return true; }
}

// ─────────────────────────────────────────────
// Sidebar —— 设置页侧边栏
// ─────────────────────────────────────────────
class Sidebar extends Container {
  constructor(x, y, onOptionSelected) {
    super(x, y);
    this.selectedOptionId = null;
    this.onOptionSelected = onOptionSelected;
    this._buildOptions();
  }

  setSelectedOption(optionId) {
    this.selectedOptionId = optionId;
  }

  isMouseOver(mx, my) {
    return mx >= this.x && mx <= this.x + 160 &&
           my >= this.y && my <= this.y + 300;
  }

  draw() {
    // 侧边栏背景
    fill(45, 45, 55);
    noStroke();
    rectMode(CORNER);
    rect(this.x, this.y, 160, 300, 8);

    // 子组件（选项按钮）
    super.draw();

    // 选中高亮条
    for (const child of this.children) {
      if (child._optionId === this.selectedOptionId) {
        fill(80, 160, 255);
        noStroke();
        rectMode(CORNER);
        rect(this.x, child.y - child.h / 2, 4, child.h, 2);
      }
    }
  }

  _buildOptions() {
    const options = [
      { id: 'sound',   label: '🔊 音效' },
      { id: 'display', label: '🖥  画面' },
      { id: 'control', label: '🎮 控制' },
    ];
    options.forEach((opt, i) => {
      const btn = new RectButton(
        this.x + 88,               // 中心x
        this.y + 30 + i * 60,      // 中心y
        144, 44,
        opt.label,
        () => {
          this.setSelectedOption(opt.id);
          if (typeof this.onOptionSelected === 'function') {
            this.onOptionSelected(opt.id);
          }
        }
      );
      btn._optionId = opt.id;
      this.addChild(btn);
    });
  }
}
