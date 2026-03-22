/**
 * SoundIcon.js —— 静音切换按钮
 * 点击时保存/恢复 window.gameVolume（与你原 handleSettingClick 静音逻辑一致）
 * x, y 为圆心坐标
 */
class SoundIcon extends UIComponent {
  constructor(x, y, size, onToggle) {
    super(x, y);
    this.size     = size;
    this.isMuted  = false;
    this.onToggle = onToggle; // function(isMuted) 可选回调
  }

  get label() { return this.isMuted ? '🔇' : '🔊'; }

  isMouseOver(mx, my) {
    return dist(mx, my, this.x, this.y) < this.size / 2;
  }

  onMousePressed(mx, my) {
    if (this.isMouseOver(mx, my)) {
      this._toggle();
      return true;
    }
    return false;
  }

  draw() {
    const hovering = this.isMouseOver(mouseX, mouseY);
    fill(hovering ? color(100, 100, 150) : color(80, 80, 120));
    stroke(255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size);

    fill(255);
    noStroke();
    textSize(this.size * 0.4);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }

  // ── 私有方法 ──────────────────────────────

  _toggle() {
    if (!this.isMuted) {
      // 静音：保存当前音量
      window.savedVolume = window.gameVolume ?? 80;
      window.gameVolume  = 0;
      this.isMuted = true;
    } else {
      // 恢复：还原保存的音量
      window.gameVolume = window.savedVolume ?? 80;
      this.isMuted = false;
    }
    if (typeof outputVolume === 'function') {
      outputVolume(window.gameVolume / 100);
    }
    if (typeof this.onToggle === 'function') {
      this.onToggle(this.isMuted);
    }
  }
}

// ── ImageSoundIcon —— 贴图版 ──────────────────
class ImageSoundIcon extends SoundIcon {
  constructor(x, y, size, onToggle, imgOn, imgOff) {
    super(x, y, size, onToggle);
    this.imgOn  = imgOn;
    this.imgOff = imgOff;
  }

  draw() {
    const img = this.isMuted ? this.imgOff : this.imgOn;
    if (img) {
      imageMode(CENTER);
      image(img, this.x, this.y, this.size, this.size);
    } else {
      super.draw();
    }
  }
}
