class GameOverScreenBehavior extends Sup.Behavior {
  awake() {
    soundMgr.stop();
    soundMgr = new Sup.Audio.SoundPlayer("Sounds/GameOver", 0.5, {loop: true});
    soundMgr.play();
    Sup.setTimeout(2000, () => {
      soundMgr.stop();
      soundMgr = new Sup.Audio.SoundPlayer("Musics/GameOverScreen", 0.2, {loop:true});
      soundMgr.play();
    });
  }

  update() {
    
  }
}
Sup.registerBehavior(GameOverScreenBehavior);
