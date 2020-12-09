import Global from "../Global";
import { SCENENAME } from "../mgr/SceneMgr";

let DESIGN_WIDTH = 720;
let DESIGN_HEIGHT = 1280;
let BOARD_DEFAULT_WIDTH = 98;

let BOARD_INTERVAL_MIN = 30;
let BOARD_INTERVAL_MAX = 70;
let INTERVAL_HEIGHT = 130;

let BOARD_WIDTH_MIN = [198,150,98,98,98,98,98];     //最小宽度
let BOARD_WIDTH_MAX = [498,450,398,350,350,300,300];//最大宽度

let BOARD_SPEED = [1, 1.5, 2, 2.5, 3, 4, 5];
let BOARD_COLOR = [cc.Color.GREEN, cc.Color.CYAN, cc.Color.YELLOW, cc.Color.ORANGE, cc.Color.MAGENTA, cc.Color.RED, cc.Color.GRAY]

let sound = {
    BG:'sound/GravityBall/background',
    BUZZ:'sound/GravityBall/buzz',
    GET_ITEM:'sound/GravityBall/get_item',
    PASS:'sound/GravityBall/pass',
}

const {ccclass, property} = cc._decorator;
@ccclass
export default class GravityBall extends cc.Component {

    @property({
        type:cc.Node,
        tooltip:'背景'
    })
    BG:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'物理层'
    })
    physicsLayer:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'障碍物层'
    })
    boardLayer:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'分数'
    })
    score:cc.Node = null;

    @property({
        type:cc.Prefab,
        tooltip:'挡板'
    })
    boardPrefab:cc.Prefab = null;

    @property({
        type:cc.Prefab,
        tooltip:'球'
    })
    ballPrefab:cc.Prefab = null;

    allBoardS = [];
    curLevel = 0;
    curColorIndex = 0;
    isGameOver = false;
    curScore = 0;

    ball:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.audioMgr.playBGM(sound.BG);
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags;
        cc.director.getPhysicsManager().gravity = cc.v2(0,-1000);

        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION,this.onDeviceMotion,this);
    }

    onDeviceMotion(event){
        if(this.ball){
            this.ball.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(event.acc.x * 40000,0),true);
        }
    }

    start () {
        let curH = 0;
        while (curH >= (-DESIGN_HEIGHT / 2 - INTERVAL_HEIGHT)) {
            this.creatAlineBoard(curH);
            curH -= INTERVAL_HEIGHT;
        }

        this.createBall();
    }

    private createBall(){
        if(!this.ball){
            this.ball = cc.instantiate(this.ballPrefab);
            this.ball.parent = this.physicsLayer;
        }
        this.ball.setPosition(cc.v2(200,300));
    }

    private creatAlineBoard(posH:number){
        let isNeed = true;
        let boards = [];

        while (isNeed) {
            let randomWidth = Math.random() * (BOARD_WIDTH_MAX[this.curLevel] - BOARD_WIDTH_MIN[this.curLevel]) + BOARD_WIDTH_MIN[this.curLevel];
            let posX = 0;
            if(boards.length == 0){
                let minPosX = -DESIGN_WIDTH / 2 - randomWidth / 2;
                let maxPosx = -DESIGN_WIDTH / 2 + randomWidth / 2;

                posX = Math.random() * (maxPosx - minPosX) + minPosX;
                let board = {};
                board['w'] = randomWidth;
                board['x'] = posX;
                boards.push(board);
                this.createBoard(cc.v2(posX,posH),board['w']);
            }else{
                let lastBoard = boards[boards.length - 1];
                let randonInterval = Math.random() * (BOARD_INTERVAL_MAX - BOARD_INTERVAL_MIN) + BOARD_INTERVAL_MIN;

                posX = lastBoard.w / 2 + randomWidth / 2 + randonInterval + lastBoard.x;
                let rightDis = DESIGN_WIDTH / 2 - posX - randomWidth / 2;
                if((rightDis < BOARD_INTERVAL_MIN) && rightDis > 0){
                    isNeed = true;
                }else{
                    let board = {};
                    board['w'] = randomWidth;
                    board['x'] = posX;
                    boards.push(board);
                    this.createBoard(cc.v2(board['x'],posH),board['w']);
                    if(rightDis > BOARD_INTERVAL_MAX){
                        isNeed = true;
                    }else{
                        isNeed = false;
                    }
                }
            }
        }
    }

    private createBoard(pos:cc.Vec2,width:number){
        let board:cc.Node = cc.instantiate(this.boardPrefab);
        board.parent = this.boardLayer;
        board.position = pos;
        board.width = width;
        board.color = BOARD_COLOR[this.curColorIndex];

        let boxP = board.getComponent(cc.PhysicsPolygonCollider);
        let points = boxP.points;

        for (let index = 0; index < points.length; index++) {
            let pos = points[index];
            if(pos.x > 0){
                board.getComponent(cc.PhysicsPolygonCollider).points[index] = cc.v2(pos.x + (width - BOARD_DEFAULT_WIDTH) / 2,pos.y);
            }else{
                board.getComponent(cc.PhysicsPolygonCollider).points[index] = cc.v2(pos.x - (width - BOARD_DEFAULT_WIDTH) / 2,pos.y);
            }
        }

        boxP.apply();
        this.allBoardS.push(board);
        return board;
    }

    update (dt) {
        if(!this.isGameOver){
            this.boardMove();
            let allCount = this.allBoardS.length;

            if(allCount > 0 && this.allBoardS[this.allBoardS.length - 1]){
                let pos = this.allBoardS[this.allBoardS.length - 1].position;
                if(pos.y >= -DESIGN_HEIGHT / 2){
                    this.creatAlineBoard(pos.y - INTERVAL_HEIGHT);
                    this.curScore ++;
                    this.updateScore();
                    Global.audioMgr.playEffect(sound.GET_ITEM);
                }
            }
        }
    }

    updateScore(){
        this.score.getComponent(cc.Label).string = this.curScore + '';
    }

    boardMove(){
        for (let index = 0; index < this.allBoardS.length; index++) {
            let board:cc.Node = this.allBoardS[index];
            let curPosY = board.y;

            board.position = cc.v2(board.x,curPosY + BOARD_SPEED[this.curLevel]);
            if(board.y > (DESIGN_HEIGHT / 2) + 150){
                this.allBoardS.splice(index,1);
                board.removeFromParent();
            }
        }
    }

    onBtnClick(event){
        if(event.target.name == 'btnMenu'){
            Global.sceneMgr.loadScene(SCENENAME.MENU);
        }
    }


}
