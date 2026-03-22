// JS-input-handler.js
// 输入管理：把 p5.js 原生事件分发给当前活跃的 UI 页面实例
// 保留所有原有游戏按键逻辑不变

// ── 工具：获取当前活跃 UI 页面 ───────────────
function _currentUIPage() {
  if (typeof uiPages === 'undefined') return null;
  switch (gameState) {
    case 'MENU':          return uiPages.menu;
    case ST_STORY_CRAWL:  return uiPages.story;
    case 'LEVEL':         return uiPages.levelselect;
    case 'SETTING':       return uiPages.setting;
    case 'CREDITS':       return uiPages.credits;
    case 'PLAYING':       return uiPages.playing;
    default:              return null;
  }
}

// ─────────────────────────────────────────────
// 鼠标点击
// ─────────────────────────────────────────────
function mousePressed() {
  if (typeof gameState === 'undefined') return;
  const page = _currentUIPage();
  if (page) page.onMousePressed(mouseX, mouseY);
}

// ─────────────────────────────────────────────
// 鼠标拖拽（Slider 依赖此事件）
// ─────────────────────────────────────────────
function mouseDragged() {
  if (typeof gameState === 'undefined') return;
  const page = _currentUIPage();
  if (page) page.onMouseDragged(mouseX, mouseY);
}

// ─────────────────────────────────────────────
// 鼠标释放
// ─────────────────────────────────────────────
function mouseReleased() {
  if (typeof gameState === 'undefined') return;
  const page = _currentUIPage();
  if (page) page.onMouseReleased(mouseX, mouseY);
}

// ─────────────────────────────────────────────
// 键盘输入
// ─────────────────────────────────────────────
function keyPressed() {
  if (typeof gameState === 'undefined') return;

  // 1. StoryCrawlPage 和 GamePlayPage 自己处理按键（Enter跳过 / C重试）
  const page = _currentUIPage();
  if (page && typeof page.keyPressed === 'function') {
    page.keyPressed(key);
  }

  // 2. 菜单界面：Enter 等同于点击 PLAY（与原逻辑一致）
  if (gameState === 'MENU' && key === 'Enter') {
    gameState    = ST_STORY_CRAWL;
    crawlScrollY = height; // 保持原变量赋值（cutscene.js 用）
    crawlFinished = false;
    uiPages.story.reset(); // 同时重置 UI 页面状态
    if (typeof currentBGM !== 'undefined' && currentBGM &&
        typeof currentBGM.stop === 'function') {
      currentBGM.stop();
    }
    return;
  }

  // 3. 仅游玩状态响应后续游戏按键
  if (gameState !== 'PLAYING') return;

  // 4. 死亡/胜利结算：C 键重试（GamePlayPage.keyPressed 已处理，此处保留兼容）
  if (levelState === 'WIN' || levelState === 'DEAD') return;

  // 5. 录制/回放逻辑（原逻辑不变）
  if (key === 'r' || key === 'R') {
    if (levelState === 'IDLE' && typeof startRecording === 'function') {
      startRecording();
    } else if (levelState === 'RECORDING' && typeof startReplay === 'function') {
      startReplay();
    }
  }

  // 6. 跳跃
  if (key === ' ' || key === 'w' || key === 'W') {
    if (typeof player !== 'undefined' && player && player.onGround) {
      if (typeof player.jump === 'function') player.jump();
    }
  }
}