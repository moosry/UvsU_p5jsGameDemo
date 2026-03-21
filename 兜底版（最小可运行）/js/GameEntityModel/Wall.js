import { GameEntity } from "./GameEntity.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Wall extends GameEntity {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "wall";
        this.movementComponent = null;
        this.collider = new RectangleCollider(ColliderType.STATIC, w, h);
    }

    draw() {
        sketch.fill(150);
        sketch.rect(this.x, this.y, this.collider.w, this.collider.h);
    }
}