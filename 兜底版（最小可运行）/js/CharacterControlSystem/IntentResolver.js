class IntentResolver {
    constructor() {

    }
    resolve() {

    }
}
export class BasicIntentResolver extends IntentResolver {
    constructor() {
        super();
        this.conflictResolver = {
            "right": false,
            "left": false,
        }
    }
    resolve(event) {
        let intent = new Set();
        //处理意图冲突比如左右同时按下，返回意图
        if(event.type === "keydown") {
            switch(event.code) {
                case "KeyW":
                    intent.add("wantsJump");
                    break;
                case "KeyD":
                    this.conflictResolver["left"] = false;
                    this.conflictResolver["right"] = true; 
                    break; 
                case "KeyA":
                    this.conflictResolver["left"] = true;
                    this.conflictResolver["right"] = false;
                    break;
            }
        }

        if(event.type === "keyup") {
            switch(event.code) {
                case "KeyW":
                    break;
                case "KeyD":
                    this.conflictResolver["right"] = false;
                    break;
                case "KeyA":
                    this.conflictResolver["left"] = false;
                    break;
            }
        }

        if(this.conflictResolver["left"] && !this.conflictResolver["right"]) {
            intent.add("wantsLeft");
        } else if(!this.conflictResolver["left"] && this.conflictResolver["right"]) {
            intent.add("wantsRight");
        } else if(!this.conflictResolver["left"] && !this.conflictResolver["right"]) {
            intent.add("wantsStopX");
        }

        return intent;
    }
}