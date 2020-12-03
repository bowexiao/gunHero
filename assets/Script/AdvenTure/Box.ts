import NodeMgr from "./NodeMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Box extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    private preBox:cc.Node = null;
    private nextBox:cc.Node = null;
    private offset:number = 0;
    // onLoad () {}

    start () {

    }

    setOffset(offset:number){
        this.offset = offset;
    }

    getOffset(){
        return this.offset;
    }

    setPreBox(preBox:cc.Node){
        this.preBox = preBox;
    }

    getPreBox(){
        return this.preBox;
    }

    setNext(next:cc.Node){
        this.nextBox = next;
    }

    getNetBox(){
        return this.nextBox;
    }

    down(y:number){
        let moveBy = cc.moveBy(0.4,0,y);
        let callF = cc.callFunc(()=>{
            NodeMgr.putBox(this.node);
        })
        let seq = cc.sequence(moveBy,callF)
        this.node.runAction(seq);
    }



    // update (dt) {}
}
