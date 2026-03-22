// 关卡 & 地形 & 物理实体；
// 例如地面、按钮、刺、关卡结构等
// 以后加新关卡，只改这个文件。

// 关卡工厂 (加载关卡1)
function loadLevel(num) {
  levelState = 'IDLE';
  recordingData = [];
  replayIndex = 0;
  // 清空并初始化 portals 数组
  floors = []; buttons = []; spikes = []; portals = [];
  
  if (num === 1) { // 这是编写的关卡内容
    player = new Character(50, 350, color(50, 100, 255), "主角");
    clone = null; // 修改：初始状态不生成分身，设为 null
    
    floors.push(new Platform(0, height - 40, 250, 40));
    floors.push(new Platform(450, height - 40, 350, 40));
    floors.push(new Platform(250, height - 10, 200, 10, color(50, 30, 10)));
    floors.push(new Platform(50, 250, 100, 20)); 
    floors.push(new Platform(200, 350, 60, 20));
    floors.push(new Platform(320, 280, 60, 20));  
    floors.push(new Platform(550, 300, 100, 20));
    floors.push(new Platform(700, 180, 80, 20));  

    spikes.push(new Spike(250, height, 200));
    
    // 两个按钮的代码
    buttons.push(new PressButton(80, 250 - 10));
    buttons.push(new PressButton(600, height - 40 - 10));
    
    // 传送门的代码：
    portals.push(new Portal(720, 120, 40, 60));
    
  } else {
    
    // 暂时代替其他关卡
    player = new Character(50, 350, color(50, 100, 255), "主角");
    clone = null;
    floors.push(new Platform(0, height - 40, width, 40));
  }
}

// ==========================================
// 游戏核心调度，渲染逻辑，关卡1
// ==========================================
function drawPlaying() {
  
// 渲染地牢背景图片
image(bgImage_level1, 0, 0, width, height);
  
  for (let f of floors) f.show();
  for (let s of spikes) s.show();

  let characters = clone ? [player, clone] : [player];
  let pressedCount = 0;
  for (let btn of buttons) {
    btn.update(characters);
    btn.show();
    if (btn.isPressed) pressedCount++;
}

// 更新并显示传送门
    for (let p of portals) {
      p.update(player, buttons); 
      p.show();
    }
  
// 胜负判定
if (levelState !== 'DEAD' && levelState !== 'WIN') {
    if (checkSpikeCollision(player) || (clone && checkSpikeCollision(clone))) {
      levelState = 'DEAD';
  }
}

if (levelState === 'DEAD') {
    player.show(); if(clone) clone.show();
    uiPages.playing.showDead();
  } else if (levelState === 'WIN') {
    player.show(); if(clone) clone.show();
    uiPages.playing.showWin();
  } else {
    uiPages.playing.hideAll();
    runGameLogic();
  }
  
  rectMode(CENTER); // 绘制返回按钮前切回 CENTER
}