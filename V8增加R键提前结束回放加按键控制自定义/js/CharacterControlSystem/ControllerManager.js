import { BasicControlMode, BasicControlModeReplayer } from "./ControlMode.js";
import { BasicControlComponent } from "./ControlComponent.js";

const controlModeMap = {
    "BasicMode" : BasicControlMode,
    "BasicModeReplayer": BasicControlModeReplayer,
}
const controlComponentMap = {
    "BasicMode" : BasicControlComponent,
    "BasicModeReplayer": BasicControlComponent,
}

export class ControllerManager {//多例模式，每个可操控角色拥有一个实例，比如主角、过去自己、敌人、ai控制）
    constructor(defaultControlMode, movementComponent) {
        this.movementComponent = movementComponent;

        const ControlComponentClass = controlComponentMap[defaultControlMode];
           this.owner = null; // 指向所有者角色对象
        this.currentControlComponent = new ControlComponentClass();

        const ControlModeClass = controlModeMap[defaultControlMode];
        this.currentControlMode = new ControlModeClass(this.currentControlComponent, this.movementComponent);

        this._keydownHandler = (event) => this.controlEntry(event);
        this._keyupHandler = (event) => this.controlEntry(event);
    }
    
    createListeners() {
        
        window.addEventListener("keydown", this._keydownHandler);
        window.addEventListener("keyup", this._keyupHandler);
    }

    clearListeners() {
        window.removeEventListener("keydown", this._keydownHandler);
        window.removeEventListener("keyup", this._keyupHandler);
    }
    switchMode(controlMode) {
        const ControlComponentClass = new controlComponentMap[controlMode];
        this.currentControlComponent = new ControlComponentClass();
           
        const ControlModeClass = controlModeMap[controlMode];
        this.currentControlMode = new ControlModeClass(this.currentControlComponent, this.movementComponent);

    }

    controlEntry(event) {
           // 死亡时禁用控制
           if(this.owner && this.owner.deathState && this.owner.deathState.isDead) {
               return;
           }
        this.currentControlMode.controlPipeline(event);
    }
}

