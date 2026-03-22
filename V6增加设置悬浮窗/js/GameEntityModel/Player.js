import { Character } from "./Character.js";
import { MovementComponent } from "../PhysicsSystem/MovementComponent.js";
import { ControllerManager } from "../CharacterControlSystem/ControllerManager.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";
import { Assets } from "../AssetsManager.js";

function getPlayerSprite(velX, velY, isOnGround) {
    if (!isOnGround) {
        if (velY > 0) { // y轴向上为正，跳跃中
            if (velX > 0) return Assets.playerImg_upRight;
            if (velX < 0) return Assets.playerImg_upLeft;
            return Assets.playerImg_up;
        }
        return null; // 下落时沿用上一帧
    }
    if (velX > 0) return Assets.playerImg_right;
    if (velX < 0) return Assets.playerImg_left;
    return null; // 静止时沿用上一帧
}

export class Player extends Character {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "player";
        this.startX = x;
        this.startY = y;
        this.movementComponent = new MovementComponent(0, 0, 0, 0);
        this.controllerManager = new ControllerManager("BasicMode", this.movementComponent);
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


    draw(p) {
        if(this.deathState && this.deathState.isDead) {
            const deadSprite = Assets.playerImg_dead;
            if (deadSprite) {
                p.push();
                p.translate(this.x, this.y + this.collider.h);
                p.scale(1, -1);
                p.image(deadSprite, 0, 0, this.collider.w, this.collider.h);
                p.pop();
                return;
            }
        }

        const isOnGround = this.controllerManager.currentControlComponent.abilityCondition["isOnGround"];
        let sprite = getPlayerSprite(this.movementComponent.velX, this.movementComponent.velY, isOnGround);
        if (sprite) this._lastSprite = sprite;
        sprite = this._lastSprite || Assets.playerImg_right;

        if (sprite) {
            p.push();
            p.translate(this.x, this.y + this.collider.h);
            p.scale(1, -1);
            p.image(sprite, 0, 0, this.collider.w, this.collider.h);
            p.pop();
        } else {
            p.fill(100, 200, 255);
            p.rect(this.x, this.y, this.collider.w, this.collider.h);
        }
    }
}