class WinScreenBehavior extends Sup.Behavior {
  awake() {
    soundMgr.stop();
    Sup.Audio.playSound("Sounds/Win");
    Sup.setTimeout(2000, () => {
      soundMgr = new Sup.Audio.SoundPlayer("Musics/Title", 0.3, {loop:true});
      soundMgr.play();
    });
  }

  update() {
    
  }
}
Sup.registerBehavior(WinScreenBehavior);
