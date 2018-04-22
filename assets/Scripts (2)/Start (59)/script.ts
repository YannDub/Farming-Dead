class StartBehavior extends Sup.Behavior {
  update() {
    if(Sup.Input.wasKeyJustPressed("SPACE"))
      Sup.loadScene("Scenes/Controls");
  }
}
Sup.registerBehavior(StartBehavior);
