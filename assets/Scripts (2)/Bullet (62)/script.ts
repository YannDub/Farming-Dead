const DAMAGE = {
  "Tomate": 1,
  "Carotte": 2,
  "Aubergine":4,
  "Piment":6,
  "Citrouille":8,
  "Radis":10,
  "Patate":12,
  "Oignon":14,
  "Champi":20
}

class BulletBehavior extends Sup.Behavior {
  vegetable:string;
  speed:number;
  
  private direction;
  
  awake() {
    Sup.setTimeout(5000, () => {
      if(!this.isDestroyed) this.actor.destroy;
    });
  }
  
  init(vegetable:string, start:Sup.Math.Vector2, final:Sup.Math.Vector2) {
    this.vegetable = vegetable;
    this.actor.spriteRenderer.setAnimation(this.vegetable + "3");
    
    this.actor.arcadeBody2D.warpPosition(start);
    this.direction = final;
    this.actor.arcadeBody2D.setVelocity(this.direction.clone().multiplyScalar(this.speed));
  }

  update() {
    for(let i = 0; i <  Sup.getActor("Zombies").getChildren().length; i++) {
      if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Zombies").getChildren()[i].arcadeBody2D)) {
        let zombie = Sup.getActor("Zombies").getChildren()[i].getBehavior<ZombieBehavior>(ZombieBehavior);
        zombie.hurt(this.direction, DAMAGE[this.vegetable]);
        this.actor.destroy();
        Sup.Audio.playSound("Sounds/Explosion", 0.5);
        Sup.setTimeout(800, () => {Sup.Audio.playSound("Sounds/HitVoice", 0.5);})
      }
    }
  }
}
Sup.registerBehavior(BulletBehavior);
