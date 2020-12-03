
const {ccclass, property} = cc._decorator;

@ccclass
export default class NodeMgr  {
    private static boxNodePool:cc.NodePool = null;

    public static putBox(box:cc.Node){
        if(this.boxNodePool == null){
            this.boxNodePool = new cc.NodePool('box');
        }

        if(box){
            this.boxNodePool.put(box);
        }
    }

    public static getBox(){
        if(this.boxNodePool != null && this.boxNodePool.size() > 0){
            let box = this.boxNodePool.get();
            box.stopAllActions();
            return box;
        }else{
            return null;
        }
    }
}
