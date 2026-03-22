import { GameEntity } from "./GameEntity.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Spike extends GameEntity {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "spike";
        this.movementComponent = null;
        this.collider = new RectangleCollider(ColliderType.TRIGGER, w, h);
    }

    draw(p) {
        p.fill(80);
        p.rect(this.x, this.y, this.collider.w, this.collider.h);
    }
}