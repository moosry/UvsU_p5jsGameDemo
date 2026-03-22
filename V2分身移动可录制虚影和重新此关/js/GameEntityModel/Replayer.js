import { Character } from "./Character.js";
import { MovementComponent } from "../PhysicsSystem/MovementComponent.js";
import { ControllerManager } from "../CharacterControlSystem/ControllerManager.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Replayer extends Character {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "replayer";
        this.startX = x;
        this.startY = y;
        this.isReplaying = false;
        this.movementComponent = new MovementComponent(0, 0, 0, 0);
        this.controllerManager = new ControllerManager("BasicModeReplayer", this.movementComponent);
        this.collider = new RectangleCollider(ColliderType.DYNAMIC, w, h);
    }
    createListeners() {
        this.controllerManager.createListeners();
    }
    clearListeners() {
        this.controllerManager.clearListeners();
    }
    inLevelReset() {
        this.x = this.startX;
        this.y = this.startY;
        this.movementComponent.velX = 0;
        this.movementComponent.velY = 0;
        // 清除控制状态，避免残留的 pressedKeys 导致下次回放 keydown 被过滤
        const mode = this.controllerManager.currentControlMode;
        mode.eventProcesser.pressedKeys.clear();
        mode.intentResolver.conflictResolver["left"] = false;
        mode.intentResolver.conflictResolver["right"] = false;
    }

    draw(p) {
        if (this.isReplaying) {
            p.fill(255, 200, 255);
        } else {
            // 未回放时固定在起点，不受物理影响
            this.x = this.startX;
            this.y = this.startY;
            this.movementComponent.velX = 0;
            this.movementComponent.velY = 0;
            p.fill(255, 200, 255, 60);
        }
        p.rect(this.x, this.y, this.collider.w, this.collider.h);
    }
}
