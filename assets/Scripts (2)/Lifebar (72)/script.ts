class LifebarBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    let life = this.actor.getParent().getBehavior<ZombieBehavior>(ZombieBehavior);
    this.actor.setLocalScaleX(life.getCurrentLife() / life.getMaxLife());
  }
}
Sup.registerBehavior(LifebarBehavior);
