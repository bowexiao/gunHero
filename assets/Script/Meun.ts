import Global from "./Global";
import { SCENENAME } from "./mgr/SceneMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Meun extends cc.Component {

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // Global.sceneMgr.adaptScene(this.node);
    }

    start () {

    }

    onBtnClick(event){
        if(event.target.name == 'adnenture'){
            Global.sceneMgr.loadScene(SCENENAME.ADVENTUREHOME);
        }else if(event.target.name == 'gun'){
            Global.sceneMgr.loadScene(SCENENAME.BEGIN);
        }
    }

    // update (dt) {}
}
