import { PageBase } from "../PageBase.js";
import { ButtonBase } from "../../components/ButtonBase.js";
import { t } from '../../../i18n.js';

export class StaticPageResult extends PageBase {
  constructor(result, levelIndex, switcher, p) {
    super(switcher);
    this.result = result;
    this.levelIndex = levelIndex;  // e.g. "level1", "level2"
    this.p = p;

    // 从 levelIndex 提取关卡号
    const levelNum = parseInt(this.levelIndex.replace("level", ""), 10);

    // 创建按钮
    const backBtn = new ButtonBase(p, t('btn_back_menu'), p.width/2 - 60, p.height/2 + 50, () => {
      this.switcher.staticSwitcher.showMainMenu(p);
    }, 'back-button');
    backBtn.btn.style('font-size', '20px');
    this.addElement(backBtn);

    const restartBtn = new ButtonBase(p, t('btn_restart'), p.width/2 - 60, p.height/2 + 100, () => {
      this.switcher.gameSwitcher.loadLevel(levelNum, p);
    }, 'restart-button');
    restartBtn.btn.style('font-size', '20px');
    this.addElement(restartBtn);

    // 如果有下一关，显示"下一关"按钮
    const nextLevelIndex = "level" + (levelNum + 1);
    if (this.result === "autoResult1") {
      const nextBtn = new ButtonBase(p, t('btn_next_level'), p.width/2 - 60, p.height/2 + 150, () => {
        this.switcher.gameSwitcher.loadLevel(levelNum + 1, p);
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
    const message = this.result === "autoResult1" ? t('result_win') : t('result_lose');
    p.text(message, p.width/2, p.height/4);
  }
}