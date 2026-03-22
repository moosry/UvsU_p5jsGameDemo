import { Level1 } from "./Level1.js";
import { Level2 } from "./Level2.js";

export class LevelManager {
    constructor(p, eventBus) {
        this.p = p;
        this.eventBus = eventBus;
        this.levelMap = {
            "level1": Level1,
            "level2": Level2,
        }
        this.level = null;
        this.currentLevelIndex = null;
    }
    loadLevel(levelIndex, p = this.p, eventBus = this.eventBus) {
        if(!this.level) {
            const LevelClass = this.levelMap[levelIndex];
            this.level = new LevelClass(p, eventBus);
            this.currentLevelIndex = levelIndex;
            console.log("load level: " + levelIndex);
        }
    }
    unloadLevel(p = this.p, eventBus = this.eventBus) {
        if(this.level) {
            this.level.clearLevel(p, eventBus);
            this.level = null;
            console.log("unload level");
        }
    }
    update(p = this.p, eventBus = this.eventBus) {
        if(this.level) {
            this.flipY(p);
            this.level.clearCanvas && this.level.clearCanvas(p);
            this.level.updatePhysics && this.level.updatePhysics(p);
            this.level.updateCollision && this.level.updateCollision(p, eventBus);
            if(this.level) {
                this.level.draw && this.level.draw(p);
            }
        }
    }
    flipY(p = this.p) {
        p.translate(0, p.height);
        p.scale(1, -1);
    }
}