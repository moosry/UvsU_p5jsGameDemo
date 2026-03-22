// AssetsManager.js
// 资源加载器 — p5 instance mode (p5.js 2.0 async/await)
// 在 async setup() 中调用 await Assets.loadAll(p)

export const Assets = {
  // 字体
  customFont: null,

  // 故事文案
  storyTexts: null,

  // 主页动图
  followerImg1: null,
  followerImg2: null,

  // 背景图
  bgImageMenu: null,
  bgImageSettings: null,
  bgImageLevelChoice: null,
  bgImageOpeningScene: null,
  bgImageCredits: null,
  bgImageLevel1: null,
  bgImageLevel2: null,

  // 本体贴图（5方向）
  playerImg_right: null,
  playerImg_left: null,
  playerImg_up: null,
  playerImg_upRight: null,
  playerImg_upLeft: null,
  playerImg_dead: null,

  // 分身贴图（5方向）
  cloneImg_right: null,
  cloneImg_left: null,
  cloneImg_up: null,
  cloneImg_upRight: null,
  cloneImg_upLeft: null,

  // 地块贴图
  tileImage_goal: null,
  tileImage_ground: null,
  tileImage_platform: null,

  // 安全加载：失败时返回 null 而不是抛异常
  async _safeLoad(promise, name) {
    try {
      const result = await promise;
      console.log(name + '加载成功');
      return result;
    } catch (err) {
      console.warn(name + '加载失败：', err);
      return null;
    }
  },

  // 预加载所有资源（async/await，适配 p5.js 2.0）
  async loadAll(p) {
    const results = await Promise.all([
      this._safeLoad(p.loadImage('assets/images/bg/menu.png'), '菜单背景'),
      this._safeLoad(p.loadImage('assets/images/bg/settings.png'), '设置页背景'),
      this._safeLoad(p.loadImage('assets/images/bg/level_choice.png'), '关卡选择页背景'),
      this._safeLoad(p.loadImage('assets/images/bg/opening_scene.png'), '开场动画背景'),
      this._safeLoad(p.loadImage('assets/images/bg/credits.png'), 'Credits页背景'),
      this._safeLoad(p.loadImage('assets/images/bg/level1.png'), '关卡1背景'),
      this._safeLoad(p.loadImage('assets/images/bg/level2.png'), '关卡2背景'),
      this._safeLoad(p.loadImage('assets/images/bg/follower1.png'), '动图1'),
      this._safeLoad(p.loadImage('assets/images/bg/follower2.png'), '动图2'),
      this._safeLoad(p.loadFont('assets/fonts/HYPixel11pxU-2.ttf'), '字体'),
      this._safeLoad(p.loadStrings('assets/text/story.txt'), '故事文案'),
      // 本体贴图
      this._safeLoad(p.loadImage('assets/images/player/right.png'), '本体right'),
      this._safeLoad(p.loadImage('assets/images/player/left.png'), '本体left'),
      this._safeLoad(p.loadImage('assets/images/player/up.png'), '本体up'),
      this._safeLoad(p.loadImage('assets/images/player/upRight.png'), '本体upRight'),
      this._safeLoad(p.loadImage('assets/images/player/upLeft.png'), '本体upLeft'),
      this._safeLoad(p.loadImage('assets/images/player/playerdead.png'), '本体dead'),
      // 分身贴图
      this._safeLoad(p.loadImage('assets/images/player/right2.png'), '分身right'),
      this._safeLoad(p.loadImage('assets/images/player/left2.png'), '分身left'),
      this._safeLoad(p.loadImage('assets/images/player/up2.png'), '分身up'),
      this._safeLoad(p.loadImage('assets/images/player/upRight2.png'), '分身upRight'),
      this._safeLoad(p.loadImage('assets/images/player/upLeft2.png'), '分身upLeft'),
      // 地块贴图
      this._safeLoad(p.loadImage('assets/images/tiles/goal.png'), '终点门'),
      this._safeLoad(p.loadImage('assets/images/tiles/ground.png'), '地面贴图'),
      this._safeLoad(p.loadImage('assets/images/tiles/platform.png'), '平台贴图'),
    ]);

    // 按顺序赋值
    this.bgImageMenu = results[0];
    this.bgImageSettings = results[1];
    this.bgImageLevelChoice = results[2];
    this.bgImageOpeningScene = results[3];
    this.bgImageCredits = results[4];
    this.bgImageLevel1 = results[5];
    this.bgImageLevel2 = results[6];
    this.followerImg1 = results[7];
    this.followerImg2 = results[8];
    this.customFont = results[9];
    this.storyTexts = results[10];
    // 本体贴图
    this.playerImg_right = results[11];
    this.playerImg_left = results[12];
    this.playerImg_up = results[13];
    this.playerImg_upRight = results[14];
    this.playerImg_upLeft = results[15];
    this.playerImg_dead = results[16];
    // 分身贴图
    this.cloneImg_right = results[17];
    this.cloneImg_left = results[18];
    this.cloneImg_up = results[19];
    this.cloneImg_upRight = results[20];
    this.cloneImg_upLeft = results[21];
    // 地块贴图
    this.tileImage_goal = results[22];
    this.tileImage_ground = results[23];
    this.tileImage_platform = results[24];
  }
};
