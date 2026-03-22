import { Clip } from "./Clip.js";

export class RecordSystem {
    constructor(player, maxRecordTime, addReplayerCallback, removeReplayerCallback) {
        //与状态无关的属性
        this.player = player;
        this.maxRecordTime = maxRecordTime;
        this.allowedKeys = new Set(["KeyE", "KeyR"]);
        this.pressedKeys = new Set();
        this.addReplayer = addReplayerCallback;
        this.removeReplayer = removeReplayerCallback;
        this._keydownHandler = (event) => this.eventHandler(event);
        this._keyupHandler = (event) => this.eventHandler(event);
        
        //状态转移规则
        this.states = {
            "ReadyToRecord": {
                "KeyE": "Recording",
            },
            "Recording": {
                "KeyE": "ReadyToReplay",
                "RecordTimeout": "ReadyToReplay",
            },
            "ReadyToReplay":{
                "KeyR": "Replaying",
                "KeyE": "Recording",
            },
            "Replaying": {
                "ReplayTimeout": "ReadyToReplay",
            },
        }
        this.actions = {
            "ReadyToRecord": {
                "KeyE": this.beingRecordingFromIdle,
            },
            "Recording": {
                "KeyE": this.finishRecordingByKey,
                "RecordTimeout": this.finishRecordingByTimeout,
            },
            "ReadyToReplay": {
                "KeyR": this.beingReplay,
                "KeyE": this.restartRecording,
            },
            "Replaying": {
                "ReplayTimeout": this.finishReplayAndReset,
            },
        }

        //决定状态的属性
        this.state = "ReadyToRecord";
        this.clip = null;
        this.recordStartTime = -1;
        this.recordEndTime = -1;
        this.recordTimer = null;
        this.replayTimer = null;
        this.eventTimers = [];
        this.replayer = null;

          
    }

    createListeners() {
        window.addEventListener("keydown", this._keydownHandler);
        window.addEventListener("keyup", this._keyupHandler);
    }
    clearAllListenersAndTimers() {
        window.removeEventListener("keydown", this._keydownHandler);
        window.removeEventListener("keyup", this._keyupHandler);
        if(this.clip) {
            this.clip.clearListeners();
        }
        if(this.recordTimer) {
            clearTimeout(this.recordTimer);
        }
        if(this.replayTimer) {
            clearTimeout(this.replayTimer);
        }
        if(this.eventTimers.length !== 0) {
            for(const timer of this.eventTimers) {
                clearTimeout(timer);
            }
        }
        if(this.replayer) {
            this.removeReplayer();
        }
    }
    // event: window raw keyboard event -> returns: boolean
    eventHandler(event) {
        const processedEvent = this.process(event);
        if(processedEvent !== null) {
            this.transition(processedEvent.code);
        }
    }
    // -> return: boolean
    beingRecordingFromIdle() {
        this.recordStartTime = performance.now();
        this.clip = new Clip(this.player.x, this.player.y, this.recordStartTime);
        const heldKeys = this.player.controllerManager.currentControlMode.eventProcesser.pressedKeys;
        this.clip.injectHeldKeys(heldKeys);
        this.clip.createListeners();
        
        this.recordTimer = setTimeout(() => {
            this.transition("RecordTimeout");
        }, this.maxRecordTime);
    }
    // -> return:
    finishRecordingByKey() {
        this.recordEndTime = performance.now();
        this.clip.clearListeners();
        clearTimeout(this.recordTimer);
        this.recordTimer = null;
        this.replayer = this.addReplayer(this.clip.getStartX(), this.clip.getStartY());
        //this.printRecords();
    }

    finishRecordingByTimeout() {
        this.recordEndTime = performance.now();
        this.clip.clearListeners();
        this.recordTimer = null;
        this.replayer = this.addReplayer(this.clip.getStartX(), this.clip.getStartY());
        //this.printRecords();
    }
    //
    restartRecording() {
        this.recordStartTime = performance.now();
        this.recordEndTime = -1;

        this.recordTimer = setTimeout(() => {
            this.transition("RecordTimeout");
        }, this.maxRecordTime);
        this.removeReplayer();
        this.replayer = null;

        this.clip = new Clip(this.player.x, this.player.y, this.recordStartTime);
        const heldKeys = this.player.controllerManager.currentControlMode.eventProcesser.pressedKeys;
        this.clip.injectHeldKeys(heldKeys);
        this.clip.createListeners();

    }
    dispatchEvent() {
        const records = this.clip.getRecords();
        for(const record of records) {
            const eventTimer = setTimeout(() => this.triggerKey(record), record["time"]);
            this.eventTimers.push(eventTimer);
        }
    }

    triggerKey(record){
        const event = new KeyboardEvent(record["keyType"], { code: record["code"] } );//创建键盘事件
        Object.defineProperty(event, "isReplay", { value: true })
        window.dispatchEvent(event);//发布键盘事件
    }

    beingReplay() {
        if (this.replayer) this.replayer.isReplaying = true;

        this.replayTimer = setTimeout(() => {
            this.transition("ReplayTimeout");
        }, this.recordEndTime - this.recordStartTime);

        this.dispatchEvent();

    }

    finishReplayAndReset() {
        if (this.replayer) this.replayer.isReplaying = false;
        this.replayTimer = null;
        this.eventTimers = [];
        this.replayer.inLevelReset();
    }

    process(event) {
        if(!this.allowedKeys.has(event.code)) {
            return null;
        }
        if(event.type === "keydown") {
            if(this.pressedKeys.has(event.code)) {
                return null;
            } else {
                this.pressedKeys.add(event.code);
                return event;                
            }
        }
        if(event.type === "keyup") {
            this.pressedKeys.delete(event.code);
            return null;
        }
    }
    //input: string -> return: void
    transition(input) {
        const nextState = this.states[this.state][input];
        if(!nextState){
            return false;
        } else {
            const actionFunc = this.actions[this.state][input];
            this.state = nextState;
            actionFunc.call(this);
        }
    }

    draw(p) {
        // 1. 把坐标系翻回正常方向（y 向下）
        p.scale(1, -1);

        // 2. 画 UI（现在坐标系正常，UI 会在画布顶部）
        p.fill(0, 0, 0, 120);
        p.rect(0, -60, 960, 60);   // 顶部 UI 背景

        let msg = "";
        let color = p.color(255);

        switch (this.state) {
            case "ReadyToRecord":
                msg = "按 E 开始录制";
                color = p.color(100, 200, 255);
                break;
            case "Recording":
                msg = "录制中… 按 E 结束";
                color = p.color(255, 150, 100);
                break;
            case "ReadyToReplay":
                msg = "按 R 回放，按 E 重新录制";
                color = p.color(180, 255, 120);
                break;
            case "Replaying":
                msg = "回放中…";
                color = p.color(255, 220, 80);
                break;
        }

        p.fill(color);
        p.rect(0, -40, 960, 40);   // 状态条

        p.fill(0);
        p.textSize(24);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(msg, 480, -20);     // 顶部文字（正常方向）

        // 3. 再翻回去，让游戏世界继续 y 轴向上
        p.scale(1, -1);
    }
    printRecords() {
        const records = this.clip.getRecords();
        for( const record of records) {
            console.log("eventType: " + record["keyType"]);
        }
    }


}
