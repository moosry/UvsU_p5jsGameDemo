import { Level1 } from "./Level1.js";
import { Level2 } from "./Level2.js";

export class LevelManager {
    constructor() {
        this.levelMap = {
            "level1": Level1,
            "level2": Level2,
        }
        this.level = null;//生命周期和loadlevel，unloadlevel一致
    }
    loadLevel(levelIndex) {
        if(!this.level) {
            const LevelClass = this.levelMap[levelIndex];
            this.level = new LevelClass();
            console.log("load level: " + levelIndex);
        }
    }
    unloadLevel() {
        if(this.level) {
            this.level.clearLevel();
            this.level = null;
            console.log("unload level");
        }
        
    }
    update() {
        if(this.level) {
            this.flipY();// every frame flip y axis
            this.level.clearCanvas();
            this.level.updatePhysics();
            this.level.updateCollision();
            if(this.level) {
                this.level.draw();
            }
        }
    }
    flipY() {
        sketch.translate(0, sketch.height);
        sketch.scale(1, -1);
    }
}