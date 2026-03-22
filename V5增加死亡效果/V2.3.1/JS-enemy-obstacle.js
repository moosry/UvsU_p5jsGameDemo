// 敌人/障碍/平台/交互机制类
// 职责：定义所有非玩家的物理实体（地块、刺、按钮、传送门）
// 只存地图实体类，所有和地图机关相关的“类（Class）”都应该放在这里

// 物理的“类”

// --- 关卡1平台的各种“类” ---
class Platform {
  constructor(x, y, w, h, c) { 
    this.x = x; 
    this.y = y; 
    this.w = w; 
    this.h = h; 
    // 把默认颜色从泥土色改成深灰色
    this.c = c || color(55, 55, 60); 
  }

  show() { 
    // 1. 画基础的深灰石头底色
    fill(this.c); 
    stroke(25, 25, 30); // 砖缝的颜色（深黑）
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h); 

    // 2. 嵌套循环：程序化生成砖墙纹理
    let brickHeight = 15;
    let brickWidth = 30;

    for (let y = this.y; y < this.y + this.h; y += brickHeight) {
      // 奇数行错位，形成经典砖块交错
      let isOffset = Math.floor((y - this.y) / brickHeight) % 2 !== 0;
      let startX = isOffset ? this.x - brickWidth / 2 : this.x;

      for (let x = startX; x < this.x + this.w; x += brickWidth) {
        // 只在平台内部画竖直的砖缝
        if (x > this.x && x < this.x + this.w) {
          let endY = min(y + brickHeight, this.y + this.h);
          line(x, y, x, endY);
        }
      }
      // 画水平的横向砖缝
      if (y > this.y) {
        line(this.x, y, this.x + this.w, y);
      }
    }

    // 3. 画平台顶部的高光边缘，增加立体感
    fill(80, 80, 85);
    noStroke();
    rect(this.x, this.y, this.w, 4);
  }
}

// 地刺内容
class Spike {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 15; // 默认地刺高度
  }

  show() {
    fill(100);
    noStroke();
    // 遍历宽度，每隔20像素画一个三角形地刺
    for (let i = 0; i < this.w; i += 20) {
      triangle(
        this.x + i, this.y, 
        this.x + i + 10, this.y - this.h, 
        this.x + i + 20, this.y
      );
    }
  }
}

// 地图踩踏按钮（改名为 PressButton，避免与 UI 框架的 Button 基类冲突）
class PressButton {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 10;
    this.isPressed = false;
}

  update(entities) {
    this.isPressed = false;
    // 遍历所有实体（玩家、分身），检查是否踩在按钮上
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
      // 踩下状态：绿色
      fill(50, 255, 50);
      rect(this.x, this.y + 5, this.w, 5);
    } else {
      // 未踩下状态：红色
      fill(255, 50, 50);
      rect(this.x, this.y, this.w, 10);
    }
  }
}

// 新增的 Portal（传送门）类，作为最终通关条件
class Portal {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isActive = false; // 初始状态为关闭（未激活）
  }

// 更新传送门逻辑：检查按钮状态 和 玩家碰撞
update(player, buttons) {
    // 1. 检查是否地图上所有的按钮都被踩下了
    let allPressed = true;
    for (let b of buttons) {
      if (!b.isPressed) {
        allPressed = false;
        break; // 只要有一个没被踩下，就不激活
      }
    }
  
    // 当全部踩下时，将状态设为 true。
    // 一旦 this.isActive 变成了 true，不会再有任何代码把它改回 false 了！
    if (allPressed) {
      this.isActive = true; 
    }

    // 2. 如果传送门已激活，且玩家本体碰到了传送门，则触发通关
    if (this.isActive) {
      // 经典的 AABB 矩形碰撞检测
      if (
        player.pos.x + player.w > this.x &&
        player.pos.x < this.x + this.w &&
        player.pos.y + player.h > this.y &&
        player.pos.y < this.y + this.h
      ) {
        levelState = 'WIN'; // 改变全局状态为通关
      }
    }
  }

// 绘制传送门的画面
  show() {
    push();
    if (this.isActive) {
      // 【激活状态】：发出幽蓝色的魔法光芒
      fill(50, 150, 255, 180); // 半透明亮蓝色
      stroke(200, 255, 255);
      strokeWeight(2);
      rect(this.x, this.y, this.w, this.h, 20, 20, 0, 0); // 拱门形状

      // 画内部的神秘光效（让它看起来像在旋转闪烁）
      noStroke();
      fill(255, 255, 255, 100 + sin(frameCount * 0.1) * 50); 
      ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.5, this.h * 0.7);
    } else {
      // 【未激活状态】：暗灰色的石门/铁门，表示锁住了
      fill(40, 40, 45);
      stroke(20);
      strokeWeight(2);
      rect(this.x, this.y, this.w, this.h, 20, 20, 0, 0); // 拱门形状
      
      // 画一个红色的锁孔或者禁止符号
      fill(150, 50, 50);
      noStroke();
      ellipse(this.x + this.w / 2, this.y + this.h / 2, 10, 10);
    }
    pop();
  }
}