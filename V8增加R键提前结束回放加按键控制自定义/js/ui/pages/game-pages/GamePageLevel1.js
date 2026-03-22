import { PageBase } from "../PageBase.js";
import { ButtonBase } from "../../components/ButtonBase.js";

export class GamePageLevel1 extends PageBase {
  constructor(switcher, p) {
    super(switcher);

    const backBtn = new ButtonBase(p, '◀', 0.02 * p.width, 0.03 * p.height, () => {
      console.log('返回按钮手动点击');
      // 发布unloadLevel事件，然后切换到菜单
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
    console.log('GamePageLevel1 exit');
    super.exit();
  }
}