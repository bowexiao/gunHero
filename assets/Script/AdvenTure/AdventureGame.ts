import Global from "../Global";
import { SCENENAME } from "../mgr/SceneMgr";
import Box from "./Box";
import BoxMgr from "./BoxMgr";
import Hero from "./Hero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdventureGame extends cc.Component {

    @property({
        type:cc.Node,
        tooltip:'容器'
    })
    container:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'英雄'
    })
    hero:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'分数'
    })
    score:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'结束'
    })
    gameOver:cc.Node = null;

    isPlaying = false;
    point = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
    }

    init(){
        this.isPlaying = true;
        this.gameOver.active = false;
        this.point = 0;
        this.score.getComponent(cc.Label).string = '0';
        
        let hero = this.hero.getComponent(Hero);
        hero.setAddCallback(()=>{
            this.addPoint();
        })

        hero.setFailedCallback(()=>{
            this.onGameEnd();
        })

        this.reLoadBoxes();
    }

    backToAdvHome(){
        Global.sceneMgr.loadScene(SCENENAME.ADVENTUREHOME);
    }

    onGameEnd(){
        this.isPlaying = false;
        this.gameOver.active = true;
    }

    addPoint(){
        this.point++;
        this.score.getComponent(cc.Label).string = this.point + '';
    }

    private touchStart(event){
        //停止当前事件的传递
        event.stopPropagation();
        if(!this.isPlaying){
            return;
        }
        let isJump = this.hero.getComponent(Hero).getIsJump();
        if(isJump){
            return;
        }

        this.bgDonw();

        let location = event.getLocation();

        if(location.x < cc.winSize.width / 2){
            this.heroJumpLeft();
        }else{
            this.heroJumpRight();
        }
    }

    heroJumpLeft(){
        this.hero.getComponent(Hero).turnLeft();
        this.hero.getComponent(Hero).jump();
    }

    heroJumpRight(){
        this.hero.getComponent(Hero).turnRight();
        this.hero.getComponent(Hero).jump();
    }

    //背景下拉
    bgDonw(){
        let maxY = -cc.winSize.height / 2 - 2 * cc.winSize.height;
        let interval = this.node.getComponent(BoxMgr).getIntervalY();

        if(this.container.y - interval <= maxY){
            this.container.y += 2 * cc.winSize.height;
            this.reLoadBoxes();
        }

        let moveBy = cc.moveBy(0.2,0,-interval);
        let callF = cc.callFunc(()=>{
            this.container.stopAllActions();
        })

        let seq = cc.sequence(moveBy,callF);

        this.container.runAction(seq);
    }

    reLoadBoxes(){
        let boxMgr = this.getComponent(BoxMgr);
        boxMgr.reloadAllBox();

        let hero = this.hero.getComponent(Hero);
        if( hero.getCurNode()==null ){
            let standBox = boxMgr.getStandBox();
            let nextBox = standBox.getComponent(Box).getNetBox();

            hero.setCurNode(standBox);
            hero.setNext(nextBox);

            if(nextBox.x > standBox.x){
                hero.turnRight();
            }else{
                hero.turnLeft();
            }
        }else{
            hero.setCurNode(hero.getCurNode());
        }
    }

    // update (dt) {}
}
