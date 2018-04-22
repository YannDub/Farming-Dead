class ZombieBehavior extends Sup.Behavior {
  
  damage:number;
  distanceToView:number;
  moveSpeed :number;
  name: string;
  life:number;
  
  private player:Sup.Actor;
  private playerBehavior;
  private rng = new RNG();
  private targetVector:Sup.Math.Vector2;
  private playerDetected = false;
  private dead = false;
  
  private direction = 0; // 0: Front 1: Back 2: Left 3: Right
  private previousDirection = -1;
  private isMoving = false;
  private maxLife;
  
  awake() {
    this.player = Sup.getActor("Player");
    this.playerBehavior = this.player.getBehavior<PlayerBehavior>(PlayerBehavior);
    this.targetVector = new Sup.Math.Vector2(this.actor.getPosition().x, this.actor.getPosition().y);
    this.maxLife = this.life;
    
    this.actor.getChild("Explosion").spriteRenderer.stopAnimation();
    this.actor.getChild("Explosion").setVisible(false);
  }

  update() {
    if(!this.dead) {
      Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
      this.animate();

      let pos:Sup.Math.Vector2 = new Sup.Math.Vector2(this.actor.getX(), this.actor.getY());
      let playerPos:Sup.Math.Vector2 = new Sup.Math.Vector2(this.player.getX(), this.player.getY());

      if(pos.distanceTo(playerPos) <= this.distanceToView && !this.playerBehavior.isDead()) {
        this.playerDetected = true;
      } else {
        this.playerDetected = false;
      }

      if(this.playerDetected) {
        this.followPlayer(pos, playerPos);
      } else {
        this.randomMove(pos);
      }
      
      if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.player.arcadeBody2D)) {
        this.hit(); 
      }
    }
  }
  
  animate() {
    if(this.previousDirection != this.direction) {
      switch(this.direction) {
        case 0:
          this.isMoving ? this.actor.spriteRenderer.setAnimation(this.name + "WalkFront") : this.actor.spriteRenderer.setAnimation(this.name + "IdleFront");
          break;
        case 1:
          this.isMoving ? this.actor.spriteRenderer.setAnimation(this.name + "WalkBack") : this.actor.spriteRenderer.setAnimation(this.name + "IdleBack");
          break;
        case 2:
          this.isMoving ? this.actor.spriteRenderer.setAnimation(this.name + "WalkLeft") : this.actor.spriteRenderer.setAnimation(this.name + "IdleLeft");
          break;
        case 3:
          this.isMoving ? this.actor.spriteRenderer.setAnimation(this.name + "WalkRight") : this.actor.spriteRenderer.setAnimation(this.name + "IdleRight");
          break;
        default:
          this.actor.spriteRenderer.setAnimation(this.name + "IdleFront");
      }
      if(this.previousDirection != -1) this.previousDirection = this.direction;
    }
  }
  
  hit() {
    let pos = new Sup.Math.Vector2(this.actor.getPosition().x, this.actor.getPosition().y);
    let playerPos = new Sup.Math.Vector2(this.player.getPosition().x, this.player.getPosition().y);
    let knockpack = playerPos.clone().subtract(pos).normalize();
    this.playerBehavior.hurt(knockpack, this.damage);
  }
  
  followPlayer(pos:Sup.Math.Vector2, playerPos:Sup.Math.Vector2) {
    let zmp = playerPos.subtract(pos).normalize();
    this.targetVector = playerPos;
    this.move(zmp.x * this.moveSpeed, zmp.y * this.moveSpeed);
  }
  
  randomMove(pos:Sup.Math.Vector2) {
    // let map = Sup.getActor("Map").tileMapRenderer.getTileMap();
    
    if(this.targetVector.distanceTo(pos) <= 0.5 || this.rng.uniform() <= 0.01) {
      let x = this.rng.random(0,5);
      let y = this.rng.random(0,5);
      let signX = this.rng.uniform() <= 0.5 ? -1 : 1;
      let signY = this.rng.uniform() <= 0.5 ? -1 : 1;
      this.targetVector = pos.clone();
      this.targetVector.x += x * signX;
      this.targetVector.y += y * signY;

      // let tile = map.getTileAt(0, Math.round(x), Math.round(y));
      // if(Sup.getActor("Map").tileMapRenderer.getTileSet().getTileProperties(tile)) {
        let norm = this.targetVector.clone().normalize();
        this.move(norm.x * signX * this.moveSpeed, norm.y * signY * this.moveSpeed);
      // }
    }
    
  }
  
  move(x, y) {
    this.actor.arcadeBody2D.setVelocityX(x);
    this.actor.arcadeBody2D.setVelocityY(y);
    this.isMoving = true;
    
    if(y > 0) {
      if(y > x) this.direction = 1;
      else {
        if(x > 0) this.direction = 3;
        else this.direction = 2;
      }
    } else {
      if(y < x) this.direction = 0;
      else {
        if(x > 0) this.direction = 3;
        else this.direction = 2;
      }
    }
  }
  
  hurt(knockback: Sup.Math.Vector2, lifepoint: number) {
    this.life -= lifepoint;
    this.actor.arcadeBody2D.setVelocity(knockback.clone().multiplyScalar(this.moveSpeed * 2));
    this.actor.spriteRenderer.setColor(new Sup.Color(0xFF0000));
    this.actor.getChild("Explosion").setVisible(true);
    this.actor.getChild("Explosion").spriteRenderer.playAnimation(false);
    if(this.life <= 0) {
      this.die();
    } else {
      Sup.setTimeout(500, () => {
        this.actor.getChild("Explosion").setVisible(false);
      });
      Sup.setTimeout(1000, () => {
        this.actor.spriteRenderer.setColor(new Sup.Color(0xffffff));
      })
    }
  }
  
  die() {
    this.actor.spriteRenderer.setColor(new Sup.Color(0xFF0000));
    this.dead = true;
    this.actor.arcadeBody2D.setVelocityX(0);
    this.actor.arcadeBody2D.setVelocityY(0);
    this.isMoving = false;
    Sup.setTimeout(1000, () => {
      this.actor.destroy()
    });
  }
  
  getMaxLife() {
    return this.maxLife;
  }
  
  getCurrentLife() {
    return this.life;
  }
}
Sup.registerBehavior(ZombieBehavior);
