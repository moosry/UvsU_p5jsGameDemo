// 玩家/分身文件

// ============================================================
// 贴图选择逻辑（根据速度方向返回对应贴图）
// isClone=true 时使用分身贴图（cloneImg_*），否则用本体贴图（playerImg_*）
// ============================================================
function getCharSprite(vel, onGround, isClone) {
  let r  = isClone ? cloneImg_right   : playerImg_right;
  let l  = isClone ? cloneImg_left    : playerImg_left;
  let u  = isClone ? cloneImg_up      : playerImg_up;
  let ur = isClone ? cloneImg_upRight : playerImg_upRight;
  let ul = isClone ? cloneImg_upLeft  : playerImg_upLeft;
  let vx = vel.x;
  let vy = vel.y;

  if (!onGround) {
    if (vy < 0) {
      if (vx > 0)  return ur;
      if (vx < 0)  return ul;
      return u;
    } else {
      return null; // 下落时沿用上一帧贴图
    }
  }

  if (vx > 0) return r;
  if (vx < 0) return l;
  return r;
}

// ============================================================
// Character 角色类
// ============================================================
class Character {
  constructor(x, y, c, label) {
    this.pos    = createVector(x, y);
    this.vel    = createVector(0, 0);
    this.w      = 30;
    this.h      = 30;
    this.c      = c;
    this.label  = label;
    this.speed  = 5;
    this.jumpForce = -13;
    this.onGround  = false;
    this.facingRight = true;
    this.didJumpThisFrame = false;
    this._lastSprite = null; // 记录上一帧贴图，静止时保持方向
  }

  applyGravity() {
    this.vel.y += gravity;
  }

  handleInput() {
    this.vel.x = 0;
    if (keyIsDown(65)) { this.vel.x = -this.speed; this.facingRight = false; }
    if (keyIsDown(68)) { this.vel.x =  this.speed; this.facingRight = true;  }
  }

  jump() {
    this.vel.y = this.jumpForce;
    this.onGround = false;
    this.didJumpThisFrame = true;
  }

  move(obstacles) {
    this.pos.x += this.vel.x;
    this.resolveMapCollisionX(obstacles);
    this.pos.y += this.vel.y;
    this.resolveMapCollisionY(obstacles);
  }

  resolveMapCollisionX(obstacles) {
    this.pos.x = constrain(this.pos.x, 0, width - this.w);
    for (let o of obstacles) {
      if (this.checkMapOverlap(o)) {
        if (this.vel.x > 0) this.pos.x = o.x - this.w;
        else if (this.vel.x < 0) this.pos.x = o.x + o.w;
        this.vel.x = 0;
      }
    }
  }

  resolveMapCollisionY(obstacles) {
    this.onGround = false;
    for (let o of obstacles) {
      if (this.checkMapOverlap(o)) {
        if (this.vel.y > 0) {
          this.pos.y = o.y - this.h;
          this.vel.y = 0;
          this.onGround = true;
        } else if (this.vel.y < 0) {
          this.pos.y = o.y + o.h;
          this.vel.y = 0;
        }
      }
    }
  }

  checkMapOverlap(o) {
    return (
      this.pos.x + this.w > o.x &&
      this.pos.x < o.x + o.w &&
      this.pos.y + this.h > o.y &&
      this.pos.y < o.y + o.h
    );
  }

  show() {
    push();
    rectMode(CORNER);

    // 选贴图：静止时沿用上一帧，避免贴图乱跳
    let sprite = getCharSprite(this.vel, this.onGround, false);
    if (sprite !== null) {
      this._lastSprite = sprite;
    }
    sprite = this._lastSprite || playerImg_right;

    image(sprite, this.pos.x, this.pos.y, this.w, this.h);

    // 头顶标签
    if (levelState !== 'RECORDING') {
      fill(255); noStroke(); textAlign(CENTER); textSize(10);
      text(this.label, this.pos.x + this.w / 2, this.pos.y - 5);
    }

    pop();
  }
}

// ============================================================
// Clone 分身类（继承 Character，贴图带半透明红色蒙版区分本体）
// ============================================================
class Clone extends Character {
  constructor(x, y, actionQueue) {
    super(x, y, color(255, 80, 80), "分身");
    this.actionQueue = actionQueue;
    this.frameIndex  = 0;
  }

  show() {
    push();
    rectMode(CORNER);

    let sprite = getCharSprite(this.vel, this.onGround, true);
    if (sprite !== null) {
      this._lastSprite = sprite;
    }
    sprite = this._lastSprite || cloneImg_right;

    image(sprite, this.pos.x, this.pos.y, this.w, this.h);

    // 头顶标签
    fill(255); noStroke(); textAlign(CENTER); textSize(10);
    text("分身", this.pos.x + this.w / 2, this.pos.y - 5);

    pop();
  }
}

// ============================================================
// 录制 & 回放
// ============================================================
function startRecording() {
  levelState = 'RECORDING';
  recordingData    = [];
  recordStartTime  = millis();
  recordStartPosX  = player.pos.x;
  recordStartPosY  = player.pos.y;
  clone = null;
}

function startReplay() {
  levelState  = 'REPLAYING';
  replayIndex = 0;
  clone = new Clone(recordStartPosX, recordStartPosY, color(255, 80, 80), "分身");
  clone.facingRight = player.facingRight;
}

function runGameLogic() {
  if (levelState === 'IDLE') {
    player.applyGravity();
    player.handleInput();
    player.move(floors);
    if (clone) clone.show();
    player.show();

  } else if (levelState === 'RECORDING') {
    player.applyGravity();
    player.handleInput();
    player.move(floors);
    recordingData.push({ x: player.pos.x, jumpCmd: player.didJumpThisFrame, frame: player.facingRight });
    player.didJumpThisFrame = false;
    if (millis() - recordStartTime > recordDuration) startReplay();
    player.show();

  } else if (levelState === 'REPLAYING') {
    player.applyGravity();
    player.handleInput();

    if (clone) {
      clone.applyGravity();
      if (replayIndex < recordingData.length) {
        let data = recordingData[replayIndex];
        let diffX = data.x - clone.pos.x;
        clone.vel.x = diffX * 0.2;
        clone.facingRight = data.frame;
        if (data.jumpCmd) { clone.vel.y = clone.jumpForce; clone.onGround = false; }
        replayIndex++;
      } else {
        levelState = 'IDLE';
        clone = null;
        return;
      }
    }

    player.pos.x += player.vel.x;
    if (clone) clone.pos.x += clone.vel.x;
    player.resolveMapCollisionX(floors);
    if (clone) clone.resolveMapCollisionX(floors);
    if (clone) resolveEntityCollisionX(player, clone);

    player.pos.y += player.vel.y;
    if (clone) clone.pos.y += clone.vel.y;
    player.resolveMapCollisionY(floors);
    if (clone) clone.resolveMapCollisionY(floors);
    if (clone) resolveEntityCollisionY(player, clone);

    if (clone) clone.show();
    player.show();
  }
}

// ============================================================
// 碰撞辅助函数
// ============================================================
function resolveEntityCollisionX(a, b) {
  if (checkOverlap(a, b)) {
    let centerA = a.pos.x + a.w / 2;
    let centerB = b.pos.x + b.w / 2;
    let overlapX = (a.w / 2 + b.w / 2) - abs(centerA - centerB);
    if (overlapX > 0) {
      let push = overlapX * 0.5;
      if (centerA < centerB) { a.pos.x -= push; b.pos.x += push; }
      else                   { a.pos.x += push; b.pos.x -= push; }
    }
  }
}

function resolveEntityCollisionY(a, b) {
  if (checkOverlap(a, b)) {
    let centerA = a.pos.y + a.h / 2;
    let centerB = b.pos.y + b.h / 2;
    let overlapY = (a.h / 2 + b.h / 2) - abs(centerA - centerB);
    if (overlapY > 0) {
      if (centerA < centerB) { a.pos.y -= overlapY; a.vel.y = 0; a.onGround = true; }
      else                   { b.pos.y -= overlapY; b.vel.y = 0; b.onGround = true; }
    }
  }
}

function checkOverlap(a, b) {
  return (
    a.pos.x + a.w > b.pos.x && a.pos.x < b.pos.x + b.w &&
    a.pos.y + a.h > b.pos.y && a.pos.y < b.pos.y + b.h
  );
}

function checkSpikeCollision(char) {
  let hx = char.pos.x + 8, hw = char.w - 16;
  let hy = char.pos.y + 5, hh = char.h - 5;
  for (let s of spikes) {
    if (hx + hw > s.x && hx < s.x + s.w && hy + hh > s.y - s.h && hy < s.y) return true;
  }
  return false;
}