/*
 资源管理模块
 职责：素材加载、BGM切换、音量管理
*/

// --- 素材变量（仅在此声明，全局共享）---
let bgImage_level1;
let bgImage_menu;
let bgImage_levelChoose;
let bgImage_cutscene;
let menuBGM;
let level1BGM;
let level2BGM;
let level3BGM;
let customFont;
let tileImage_ground;
let tileImage_platform;
let goalImage;

// 本体贴图（6方向）
let playerImg_right;
let playerImg_left;
let playerImg_up;
let playerImg_upRight;
let playerImg_upLeft;

// 分身贴图（6方向，文件名后加2）
let cloneImg_right;
let cloneImg_left;
let cloneImg_up;
let cloneImg_upRight;
let cloneImg_upLeft;

// ==========================================
// 素材预加载
// ==========================================
function preloadAssets() {

  // 背景图
  try {
    bgImage_level1 = loadImage('assets/images/bg/level1.png',
      () => console.log('关卡1背景加载成功'),
      (err) => console.warn('关卡1背景加载失败：', err)
    );
    bgImage_menu = loadImage('assets/images/bg/menu.png',
      () => console.log('菜单背景加载成功'),
      (err) => console.warn('菜单背景加载失败：', err)
    );
    bgImage_levelChoose = loadImage('assets/images/bg/levelChoose.png',
      () => console.log('关卡选择背景加载成功'),
      (err) => console.warn('关卡选择背景加载失败：', err)
    );
    bgImage_cutscene = loadImage('assets/images/bg/cutscene.png',
      () => console.log('过场背景加载成功'),
      (err) => console.warn('过场背景加载失败：', err)
    );
  } catch (e) {
    console.error('背景图加载异常：', e);
  }

  // 地块贴图
  try {
    tileImage_ground = loadImage('assets/images/tiles/ground.png',
      () => console.log('地面贴图加载成功'),
      (err) => console.warn('地面贴图加载失败：', err)
    );
    tileImage_platform = loadImage('assets/images/tiles/platform.png',
      () => console.log('平台贴图加载成功'),
      (err) => console.warn('平台贴图加载失败：', err)
    );
    goalImage = loadImage('assets/images/tiles/goal.png',
      () => console.log('终点门贴图加载成功'),
      (err) => console.warn('终点门贴图加载失败：', err)
    );
  } catch (e) {
    console.error('地块贴图加载异常：', e);
  }

  // 本体贴图
  try {
    playerImg_right   = loadImage('assets/images/player/right.png',
      () => console.log('本体right加载成功'),
      (err) => console.warn('本体right加载失败：', err)
    );
    playerImg_left    = loadImage('assets/images/player/left.png',
      () => console.log('本体left加载成功'),
      (err) => console.warn('本体left加载失败：', err)
    );
    playerImg_up      = loadImage('assets/images/player/up.png',
      () => console.log('本体up加载成功'),
      (err) => console.warn('本体up加载失败：', err)
    );
    playerImg_upRight = loadImage('assets/images/player/upRight.png',
      () => console.log('本体upRight加载成功'),
      (err) => console.warn('本体upRight加载失败：', err)
    );
    playerImg_upLeft  = loadImage('assets/images/player/upLeft.png',
      () => console.log('本体upLeft加载成功'),
      (err) => console.warn('本体upLeft加载失败：', err)
    );
  } catch (e) {
    console.error('本体贴图加载异常：', e);
  }

  // 分身贴图
  try {
    cloneImg_right   = loadImage('assets/images/player/right2.png',
      () => console.log('分身right2加载成功'),
      (err) => console.warn('分身right2加载失败：', err)
    );
    cloneImg_left    = loadImage('assets/images/player/left2.png',
      () => console.log('分身left2加载成功'),
      (err) => console.warn('分身left2加载失败：', err)
    );
    cloneImg_up      = loadImage('assets/images/player/up2.png',
      () => console.log('分身up2加载成功'),
      (err) => console.warn('分身up2加载失败：', err)
    );
    cloneImg_upRight = loadImage('assets/images/player/upRight2.png',
      () => console.log('分身upRight2加载成功'),
      (err) => console.warn('分身upRight2加载失败：', err)
    );
    cloneImg_upLeft  = loadImage('assets/images/player/upLeft2.png',
      () => console.log('分身upLeft2加载成功'),
      (err) => console.warn('分身upLeft2加载失败：', err)
    );
  } catch (e) {
    console.error('分身贴图加载异常：', e);
  }

  // 音频
  try {
    menuBGM = loadSound('assets/audio/menu.mp3',
      () => console.log('菜单BGM加载成功'),
      (err) => console.warn('菜单BGM加载失败：', err)
    );
    level1BGM = loadSound('assets/audio/level1.mp3',
      () => console.log('关卡1BGM加载成功'),
      (err) => console.warn('关卡1BGM加载失败：', err)
    );
  } catch (e) {
    console.error('音频加载异常：', e);
  }

  // 字体
  try {
    customFont = loadFont('assets/fonts/HYPixel11pxU-2.ttf',
      () => console.log('字体加载成功'),
      (err) => {
        console.warn('字体加载失败，使用默认字体：', err);
        customFont = null;
      }
    );
  } catch (e) {
    console.error('字体加载异常：', e);
    customFont = null;
  }
}

// ==========================================
// 音量初始化
// ==========================================
function initVolume() {
  const volume = typeof gameVolume === 'number' ? gameVolume / 100 : 0.5;
  outputVolume(volume);
  console.log('音量初始化完成：', volume);
}

// ==========================================
// BGM切换
// ==========================================
function changeBGM(newBGM) {
  if (!newBGM) {
    console.warn('切换BGM失败：目标BGM不存在');
    return;
  }
  if (currentBGM && typeof currentBGM.stop === 'function') {
    if (currentBGM.isPlaying()) currentBGM.stop();
  }
  currentBGM = newBGM;
  if (typeof currentBGM.loop === 'function') {
    currentBGM.loop();
    console.log('BGM切换成功');
  }
}