class VegetalBehavior extends Sup.Behavior {
  
  name:string;
  timeToGrow:number;
  chanceToGrow:number;
  
  step = 1;
  private grow = false;
  private waitForCycle = false;
  
  private rng;
  
  awake() {
    this.rng = new RNG();
  }

  update() {
    Sup.log(this.actor.getPosition());
    if(this.step < 3) {
      if(this.grow) {
        this.grow  = false;
        this.step++;
        this.actor.spriteRenderer.setAnimation(this.name + this.step);
      }

      if(!this.waitForCycle) {
        Sup.setTimeout(this.timeToGrow, () => {
          this.waitForCycle = false;
          if(this.rng.uniform() <= this.chanceToGrow) {
            this.grow = true;
          }
        })
        this.waitForCycle = true;
      }
    }
  }
}
Sup.registerBehavior(VegetalBehavior);
