/**
 * DeadScreen.js
 *
 * extends UIComponent
 * 死亡遮罩层：半透明黑色覆盖 + 红色大字 + 呼吸灯提示
 */
class DeadScreen extends UIComponent {

  constructor() {
    super(0, 0);
  }

  isMouseOver(mx, my) {
    return mx >= 0 && mx <= width && my >= 0 && my <= height;
  }

  draw() {
    // 半透明黑色遮罩
    fill(0, 0, 0, 150);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);

    // 红色大字
    textAlign(CENTER, CENTER);
    fill(255, 50, 50);
    textSize(40);
    textStyle(BOLD);
    text('SUBJECT TERMINATED', width / 2, height / 2 - 40);

    // 呼吸灯提示（sin 波动透明度）
    const pulse = 150 + sin(frameCount * 0.1) * 105;
    fill(255, 255, 255, pulse);
    textSize(20);
    textStyle(NORMAL);
    text("Press 'C' to Restart the Loop", width / 2, height / 2 + 40);
  }
}