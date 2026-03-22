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
  }
};
