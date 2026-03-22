import { Character } from "./Character.js";
import { MovementComponent } from "../PhysicsSystem/MovementComponent.js";
import { ControllerManager } from "../CharacterControlSystem/ControllerManager.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";
import { Assets } from "../AssetsManager.js";

function getCloneSprite(velX, velY, isOnGround) {
    if (!isOnGround) {
        if (velY > 0) {
            if (velX > 0) return Assets.cloneImg_upRight;
            if (velX < 0) return Assets.cloneImg_upLeft;
            return Assets.cloneImg_up;
        }
        return null;
    }
    if (velX > 0) return Assets.cloneImg_right;
    if (velX < 0) return Assets.cloneImg_left;
    return null;
}

export class Replayer extends Character {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "replayer";
        this.startX = x;
        this.startY = y;
        this.isReplaying = false;
        this.movementComponent = new MovementComponent(0, 0, 0, 0);
        this.controllerManager = new ControllerManager("BasicModeReplayer", this.movementComponent);
           this.controllerManager.owner = this; // 设置owner用于死亡状态检查
        this.collider = new RectangleCollider(ColliderType.DYNAMIC, w, h);
        this._lastSprite = null;
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
        this._lastSprite = null;
    }

    draw(p) {
        let drawX = this.x;
        let drawY = this.y;

        if (!this.isReplaying) {
            drawX = this.startX;
            drawY = this.startY;
            this.x = this.startX;
            this.y = this.startY;
            this.movementComponent.velX = 0;
            this.movementComponent.velY = 0;
        }

        const isOnGround = this.controllerManager.currentControlComponent.abilityCondition["isOnGround"];
        let sprite = this.isReplaying
            ? getCloneSprite(this.movementComponent.velX, this.movementComponent.velY, isOnGround)
            : null;
        if (sprite) this._lastSprite = sprite;
        sprite = this._lastSprite || Assets.cloneImg_right;

        if (sprite) {
            p.push();
            p.translate(drawX, drawY + this.collider.h);
            p.scale(1, -1);
            if (!this.isReplaying) {
                p.tint(255, 60);
            }
            p.image(sprite, 0, 0, this.collider.w, this.collider.h);
            if (!this.isReplaying) {
                p.noTint();
            }
            p.pop();
        } else {
            if (this.isReplaying) {
                p.fill(255, 200, 255);
            } else {
                p.fill(255, 200, 255, 60);
            }
            p.rect(drawX, drawY, this.collider.w, this.collider.h);
        }
    }
}
