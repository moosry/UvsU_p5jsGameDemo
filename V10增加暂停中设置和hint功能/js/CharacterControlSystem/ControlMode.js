//输入层，意图层，动作层，物理层
import { BasicEventProcesser } from "./EventProcesser.js";
import { BasicIntentResolver } from "./IntentResolver.js";
import { BasicActionValidator } from "./ActionValidator.js";
import { BasicPhysicsApplier } from "./PhysicsApplier.js";

class ControlMode {
    constructor() {

    }
    controlPipeline() {

    }
}

export class BasicControlMode extends ControlMode{//基础控制模式（地面，无惯性）
    constructor(controlComponent, movementComponent) {
        super();
        this.controlComponent = controlComponent;
        this.movementComponent = movementComponent;

        this.eventProcesser = new BasicEventProcesser();
        this.intentResolver = new BasicIntentResolver();
        this.actionValidator = new BasicActionValidator();
        this.physicsApplier = new BasicPhysicsApplier();

        this.movementComponent.accY = this.controlComponent.gravity;

    }
    controlPipeline(event) {
        if(!event.hasOwnProperty("isReplay")) {
            const processedEvent = this.eventProcesser.process(event);
            if(processedEvent) {
                const intent = this.intentResolver.resolve(processedEvent);
                const action = this.actionValidator.validate(intent, this.controlComponent);
                this.physicsApplier.apply(action, this.controlComponent, this.movementComponent);
            }
        }
    }
}
export class BasicControlModeReplayer extends ControlMode{//基础控制模式（地面，无惯性）
    constructor(controlComponent, movementComponent) {
        super();
        this.controlComponent = controlComponent;
        this.movementComponent = movementComponent;

        this.eventProcesser = new BasicEventProcesser();
        this.intentResolver = new BasicIntentResolver();
        this.actionValidator = new BasicActionValidator();
        this.physicsApplier = new BasicPhysicsApplier();

        this.movementComponent.accY = this.controlComponent.gravity;
        // console.log("velX: " + this.movementComponent.velX);
        // console.log("velY: " + this.movementComponent.velY);
        // console.log("accX: " + this.movementComponent.accX);
        // console.log("accY: " + this.movementComponent.accY);
    }
    controlPipeline(event) {
        //console.log("enter replayer control pipeline");
        if(event.hasOwnProperty("isReplay")) {
            //console.log("replayer accept event" + event.type  +  "," + event.code);
            const processedEvent = this.eventProcesser.process(event);
            //console.log("eventtype: " + processedEvent.type + ", eventcode: " + processedEvent.code);
            if(processedEvent) {
                const intent = this.intentResolver.resolve(processedEvent);
                const action = this.actionValidator.validate(intent, this.controlComponent);
                // for(const i of action) {
                //     console.log("action: "+ i);
                // }
                this.physicsApplier.apply(action, this.controlComponent, this.movementComponent);
            }
        }
    }
}