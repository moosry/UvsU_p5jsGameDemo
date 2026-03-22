export class PhysicsSystem {
    constructor(entities) {
        this.entities = entities;
    }
    setEntities(entities) {
        this.entities = entities;
    }
    physicsEntry() {
        for(const entity of this.entities) {
            const m = entity.movementComponent;
            if(m) {
                entity.headBlockedThisFrame = false;
                entity.prevX = entity.x;
                entity.prevY = entity.y;
                m.velY = m.velY + m.accY;
                m.velX = m.velX + m.accX;
                entity.x = entity.x + m.velX;
                entity.y = entity.y + m.velY;
            }
        }
    }
}