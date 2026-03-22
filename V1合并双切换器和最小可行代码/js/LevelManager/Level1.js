//import all game entity classes
import { Player, Replayer, Ground, Wall, Home } from "../GameEntityModel/index.js";
import { CollisionSystem } from "../CollideSystem/CollisionSystem.js";
import { PhysicsSystem } from "../PhysicsSystem/PhysicsSystem.js";
import { RecordSystem } from "../RecordSystem/RecordSystem.js";
import { BaseLevel } from "./BaseLevel.js";

export class Level1 extends BaseLevel {
    constructor(p, eventBus) {
        super();
        this.p = p;
        this.eventBus = eventBus;
        this.entities = new Set();
        this.entities.add(new Ground(0, 0, p.width, 80));
        this.entities.add(new Ground(600, 80, 200, 150));
        this.entities.add(new Home(700, 80+150, 50, 70));
        this.entities.add(new Wall(-10, 0, 15, p.height));
        this.entities.add(new Wall(900, 0, p.width-900, p.height));

        const player = new Player(50, 450, 40, 40);
        player.createListeners();
        this.entities.add(player);
        
        this.recordSystem = new RecordSystem(player, 5000, (x, y) => this.addReplayer(x, y), () => this.removeReplayer());
        this.recordSystem.createListeners();

        this.physicsSystem = new PhysicsSystem(this.entities);
        this.collisionSystem = new CollisionSystem(this.entities, eventBus);
    }
    clearLevel(p = this.p, eventBus = this.eventBus) {
        this.recordSystem.clearAllListenersAndTimers();
        const player = this.referenceOfPlayer();
        if(player) {
            player.clearListeners();
        }
    }
    // startX: number, startY: number -> return: Replayer
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
    // -> return: void
    removeReplayer() {
        const ref = this.referenceOfReplayer();
        if(ref !== null) {// allow remove
            ref.clearEventListeners();
            this.entities.delete(ref);
            this.physicsSystem.setEntities(this.entities);
            this.collisionSystem.setEntities(this.entities);
        }
    }

    // -> return number
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
    
    clearCanvas(p = this.p) {
        p.background(220);
    }
    
    updatePhysics() {
        this.physicsSystem.physicsEntry();
    }

    updateCollision(p = this.p, eventBus = this.eventBus) {
        this.collisionSystem.collisionEntry(eventBus);
    }

    
    draw(p = this.p) {
        for(const entity of this.entities) {
            entity.draw(p);
        }
        //绘制录制ui
        this.recordSystem.draw && this.recordSystem.draw(p);
    }


}