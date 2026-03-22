/**
 * Button.js —— 按钮抽象基类及各具体子类
 */

// ── 抽象基类 ──────────────────────────────────
class Button extends UIComponent {
  constructor(x, y, label, callback) {
    super(x, y);
    this.label     = label;
    this.callback  = callback;
    this.isHovered = false;
    this.isPressed = false;
  }

  draw() { throw new Error(`${this.constructor.name} 必须实现 draw()`); }
  isMouseOver(mx, my) { throw new Error(`${this.constructor.name} 必须实现 isMouseOver()`); }

  updateHover(mx, my) {
    this.isHovered = this.isMouseOver(mx, my);
  }

  onMousePressed(mx, my) {
    if (this.isMouseOver(mx, my)) {
      this.isPressed = true;
      return true;
    }
    return false;
  }

  // 按下+释放都在按钮内才触发 callback
  onMouseReleased(mx, my) {
    if (this.isPressed && this.isMouseOver(mx, my)) {
      if (typeof this.callback === 'function') this.callback();
    }
    this.isPressed = false;
    return false;
  }
}

// ── RectButton —— 矩形按钮（x,y 为中心坐标，与你原代码一致）────
class RectButton extends Button {
  constructor(x, y, w, h, label, callback) {
    super(x, y, label, callback);
    this.w = w;
    this.h = h;
  }

  isMouseOver(mx, my) {
    return mx > this.x - this.w / 2 && mx < this.x + this.w / 2 &&
           my > this.y - this.h / 2 && my < this.y + this.h / 2;
  }

  draw() {
    fill(this.isPressed ? color(120, 40, 40) : this.isHovered ? color(200, 80, 80) : color(150, 50, 50));
    stroke(255);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 10);

    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
}

// ── ImageRectButton —— 贴图矩形按钮 ──────────
class ImageRectButton extends RectButton {
  constructor(x, y, w, h, label, callback, imgNormal, imgHover, imgPressed) {
    super(x, y, w, h, label, callback);
    this.imgNormal  = imgNormal;
    this.imgHover   = imgHover;
    this.imgPressed = imgPressed;
  }

  draw() {
    const img = (this.isPressed && this.imgPressed) ? this.imgPressed
              : (this.isHovered && this.imgHover)   ? this.imgHover
              : this.imgNormal;
    if (img) {
      imageMode(CENTER);
      image(img, this.x, this.y, this.w, this.h);
    } else {
      super.draw();
    }
  }
}

// ── CircleButton —— 圆形按钮（x,y 为圆心，与你原代码一致）────
class CircleButton extends Button {
  constructor(x, y, r, label, callback) {
    super(x, y, label, callback);
    this.r = r;
  }

  isMouseOver(mx, my) {
    return dist(mx, my, this.x, this.y) < this.r;
  }

  draw() {
    fill(this.isHovered ? color(255, 255, 255, 40) : color(255, 255, 255, 0));
    noStroke();
    ellipse(this.x, this.y, this.r * 2);

    // 文字样式（与你原来菜单圆按钮一致）
    fill(128, 0, 128);
    stroke(this.isHovered ? 255 : 0);
    strokeWeight(this.isHovered ? 1.2 : 0.8);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
}

// ── ImageCircleButton —— 贴图圆形按钮 ────────
class ImageCircleButton extends CircleButton {
  constructor(x, y, r, label, callback, imgNormal, imgHover, imgPressed) {
    super(x, y, r, label, callback);
    this.imgNormal  = imgNormal;
    this.imgHover   = imgHover;
    this.imgPressed = imgPressed;
  }

  draw() {
    const img = (this.isPressed && this.imgPressed) ? this.imgPressed
              : (this.isHovered && this.imgHover)   ? this.imgHover
              : this.imgNormal;
    if (img) {
      imageMode(CENTER);
      image(img, this.x, this.y, this.r * 2, this.r * 2);
    } else {
      super.draw();
    }
  }
}
