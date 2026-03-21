import { Character } from "./Character.js";
import { MovementComponent } from "../PhysicsSystem/MovementComponent.js";
import { ControllerManager } from "../CharacterControlSystem/ControllerManager.js";
import { RectangleCollider } from "../CollideSystem/CollideComponent.js";
import { ColliderShape, ColliderType } from "../CollideSystem/enumerator.js";

export class Player extends Character {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = "player";
        this.startX = x;
        this.startY = y;
        this.movementComponent = new MovementComponent(0, 0, 0, 0);
        this.controllerManager = new ControllerManager("BasicMode", this.movementComponent);
        this.collider = new RectangleCollider(ColliderType.DYNAMIC, w, h);
    }
    createListeners() {
        
        this.controllerManager.createListeners();
    }
    clearListeners() {
        this.controllerManager.clearListeners();
    }


    draw() {
        sketch.fill(100, 200, 255);
        sketch.rect(this.x, this.y, this.collider.w, this.collider.h);
    }
}