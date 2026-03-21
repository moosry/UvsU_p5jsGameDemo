import { UIManager } from "./js/UISystem/UIManager.js";
import { EventBus } from "./js/EventSystem/EventBus.js";
import { LevelManager } from "./js/LevelManager/LevelManager.js";

new p5((sketch) => {
  window.sketch = sketch;
  sketch.setup = () => {
    window.UI = new UIManager();
    window.eventBus = new EventBus();
    window.levelManager = new LevelManager();

    //subscribe event
    window.eventBus.subscribe("loadLevel", (levelIndex) => window.levelManager.loadLevel(levelIndex));
    window.eventBus.subscribe("unloadLevel", () => window.levelManager.unloadLevel());
    window.eventBus.subscribe("autoResult", (result) => window.UI.transition(result));
  };
  
  sketch.draw = () => {
      window.levelManager.update();
  }
});
