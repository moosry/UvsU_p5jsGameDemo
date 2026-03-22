import { GameEntity } from "./GameEntity.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Ground extends GameEntity {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "ground";
        this.movementComponent = null;
        this.collider = new RectangleCollider(ColliderType.STATIC, w, h);
    }

    draw(p) {
        p.fill(180, 120, 60);
        p.rect(this.x, this.y, this.collider.w, this.collider.h);
    }
}