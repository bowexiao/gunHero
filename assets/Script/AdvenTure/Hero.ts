import Global from "../Global";
import Box from "./Box";

const {ccclass, property} = cc._decorator;

enum HEROFACE{
    left,
    right
}

@ccclass
export default class Hero extends cc.Component {

    // LIFE-CYCLE CALLBACKS:


    private preNode:cc.Node = null;
    private curNode:cc.Node = null;
    private nextNode:cc.Node = null;
    private offset:cc.Vec2 = cc.v2(11,120);
    private heroFace:number = -1;
    private addCallBack:any = null;
    private failedCallVack:any = null;
    private isJump:boolean = false;

    // onLoad () {}

    start () {
        this.node.zIndex = 20000;
    }

    getCurNode(){
        return this.curNode;
    }

    setCurNode(curNode:cc.Node){
        this.curNode = curNode;
        this.node.position = this.curNode.position.add(this.offset);
    }

    setNext(next:cc.Node){
        this.nextNode = next;
    }

    turnLeft(){
        this.heroFace = HEROFACE.left;
        Global.sceneMgr.updateSprite('adventure/robot_left',this.node);
    }

    turnRight(){
        this.heroFace = HEROFACE.right;
        Global.sceneMgr.updateSprite('adventure/robot_right',this.node);
    }

    setAddCallback(callBack:Function){
        this.addCallBack = callBack;
    }

    setFailedCallback(callBack:Function){
        this.failedCallVack = callBack;
    }

    jump(){
        if(this.nextNode == null){
            return;
        }

        this.isJump = true;
        let curPos:cc.Vec2 = this.node.getPosition();
        let nextPos:cc.Vec2 = this.nextNode.getPosition();
        nextPos = nextPos.add(this.offset);

        if((this.heroFace == HEROFACE.left && nextPos.x < curPos.x) || (this.heroFace == HEROFACE.right && nextPos.x > curPos.x)){
            let jumpTo = cc.jumpTo(0.2,nextPos,30,1);
            let callF_1 = cc.callFunc(()=>{
                this.preNode = this.curNode;
                this.curNode = this.nextNode;
                this.nextNode = this.curNode.getComponent(Box).getNetBox();
                this.isJump = false;
            });

            let callF_2 = cc.callFunc(()=>{
                if(this.preNode){
                    this.preNode.getComponent(Box).down(-(this.getDownY(this.preNode)));
                    this.preNode = null;
                }

                if(this.addCallBack){
                    this.addCallBack();
                }
            })

            let seq = cc.sequence(jumpTo,callF_1,callF_2);

            this.node.runAction(seq);
        }else{
            let targetPos = curPos;
            if(nextPos.x > curPos.x){
                targetPos.x -= 130;
            }else{
                targetPos.x += 130;
            }

            targetPos.y += 65;

            let jumpTo = cc.jumpTo(0.2,targetPos,30,1);
            let callFun = cc.callFunc(()=>{
                this.isJump = false;

                if(this.preNode){
                    this.preNode.getComponent(Box).down(-(this.getDownY(this.preNode)));
                    this.preNode = null;
                };

                let moveBy = cc.moveBy(0.5,0,-this.getDownY(this.node));
                let callF = cc.callFunc(()=>{
                    if(this.failedCallVack){
                        this.failedCallVack();
                    }
                })

                let seq = cc.sequence(moveBy,callF);
                this.node.runAction(seq);
            })

            let seq = cc.sequence(jumpTo,callFun);
            this.node.runAction(seq);
        }
    }

    getDownY(node:cc.Node){
        let pos = node.parent.convertToWorldSpaceAR(node.position);
        let y = pos.y + node.height;

        return y;
    }

    getIsJump(){
        return this.isJump;
    }

    // update (dt) {}
}
