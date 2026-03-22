/**
 * WinScreen.js
 *
 * extends UIComponent
 * 胜利遮罩层：半透明深蓝色覆盖 + 绿色大字 + 返回提示
 */
class WinScreen extends UIComponent {

  constructor() {
    super(0, 0);
  }

  isMouseOver(mx, my) {
    return mx >= 0 && mx <= width && my >= 0 && my <= height;
  }

  draw() {
    // 半透明深蓝色遮罩
    fill(20, 40, 80, 180);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);

    // 绿色大字
    textAlign(CENTER, CENTER);
    fill(50, 255, 150);
    textSize(40);
    textStyle(BOLD);
    text('MISSION SUCCESSFUL', width / 2, height / 2 - 40);

    fill(255);
    textSize(20);
    textStyle(NORMAL);
    text('You have escaped the sector.', width / 2, height / 2 + 20);

    fill(200, 255, 200);
    textSize(18);
    text("Press 'C' to Return to Level Select", width / 2, height / 2 + 80);
  }
}