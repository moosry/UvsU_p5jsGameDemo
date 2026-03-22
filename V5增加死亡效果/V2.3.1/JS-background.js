// 背景 & 视觉效果
// 纯视觉，不影响游戏逻辑

// 关卡1，地牢背景
function drawGameBackground() {
  // image(图片变量, x坐标, y坐标, 绘制宽度, 绘制高度)
  // 这样写可以确保图片拉伸铺满你设定的整个 Canvas 画布
  image(bgImage, 0, 0, width, height);
}

/*
关卡1：
绘制石砖风格的平台
px 平台的左上角 X 坐标
py 平台的左上角 Y 坐标
pw 平台的宽度
ph 平台的高度
 */
function drawStonePlatform(px, py, pw, ph) {
  // 1. 绘制基础底色（深灰色的石头底色）
  fill(55, 55, 60);
  stroke(25, 25, 30); // 砖缝的颜色（更深的黑色）
  strokeWeight(2);
  rect(px, py, pw, ph);

  // 2. 定义单块石砖的尺寸，你可以随意修改这里来调整砖块大小
  let brickHeight = 15;
  let brickWidth = 30;

  // 3. 使用嵌套循环生成砖缝纹理
  for (let y = py; y < py + ph; y += brickHeight) {
    // 判断当前行是否需要错位（奇数行错位，实现经典砖墙效果）
    let isOffset = Math.floor((y - py) / brickHeight) % 2 !== 0;
    // 如果错位，起始X坐标就向左偏移半块砖的宽度
    let startX = isOffset ? px - brickWidth / 2 : px;

    for (let x = startX; x < px + pw; x += brickWidth) {
      // 只在平台内部画竖直的砖缝，防止画出边界
      if (x > px && x < px + pw) {
        // 限制竖线不能画出平台的下边界
        let endY = min(y + brickHeight, py + ph);
        line(x, y, x, endY);
      }
    }
    // 画水平的砖缝（最顶上那条不需要画，因为有边框了）
    if (y > py) {
      line(px, y, px + pw, y);
    }
  }

  // 4. 绘制平台顶部的边缘高光（增加石板的立体厚重感）
  fill(80, 80, 85);
  noStroke();
  rect(px, py, pw, 4);
}
