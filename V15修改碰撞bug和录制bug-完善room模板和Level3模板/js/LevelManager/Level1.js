//import all game entity classes
import { Player, Ground, Wall, Portal } from "../GameEntityModel/index.js";
import { CollisionSystem } from "../CollideSystem/CollisionSystem.js";
import { PhysicsSystem } from "../PhysicsSystem/PhysicsSystem.js";
import { RecordSystem } from "../RecordSystem/RecordSystem.js";
import { BaseLevel } from "./BaseLevel.js";

export class Level1 extends BaseLevel {
    constructor(p, eventBus) {
        super(p, eventBus);
        this.bgAssetKey = "bgImageLevel1";
        const wallThickness = 20;
        this.entities.add(new Wall(0, 0, wallThickness, p.height));
        this.entities.add(new Wall(p.width - wallThickness, 0, wallThickness, p.height));
        this.entities.add(new Ground(0, 0, p.width, 80));
        this.entities.add(new Ground(600, 80, 200, 150, true));
        // 将门改为 Portal，大小统一为 50x50
        const portal = new Portal(700, 80+150, 50, 50);
        portal.openPortal(); // Level1 的门默认解锁
        this.entities.add(portal);

        const player = new Player(50, 450, 40, 40);
        player.createListeners();
        this.entities.add(player);
        
        this.recordSystem = new RecordSystem(player, 5000, (x, y) => this.addReplayer(x, y), () => this.removeReplayer());
        this.recordSystem.createListeners();

        this.physicsSystem = new PhysicsSystem(this.entities);
        this.collisionSystem = new CollisionSystem(this.entities, eventBus);
    }
}