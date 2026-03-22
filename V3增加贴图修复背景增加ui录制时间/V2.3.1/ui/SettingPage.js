/**
 * SettingPage.js
 *
 * extends Page
 * 属性：- Sidebar sidebar（类图组合关系）
 * 内容：左侧 Sidebar（音效/画面/控制），右侧面板，顶部返回按钮
 */
class SettingPage extends Page {

  constructor(onNavigate) {
    super(color(40, 40, 60), null);
    this.onNavigate     = onNavigate;
    this.sidebar        = null; // 类图中的组合属性
    this._slider        = null;
    this._muteBtn       = null;
    this._panels        = {};
    this._currentPanel  = null;
  }

  init() {
    this.children = [];

    // ── 返回按钮（左上角）────────────────────────
    this.addChild(new RectButton(
      70, 40, 120, 50, 'BACK',
      () => {
        this.onNavigate('menu');
        if (typeof changeBGM === 'function' && typeof menuBGM !== 'undefined') {
          changeBGM(menuBGM);
        }
      }
    ));

    // ── Sidebar（类图组合成员）────────────────────
    this.sidebar = new Sidebar(20, 100, (optionId) => this._showPanel(optionId));
    this.addChild(this.sidebar);

    // ── 音效面板 ──────────────────────────────────
    const soundPanel = new Container(0, 0);

    this._slider = new Slider(220, height / 2, 260, 0, 100, window.gameVolume ?? 80);
    soundPanel.addChild(this._slider);

    this._muteBtn = new SoundIcon(
      560, height / 2, 60,
      () => this._slider.setValue(window.gameVolume)
    );
    soundPanel.addChild(this._muteBtn);

    // ── 画面 / 控制面板（占位，可扩展）───────────
    this._panels = {
      sound:   soundPanel,
      display: new Container(0, 0),
      control: new Container(0, 0),
    };

    for (const panel of Object.values(this._panels)) {
      panel._visible = false;
      this.addChild(panel);
    }

    this._showPanel('sound'); // 默认显示音效面板
  }

  draw() {
    background(40, 40, 60);

    // 页面标题
    fill(200);
    noStroke();
    textSize(22);
    textAlign(LEFT, CENTER);
    text('设置', 210, 40);

    // 右侧分隔线
    stroke(70, 70, 90);
    strokeWeight(1);
    line(200, 90, 200, height - 40);
    noStroke();

    // 当前面板标题
    const titles = { sound: '🔊 音效', display: '🖥  画面', control: '🎮 控制' };
    if (this._currentPanel) {
      fill(255);
      textSize(18);
      textAlign(LEFT, CENTER);
      text(titles[this._currentPanel] ?? '', 220, height / 2 - 60);
    }

    super.draw();
  }

  // ── 私有 ──────────────────────────────────────
  _showPanel(optionId) {
    this._currentPanel = optionId;
    for (const [id, panel] of Object.entries(this._panels)) {
      panel._visible = (id === optionId);
    }
  }
}