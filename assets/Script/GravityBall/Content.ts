
const {ccclass, property} = cc._decorator;

@ccclass
export default class Content extends cc.Component {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBeginContact(contact,selfCollider,otherCollider){
        if(selfCollider.tag == 0 && otherCollider.tag == 1){
            cc.log('onBeginContact')
        }
    }

    // update (dt) {}
}
