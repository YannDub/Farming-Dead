class LifebarPlayerBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    let life = this.actor.getParent().getParent().getParent().getBehavior<PlayerBehavior>(PlayerBehavior);
    this.actor.setLocalScaleX(life.getCurrentLife() / life.getMaxLife());
  }
}
Sup.registerBehavior(LifebarPlayerBehavior);
