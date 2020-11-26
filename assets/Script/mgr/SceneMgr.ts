import Global from "../Global";

export class SceneMgr {
    public loadScene(sceneName){
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
