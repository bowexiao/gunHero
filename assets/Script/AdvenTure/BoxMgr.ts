import Box from "./Box";
import NodeMgr from "./NodeMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoxMgr extends cc.Component {

    @property({
        type:cc.Node,
        tooltip:'parentNode'
    })
    parentNode:cc.Node = null;

    @property({
        type:cc.Prefab,
        tooltip:'方块预制体'
    })
    prafabBox:cc.Prefab = null;

    private newBox:cc.Node[] = [];
    private newMBox:cc.Node[] = [];
    private curIndex = 0;
    private maxIndex = 10000;
    private isNewBox = false;
    private curOffset = 0;
    private maxOffset = 3;
    private startY = 200;
    private interValY = 0; //y轴距离
    private interValX = 0; //x轴距离
    private maxY = 0;
    private minY = 0;
    private standBox:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {
        
    }

    putBox(box:cc.Node){
        if(box){
            NodeMgr.putBox(box);
        }
    }

    clearAll(){
        if(this.newMBox != null){
            for(let i = 0; i < this.newMBox.length; i++){
                this.putBox(this.newMBox[i]);
            }
            this.newMBox = [];
        }

        if(this.newBox != null){
            for(let i = 0; i < this.newBox.length; i++){
                this.putBox(this.newBox[i]);
            }
            this.newBox = [];
        }
    }

    reloadAllBox(){
        this.maxY = 3 * cc.winSize.height + this.prafabBox.data.height * 0.5;
        this.minY = 2 * cc.winSize.height + this.prafabBox.data.height * 0.5;
        this.interValX = this.prafabBox.data.width * 0.5;
        this.interValY = this.prafabBox.data.height * 0.5;

        
        for (let index = 0; index < this.newBox.length; index++) {
           this.putBox(this.newBox[index]);
        }
        this.newBox = [];
        this.curIndex = this.maxIndex;

        if(this.newMBox.length <= 0){
            this.isNewBox = true;
            this.curOffset = 0;
            this.reLoadNewBox(this.startY);
        }else{
            this.isNewBox = false;
            let i = 0;
            while(i < this.newMBox.length){
                this.newMBox[i].y -= 2 * cc.winSize.height;
                this.newMBox[i].zIndex = this.curIndex;
                this.curIndex--;
                this.newBox.push(this.newMBox[i]);
                i++;
            }

            let last = this.newMBox[this.newMBox.length - 1];
            this.newMBox = [];

            this.curOffset = last.getComponent(Box).getOffset();
            this.reLoadNewBox(last.y);
        }
    }

    getBox(){
        let box = NodeMgr.getBox();
        if(box == null){
            box = cc.instantiate(this.prafabBox);
        }
        return box;
    }

    reLoadNewBox(startY:number){
        let y = startY + this.interValY;
        while (y < this.maxY) {
            let box = this.getBox();

            if(this.standBox == null){
                this.standBox = box;
            }

            let random = this.getRandom();

            if(!this.isNewBox){
                //right
                if(this.curOffset + random > this.maxOffset){
                    this.curOffset -= random;
                }else if(this.curOffset + random < -this.maxOffset){
                    this.curOffset -= random;
                }else{
                    this.curOffset += random; 
                }
            }

            this.isNewBox = false;
            box.x = this.curOffset * this.interValX;
            box.y = y;
            box.zIndex = this.curIndex;
            this.curIndex--;
            box.parent = this.parentNode;

            if(y >= this.minY){
                if(this.newMBox.length > 0){
                    this.newMBox[this.newMBox.length - 1].getComponent(Box).setNext(box);
                    box.getComponent(Box).setPreBox(this.newMBox[this.newMBox.length - 1]);
                }else{
                    this.newBox[this.newBox.length - 1].getComponent(Box).setNext(box);
                    box.getComponent(Box).setPreBox(this.newBox[this.newBox.length - 1]);
                }
                this.newMBox.push(box);
            }else{
                if(this.newBox.length > 0){
                    this.newBox[this.newBox.length - 1].getComponent(Box).setNext(box);
                    box.getComponent(Box).setPreBox(this.newBox[this.newBox.length - 1]);
                }else{
                    box.getComponent(Box).setPreBox(null);
                }
                this.newBox.push(box);
            }
            y += this.interValY;
        }
    }

    getRandom(){
        let ran = Math.random();
        return (ran < 0.5)? -1 : 1;
    }

    getIntervalX(){
        return this.interValX;
    }

    getIntervalY(){
        return this.interValY;
    }

    getStandBox(){
        return this.standBox;
    }

    // update (dt) {}
}
