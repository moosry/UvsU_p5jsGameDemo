import { PageBase } from "../PageBase.js";
import { ButtonBase } from "../../components/ButtonBase.js";

export class GamePageLevel2 extends PageBase {
  constructor(switcher, p) {
    super(switcher);
    // 可根据需要添加按钮和 UI
    const backBtn = new ButtonBase(p, '◀', 0.02 * p.width, 0.03 * p.height, () => {
      this.switcher.eventBus && this.switcher.eventBus.publish("unloadLevel");
      this.switcher.main.staticSwitcher.showMainMenu(p);
    }, 'back-button');
    backBtn.btn.style('width', 0.030 * p.width + 'px');
    backBtn.btn.style('height', 0.055 * p.height + 'px');
    this.addElement(backBtn);
  }

  update() {
    // 游戏逻辑由 main.js 的 levelManager.update() 驱动
  }

  draw() {
    // 游戏绘制由 main.js 的 levelManager.update() 驱动
  }

  exit() {
    super.exit();
  }
}
