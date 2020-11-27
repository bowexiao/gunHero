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

    @property({
        type:cc.Node,
        tooltip:'远房子0'
    })
    far_House0:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'远房子1'
    })
    far_House1:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'jin房子0'
    })
    near_House0:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'jin房子1'
    })
    near_House1:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'远地板0'
    })
    far_Floor0:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'远地板1'
    })
    far_Floor1:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'远路0'
    })
    far_Way0:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'远路1'
    })
    far_Way1:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'分数'
    })
    score:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'英雄'
    })
    heroNode:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'射线'
    })
    shootLine:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'子弹'
    })
    myBullet:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'英雄'
    })
    myHero:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'枪'
    })
    myGun:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'特效'
    })
    shieldImg:cc.Node = null;

    @property({
        type:cc.ProgressBar,
        tooltip:'血条'
    })
    bloodBar:cc.ProgressBar = null;

    @property({
        type:cc.ParticleSystem,
        tooltip:'血条'
    })
    heroDieParticle:cc.ParticleSystem  = null;

    @property({
        type:cc.Node,
        tooltip:'结束面板'
    })
    Panel_end:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'最高分数'
    })
    bestScore:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'本局分数'
    })
    curScore:cc.Node = null;

    @property({
        type:cc.Prefab,
        tooltip:'子弹预制体'
    })
    myBullerPrefab:cc.Prefab[] = [];

    @property({
        type:cc.Prefab,
        tooltip:'敌人'
    })
    enemyPrefab:cc.Prefab = null;


    roalScore = 0;
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

        Global.sceneMgr.updateSprite('imgRes/house' + randomStyle,this.far_House0);
        Global.sceneMgr.updateSprite('imgRes/house' + randomStyle,this.far_House1);

        Global.sceneMgr.updateSprite('imgRes/houshSmall' + randomStyle,this.near_House0);
        Global.sceneMgr.updateSprite('imgRes/houshSmall' + randomStyle,this.near_House1);

        Global.sceneMgr.updateSprite('imgRes/floor' + randomStyle,this.far_Floor0);
        Global.sceneMgr.updateSprite('imgRes/floor' + randomStyle,this.far_Floor1);

        Global.sceneMgr.updateSprite('imgRes/gameFloor' + randomStyle,this.far_Way0);
        Global.sceneMgr.updateSprite('imgRes/gameFloor' + randomStyle,this.far_Way1);

        this.score.getComponent(cc.Label).string = '分数:' + this.roalScore;

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
