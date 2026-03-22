// ScrollTextModule.js
class ScrollTextModule {
  /**
   * @param {string[]} lines - 字幕行数组
   * @param {function} onComplete - 滚动完成后执行的回调
   * @param {object} options - 可选配置
   * @param {number} options.speed - 滚动速度（像素/帧），默认 1.2
   * @param {number} options.fadeHeight - 边缘渐隐高度（像素），默认 80
   * @param {object} options.scrollRect - 滚动区域 { x, y, w, h }，默认全屏 (0,0,width,height)
   */
  constructor(lines, onComplete, options = {}) {
    this.lines = lines;
    this.onComplete = onComplete;
    this.speed = options.speed || 1.2;
    this.fadeHeight = options.fadeHeight || 80;
    this.scrollRect = options.scrollRect || { x: 0, y: 0, w: width, h: height };

    this.scrollY = this.scrollRect.y + this.scrollRect.h;  // 从区域底部开始
    this.lineHeight = 40;
    this.totalHeight = lines.length * this.lineHeight;
    this.completed = false;
  }

  update() {
    if (this.completed) return;
    this.scrollY -= this.speed;
    if (this.scrollY < this.scrollRect.y - this.totalHeight - this.lineHeight) {
      this.completed = true;
      if (this.onComplete) this.onComplete();
    }
  }

  draw() {
    if (this.completed) return;

    push();
    // 设置文字样式
    textSize(30);
    textAlign(CENTER, CENTER);
    textFont('HYPixel11');

    // 裁剪到滚动区域，防止文字溢出
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(this.scrollRect.x, this.scrollRect.y, this.scrollRect.w, this.scrollRect.h);
    drawingContext.clip();

    // 逐行绘制，根据位置调整透明度
    for (let i = 0; i < this.lines.length; i++) {
      let y = this.scrollY + i * this.lineHeight;
      // 计算透明度：基于该行中心距离区域顶部和底部的距离
      let alpha = 255; // 默认不透明
      let lineCenterY = y;

      if (lineCenterY < this.scrollRect.y + this.fadeHeight) {
        // 靠近顶部：距离顶部越近越透明
        let dist = lineCenterY - this.scrollRect.y;
        alpha = map(dist, 0, this.fadeHeight, 0, 255);
        alpha = constrain(alpha, 0, 255);
      } else if (lineCenterY > this.scrollRect.y + this.scrollRect.h - this.fadeHeight) {
        // 靠近底部：距离底部越近越透明
        let dist = this.scrollRect.y + this.scrollRect.h - lineCenterY;
        alpha = map(dist, 0, this.fadeHeight, 0, 255);
        alpha = constrain(alpha, 0, 255);
      }

      // 设置填充色带透明度
      fill(255, alpha);  // 白色文字，动态透明度

      // 绘制该行（如果y在区域附近才绘制，提高性能）
      if (y > this.scrollRect.y - this.lineHeight && y < this.scrollRect.y + this.scrollRect.h + this.lineHeight) {
        text(this.lines[i], this.scrollRect.x + this.scrollRect.w / 2, y);
      }
    }

    // 恢复裁剪状态
    drawingContext.restore();
    pop();
  }
}