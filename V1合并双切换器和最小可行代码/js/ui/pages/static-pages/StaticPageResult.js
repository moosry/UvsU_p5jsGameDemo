import { PageBase } from "../PageBase.js";
import { ButtonBase } from "../../components/ButtonBase.js";

export class StaticPageResult extends PageBase {
  constructor(result, switcher, p) {
    super(switcher);
    this.result = result;  // "autoResult1" 或 "autoResult2"
    this.p = p;

    // 创建按钮
    const backBtn = new ButtonBase(p, '返回菜单', p.width/2 - 60, p.height/2 + 50, () => {
      this.switcher.staticSwitcher.showMainMenu(p);
    }, 'back-button');
    backBtn.btn.style('font-size', '20px');
    this.addElement(backBtn);

    const restartBtn = new ButtonBase(p, '重新开始', p.width/2 - 60, p.height/2 + 100, () => {
      // 假设重新开始关卡1
      this.switcher.gameSwitcher.loadLevel(1, p);
    }, 'restart-button');
    restartBtn.btn.style('font-size', '20px');
    this.addElement(restartBtn);

    if (this.result === "autoResult1") {
      const nextBtn = new ButtonBase(p, '下一关', p.width/2 - 60, p.height/2 + 150, () => {
        this.switcher.gameSwitcher.loadLevel(2, p);
      }, 'next-button');
      nextBtn.btn.style('font-size', '20px');
      this.addElement(nextBtn);
    }
  }

  draw() {
    const p = this.p;
    p.background(50, 100, 150);
    p.fill(255);
    p.textSize(36);
    p.textAlign(p.CENTER, p.CENTER);
    const message = this.result === "autoResult1" ? "恭喜通关！" : "游戏结束";
    p.text(message, p.width/2, p.height/4);
  }
}