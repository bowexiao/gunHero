import Contact, { GROUP } from "./Contact";
import Enemy from "./Enemy";
import Global from "./Global";
import { SCENENAME } from "./mgr/SceneMgr";
import SpriteFrameAni from "./SpriteFrameAni";

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
    enemyNode:cc.Node = null;
    _canContent = true;
    _canshooting = true;
    _heroBloodNum = 100;
    _heroType = null;
    _curAngle = 0;
    _gunSchedule = null;
    _bulletNode:cc.Node = null;
    _bulletFun = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0,-640);
    }

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

        this.far_Way0.zIndex = 100;
        this.far_Way1.zIndex = 101;

        this.score.getComponent(cc.Label).string = '分数:' + this.roalScore;

        this.cloudAction(randomStyle);

        this.creatEnemyNode();
        this._heroType = parseInt(cc.sys.localStorage.getItem('Hero_Type'));
        this.myHeroAction(false);

        this.shieldImg.getComponent(SpriteFrameAni).playAnimation("shield", 4, 0.1, true);

        this.addTouchEvent();
    }

    //add touch event
    private addTouchEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }

    private onTouchCancel(){
        this.onTouchEnd();
    }

    private onTouchEnd(){
        if(!this._canshooting){
            return;
        }
        Global.audioMgr.playEffect('sound/heroBullet');
        this._canshooting = false;
        this.stopGunAngle();
        this.setBulletTexture();

        let x= 5000;
        if(this._heroType == 1){
            x = 7000;
        }

        let y = x * Math.tan(Math.abs(this._curAngle) * (Math.PI / 180));
        this._bulletNode.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(x,y),true);

        let curPos:cc.Vec2 = this._bulletNode.position;
        let lastPos:cc.Vec2 = curPos;

        this._bulletFun = ()=>{
            curPos = this._bulletNode.position;

            let LenX = curPos.x - lastPos.x;
            let LenY = 0;
            let r = 0;
            //move up
            if(curPos.y < lastPos.y){
                LenY = curPos.y - lastPos.y;
                r = Math.atan2(LenY,LenX) * 180 / Math.PI;
            }else{ //move down
                LenY = lastPos.y - curPos.y;
                r = -1 * Math.atan2(LenY,LenX) * 180 / Math.PI;
            }

            lastPos = curPos;
            this._bulletNode.angle = r;
        }
        this.schedule(this._bulletFun,0.1);
    }

    //set bullet
    private setBulletTexture(){
        this._bulletNode = cc.instantiate(this.myBullerPrefab[this._heroType]);
        this._bulletNode.parent = this.myGun;
        this._bulletNode.position = this.myBullet.getPosition();

        this._bulletNode.getComponent(Contact).setCallCack((selfCollider,otherCollider)=>{
            if(!this._canContent){
                return;
            }
            this._canContent = false;
            Global.audioMgr.playEffect('sound/openFire');

            this.unschedule(this._bulletFun);

            let bodyGroup0 = selfCollider.node.group;
            let bodyGroup1 = otherCollider.node.group;

            //hit on the floor
            if((bodyGroup0 == GROUP.HEROBULLET && bodyGroup1 == GROUP.FLOOR)
            ||(bodyGroup0 == GROUP.FLOOR && bodyGroup1 == GROUP.HEROBULLET)){
                this.scheduleOnce(()=>{
                    this._bulletNode.destroy();
                    this._bulletNode = null;
                    this.enemyBeginFire();
                },0.5);
            }

            //hit on the colum
            if((bodyGroup0 == GROUP.HEROBULLET && bodyGroup1 == GROUP.COLUMN)
            ||(bodyGroup0 == GROUP.COLUMN && bodyGroup1 == GROUP.HEROBULLET)){
                this._bulletNode.destroy();
                this._bulletNode = null;
                this.enemyBeginFire();
            }

            //hit on the enemy
            if((bodyGroup0 == GROUP.HEROBULLET && bodyGroup1 == GROUP.ENEMY)
            ||(bodyGroup0 == GROUP.ENEMY && bodyGroup1 == GROUP.HEROBULLET)){
                
                this._bulletNode.destroy();
                this._bulletNode = null;
                
                cc.log('-----------------------')

                this.upDateScore();
                this.myHeroAction(true);
                this.gameBGAction();
                this.enemyNode.getComponent(Enemy).clounmMove();
            }

            this._curAngle = 0;
            this.myGun.angle = 0;
        })
    }

    private gameBGAction(){
        let fhW = this.far_House0.width;
        let moveBy = cc.moveBy(2,cc.v2(-200,0));
        let deTime = cc.delayTime(0.1);
        let callFunc = cc.callFunc(()=>{
            if(this.far_House0.x <= -fhW - cc.winSize.width / 2){
                this.far_House0.position = cc.v2(this.far_House1.getPosition());
            }
        })

        let seq = cc.sequence(moveBy,deTime,callFunc);
        this.far_House0.runAction(seq);


        let moveBy_1 = cc.moveBy(2,cc.v2(-200,0));
        let deTime_1 = cc.delayTime(0.1);
        let callFunc_1 = cc.callFunc(()=>{
            if(this.far_House1.x <= -fhW - cc.winSize.width / 2){
                this.far_House1.position = cc.v2(this.far_House0.getPosition());
            }
        })
        let seq_1 = cc.sequence(moveBy_1,deTime_1,callFunc_1);
        this.far_House1.runAction(seq_1);

        let nhW = this.near_House0.width;
        let moveBy_2 = cc.moveBy(2,cc.v2(-300,0));
        let deTime_2 = cc.delayTime(0.1);
        let callFunc_2 = cc.callFunc(()=>{
            if(this.near_House0.x <= -nhW - cc.winSize.width / 2){
                this.near_House0.position = cc.v2(this.near_House1.getPosition());
            }
        })
        let seq_2 = cc.sequence(moveBy_2,deTime_2,callFunc_2);
        this.near_House0.runAction(seq_2);

        let moveBy_3 = cc.moveBy(2,cc.v2(-300,0));
        let deTime_3 = cc.delayTime(0.1);
        let callFunc_3 = cc.callFunc(()=>{
            if(this.near_House1.x <= -nhW - cc.winSize.width / 2){
                this.near_House1.position = cc.v2(this.near_House0.getPosition());
            }
        })
        let seq_3 = cc.sequence(moveBy_3,deTime_3,callFunc_3);
        this.near_House1.runAction(seq_3);

        let ffW = this.far_Way0.width;
        let moveBy_4 = cc.moveBy(2,cc.v2(-400,0));
        let deTime_4 = cc.delayTime(0.1);
        let callFunc_4 = cc.callFunc(()=>{
            if(this.far_Way0.x <= -ffW - cc.winSize.width / 2){
                this.far_Way0.position = cc.v2(this.far_Way1.getPosition());
            }
        })
        let seq_4 = cc.sequence(moveBy_4,deTime_4,callFunc_4);
        this.far_Way0.runAction(seq_4);

        let moveBy_5 = cc.moveBy(2,cc.v2(-400,0));
        let deTime_5 = cc.delayTime(0.1);
        let callFunc_5 = cc.callFunc(()=>{
            if(this.far_Way1.x <= -ffW - cc.winSize.width / 2){
                this.far_Way1.position = cc.v2(this.far_Way0.getPosition());
            }
        })
        let seq_5 = cc.sequence(moveBy_5,deTime_5,callFunc_5);
        this.far_Way1.runAction(seq_5);

        let nfW = this.far_Way0.width;
        for (let index = 0; index < 100; index++) {
            let deTime = cc.delayTime(0.02 * index);
            let callFunc = cc.callFunc(()=>{
                if(index % 9 == 0){
                    Global.audioMgr.playEffect('sound/walk');
                }

                let px1 = this.far_Way0.x;
                this.far_Way0.position = cc.v2(px1,this.far_Way0.y);

                let px2 = this.far_Way1.x;
                this.far_Way1.position = cc.v2(px2,this.far_Way1.y);

                if(px1 <= - nfW - cc.winSize.width / 2){
                    this.far_Way0.position = cc.v2(this.far_Way1.x + nfW,this.far_Way1.y);
                }

                if(px2 <= -nfW - cc.winSize.width/2){
                    this.far_Way1.position = cc.v2(this.far_Way0.x + nfW,this.far_Way0.y);
                }
            });

            let seq = cc.sequence(deTime,callFunc);
            this.far_Way0.runAction(seq);
        }
        this.far_Way0.zIndex = 100;
        this.far_Way1.zIndex = 101;
    }
    
    private upDateScore(){
        this.roalScore ++;
        this.score.getComponent(cc.Label).string = '分数:' + this.roalScore;
        Global.audioMgr.playEffect('sound/addScore');
    }

    //enemy fire
    private enemyBeginFire(){
        let enemyBulletPosition = this.enemyNode.getComponent(Enemy).getEnemyWorldPos();
        let myHeroPos = this.myHero.parent.convertToWorldSpaceAR(this.myHero.getPosition());

        let lenX = Math.abs(enemyBulletPosition.x - myHeroPos.x);
        let LenY = Math.abs(enemyBulletPosition.y - myHeroPos.y);

        let angle = Math.atan2(LenY , lenX) * 180 /Math.PI;
        this.enemyNode.getComponent(Enemy).setGunAngle(angle);

        //fire distence
        let length = Math.sqrt(Math.pow(lenX,2) + Math.pow(LenY,2));
        this.enemyNode.getComponent(Enemy).gunAction(length);
        Global.audioMgr.playEffect('sound/enemyBullet');
    }

    private stopGunAngle(){
        this.unschedule(this._gunSchedule);
        this.shootLine.active = false;
    }

    private onTouchStart(){
        if(!this._canshooting){
            return;
        }

        this.changeGunAngle();
    }

    //改变角度
    private changeGunAngle(){
        this.shootLine.active = true;
        this._gunSchedule = ()=>{
            if(this._curAngle < 90){
                this._curAngle ++;
                this.myGun.angle = this._curAngle;
            }
        }

        this.schedule(this._gunSchedule,0.03);
    }

    //myHero action
    private myHeroAction(isRun){
        if(isRun){
            this.myHero.getComponent(SpriteFrameAni).playAnimation('heroRun' + this._heroType + '_',5,0.6,true);
        }else{
            this.myHero.getComponent(SpriteFrameAni).playAnimation('heroWait' + this._heroType + '_',3,0.1,true);
        }
    }


    //云的行为
    private cloudAction(randomStyle){
        let curWidth = -this.winSizeW / 2;

        while (curWidth < this.winSizeW / 2) {
            let t = Math.floor(Math.random() * 100) % 3;
            let h = Math.random() * (cc.winSize.height * 1 / 6) + cc.winSize.height * 2 /8;
            curWidth = curWidth + Math.random() * 150 + 150;

            let cloudNode:cc.Node = new cc.Node();
            cloudNode.addComponent(cc.Sprite);
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

    private creatEnemyNode(){
        this.enemyNode = cc.instantiate(this.enemyPrefab);
        this.enemyNode.active = true;
        this.enemyNode.position = cc.v2(0,-110);
        this.enemyNode.parent = this.floor_parent;
        this.enemyNode.getComponent(Enemy).enemyInAction();

        this.enemyNode.getComponent(Enemy).actionFinishCall(()=>{
            this._canContent = true;
            this._canshooting = true;
            this.enemyNode.destroy();
            this.enemyNode = null;
            this.creatEnemyNode();
        });

        this.enemyNode.getComponent(Enemy).hitHeroCall(()=>{
            this._heroBloodNum = this._heroBloodNum - 25;

            if(this._heroBloodNum <= 0){
                Global.audioMgr.playEffect('sound/heroDie');
                this._heroBloodNum = 0;
                this.myHeroDie();
                this.gameOver();
            }else{
                Global.audioMgr.playEffect('sound/enemyDie');
                this.setBloodValue();
                this.myGun.angle = 0;
                this._canContent = true;
                this._canshooting = true;
            }
        });
    }

    private setBloodValue(){
        let p = this._heroBloodNum / 100;
        this.shieldImg.opacity = Math.floor(p * 255);

        this.bloodBar.progress = p;
    }

    private gameOver(){
        this.Panel_end.active = true;
        let bestScore = parseInt(cc.sys.localStorage.getItem('GUN_BEST_SCORE') || 0);
        if(this.roalScore > bestScore){
            this.bestScore.getComponent(cc.Label).string = this.roalScore + '';
            cc.sys.localStorage.setItem('GUN_BEST_SCORE',this.roalScore);
        }else{
            this.bestScore.getComponent(cc.Label).string = bestScore + '';
        }
        this.curScore.getComponent(cc.Label).string = this.roalScore + '';
    }

    private myHeroDie(){
        this.heroDieParticle.node.active = true;
        this.heroDieParticle.stopSystem();
        this.heroDieParticle.resetSystem();
        this.heroNode.active = false;
    }

    onBtnBack(){
        Global.sceneMgr.loadScene(SCENENAME.BEGIN);
    }

    // update (dt) {}
}
