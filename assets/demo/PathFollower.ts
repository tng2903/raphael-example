// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Path = require("../raphael/R.path");
const { ccclass, property } = cc._decorator;

@ccclass
export default class PathFollower extends cc.Component {

    @property(cc.Vec2)
    public scale: cc.Vec2 = cc.Vec2.ONE;
    @property(cc.Vec2)
    public offset: cc.Vec2 = cc.Vec2.ZERO;
    @property(cc.Node)
    public targetNode: cc.Node = null;
    @property
    public isMoveCounterClockwise = true;
    @property
    public startOffset = 0;
    @property recenterAnimation = false;


    private path: any = null;
    private totalLength = 0;
    private elapsedTime = 0;
    private moveDuration = 0;
    private isMoving = false;

    public onCompleteCallback: any = null;

    onLoad() {
        if (this.targetNode == null) {
            this.targetNode = this.node;
        }
    }

    public setMovingStatus(value = true) {
        this.isMoving = value;
    }

    public setPath(path: any, recenter = false) {
        this.path = path;
        this.path.shouldRender = false;
        this.recenterAnimation = recenter;
        this.path.makePath();
        this.totalLength = this.path.getTotalLength();
    }

    public startMoving(moveDuration: number, startAtPercentage = 0) {
        this.moveDuration = moveDuration;
        this.elapsedTime = startAtPercentage * moveDuration;
        this.isMoving = true;
    }

    public stop() {
        this.elapsedTime = 0;
        this.isMoving = false;
    }

    public setActiveMoveObject(isActive = true) {
        if (this.targetNode) {
            this.targetNode.active = isActive;
            if (isActive) {
                this.targetNode.stopAllActions();
                this.targetNode.angle = 0;
                this.targetNode.runAction(cc.repeatForever(cc.sequence(
                    cc.rotateBy(0.5, 15),
                    cc.rotateBy(0.5, -15)
                )));
            }
        }
    }

    public moveToPercentage(percent: number) {
        percent = this.isMoveCounterClockwise ? percent : 1 - percent;
        percent = percent + this.startOffset;
        if (percent > 1) percent = percent - 1;
        let point = this.path.getPointAtLengthRelative(percent).scale(this.scale).add(this.offset);
        if (this.recenterAnimation && (this.targetNode != this.node)) {
            point = point.add(this.node.position);
        }
        // cc.log(point);
        this.targetNode.position = point;
    }

    update(dt: number) {
        if (this.isMoving) {
            this.elapsedTime += dt;
            let percent = this.elapsedTime / this.moveDuration;

            if (percent >= 1) {
                this.isMoving = false;
                if (this.onCompleteCallback != null) {
                    this.onCompleteCallback();
                }
                return;
            }
            this.moveToPercentage(percent);
            // percent = this.isMoveCounterClockwise ? percent : 1 - percent;
            // percent = percent + this.startOffset;
            // if (percent > 1) percent = percent - 1;
            // let point = this.path.getPointAtLengthRelative(percent).scale(this.scale).add(this.offset);
            // if (this.recenterAnimation && (this.targetNode != this.node)) {
            //     point = point.add(this.node.position);
            // }
            // // cc.log(point);
            // this.targetNode.position = point;
        }
    }
}
