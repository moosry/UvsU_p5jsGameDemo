import { Player, Replayer, Ground, Wall, Portal, Spike, Button } from "../GameEntityModel/index.js";
import { CollisionSystem } from "../CollideSystem/CollisionSystem.js";
import { PhysicsSystem } from "../PhysicsSystem/PhysicsSystem.js";
import { RecordSystem } from "../RecordSystem/RecordSystem.js";
import { BaseLevel } from "./BaseLevel.js";

export class Level2 extends BaseLevel {
    constructor() {
        super();
        this.entities = new Set();
        this.button1 = new Button(700, 80, 20, 5);//右按钮
        this.button2 = new Button(215, 240, 20, 5);//左按钮
        this.portal = new Portal(825, 280, 50, 50);
        this.entities.add(new Ground(0, 0, 400, 80));//左下
        this.entities.add(new Ground(600, 0, 360, 80));//右下
        this.entities.add(new Ground(330, 130, 100, 30));//平台中
        this.entities.add(new Ground(175, 210, 100, 30));//平台左
        this.entities.add(new Ground(800, 250, 100, 30));//平台右

        this.entities.add(new Spike(400, 0, 200, 70));
        
        this.entities.add(this.portal);

        this.entities.add(this.button1);
        this.entities.add(this.button2);

        const player = new Player(50, 80, 40, 40);
        player.createListeners();
        this.entities.add(player);

        this.recordSystem = new RecordSystem(player, 5000, (x, y) => this.addReplayer(x, y), () => this.removeReplayer());
        this.recordSystem.createListeners();

        this.physicsSystem = new PhysicsSystem(this.entities);
        this.collisionSystem = new CollisionSystem(this.entities);

        

    }
    clearLevel() {
        this.recordSystem.clearAllListenersAndTimers();
        const player = this.referenceOfPlayer();
        if(player) {
            player.clearListeners();
        }
    }
    addReplayer(startX, startY) {
        const ref = this.referenceOfReplayer();
        if(ref === null) {// allow add
            const replayer = new Replayer(startX, startY, 40, 40);
            replayer.createListeners();
            this.entities.add(replayer);
            this.physicsSystem.setEntities(this.entities);
            this.collisionSystem.setEntities(this.entities);
            return replayer;
        }
    }
    removeReplayer() {
        const ref = this.referenceOfReplayer();
        if(ref !== null) {// allow remove
            ref.clearEventListeners();
            this.entities.delete(ref);
            this.physicsSystem.setEntities(this.entities);
            this.collisionSystem.setEntities(this.entities);
        }
    }

    referenceOfPlayer() {
        for(const entity of this.entities) {
            if(entity.type === "player") {
                return entity;
            }
        }
        return null;
    }

    // -> return: number
    referenceOfReplayer() {
        for(const entity of this.entities) {
            if(entity.type === "replayer") {
                return entity;
            }
        }
        return null;
    }
    clearCanvas() {
        sketch.background(220);
    }
    
    updatePhysics() {
        this.physicsSystem.physicsEntry();
    }

    updateCollision() {
        this.collisionSystem.collisionEntry();
        if(this.button1.isPressed && this.button2.isPressed) {
            this.portal.openPortal();
        }
    }

    
    draw() {
        for(const entity of this.entities) {
            entity.draw();
        }
        //绘制录制ui
        this.recordSystem.draw();

        this.button1.releaseButton();
        this.button2.releaseButton();

    }
    
}