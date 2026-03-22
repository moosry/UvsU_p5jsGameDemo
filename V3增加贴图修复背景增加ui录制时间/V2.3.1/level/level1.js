// level/level1.js
// 关卡1：简单平台关卡（地面 + 一个悬空平台 + 终点门）
// 所有用到的实体类都定义在此文件内，不依赖外部文件

// ============================================================
// 实体类
// ============================================================

class Ground {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  show() {
    fill(55, 55, 60);
    stroke(25, 25, 30);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h);
    // 砖墙纹理
    let bH = 15, bW = 30;
    for (let y = this.y; y < this.y + this.h; y += bH) {
      let isOffset = Math.floor((y - this.y) / bH) % 2 !== 0;
      let startX = isOffset ? this.x - bW / 2 : this.x;
      for (let x = startX; x < this.x + this.w; x += bW) {
        if (x > this.x && x < this.x + this.w) {
          line(x, y, x, min(y + bH, this.y + this.h));
        }
      }
      if (y > this.y) line(this.x, y, this.x + this.w, y);
    }
    // 顶部高光
    fill(80, 80, 85); noStroke();
    rect(this.x, this.y, this.w, 4);
  }
}

class L1Platform {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  show() {
    fill(70, 70, 80);
    stroke(25, 25, 30);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h);
    fill(100, 100, 110); noStroke();
    rect(this.x, this.y, this.w, 4);
  }
}

class GoalDoor {
  constructor(x, y, size) {
    this.x = x; this.y = y; this.w = size; this.h = size;
  }
  update(player) {
    if (
      player.pos.x + player.w > this.x &&
      player.pos.x < this.x + this.w &&
      player.pos.y + player.h > this.y &&
      player.pos.y < this.y + this.h
    ) {
      levelState = 'WIN';
    }
  }
  show() {
    push();
    fill(50, 150, 255, 180);
    stroke(200, 255, 255);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);
    noStroke();
    fill(255, 255, 255, 100 + sin(frameCount * 0.1) * 50);
    ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.5, this.h * 0.7);
    pop();
  }
}

// ============================================================
// 关卡布局常量
// ============================================================
const L1_GROUND_Y   = 500;
const L1_GROUND_H   = 40;
const L1_PLATFORM_X = 380;
const L1_PLATFORM_Y = 360;
const L1_PLATFORM_W = 180;
const L1_PLATFORM_H = 20;
const L1_GOAL_SIZE  = 50;
const L1_GOAL_X     = 450;
const L1_GOAL_Y     = L1_PLATFORM_Y - L1_GOAL_SIZE;

// ============================================================
// loadLevel1()
// ============================================================
function loadLevel1() {
  levelState    = 'IDLE';
  recordingData = [];
  replayIndex   = 0;
  floors        = [];
  goals         = [];
  spikes        = [];
  buttons       = [];
  portals       = [];

  player = new Character(60, L1_GROUND_Y - 30, color(50, 100, 255), '主角');
  clone  = null;

  floors.push(new Ground(0, L1_GROUND_Y, width, L1_GROUND_H));
  floors.push(new L1Platform(L1_PLATFORM_X, L1_PLATFORM_Y, L1_PLATFORM_W, L1_PLATFORM_H));
  goals.push(new GoalDoor(L1_GOAL_X, L1_GOAL_Y, L1_GOAL_SIZE));
}

// ============================================================
// drawLevel1()
// ============================================================
function drawLevel1() {
  // 1. 背景
  if (typeof bgImage_level1 !== 'undefined' && bgImage_level1) {
    image(bgImage_level1, 0, 0, width, height);
  } else {
    background(30, 30, 40);
  }

  // 2. 地形
  for (let f of floors) f.show();

  // 3. 终点门
  for (let g of goals) {
    g.update(player);
    g.show();
  }

  // 4. 胜负判定 & 角色渲染
  if (levelState === 'DEAD') {
    player.show();
    if (clone) clone.show();
    uiPages.playing.showDead();
  } else if (levelState === 'WIN') {
    player.show();
    if (clone) clone.show();
    uiPages.playing.showWin();
  } else {
    uiPages.playing.hideAll();
    runGameLogic();
  }

  rectMode(CORNER);
}