/**
 * GameHUD.js
 *
 * extends Container
 * 游戏内常驻 HUD：管理游戏内 UI 组件，绘制录制状态提示
 * 方法：
 *   + draw()              绘制子组件 + 录制状态提示
 *   + keyPressed(key)     Esc/P 触发暂停
 */
class GameHUD extends Container {

  constructor(onPause) {
    super(0, 0);
    this.onPause = onPause;
  }

  init() {
    this.children = [];
    // 如需添加暂停按钮等可在此 addChild
  }

  isMouseOver(mx, my) { return true; }

  draw() {
    super.draw();            // 绘制子组件
    this._drawRecordingUI(); // 录制状态提示叠在最顶层
  }

  keyPressed(key) {
    if (key === 'Escape' || key === 'p' || key === 'P') {
      if (typeof this.onPause === 'function') this.onPause();
    }
  }

  // ── 私有：录制状态提示 ────────────────────────
  _drawRecordingUI() {
    push();
    textAlign(LEFT, TOP);
    textSize(16);
    noStroke();

    if (typeof levelState !== 'undefined') {
      if (levelState === 'RECORDING') {
        if (frameCount % 60 < 30) {
          fill(255, 0, 0);
          ellipse(30, 30, 12, 12);
        }
        fill(255);
        text('RECORDING ECHO...', 50, 22);
      } else if (levelState === 'REPLAYING') {
        fill(100, 200, 255);
        text('ECHO MANIFESTED', 30, 22);
      } else {
        fill(200);
        text("Press 'R' to Record Shadow", 30, 22);
      }
    }
    pop();
  }
}