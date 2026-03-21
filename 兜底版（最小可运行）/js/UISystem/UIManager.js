import { UIMounter } from "./UIMounter.js";

export class UIManager {//改成pages
    constructor() {
        this.templates = {
            main: 
                `<div id="main">
                    <button id="main-btn-levelSelect" onclick="UI.transition(this.id)">LEVEL SELECT</button>
                </div>`
            ,
            levelSelect:
                `<div id="levelSelect">
                    <button id="levelSelect-btn-level1" onclick="UI.transition(this.id)">LEVEL1</button>
                    <button id="levelSelect-btn-level2" onclick="UI.transition(this.id)">LEVEL2</button>
                    <button id="levelSelect-btn-back" onclick="UI.transition(this.id)">BACK</button>
                </div> `
            ,
            level1:
                `<div id="level1">
                    <div id="inLevel1UI">
                        <button id="level1-btn-back" onclick="UI.transition(this.id)">BACK</button>
                    </div>
                </div>`
            ,
            level1Result:
                `<div id="level1Result">
                    <button id="level1Result-btn-back" onclick="UI.transition(this.id)">BACK</button>
                    <button id="level1Result-btn-restart" onclick="UI.transition(this.id)">RESTART</button>
                    <button id="level1Result-btn-nextLevel" onclick="UI.transition(this.id)">NEXT LEVEL</button>
                </div>`
            ,
            level2: 
                `<div id="level2">
                    <div id="inLevel2UI">
                        <button id="level2-btn-back" onclick="UI.transition(this.id)">BACK</button>
                    </div>
                </div>`
            ,
            level2Result:
                `<div id="level2Result">
                    <button id="level2Result-btn-back" onclick="UI.transition(this.id)">BACK</button>
                    <button id="level2Result-btn-restart" onclick="UI.transition(this.id)">RESTART</button>
                </div>`
            ,
        }
        this.states = {
            "main": {
                "main-btn-levelSelect": "levelSelect",
            },
            "levelSelect": {
                "levelSelect-btn-level1": "level1",
                "levelSelect-btn-level2": "level2",
                "levelSelect-btn-back": "main"
            },
            "level1": {
                "level1-btn-back": "levelSelect",
                "autoResult1": "level1Result",
            },
            "level2": {
                "level2-btn-back": "levelSelect",
                "autoResult2": "level2Result",
            },
            "level1Result": {
                "level1Result-btn-back": "levelSelect",
                "level1Result-btn-restart": "level1",
                "level1Result-btn-nextLevel": "level2",
            },
            "level2Result": {
                "level2Result-btn-back": "levelSelect",
                "level2Result-btn-restart": "level2",
            },
        }
        
        this.mounter = new UIMounter();//mount给一段html文本，给什么就挂什么，挂在body下面，unmount把当前在body下面的之前挂上去的节点卸载
        this.mounter.mount(this.templates["main"]);
        this.state = "main";
    }

    transition(input) {
        console.log("input: " + input);
        const nextState = this.states[this.state][input];
        if(nextState !== undefined) {
            
            if(nextState === "level1" || nextState === "level2") {
                this.renderState(nextState);
                eventBus.publish("loadLevel", nextState);
            } else if(input === "level1-btn-back" || input === "level2-btn-back") {
                eventBus.publish("unloadLevel");
                this.renderState(nextState);
            } else if(input === "autoResult1") {
                eventBus.publish("unloadLevel");
                this.renderState(nextState);
            } else if(input === "autoResult2") {
                eventBus.publish("unloadLevel");
                this.renderState(nextState);
            } else {
                this.renderState(nextState);
            }
            this.state = nextState;
        }
        
    }

    renderState(state) {//应该是什么状态就把对应的模板调出来
        const template = this.templates[state];
        if(template !== undefined) {
            this.mounter.unmount();
            this.mounter.mount(template);

            if(state === "level1" || state === "level2") {
                const match = state.match(/\d+$/);
                const levelIndex = parseInt(match, 10);

                const canvas = sketch.createCanvas(960, 540);
                canvas.parent(`#level${levelIndex}`);
            }
        }
    }
}