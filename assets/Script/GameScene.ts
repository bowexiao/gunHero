import Global from "./Global";

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

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let randomStyle = Math.floor(Math.random() * 100 % 3);

        Global.sceneMgr.updateSprite('bg/bgImg' + randomStyle,this.bg);

        if(randomStyle == 2){
            this.sun.active = false;
            this.moon.active = true;
        }else{
            this.sun.active = true;
            this.moon.active = false;
            Global.sceneMgr.updateSprite('imgRes/sun' + randomStyle,this.sun);
        }
    }

    // update (dt) {}
}
