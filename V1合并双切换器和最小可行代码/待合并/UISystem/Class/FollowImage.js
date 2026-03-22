// FollowImage.js
class FollowImage {
  /**
   * @param {p5.Image} img - 要跟随的图片对象
   * @param {number} circleX - 圆心的 x 坐标
   * @param {number} circleY - 圆心的 y 坐标
   * @param {number} circleRadius - 圆的半径
   * @param {number} imgSize - 图片显示尺寸（宽高相等），默认 min(50, circleRadius*0.8)
   */
  constructor(img, circleX, circleY, circleRadius, imgSize = null) {
    this.img = img;
    this.circleX = circleX;
    this.circleY = circleY;
    this.circleRadius = circleRadius;
    this.imgSize = imgSize || min(50, circleRadius * 0.8); // 默认不超过圆半径的80%

    // 初始位置在圆心
    this.posX = circleX;
    this.posY = circleY;
  }

  // 每帧更新位置：跟随鼠标，但限制在圆内
  update() {
    // 目标位置（鼠标在画布上的坐标）
    let targetX = mouseX;
    let targetY = mouseY;

    // 计算从圆心到目标点的向量
    let dx = targetX - this.circleX;
    let dy = targetY - this.circleY;
    let dist = sqrt(dx * dx + dy * dy);

    // 图片可移动的最大距离 = 圆半径 - 图片半径（图片中心到圆边界的距离）
    let maxDist = this.circleRadius - this.imgSize / 2;

    if (dist > maxDist) {
      // 如果目标超出圆范围，将图片放在圆边界上
      let angle = atan2(dy, dx);
      this.posX = this.circleX + cos(angle) * maxDist;
      this.posY = this.circleY + sin(angle) * maxDist;
    } else {
      // 在范围内，直接跟随鼠标
      this.posX = targetX;
      this.posY = targetY;
    }
  }

  // 绘制圆形边框和图片
  draw() {
    push();
    // 绘制图片（以中心点对齐）
    imageMode(CENTER);
    image(this.img, this.posX, this.posY, this.imgSize, this.imgSize);
  
    // 绘制圆形边框（可选）
    noFill();
    stroke(101, 55, 119);
    strokeWeight(15);
    ellipse(this.circleX, this.circleY, this.circleRadius * 2);

    pop();
  }
}