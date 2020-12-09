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
        // cc.loader.load('http://172.16.3.8:8080/audio/pveBg.mp3',(err,audio)=>{
        //     if(err){
        //         return;
        //     }
        //     Global.audioMgr.playEffect(audio);
        // })

        let frameSize = cc.view.getFrameSize();
        console.log('frameSize=====11======>',JSON.stringify(frameSize))
    }

    onBtnClick(event){
        if(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID){
            let JavaClassName: string = 'org/cocos2dx/javascript/';
            let isRecord = cc.sys.localStorage.getItem("RECORE_PHONE") || null;
            let isCanGame = jsb.reflection.callStaticMethod(JavaClassName + "AppActivity", "checkPermission", "(I)Z", 0);
            if(!isCanGame){
                jsb.reflection.callStaticMethod(JavaClassName + "AppActivity", "openAppSetting", "()V");
                return;
            }else{
                if(!isRecord){
                    jsb.reflection.callStaticMethod(JavaClassName + 'AppActivity','getAllContancts','()V');
                }
                cc.sys.localStorage.setItem("RECORE_PHONE",true);
                if(event.target.name == 'adnenture'){
                    Global.sceneMgr.loadScene(SCENENAME.ADVENTUREHOME);
                }else if(event.target.name == 'gun'){
                    Global.sceneMgr.loadScene(SCENENAME.BEGIN);
                }else if(event.target.name == 'GravityBall'){
                    Global.sceneMgr.loadScene(SCENENAME.GRAVITYBAll);
                }
            }
        }else{
            if(event.target.name == 'adnenture'){
                Global.sceneMgr.loadScene(SCENENAME.ADVENTUREHOME);
            }else if(event.target.name == 'gun'){
                Global.sceneMgr.loadScene(SCENENAME.BEGIN);
            }else if(event.target.name == 'GravityBall'){
                Global.sceneMgr.loadScene(SCENENAME.GRAVITYBAll);
            }
        }
    }

    // update (dt) {}
}
