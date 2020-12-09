import Global from "../Global";

export enum SCENENAME {
    BEGIN ='start',
    GAMESCENE ='gameScene',
    MENU ='Meun',
    ADVENTUREHOME = 'AdventureHome',
    ADVENTUREGAME = 'AdventureGame',
    GRAVITYBAll = 'GravityBall'
}

export class SceneMgr {

    private Origntation = false;

    public loadScene(sceneName){
        let JavaClassName: string = 'org/cocos2dx/javascript/';
        
        if(sceneName == SCENENAME.ADVENTUREHOME || sceneName == SCENENAME.GRAVITYBAll){
            this.Origntation = false
        }else if(sceneName == SCENENAME.BEGIN || sceneName == SCENENAME.MENU){
            this.Origntation = true;
        }

        if(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(JavaClassName + 'AppActivity','changeOrigntationH','(Z)V',this.Origntation);
        }
        let frameSize = cc.view.getFrameSize();
        let canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas);

        console.log('frameSize=====22======>',JSON.stringify(frameSize))
        if(this.Origntation){
            console.log('this.Origntation=====>',this.Origntation)
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            if(frameSize.height > frameSize.width){
                cc.view.setFrameSize(frameSize.height,frameSize.width);
            }

            canvas.designResolution = cc.size(1136,640);
            frameSize = cc.view.getFrameSize();
        }else{
            console.log('this.Origntation=====>',this.Origntation)
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            if(frameSize.width > frameSize.height){
                cc.view.setFrameSize(frameSize.height,frameSize.width);
            }

            canvas.designResolution = cc.size(640,1136);
            frameSize = cc.view.getFrameSize();
        }
        this.adaptScene(canvas.node);
            
        cc.director.preloadScene(sceneName,()=>{
            cc.log('SceneName=========>',sceneName)
            console.log('SceneName=========>',sceneName)
            Global.audioMgr.stopBgmMusic();
            
            cc.director.loadScene(sceneName);
        })
    }

    private adaptScene(node:cc.Node){
        let visibleSize = cc.view.getVisibleSize();
        let canvas = node.getComponent(cc.Canvas);

        let size = cc.view.getFrameSize();
        if(this.Origntation){
            canvas.fitHeight = false;
            canvas.fitWidth = true;
        }else{
            canvas.fitHeight = true;
            canvas.fitWidth = true;
        }
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
