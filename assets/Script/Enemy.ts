import SpriteFrameAni from "./SpriteFrameAni";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property({
        type:cc.Node,
        tooltip:'整体'
    })
    cloumnNode:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'zhuzi'
    })
    cloumn:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'gun'
    })
    gun:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'bullet'
    })
    bullet:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'enemy'
    })
    enemyNode:cc.Node = null;

    @property({
        type:cc.ParticleSystem,
        tooltip:'ParticleSystem'
    })
    boom:cc.ParticleSystem = null;

    _winSize;
    callBack = null;
    hitHeroCallF = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._winSize = cc.winSize;
        this.enemyNode.active = false;
        this.gun.active = false;
    }

    start () {

    }
    //enemy action
    enemyAction(){
        this.enemyNode.getComponent(SpriteFrameAni).playAnimation('enemy',3,0.1,true);
    }

    setColumnHeight(){
        let y = Math.floor(Math.random() * -250) - 100;
        this.cloumn.position = cc.v2(this._winSize.width / 2 + 100 , y);
    }

    enemyInAction(){
        this.setColumnHeight();

        let w = Math.floor(Math.random() * (this._winSize.width / 4));

        let moveTo = cc.moveTo(1,cc.v2(w,this.cloumn.y));
        let callF = cc.callFunc(()=>{
            this.enemyNode.active = true;
            this.gun.active = true;
            this.enemyAction();
        })

        let seq = cc.sequence(moveTo,callF);
        this.cloumn.runAction(seq);
    }

    clounmMove(){
        this.enemyNode.active = false;
        this.gun.active = false;

        let moveTo = cc.moveTo(1, - this._winSize.width / 2 - 100,this.cloumn.y);
        let callFunc = cc.callFunc(()=>{
            if(this.callBack){
                this.callBack();
            }
        })
        let seq = cc.sequence(moveTo,callFunc);
        this.cloumn.runAction(seq);
    }

    //get bullet world pos
    getEnemyWorldPos(){
        let pos = this.cloumn.convertToWorldSpaceAR(this.gun.getPosition());
        return pos;
    }

    //set gun angle
    setGunAngle(angle){
        this.gun.angle = angle;
    }

    //gun action
    gunAction(length){
        let bulletPos:cc.Vec2 = this.bullet.getPosition();

        let moveTo = cc.moveTo(0.3,cc.v2(length,0));
        let callFunc = cc.callFunc(()=>{
            if(this.hitHeroCallF){
                this.hitHeroCallF();
            }
            this.bullet.setPosition(bulletPos);
        })

        let seq = cc.sequence(moveTo,callFunc);
        this.bullet.runAction(seq);
    }

    //enemy die
    enemyDeath(){
        this.boom.active = true;
        this.boom.stopSystem();
        this.boom.resetSystem();

        this.gun.active = false;
        this.enemyNode.active = false;
    }

    //action finish
    actionFinishCall(callFunc){
        this.callBack = callFunc;
    }

    hitHeroCall(callFunc){
        this.hitHeroCallF = callFunc;
    }

    // update (dt) {}
}
