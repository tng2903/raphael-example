// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PathFollower from "./PathFollower";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SVGPathFollowTest extends cc.Component {

    @property
    duration = 5;
    @property(PathFollower)
    moveObject: PathFollower = null;
    @property
    public isMoveCounterClockwise = true;
    @property
    public startOffset = 0;
    @property recenterAnimation = false;
    @property(cc.Vec2)
    scale: cc.Vec2 = cc.Vec2.ONE;
    @property(cc.Vec2)
    offset: cc.Vec2 = cc.Vec2.ZERO;


    // LIFE-CYCLE CALLBACKS:
    private path:any = null;

    onLoad() {
        let path = this.addComponent('R.path');
        // path.strokeColor = cc.Color.BLACK;
        // path.lineWidth = 8;
        // path.fillColor = 'none';

        // path.scale = cc.v2(4, -4);

        this.path = path;
        // this.path.rect(0, 0, 200, 200, 20);
        this.path.path((<any>_Demo).paths[0]);
        this.moveObject.isMoveCounterClockwise = this.isMoveCounterClockwise;
        this.moveObject.startOffset = this.startOffset;
        this.moveObject.recenterAnimation = this.recenterAnimation;
        this.moveObject.scale = this.scale;
        this.moveObject.offset = this.offset;

        this.moveObject.setPath(this.path, true);
        this.scheduleOnce(this.startMoving, 0.1);
    }

    public startMoving(){
        this.moveObject.startMoving(this.duration);
    }

    public stop(){
        this.moveObject.stop();
    }

    public pause(){
        this.moveObject.setMovingStatus(false);
    }

    public resume(){
        this.moveObject.setMovingStatus(true);
    }

    // update (dt) {}
}
