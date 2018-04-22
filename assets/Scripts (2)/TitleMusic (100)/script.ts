class TitleMusicBehavior extends Sup.Behavior {  
  awake() {
    soundMgr.stop();
    soundMgr = new Sup.Audio.SoundPlayer("Musics/Title", 0.5);
    soundMgr.play();
  }

  update() {
    
  }
}
let soundMgr = new Sup.Audio.SoundPlayer("Musics/Title", 0.5);
Sup.registerBehavior(TitleMusicBehavior);
