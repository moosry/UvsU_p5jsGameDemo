// level/level2.js
// 关卡2：踩踏按钮 + 地刺 + 传送门
// 所有用到的实体类都定义在此文件内，不依赖外部文件

// ============================================================
// 实体类
// ============================================================

class L2Platform {
  constructor(x, y, w, h, c) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.c = c || color(55, 55, 60);
  }
  show() {
    fill(this.c);
    stroke(25, 25, 30);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h);
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
    fill(80, 80, 85); noStroke();
    rect(this.x, this.y, this.w, 4);
  }
}

class L2Spike {
  constructor(x, y, w) {
    this.x = x; this.y = y; this.w = w; this.h = 15;
  }
  show() {
    fill(100); noStroke();
    for (let i = 0; i < this.w; i += 20) {
      triangle(
        this.x + i,      this.y,
        this.x + i + 10, this.y - this.h,
        this.x + i + 20, this.y
      );
    }
  }
}

class PressButton {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 40; this.h = 10;
    this.isPressed = false;
  }
  update(entities) {
    this.isPressed = false;
    for (let e of entities) {
      if (
        e.pos.x + e.w > this.x &&
        e.pos.x < this.x + this.w &&
        e.pos.y + e.h >= this.y &&
        e.pos.y + e.h <= this.y + 20
      ) {
        this.isPressed = true;
      }
    }
  }
  show() {
    noStroke();
    if (this.isPressed) {
      fill(50, 255, 50);
      rect(this.x, this.y + 5, this.w, 5);
    } else {
      fill(255, 50, 50);
      rect(this.x, this.y, this.w, 10);
    }
  }
}

class L2Portal {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.isActive = false;
  }
  update(player, btns) {
    let allPressed = btns.every(b => b.isPressed);
    if (allPressed) this.isActive = true;
    if (this.isActive) {
      if (
        player.pos.x + player.w > this.x &&
        player.pos.x < this.x + this.w &&
        player.pos.y + player.h > this.y &&
        player.pos.y < this.y + this.h
      ) {
        levelState = 'WIN';
      }
    }
  }
  show() {
    push();
    if (this.isActive) {
      fill(50, 150, 255, 180);
      stroke(200, 255, 255);
      strokeWeight(2);
      rect(this.x, this.y, this.w, this.h, 20, 20, 0, 0);
      noStroke();
      fill(255, 255, 255, 100 + sin(frameCount * 0.1) * 50);
      ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.5, this.h * 0.7);
    } else {
      fill(40, 40, 45);
      stroke(20); strokeWeight(2);
      rect(this.x, this.y, this.w, this.h, 20, 20, 0, 0);
      fill(150, 50, 50); noStroke();
      ellipse(this.x + this.w / 2, this.y + this.h / 2, 10, 10);
    }
    pop();
  }
}

// ============================================================
// loadLevel2()
// ============================================================
function loadLevel2() {
  levelState    = 'IDLE';
  recordingData = [];
  replayIndex   = 0;
  floors        = [];
  buttons       = [];
  spikes        = [];
  portals       = [];
  goals         = [];

  player = new Character(50, 350, color(50, 100, 255), '主角');
  clone  = null;

  floors.push(new L2Platform(0,   height - 40, 250, 40));
  floors.push(new L2Platform(450, height - 40, 350, 40));
  floors.push(new L2Platform(250, height - 10, 200, 10, color(50, 30, 10)));
  floors.push(new L2Platform(50,  250,         100, 20));
  floors.push(new L2Platform(200, 350,          60, 20));
  floors.push(new L2Platform(320, 280,          60, 20));
  floors.push(new L2Platform(550, 300,         100, 20));
  floors.push(new L2Platform(700, 180,          80, 20));

  spikes.push(new L2Spike(250, height, 200));

  buttons.push(new PressButton(80,  250 - 10));
  buttons.push(new PressButton(600, height - 40 - 10));

  portals.push(new L2Portal(720, 120, 40, 60));
}

// ============================================================
// drawLevel2()
// ============================================================
function drawLevel2() {
  // 1. 背景
  if (typeof bgImage_level1 !== 'undefined' && bgImage_level1) {
    image(bgImage_level1, 0, 0, width, height);
  } else {
    background(30, 30, 40);
  }

  // 2. 지형
  for (let f of floors) f.show();
  for (let s of spikes) s.show();

  // 3. 踩踏按钮
  let characters = clone ? [player, clone] : [player];
  for (let btn of buttons) {
    btn.update(characters);
    btn.show();
  }

  // 4. 传送门
  for (let p of portals) {
    p.update(player, buttons);
    p.show();
  }

  // 5. 胜负判定（地刺）
  if (levelState !== 'DEAD' && levelState !== 'WIN') {
    if (_l2SpikeCollision(player) || (clone && _l2SpikeCollision(clone))) {
      levelState = 'DEAD';
    }
  }

  // 6. 角色渲染 & UI 覆盖层
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

// 地刺碰撞检测（收窄碰撞箱，防误死）
function _l2SpikeCollision(char) {
  let hx = char.pos.x + 8, hw = char.w - 16;
  let hy = char.pos.y + 5,  hh = char.h - 5;
  for (let s of spikes) {
    if (hx + hw > s.x && hx < s.x + s.w &&
        hy + hh > s.y - s.h && hy < s.y) {
      return true;
    }
  }
  return false;
}