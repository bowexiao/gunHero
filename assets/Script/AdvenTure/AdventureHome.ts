import Global from "../Global";
import { SCENENAME } from "../mgr/SceneMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdventureHome extends cc.Component {

    onLoad(){
        Global.sceneMgr.adaptScene(this.node);
    }

    onBtnClick(event){
        if(event.target.name == 'beginGame'){
            Global.sceneMgr.loadScene(SCENENAME.ADVENTUREGAME)
        }else if(event.target.name == 'backHome'){
            Global.sceneMgr.loadScene(SCENENAME.MENU)
        }
    }

    // update (dt) {}
}
