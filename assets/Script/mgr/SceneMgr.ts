import Global from "../Global";

export enum SCENENAME {
    BEGIN ='start',
    GAMESCENE ='gameScene',
    MENU ='Meun',
    ADVENTUREHOME = 'AdventureHome',
    ADVENTUREGAME = 'AdventureGame'
}

export class SceneMgr {
    public loadScene(sceneName){
        let JavaClassName: string = 'org/cocos2dx/javascript/';
        let Origntation = true;
        if(sceneName == SCENENAME.ADVENTUREHOME){
            Origntation = false
        }else if(sceneName == SCENENAME.BEGIN || sceneName == SCENENAME.MENU){
            Origntation = true;
        }
        jsb.reflection.callStaticMethod(JavaClassName + 'AppActivity','changeOrigntationH','(Z)V',Origntation);

        let frameSize = cc.view.getFrameSize();
        let canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas);

        if(Origntation){
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            if(frameSize.height > frameSize.width){
                cc.view.setFrameSize(frameSize.height,frameSize.width);
            }

            canvas.designResolution = cc.size(1334,750);
            frameSize = cc.view.getFrameSize();
        }else{
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            if(frameSize.width > frameSize.height){
                cc.view.setFrameSize(frameSize.height,frameSize.width);
            }

            canvas.designResolution = cc.size(750,1543);
            frameSize = cc.view.getFrameSize();
        }

        cc.director.preloadScene(sceneName,()=>{
            cc.log('SceneName=========>',sceneName)
            Global.audioMgr.stopBgmMusic();
            cc.director.loadScene(sceneName);
        })
    }

    public updateSprite(spritePath:string,node:cc.Node){
        cc.loader.loadRes(spritePath,cc.SpriteFrame,(err,sprite)=>{
            if(err){
                cc.log('sprite is not fond');
                return;
            }
            node.getComponent(cc.Sprite).spriteFrame = sprite;
        })
    }
    
}
