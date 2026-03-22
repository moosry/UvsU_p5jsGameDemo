import { ColliderShape, ColliderType } from "./enumerator.js";

export const resolverMap = {
    // "DYNAMIC-DYNAMIC": (a, b) => resolveBoth(a, b),
    "DYNAMIC-STATIC-RECTANGLE-RECTANGLE": (a, b) => resolveFirst(a, b),
    "DYNAMIC-DYNAMIC-RECTANGLE-RECTANGLE": (a, b) => resolveDynDyn(a, b),
}

function resolveFirst(a, b) {
    let  collisionMsg= "";

    let vectorX = (a.x+a.collider.w/2) - (b.x+b.collider.w/2);
    let vectorY = (a.y+a.collider.h/2) - (b.y+b.collider.h/2);

    let combinedHalfWidths = a.collider.w/2 + b.collider.w/2;
    let combinedHalfHeights = a.collider.h/2 + b.collider.h/2;

    //collision happened
    let overlapX = combinedHalfWidths - Math.abs(vectorX);
    let overlapY = combinedHalfHeights - Math.abs(vectorY);

    if(overlapX <= overlapY) {
        if(vectorX > 0) {
            collisionMsg = "left";
            a.x = a.x + overlapX;
        } else {
            collisionMsg = "right";
            a.x = a.x - overlapX;
        }
    } else {
        if(vectorY > 0) {
            collisionMsg = "bottom"
            a.y = a.y + overlapY;
        } else {
            collisionMsg = "top"
            a.y = a.y - overlapY;
        }
    }
    return collisionMsg;
}

function resolveDynDyn(a, b) {
    let  collisionMsg= "";//以a为基准

    let vectorY = (a.y+a.collider.h/2) - (b.y+b.collider.h/2);

    let combinedHalfHeights = a.collider.h/2 + b.collider.h/2;

    //collision happened
    let overlapY = combinedHalfHeights - Math.abs(vectorY);

    // let totalX = Math.abs(a.movementComponent.velX) + Math.abs(b.movementComponent.velX);
    // let weightAX, weightBX;
    // if (totalX === 0) {
    //     weightAX = 0.5;
    //     weightBX = 0.5;
    // } else {
    //     weightAX = Math.abs(a.movementComponent.velX) / totalX;
    //     weightBX = Math.abs(b.movementComponent.velX) / totalX;
    // }

    let totalY = Math.abs(a.movementComponent.velY) + Math.abs(b.movementComponent.velY);
    let weightAY, weightBY;
    if (totalY === 0) {
        weightAY = 0.5;
        weightBY = 0.5;
    } else {
        weightAY = Math.abs(a.movementComponent.velY) / totalY;
        weightBY = Math.abs(b.movementComponent.velY) / totalY;
    }

    const relativeVelY = b.movementComponent.velY - a.movementComponent.velY;
    // 垂直碰撞 → 看 vy
    if (vectorY > 0) {
        collisionMsg = "bottom";
        if(relativeVelY >= 0) {
            if(b.movementComponent.velY <= 0) {
                a.y += overlapY * weightAY;
                b.y -= overlapY * weightBY;                    
            } else {
                a.y += overlapY * weightBY;
                b.y -= overlapY * weightAY;   
            }
        } else if(relativeVelY < 0) {
        
        }
    } else if(vectorY < 0) {
        collisionMsg = "top";
        if(relativeVelY > 0) {

        } else if(relativeVelY <= 0) {
            if(a.movementComponent.velY <= 0) {
                a.y -= overlapY * weightAY;
                b.y += overlapY * weightBY;                    
            } else {
                a.y -= overlapY * weightBY;
                b.y += overlapY * weightAY;  
            }

        }
    } else if(vectorY === 0) {
        collisionMsg = "allowed collision";
    }
    

    return collisionMsg;
}