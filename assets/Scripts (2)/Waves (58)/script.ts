class WavesBehavior extends Sup.Behavior {
  
  private currentWave = -1;
  private player:Sup.Actor;
  private playerBehavior:PlayerBehavior;
  private currentMusic = 4;
  
  private waves = [
    {zombies: ["Zombie1"], drop: ["Tomate", "Carotte"]},
    {zombies: ["Zombie1","Zombie1","Zombie1"], drop: ["Carotte", "Carotte", "Carotte"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie1","Zombie1"], drop: ["Tomate", "Tomate", "Tomate", "Carotte", "Carotte", "Carotte"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie1","Zombie1","Zombie1","Zombie1"], drop: ["Aubergine", "Aubergine", "Aubergine"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie2"], drop: ["Carotte", "Carotte", "Carotte","Aubergine", "Aubergine", "Aubergine"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie2","Zombie2","Zombie2"], drop: ["Piment", "Piment", "Piment"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2"], drop: ["Aubergine", "Aubergine", "Aubergine", "Piment", "Piment", "Piment"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2"], drop: ["Citrouille", "Citrouille", "Citrouille"]},
    {zombies: ["Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2"], drop: ["Citrouille", "Citrouille", "Citrouille", "Piment", "Piment", "Piment"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie2","Zombie2","Zombie2","Zombie3"], drop: ["Radis", "Radis", "Radis"]},
    {zombies: ["Zombie1","Zombie1","Zombie2","Zombie2","Zombie2","Zombie3","Zombie3"], drop: ["Radis", "Radis", "Radis","Citrouille", "Citrouille", "Citrouille"]},
    {zombies: ["Zombie1","Zombie2","Zombie2","Zombie2","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3"], drop: ["Patate", "Patate", "Patate"]},
    {zombies: ["Zombie2","Zombie2","Zombie2","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3"], drop: ["Patate", "Patate", "Patate","Radis", "Radis", "Radis"]},
    {zombies: ["Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3"], drop: ["Oignon","Oignon","Oignon"]},
    {zombies: ["Zombie2","Zombie2","Zombie2","Zombie3","Zombie3","Zombie3","Zombie4"], drop: ["Oignon","Oignon","Oignon","Patate","Patate","Patate"]},
    {zombies: ["Zombie2","Zombie2","Zombie3","Zombie3","Zombie3","Zombie4","Zombie4"], drop: ["Champi","Champi","Champi"]},
    {zombies: ["Zombie2","Zombie3","Zombie3","Zombie3","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4"], drop: ["Champi", "Champi", "Champi","Oignon","Oignon","Oignon"]},
    {zombies: ["Zombie3","Zombie3","Zombie3","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4"], drop: ["Carotte", "Radis", "Champi","Oignon", "Champi"]},
    {zombies: ["Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4"], drop: ["Champi","Champi","Champi","Champi","Champi","Champi","Champi","Champi","Champi","Champi"]},
    {zombies: ["Zombie1","Zombie1","Zombie1","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie2","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie3","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4","Zombie4"], drop:[]}
  ];
  
  private sounds = ["Musics/5Deuxieme", "Musics/5Troisieme", "Musics/5Derniere"];
  
  awake() {
    this.player = Sup.getActor("Player");
    this.playerBehavior = this.player.getBehavior<PlayerBehavior>(PlayerBehavior);
  }

  update() {
    if(this.currentWave == 20)
      Sup.setTimeout(2000, () => {Sup.loadScene("Scenes/Win")});
    if(Sup.getActor("Zombies").getChildren().length == 0) {
      if(this.currentWave >= 0 && this.currentWave < this.waves.length) {
        this.giveDrop();
      }
      if(this.currentWave >= this.currentMusic && this.currentMusic != 19) {
        this.launchMusic(Math.floor((this.currentMusic) / 5));
      }
      this.currentWave++;
      this.spawnZombies();
      Sup.getActor("Player").getChild("Camera").getChild("Wave").textRenderer.setText("Wave: " + (this.currentWave + 1));
      Sup.getActor("Player").getChild("Camera").getChild("Zombies").textRenderer.setText("Zombies: " + Sup.getActor("Zombies").getChildren().length);
    }
  }
  
  launchMusic(musicNumber) {
    soundMgr.stop();
    soundMgr = new Sup.Audio.SoundPlayer(this.sounds[musicNumber], 0.5, {loop: true});
    soundMgr.play();
    this.currentMusic += 5;
  }
  
  spawnZombies() {
    let rng = new RNG();
    for(let i = 0; i < this.waves[this.currentWave].zombies.length; i++) {
      let zombie = Sup.appendScene("Prefabs/Zombies/" + this.waves[this.currentWave].zombies[i]);
      zombie[0].setParent(Sup.getActor("Zombies"));
      let playerPos = new Sup.Math.Vector2(this.player.getPosition().x, this.player.getPosition().y);
      let pos = playerPos;
      while(pos.distanceTo(this.player.getPosition()) <= 0.5) {
        pos = new Sup.Math.Vector2(rng.random(3,17), rng.random(3,17));
        zombie[0].arcadeBody2D.warpPosition(pos);
      }
    }
  }
  
  giveDrop() {
    for(let v = 0; v < this.waves[this.currentWave].drop.length; v++) {
      Sup.log(v)
      this.playerBehavior.drop(this.waves[this.currentWave].drop[v]);
    }
  }
}
Sup.registerBehavior(WavesBehavior);
