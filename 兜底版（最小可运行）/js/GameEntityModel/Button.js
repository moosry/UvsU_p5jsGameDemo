import { GameEntity } from "./GameEntity.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Button extends GameEntity {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "button";
        this.movementComponent = null;
        this.collider = new RectangleCollider(ColliderType.TRIGGER, w, h);
        this.isPressed = false;
    }
    pressButton() {
        this.isPressed = true;
    }
    releaseButton() {
        this.isPressed = false;
    }
    draw() {
        if(this.isPressed) {
            sketch.fill(255, 200, 200);
            sketch.rect(this.x, this.y, this.collider.w, this.collider.h);
        } else {
            sketch.fill(245, 64, 112);
            sketch.rect(this.x, this.y, this.collider.w, this.collider.h)
        }
    }

}
