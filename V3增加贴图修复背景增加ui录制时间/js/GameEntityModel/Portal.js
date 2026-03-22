import { GameEntity } from "./GameEntity.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";
import { Assets } from "../AssetsManager.js";

export class Portal extends GameEntity {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "portal";
        this.movementComponent = null;
        this.collider = new RectangleCollider(ColliderType.TRIGGER, w, h);
        this.isOpen = false;
        this._frame = 0;
    }
    openPortal() {
        this.isOpen = true;
    }
    draw(p) {
        this._frame++;
        p.push();
        const w = this.collider.w;
        const h = this.collider.h;
        if (this.isOpen) {
            // 激活状态：使用 goal.png 贴图
            const sprite = Assets.tileImage_goal;
            if (sprite) {
                p.translate(this.x, this.y + h);
                p.scale(1, -1);
                p.image(sprite, 0, 0, w, h);
            } else {
                p.fill(50, 150, 255, 180);
                p.noStroke();
                p.rect(this.x, this.y, w, h);
            }
            p.pop();
            return;
        } else {
            // 未激活：暗灰石门
            p.fill(40, 40, 45);
            p.stroke(20);
            p.strokeWeight(2);
            p.rect(this.x, this.y, w, h, 20, 20, 0, 0);
            p.fill(150, 50, 50);
            p.noStroke();
            p.ellipse(this.x + w / 2, this.y + h / 2, 10, 10);
        }
        p.pop();
    }
}
