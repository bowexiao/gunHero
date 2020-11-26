import Global from "./Global";
import { SCENENAME } from "./mgr/SceneMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property({
        type:cc.Node,
        tooltip:'背景'
    })
    bg:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'太阳'
    })
    sun:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'月亮'
    })
    moon:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'父节点'
    })
    floor_parent:cc.Node = null;

    
    winSizeW:number = 0
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //随机风格
        let randomStyle = Math.floor(Math.random() * 100 % 3);
        this.winSizeW = cc.winSize.width / 2;
        Global.sceneMgr.updateSprite('bg/bgImg' + randomStyle,this.bg);

        if(randomStyle == 2){
            this.sun.active = false;
            this.moon.active = true;
        }else{
            this.sun.active = true;
            this.moon.active = false;
            Global.sceneMgr.updateSprite('imgRes/sun' + randomStyle,this.sun);
        }

        this.cloudAction(randomStyle);
    }
    //云的行为
    private cloudAction(randomStyle){
        let curWidth = -this.winSizeW / 2;

        while (curWidth < this.winSizeW / 2) {
            let t = Math.floor(Math.random() * 100) % 3;
            let h = Math.random() * (cc.winSize.height * 1 / 6) + cc.winSize.height * 2 /8;
            curWidth = curWidth + Math.random() * 150 + 150;

            let cloudNode:cc.Node = new cc.Node();
            let cloudSp = cloudNode.addComponent(cc.Sprite);
            cloudNode.parent = this.floor_parent;

            cloudNode.position = cc.v2(curWidth,h);
            Global.sceneMgr.updateSprite('imgRes/yun' + randomStyle + '_' + t,cloudNode);

            let moveBy = cc.moveBy(1,cc.v2(-20,0));
            let callF = cc.callFunc(()=>{
                if(cloudNode.x < -this.winSizeW / 2 - 100){
                    cloudNode.position = cc.v2(this.winSizeW / 2 + 100,cloudNode.y);
                }
            })

            let seq = cc.sequence(moveBy,callF).repeatForever();

            cloudNode.runAction(seq);
        }


    }

    onBtnBack(){
        Global.sceneMgr.loadScene(SCENENAME.BEGIN);
    }

    // update (dt) {}
}
