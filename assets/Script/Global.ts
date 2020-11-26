import { AudioMgr } from "./mgr/audioMgr";
import { SceneMgr } from "./mgr/SceneMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Global extends cc.Component {
    static sceneMgr:SceneMgr = null;
    static audioMgr:AudioMgr = null;

    onLoad () {
        Global.sceneMgr = new SceneMgr();
        Global.audioMgr = new AudioMgr();
    }

    start () {
        cc.game.addPersistRootNode(this.node);
    }

    // update (dt) {}
}
