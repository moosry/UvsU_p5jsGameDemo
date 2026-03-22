import { ColliderShape, ColliderType } from "./enumerator.js";

export const responderMap = {
    "DYNAMIC-STATIC": (a, msg) => basicBlockResponse(a, msg),
    "DYNAMIC-DYNAMIC": (a, b, msg) => dynDynBlockResponse(a, b, msg),
    "DYNAMIC-TRIGGER": (a, b, eventBus) => dynTriResponse(a, b, eventBus),
}

function basicBlockResponse(a, msg) {
    if(msg === "left" || msg === "right") {
        a.movementComponent.velX = 0;
    } else {
        a.movementComponent.velY = 0;
        if(msg === "bottom") {
            a.controllerManager.currentControlComponent.abilityCondition["isOnGround"] = true;
        }
    }
}

function dynDynBlockResponse(a, b, msg) {
    if(msg === "allowed collision") {
        return;
    }
    const relativeVelY = b.movementComponent.velY - a.movementComponent.velY;
    if(msg === "bottom") {
        if(relativeVelY > 0) {
            //a落在b的头上
            a.movementComponent.velY = 0;
            a.controllerManager.currentControlComponent.abilityCondition["isOnGround"] = true;
        }
    } else {
        if(relativeVelY < 0) {
            b.movementComponent.velY = 0;
            b.controllerManager.currentControlComponent.abilityCondition["isOnGround"] = true;
        }
    }
    return;
}
function dynTriResponse(a, b, eventBus) {
    //level1
    if(a.type === "player" && b.type === "home") {
        eventBus && eventBus.publish("autoResult", "autoResult1");
        return;
    }
    //level2
    if((a.type === "player" || a.type === "replayer") && b.type === "button") {
        b.pressButton();
        return;
    }
    if(a.type === "player" && b.type === "spike") {
        eventBus && eventBus.publish("autoResult", "autoResult2");
        return;
    }
    if(a.type === "player" && b.type === "portal") {
        if(b.isOpen) {
            eventBus && eventBus.publish("autoResult", "autoResult2");
        }
        return;
    }
}