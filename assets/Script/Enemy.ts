
const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property({
        type:cc.Node,
        tooltip:'整体'
    })
    cloumnNode:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'zhuzi'
    })
    cloumn:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'gun'
    })
    gun:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'bullet'
    })
    bullet:cc.Node = null;

    @property({
        type:cc.Node,
        tooltip:'enemy'
    })
    enemyNode:cc.Node = null;

    @property({
        type:cc.ParticleSystem,
        tooltip:'ParticleSystem'
    })
    boom:cc.ParticleSystem = null;

    _winSize;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._winSize = cc.winSize;
        this.enemyNode.active = false;
        this.gun.active = false;
    }

    start () {

    }

    // update (dt) {}
}
