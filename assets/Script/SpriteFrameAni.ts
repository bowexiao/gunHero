
const {ccclass, property} = cc._decorator;

@ccclass
export default class SpriteFrameAni extends cc.Component {
    @property({
        type:cc.SpriteAtlas,
        tooltip:'SpriteAtlas'
    })
    spriteAtlas:cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    playAnimation(aniName:string,count:number,dt:number,isLoop:boolean){
        this.stopAnimation();
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(aniName + 0);
        let array = [];

        for (let index = 0; index < count; index++) {
            array.push(cc.delayTime(dt));
            array.push(cc.callFunc(()=>{
                this.node.getComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame(aniName + index);
            }))
        }
        let seq = cc.sequence(array);
        if(isLoop){
            this.node.runAction(seq.repeatForever());
        }else{
            this.node.runAction(seq);
        }
    }

    stopAnimation(){
        this.node.stopAllActions();
    }

    // update (dt) {}
}
