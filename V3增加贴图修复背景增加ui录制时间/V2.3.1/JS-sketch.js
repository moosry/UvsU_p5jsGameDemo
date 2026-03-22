// JS-sketch.js（主控文件）

let uiPages = {};

// 关卡渲染函数映射（新增关卡在此登记）
const LEVEL_DRAW_FN = {
  1: () => { if (typeof drawLevel1 === 'function') drawLevel1(); },
  2: () => { if (typeof drawLevel2 === 'function') drawLevel2(); },
};

function preload() {
  if (typeof preloadAssets === 'function') preloadAssets();
}

function setup() {
  createCanvas(960, 540);
  if (typeof initVolume === 'function') initVolume();

  uiPages.menu        = new MenuPage(_navigate);
  uiPages.setting     = new SettingPage(_navigate);
  uiPages.levelselect = new LevelSelectPage(_navigate);
  uiPages.credits     = new CreditsPage(_navigate);
  uiPages.story       = new StoryCrawlPage(() => _navigate('levelselect'));
  uiPages.playing     = new GamePlayPage(_navigate);

  uiPages.menu.setBgImage(bgImage_menu);
  uiPages.levelselect.setBgImage(bgImage_levelChoose);

  for (const page of Object.values(uiPages)) page.init();

  gameState = 'MENU';
  if (typeof changeBGM === 'function' && typeof menuBGM !== 'undefined') {
    changeBGM(menuBGM);
  }
}

function draw() {
  switch (gameState) {
    case 'MENU':
      uiPages.menu.draw();
      break;
    case ST_STORY_CRAWL:
      uiPages.story.draw();
      break;
    case 'LEVEL':
      uiPages.levelselect.draw();
      break;
    case 'SETTING':
      uiPages.setting.draw();
      break;
    case 'CREDITS':
      uiPages.credits.draw();
      break;
    case 'PLAYING':
      const drawFn = LEVEL_DRAW_FN[currentLevel];
      if (drawFn) drawFn();
      uiPages.playing.draw(); // HUD + 覆盖层
      break;
  }
}

function _navigate(pageId) {
  const map = {
    menu:        'MENU',
    story:       ST_STORY_CRAWL,
    levelselect: 'LEVEL',
    setting:     'SETTING',
    credits:     'CREDITS',
    playing:     'PLAYING',
  };
  gameState = map[pageId] ?? pageId.toUpperCase();
}