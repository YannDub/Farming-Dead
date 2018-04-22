class RestartBehavior extends Sup.Behavior {
  update() {
    if(Sup.Input.wasKeyJustPressed("SPACE"))
      Sup.loadScene("Scenes/MainMenu");
  }
}
Sup.registerBehavior(RestartBehavior);
