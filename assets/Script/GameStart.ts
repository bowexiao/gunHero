import Global from "./Global";
import { SCENENAME } from "./mgr/SceneMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property({
        type:cc.Button,
        tooltip:'按钮'
    })
    heroBtn:cc.Button[] = []

    start () {
        // Global.audioMgr.playBGM('sound/pveBg');
        let gunHeroType = parseInt(cc.sys.localStorage.getItem('Hero_Type') || 0);

        for (let index = 0; index < this.heroBtn.length; index++) {
            let hero = this.heroBtn[index];
            hero.interactable = true;            
        }

        this.heroBtn[gunHeroType].interactable = false;
    }

    anZhuoMetherd(){
        Global.sceneMgr.loadScene(SCENENAME.MENU);
        return;
        let JavaClassName: string = 'org/cocos2dx/javascript/';
        jsb.reflection.callStaticMethod(JavaClassName + 'AppActivity','getName','()V');
    }

    onBtnStart(){
        Global.sceneMgr.loadScene(SCENENAME.GAMESCENE);
    }

    onHeroSelect(event,data){
        let heroType = parseInt(data)

        for (let index = 0; index < this.heroBtn.length; index++) {
            let hero = this.heroBtn[index];
            hero.interactable = true;            
        }

        this.heroBtn[heroType].interactable = false;
        Global.audioMgr.playEffect('sound/click');
        cc.sys.localStorage.setItem('Hero_Type',heroType);
    }

    // update (dt) {}
}
