const {ccclass, property} = cc._decorator;

export enum GROUP{
    FLOOR = 'floor',
    COLUMN = 'column',
    ENEMY = 'enemy',
    ENEMYBULLET = 'enemyBullet',
    HERO = 'hero',
    HEROBULLET = 'heroBullet',
}

@ccclass
export default class Contact extends cc.Component {

    callBack = null;

    onBeginContact(contact,selfCollider,otherCollider){
        if(selfCollider.tag == 0 && otherCollider.tag == 0){
            this.contactEvent(selfCollider,otherCollider);
        }
    }

    private contactEvent(selfCollider,otherCollider){
        if(this.callBack){
            this.callBack(selfCollider,otherCollider);
        }
    }

    setCallCack(callFunc){
        this.callBack = callFunc;
    }

    // update (dt) {}
}
