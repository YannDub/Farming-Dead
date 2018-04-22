class VoiceAleatBehavior extends Sup.Behavior {
  private tab = ["Sounds/Voice1", "Sounds/Voice2", "Sounds/Voice3", "Sounds/Voice4"];
  private rng = new RNG();
  
  update() {
    var nb = this.rng.uniform();
    var sound = this.rng.random(0, 3);
    if(nb <= 0.0001){
      Sup.Audio.playSound(this.tab[sound]);
    }
  }
}
Sup.registerBehavior(VoiceAleatBehavior);
