
export class AudioMgr {
    private bgmMusicID:number = -1;

    public playEffect(audioPath:string,callFunc:Function = null){
        cc.loader.loadRes(audioPath,cc.AudioClip,(err,audioClicp)=>{
            if(err){
                cc.log(audioPath + 'audio is can not find');
            }

            let audioId = cc.audioEngine.playEffect(audioClicp,false);

            if(callFunc){
                cc.audioEngine.setFinishCallback(audioId,callFunc);
            }
        })
    }

    public playBGM(audioPath:string){
        cc.loader.loadRes(audioPath,cc.AudioClip,(err,audioClicp)=>{
            if(err){
                cc.log(audioPath + 'audio is can not find');
            }
            this.bgmMusicID = cc.audioEngine.playMusic(audioClicp,true);
        })
    }
    

    public stopBgmMusic(){
        if(this.bgmMusicID == -1){
            return;
        }
        cc.audioEngine.stop(this.bgmMusicID);
        this.bgmMusicID = -1;
    }
}
