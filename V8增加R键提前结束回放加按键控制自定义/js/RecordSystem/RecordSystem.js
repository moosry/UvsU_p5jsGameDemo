import { Assets } from "../AssetsManager.js";
import { Clip } from "./Clip.js";
import { t } from "../i18n.js";
import { KeyBindingManager } from "../KeyBindingSystem/KeyBindingManager.js";

// 将 KeyCode 转换为可显示的按键标签（如 'KeyE' -> 'E', 'Space' -> 'Space'）
function keyCodeToLabel(keyCode) {
    const mapping = {
        Space: 'Space', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
        ShiftLeft: 'Shift', ShiftRight: 'Shift', ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
        AltLeft: 'Alt', AltRight: 'Alt',
    };
    if (mapping[keyCode]) return mapping[keyCode];
    // 'KeyE' -> 'E', 'Digit1' -> '1'
    if (/^Key[A-Z]$/.test(keyCode)) return keyCode.slice(3);
    if (/^Digit\d$/.test(keyCode)) return keyCode.slice(5);
    return keyCode;
}

function getRecordUiState(p, state, maxRecordTime, recordStartTime, recordEndTime, replayStartTime) {
    const kbm = KeyBindingManager.getInstance();
    const recordKey = keyCodeToLabel(kbm.getKeyByIntent('record'));
    const replayKey  = keyCodeToLabel(kbm.getKeyByIntent('replay'));
    const maxSec = (maxRecordTime / 1000).toFixed(1);
    const base = {
        title: t("rec_title_standby"),
        subtitle: `${t("rec_sub_max")} ${maxSec}s`,
        badge: "STANDBY",
        accentA: p.color(132, 158, 82),
        accentB: p.color(89, 105, 58),
        panelGlow: p.color(47, 59, 28, 0),
        dotColor: p.color(196, 214, 145),
        frameLight: p.color(216, 200, 150),
        frameDark: p.color(68, 54, 32),
        panelFill: p.color(109, 92, 58),
        panelShade: p.color(79, 64, 38),
        textMain: p.color(247, 232, 193),
        textSub: p.color(223, 202, 146),
        progress: 0,
        showBlinkDot: false,
        pulse: 0,
    };

    switch (state) {
        case "Recording": {
            const elapsedMs = Math.max(0, performance.now() - recordStartTime);
            const elapsedSec = (elapsedMs / 1000).toFixed(1);
            return {
                title: t("rec_title_recording"),
                subtitle: `${t('rec_sub_press_e_end').replace('{KEY}', recordKey)}  ${elapsedSec}s / ${maxSec}s`,
                badge: "REC",
                accentA: p.color(203, 74, 74),
                accentB: p.color(137, 39, 39),
                panelGlow: p.color(0, 0, 0, 0),
                dotColor: p.color(255, 68, 68),
                frameLight: p.color(235, 206, 160),
                frameDark: p.color(77, 50, 31),
                panelFill: p.color(98, 74, 51),
                panelShade: p.color(71, 52, 34),
                textMain: p.color(255, 239, 219),
                textSub: p.color(235, 196, 180),
                progress: Math.min(1, elapsedMs / maxRecordTime),
                showBlinkDot: Math.floor(performance.now() / 450) % 2 === 0,
                pulse: (Math.sin(performance.now() / 200) + 1) / 2,
            };
        }
        case "ReadyToReplay": {
            const recordedSec = ((recordEndTime - recordStartTime) / 1000).toFixed(1);
            return {
                title: t("rec_title_ready"),
                subtitle: `${t('rec_sub_ready_prefix').replace('{REPLAY}', replayKey).replace('{RECORD}', recordKey)}  ${recordedSec}s`,
                badge: "READY",
                accentA: p.color(109, 156, 92),
                accentB: p.color(67, 102, 57),
                panelGlow: p.color(0, 0, 0, 0),
                dotColor: p.color(169, 221, 122),
                frameLight: p.color(212, 199, 148),
                frameDark: p.color(61, 72, 39),
                panelFill: p.color(89, 92, 55),
                panelShade: p.color(66, 68, 41),
                textMain: p.color(240, 234, 190),
                textSub: p.color(206, 218, 154),
                progress: 1,
                showBlinkDot: false,
                pulse: 0,
            };
        }
        case "Replaying": {
            const totalMs = Math.max(1, recordEndTime - recordStartTime);
            const replayElapsedMs = Math.min(Math.max(0, performance.now() - replayStartTime), totalMs);
            const replayElapsedSec = (replayElapsedMs / 1000).toFixed(1);
            const totalReplaySec = (totalMs / 1000).toFixed(1);
            return {
                title: t("rec_title_replaying"),
                subtitle: `${replayElapsedSec}s / ${totalReplaySec}s`,
                badge: "PLAY",
                accentA: p.color(197, 158, 73),
                accentB: p.color(134, 100, 39),
                panelGlow: p.color(0, 0, 0, 0),
                dotColor: p.color(235, 205, 99),
                frameLight: p.color(219, 202, 152),
                frameDark: p.color(84, 64, 31),
                panelFill: p.color(105, 84, 45),
                panelShade: p.color(77, 60, 31),
                textMain: p.color(247, 234, 187),
                textSub: p.color(229, 208, 140),
                progress: Math.min(1, replayElapsedMs / totalMs),
                showBlinkDot: Math.floor(performance.now() / 700) % 2 === 0,
                pulse: 0,
            };
        }
        default:
            return {
                ...base,
                title: t('rec_title_idle').replace('{KEY}', recordKey),
                subtitle: `${t('rec_sub_max')} ${maxSec}s`,
                badge: "IDLE",
            };
    }
}

export class RecordSystem {
    constructor(player, maxRecordTime, addReplayerCallback, removeReplayerCallback) {
        //与状态无关的属性
        this.player = player;
        this.maxRecordTime = maxRecordTime;
        this.keyBindingManager = KeyBindingManager.getInstance();
        this.pressedKeys = new Set();
        this.addReplayer = addReplayerCallback;
        this.removeReplayer = removeReplayerCallback;
        this._keydownHandler = (event) => this.eventHandler(event);
        this._keyupHandler = (event) => this.eventHandler(event);
        
        //状态转移规则（使用意图而不是键码）
        this.states = {
            "ReadyToRecord": {
                "record": "Recording",
            },
            "Recording": {
                "record": "ReadyToReplay",
                "RecordTimeout": "ReadyToReplay",
            },
            "ReadyToReplay":{
                "replay": "Replaying",
                "record": "Recording",
            },
            "Replaying": {
                "ReplayTimeout": "ReadyToReplay",
                "replay": "ReadyToReplay",          // 按 R 键提前停止回放
            },
        }
        this.actions = {
            "ReadyToRecord": {
                "record": this.beingRecordingFromIdle,
            },
            "Recording": {
                "record": this.finishRecordingByKey,
                "RecordTimeout": this.finishRecordingByTimeout,
            },
            "ReadyToReplay": {
                "replay": this.beingReplay,
                "record": this.restartRecording,
            },
            "Replaying": {
                "ReplayTimeout": this.finishReplayAndReset,
                "replay": this.finishReplayByKey,     // 按 R 键提前停止回放
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
    // event: window raw keyboard event -> returns: string (intent) or null
    eventHandler(event) {
        const intent = this.process(event);
        if(intent !== null) {
            this.transition(intent);
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
        this.replayStartTime = performance.now();

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

    finishReplayByKey() {
        // 按 R 键提前停止回放
        if (this.replayer) this.replayer.isReplaying = false;
        if (this.replayTimer) clearTimeout(this.replayTimer);
        this.replayTimer = null;
        // 清除所有待执行的事件计时器
        for (const timer of this.eventTimers) {
            clearTimeout(timer);
        }
        this.eventTimers = [];
        // 清除replayer的控制监听器，防止后续操作被回放输入干扰
        if (this.replayer) this.replayer.clearListeners();
    }

    process(event) {
        // 通过 KeyBindingManager 查询键码对应的意图
        const intent = this.keyBindingManager.getIntentByKey(event.code);
        
        // 只处理 record 和 replay 意图
        if (intent !== "record" && intent !== "replay") {
            return null;
        }
        
        if (event.type === "keydown") {
            if (this.pressedKeys.has(intent)) {
                return null;
            } else {
                this.pressedKeys.add(intent);
                return intent;  // 返回意图而不是事件
            }
        }
        
        if (event.type === "keyup") {
            this.pressedKeys.delete(intent);
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
        const ui = getRecordUiState(
            p,
            this.state,
            this.maxRecordTime,
            this.recordStartTime,
            this.recordEndTime,
            this.replayStartTime
        );

        const panelW = Math.min(540, p.width - 32);
        const panelH = 92;
        const panelX = Math.floor((p.width - panelW) / 2);
        const panelY = 14;
        const badgeW = 104;
        const progressW = panelW - 32;
        const progressH = 10;
        const progressX = panelX + 16;
        const progressY = panelY + panelH - 18;
        const pulseSize = 16 + ui.pulse * 10;

        p.push();
        p.resetMatrix();
        p.noStroke();
        if (Assets.customFont) {
            p.textFont(Assets.customFont);
        }

        p.fill(ui.frameDark);
        p.rect(panelX - 4, panelY - 4, panelW + 8, panelH + 8);
        p.fill(ui.frameLight);
        p.rect(panelX - 2, panelY - 2, panelW + 4, panelH + 4);
        p.fill(ui.panelShade);
        p.rect(panelX, panelY, panelW, panelH);
        p.fill(ui.panelFill);
        p.rect(panelX + 4, panelY + 4, panelW - 8, panelH - 8);
        p.fill(255, 255, 255, 28);
        p.rect(panelX + 6, panelY + 6, panelW - 12, 10);

        p.fill(ui.frameDark);
        p.rect(panelX + 15, panelY + 15, badgeW + 4, 34);
        p.fill(ui.accentB);
        p.rect(panelX + 17, panelY + 17, badgeW, 30);
        p.fill(ui.accentA);
        p.rect(panelX + 19, panelY + 19, badgeW - 4, 10);

        if(ui.badge === "REC") {
            p.fill(255, 88, 88, 38 + ui.pulse * 45);
            p.circle(panelX + 41, panelY + 32, pulseSize + 8);
            p.fill(255, 88, 88, 26 + ui.pulse * 25);
            p.circle(panelX + 41, panelY + 32, pulseSize);
        }

        p.fill(ui.showBlinkDot ? ui.dotColor : p.color(130, 82, 82));
        p.rect(panelX + 34, panelY + 25, 12, 12);
        if(ui.showBlinkDot) {
            p.fill(255, 220);
            p.rect(panelX + 36, panelY + 27, 4, 4);
        }

        p.fill(ui.textMain);
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(13);
        p.textStyle(p.BOLD);
        p.text(ui.badge, panelX + 48, panelY + 31);

        p.textStyle(p.BOLD);
        p.textSize(20);
        p.text(ui.title, panelX + 138, panelY + 31);

        p.textStyle(p.NORMAL);
        p.fill(ui.textSub);
        p.textSize(12);
        p.text(ui.subtitle, panelX + 138, panelY + 55);

        p.fill(ui.frameDark);
        p.rect(progressX - 2, progressY - 2, progressW + 4, progressH + 4);
        p.fill(70, 55, 36);
        p.rect(progressX, progressY, progressW, progressH);
        p.fill(ui.accentA);
        p.rect(progressX + 2, progressY + 2, Math.max(0, progressW * ui.progress - 4), Math.max(0, progressH - 4));

        p.fill(ui.textSub);
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(12);
        p.text(t("rec_hud_label"), panelX + panelW - 16, panelY + 22);

        p.pop();
    }
    printRecords() {
        const records = this.clip.getRecords();
        for( const record of records) {
            console.log("eventType: " + record["keyType"]);
        }
    }


}
