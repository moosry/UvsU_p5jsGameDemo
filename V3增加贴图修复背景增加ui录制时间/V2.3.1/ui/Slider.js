/**
 * Slider.js —— 水平滑块
 * x, y 为滑轨左端中心坐标（与你原来 volumeSlider 坐标语义一致）
 * 内部同步 window.gameVolume，并调用 outputVolume
 */
class Slider extends UIComponent {
  constructor(x, y, w, min = 0, max = 100, initialValue = 80) {
    super(x, y);
    this.w          = w;
    this.h          = 20;
    this.min        = min;
    this.max        = max;
    this.isDragging = false;

    this.value = initialValue;
    this.knobX = this._valueToKnobX(initialValue);
  }

  getValue() { return this.value; }

  setValue(val) {
    this.value = constrain(val, this.min, this.max);
    this.knobX = this._valueToKnobX(this.value);
  }

  isMouseOver(mx, my) {
    // 整个滑轨区域（包含旋钮上下各30px的宽松热区）
    return mx > this.x && mx < this.x + this.w &&
           my > this.y - 30 && my < this.y + 30;
  }

  draw() {
    // 滑轨背景
    fill(80);
    noStroke();
    rectMode(CORNER);
    rect(this.x, this.y - this.h / 2, this.w, this.h, 10);

    // 旋钮
    fill(150, 100, 255);
    rect(this.knobX - 5, this.y - this.h / 2 - 5, 30, 30, 15);
  }

  onMousePressed(mx, my) {
    if (this.isMouseOver(mx, my)) {
      this.isDragging = true;
      this._updateFromMouse(mx);
      return true;
    }
    return false;
  }

  onMouseDragged(mx, my) {
    if (this.isDragging) {
      this._updateFromMouse(mx);
      return true;
    }
    return false;
  }

  onMouseReleased(mx, my) {
    this.isDragging = false;
    return false;
  }

  // ── 私有方法 ──────────────────────────────

  _updateFromMouse(mx) {
    this.knobX = constrain(mx, this.x, this.x + this.w);
    this.value = this._knobXToValue(this.knobX);

    // 同步全局音量（与你原代码一致）
    window.gameVolume = this.value;
    if (typeof outputVolume === 'function') {
      outputVolume(this.value / 100);
    }
  }

  _valueToKnobX(val) {
    return map(val, this.min, this.max, this.x, this.x + this.w);
  }

  _knobXToValue(knobX) {
    return map(knobX, this.x, this.x + this.w, this.min, this.max);
  }
}
