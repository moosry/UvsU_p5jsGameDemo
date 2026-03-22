import { GameEntity } from "./GameEntity.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Portal extends GameEntity {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "portal";
        this.movementComponent = null;
        this.collider = new RectangleCollider(ColliderType.TRIGGER, w, h);
        this.isOpen = false;
    }
    openPortal() {
        this.isOpen = true;
    }
    draw(p) {
        if(this.isOpen) {
            p.fill(255, 200, 200);
            p.rect(this.x, this.y, this.collider.w, this.collider.h);
        } else {
            p.fill(245, 64, 112);
            p.rect(this.x, this.y, this.collider.w, this.collider.h);
        }
    }
}