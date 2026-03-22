/**
 * GamePlayPage.js
 *
 * extends Page
 * 属性（类图）：
 *   - GameHUD hud          组合成员
 *   - DeadScreen deadScreen 组合成员（默认隐藏）
 *   - WinScreen winScreen   组合成员（默认隐藏）
 *
 * 方法（类图）：
 *   + init()
 *   + draw()        游戏内容 → HUD → 死亡/胜利覆盖层
 *   + showDead()
 *   + showWin()
 *   + hideDead()
 *   + hideWin()
 *   + keyPressed()  转发给 HUD 及游戏逻辑
 */
class GamePlayPage extends Page {

  constructor(onNavigate) {
    super(null, null); // 背景由 drawPlaying() 自行绘制
    this.onNavigate = onNavigate;

    // 类图中的三个组合成员（不放入 children，手动控制绘制顺序）
    this.hud        = new GameHUD(() => this._handlePause());
    this.deadScreen = new DeadScreen();
    this.winScreen  = new WinScreen();

    this._deadVisible = false;
    this._winVisible  = false;
  }

  init() {
    this.children = [];
    this.hud.init();
  }

  // ── 显示 / 隐藏控制（类图方法）────────────────
  showDead() { this._deadVisible = true;  this._winVisible  = false; }
  showWin()  { this._winVisible  = true;  this._deadVisible = false; }
  hideDead() { this._deadVisible = false; }
  hideWin()  { this._winVisible  = false; }
  hideAll()  { this._deadVisible = false; this._winVisible  = false; }

  // ── draw()：HUD → 覆盖层 ──────────────────────
  // 游戏主内容（地形/角色）由 drawPlaying() 在外部先绘制
  draw() {
    this.hud.draw();
    if (this._deadVisible) this.deadScreen.draw();
    if (this._winVisible)  this.winScreen.draw();
  }

  // ── 事件路由 ──────────────────────────────────
  onMousePressed(mx, my)  { return this.hud.onMousePressed(mx, my);  }
  onMouseDragged(mx, my)  { return this.hud.onMouseDragged(mx, my);  }
  onMouseReleased(mx, my) { return this.hud.onMouseReleased(mx, my); }

  // ── keyPressed()（类图方法）───────────────────
  keyPressed(k) {
    this.hud.keyPressed(k);

    // C 键：死亡重试 / 胜利返回关卡选择
    if (k === 'c' || k === 'C') {
      if (this._deadVisible) {
        this.hideAll();
        const fn = window['loadLevel' + currentLevel]; if (typeof fn === 'function') fn();
      } else if (this._winVisible) {
        this.hideAll();
        this.onNavigate('levelselect');
      }
    }
  }

  isMouseOver(mx, my) { return true; }

  // ── 私有 ──────────────────────────────────────
  _handlePause() {
    // 暂停逻辑，按需扩展
    console.log('游戏暂停');
  }
}