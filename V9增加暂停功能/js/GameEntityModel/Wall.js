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

    draw(p) {
        const w = this.collider.w;
        const h = this.collider.h;
        p.fill(55, 55, 60);
        p.stroke(25, 25, 30);
        p.strokeWeight(2);
        p.rect(this.x, this.y, w, h);

        const brickH = 15;
        const brickW = 30;
        for (let by = this.y; by < this.y + h; by += brickH) {
            const row = Math.floor((by - this.y) / brickH);
            const startX = (row % 2 !== 0) ? this.x - brickW / 2 : this.x;
            for (let bx = startX; bx < this.x + w; bx += brickW) {
                if (bx > this.x && bx < this.x + w) {
                    const endY = Math.min(by + brickH, this.y + h);
                    p.line(bx, by, bx, endY);
                }
            }
            if (by > this.y) {
                p.line(this.x, by, this.x + w, by);
            }
        }
    }
}