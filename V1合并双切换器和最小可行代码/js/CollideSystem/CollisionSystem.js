import { detectorMap } from "./detectorMap.js";
import { resolverMap } from "./resolverMap.js";
import { responderMap } from "./responderMap.js";

export class CollisionSystem {
    constructor(entities, eventBus) {
        this.entities = entities;
        this.eventBus = eventBus;
        this.dynamicEntities = [];
        this.staticEntities = [];
        this.triggerEntities = [];
        this.partitionEntitiesByType();
    }

    collisionEntry(eventBus = this.eventBus) {
        for(const dyn of this.dynamicEntities) {
            for(const sta of this.staticEntities) {
                this.processDynamicStaticPair(dyn, sta);
            }
        }

        if(this.getReplayer()) {
            this.processDynamicDynamicPair(this.getPlayer(),this.getReplayer());
        }

        for(const dyn of this.dynamicEntities) {
            for(const tri of this.triggerEntities) {
                this.processDynamicTriggerPair(dyn, tri, eventBus);
            }
        }
    }
    getReplayer() {
        for(const dyn of this.dynamicEntities) {
            if(dyn.type === "replayer") {
                return dyn;
            }
        }
        return null;
    }
    getPlayer() {
        for(const dyn of this.dynamicEntities) {
            if(dyn.type === "player");
            return dyn;
        }
        return null;
    }
    setEntities(entities) {
        this.entities = entities;
        this.partitionEntitiesByType();
    }

    partitionEntitiesByType() {
        this.dynamicEntities.length = 0;
        this.staticEntities.length = 0;
        this.triggerEntities.length = 0;

        for(const entity of this.entities) {
            switch(entity.collider.colliderType) {
                case "DYNAMIC":
                    this.dynamicEntities.push(entity);
                    break;
                case "STATIC":
                    this.staticEntities.push(entity);
                    break;
                case "TRIGGER":
                    this.triggerEntities.push(entity);
                    break;
            }
        }
    }

    processDynamicStaticPair(dyn, sta) {
        const dynShape = dyn.collider.colliderShape;
        const staShape = sta.collider.colliderShape;

        const typePair = "DYNAMIC-STATIC";
        const shapePair = `${dynShape}-${staShape}`;
        const fullKey = `${typePair}-${shapePair}`;

        const detectFunc = detectorMap[shapePair];
        const detectResult = detectFunc(dyn, sta);//dynamic-static
        if(detectResult) {//如果发生碰撞，执行if语句，如果没有则跳过
            //第二步：碰撞修复
            const resolveFunc = resolverMap[fullKey];

            const collisionMsg = resolveFunc(dyn, sta);

            const responseFunc = responderMap[typePair];
            responseFunc(dyn, collisionMsg);

        }   
    }

    processDynamicDynamicPair(player, replayer) {
        const playerShape = player.collider.colliderShape;
        const replayerShape = replayer.collider.colliderShape;

        const typePair = "DYNAMIC-DYNAMIC";
        const shapePair = `${playerShape}-${replayerShape}`;
        const fullKey = `${typePair}-${shapePair}`;

        const detectFunc = detectorMap[shapePair];
        const detectResult = detectFunc(player, replayer);//dynamic-dynamic
        
        if(detectResult) {
            console.log("player and replayer collided");
            const resolveFunc = resolverMap[fullKey];
            const collisionMsg = resolveFunc(player, replayer);

            const responseFunc = responderMap[typePair];
            responseFunc(player, replayer, collisionMsg);
        }
    }
    processDynamicTriggerPair(dyn, tri, eventBus = this.eventBus) {
        const dynShape = dyn.collider.colliderShape;
        const triShape = tri.collider.colliderShape;

        const typePair = "DYNAMIC-TRIGGER";
        const shapePair = `${dynShape}-${triShape}`;

        const detectFunc = detectorMap[shapePair];
        const detectResult = detectFunc(dyn, tri);//dynamic-static
        if(detectResult) {//如果发生碰撞，执行if语句，如果没有则跳过
            const responseFunc = responderMap[typePair];
            responseFunc(dyn, tri, eventBus);
        }   
    }
}