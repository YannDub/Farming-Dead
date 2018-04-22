class ControlsSceneBehavior extends Sup.Behavior {
  update() {
    if(Sup.Input.wasKeyJustPressed("SPACE")){
      Sup.loadScene("Scenes/Game");
      soundMgr.stop();
      soundMgr = new Sup.Audio.SoundPlayer("Musics/5Premiere", 0.2, {loop : true});
      soundMgr.play();
    }
  }
}
Sup.registerBehavior(ControlsSceneBehavior);
