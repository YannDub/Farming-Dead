const DIRT=57;
const PLANT=71;

class PlayerBehavior extends Sup.Behavior {
  private leftKey = "Q";
  private rightKey = "D";
  private upKey = "Z";
  private downKey = "S";
  private action = "SPACE";
  private life = 20;
  private maxLife;
  
  private moveSpeed = 0.05;
  private direction = 0; // 0: Front 1: Back 2: Left 3: Right
  private previousDirection = -1;
  private isMoving = false;
  private invulnerability = false;
  private timeWaiting = false;
  
  private dead = false;
  
  private inventory = {
    "Tomate": 4,
    "Carotte": 0,
    "Aubergine": 0,
    "Piment": 0,
    "Citrouille": 0,
    "Radis": 0,
    "Patate": 0,
    "Oignon": 0,
    "Champi": 0
  }
  
  private HUD;
  private Zombies
  private selectedInventory = "Tomate";
  
  awake() {
    Sup.ArcadePhysics2D.setGravity(0, 0);
    
    this.HUD = Sup.getActor("Camera").getChild("HUD");
    this.Zombies = Sup.getActor("Zombies");
    this.updateHUD();
    this.maxLife = this.life;
    
    this.actor.getChild("Hit").spriteRenderer.stopAnimation();
    this.actor.getChild("Hit").setVisible(false);
  }

  update() {
    if(!this.dead) {
      Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());

      this.animate();
      this.move();
      if(Sup.Input.wasKeyJustPressed(this.action)) {
        this.act();
      }
      if(Sup.Input.wasMouseButtonJustPressed(0)) {
        let ray = new Sup.Math.Ray();
        ray.setFromCamera(this.actor.getChild("Camera").camera, Sup.Input.getMousePosition());

        if(!this.selectVegetal(ray)) { 
          this.throwVegetable();
        }
      }
    }
  }
  
  updateHUD() {
    for(let v in this.inventory) {
      this.HUD.getChild(v).getChild("Score").textRenderer.setText(this.inventory[v])
    }
  }
  
  animate() {
    if(this.previousDirection != this.direction) {
      switch(this.direction) {
        case 0:
          this.isMoving ? this.actor.spriteRenderer.setAnimation("WalkFront") : this.actor.spriteRenderer.setAnimation("IdleFront");
          break;
        case 1:
          this.isMoving ? this.actor.spriteRenderer.setAnimation("WalkBack") : this.actor.spriteRenderer.setAnimation("IdleBack");
          break;
        case 2:
          this.isMoving ? this.actor.spriteRenderer.setAnimation("WalkLeft") : this.actor.spriteRenderer.setAnimation("IdleLeft");
          break;
        case 3:
          this.isMoving ? this.actor.spriteRenderer.setAnimation("WalkRight") : this.actor.spriteRenderer.setAnimation("IdleRight");
          break;
        default:
          this.actor.spriteRenderer.setAnimation("IdleFront");
      }
      if(this.previousDirection != -1) this.previousDirection = this.direction;
    }
  }
  
  move() {
    let velocity = this.actor.arcadeBody2D.getVelocity();
    let xMove = 0, yMove = 0;
    if(Sup.Input.isKeyDown(this.leftKey)) {
      xMove -= this.moveSpeed;
      this.direction = 2;
    }
      
    if(Sup.Input.isKeyDown(this.rightKey)) {
      xMove += this.moveSpeed;
      this.direction = 3;
    }
    
    if(Sup.Input.isKeyDown(this.upKey)) {
      yMove += this.moveSpeed;
      this.direction = 1;
    }
    
    if(Sup.Input.isKeyDown(this.downKey)){
      yMove -= this.moveSpeed;
      this.direction = 0;
    }
    
    velocity.x = xMove;
    velocity.y = yMove;
    this.actor.arcadeBody2D.setVelocity(velocity);
    if(xMove != 0 || yMove != 0) {
      this.isMoving = true;
    } else {
      this.isMoving = false;
      this.previousDirection = -1;
    }
  }
  
  act() {
    let map = Sup.getActor("Map").tileMapRenderer.getTileMap();
    let x = (this.actor.getX()) * 3;
    let y = (this.actor.getY()) * 3;
    
    if(this.direction == 0) y -= 1;
    if(this.direction == 1) y += 1;
    if(this.direction == 2) x -= 1;
    if(this.direction == 3) x += 1;
    
    let tile = map.getTileAt(0, Math.floor(x), Math.floor(y));
    let vegetables = Sup.getActor("Vegetables").getChildren();
    let collided:Sup.Actor[] = []
    
    for(let i = 0; i < vegetables.length; i++) {
      let vegetableScript = vegetables[i].getBehavior<VegetalBehavior>(VegetalBehavior);
      if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, vegetables[i].arcadeBody2D) && vegetableScript.step == 3) {
        collided.push(vegetables[i]);
      }
    }
    
    if(collided.length != 0) {
      for(let i = 0; i < vegetables.length; i++) {
        let vegetableScript = collided[i].getBehavior<VegetalBehavior>(VegetalBehavior);
        let rng = new RNG();
        this.inventory[vegetableScript.name] += rng.random(2, 5);
        collided[i].destroy();
        this.updateHUD();
        Sup.Audio.playSound("Sounds/PlantVege", 0.5);
        if(rng.uniform() <= 0.05 && this.life < this.maxLife) {
          this.life++;
        }
      }
    } else if(tile == DIRT && this.inventory[this.selectedInventory] > 0) {
      // map.setTileAt(0, Math.floor(x), Math.floor(y), PLANT);
      let vege = Sup.appendScene("Prefabs/Vegetables/" + this.selectedInventory);
      vege[0].setParent(Sup.getActor("Vegetables"));
      vege[0].arcadeBody2D.warpPosition(Math.floor(x) / 3.0, Math.floor(y) / 3.0);
      this.inventory[this.selectedInventory]--;
      this.updateHUD();
      Sup.Audio.playSound("Sounds/PlantVege", 0.5);
    } 
    // else if(tile == PLANT) {
    //   let vegetables = Sup.getActor("Vegetables").getChildren();
    //   for(let i = 0; i < vegetables.length; i++) {
    //     let xV = Math.round(vegetables[i].getPosition().x * 3.0);
    //     let yV = Math.round(vegetables[i].getPosition().y * 3.0);
    //     Sup.log(xV, Math.round(x), yV, Math.round(y))
    //     let vegetableScript = vegetables[i].getBehavior<VegetalBehavior>(VegetalBehavior);
    //     if(xV == Math.round(x) && yV == Math.round(y) - 1 && vegetableScript.step == 3) {
    //       let rng = new RNG();
    //       map.setTileAt(0, Math.round(x), Math.round(y), DIRT);
    //       this.inventory[vegetableScript.name] += rng.random(2, 5);
    //       vegetables[i].destroy();
    //       this.updateHUD();
    //       Sup.Audio.playSound("Sounds/PlantVege", 0.5);
    //       if(rng.uniform() <= 0.05 && this.life < this.maxLife) {
    //         this.life++;
    //       }
    //     }
    //   }
    // }
  }
  
  selectVegetal(ray) {
    let res = false;
    
    let hits = ray.intersectActors(this.HUD.getChildren());
    for (let hit of hits) {
      if(hit.actor.getName() != "Selector") {
        this.selectedInventory = hit.actor.getName();
        res = true;
      }
    }
    let intercect = this.HUD.getChild(this.selectedInventory);
    this.HUD.getChild("Selector").setPosition(intercect.getX(), intercect.getY());
    return res;
  }
  
  throwVegetable() {
    let bullet = Sup.appendScene("Prefabs/Bullet");
    let start = new Sup.Math.Vector2(this.actor.getPosition().x, this.actor.getPosition().y);
    let targetPos = start.clone().add(Sup.Input.getMousePosition());
    let norm = targetPos.subtract(start).normalize();
    // start.add(norm);
    if(this.inventory[this.selectedInventory] > 0) {
      bullet[0].getBehavior<BulletBehavior>(BulletBehavior).init(this.selectedInventory, start, norm);
      this.inventory[this.selectedInventory]--;
      this.updateHUD();
    }
  }
  
  hurt(knockback: Sup.Math.Vector2, lifepoint: number) {
    if(!this.invulnerability) {
      Sup.Audio.playSound("Sounds/ZombieHit", 0.5);
      this.actor.getChild("Hit").setVisible(true);
      this.actor.getChild("Hit").spriteRenderer.playAnimation(false);
      this.timeWaiting = false;
      this.life -= lifepoint;
      this.actor.arcadeBody2D.setVelocity(knockback);
      this.actor.spriteRenderer.setColor(new Sup.Color(0xFF0000));
      this.invulnerability = true;
      if(this.life <= 0) {
        this.life = 0;
        this.dead = true;
        this.die();
      }
    } else if(!this.timeWaiting) {
      this.timeWaiting = true;
      Sup.setTimeout(400, () => {
        this.actor.getChild("Hit").setVisible(false);
      });
      
      Sup.setTimeout(1000, () => {
        this.invulnerability = false;
        this.actor.spriteRenderer.setColor(new Sup.Color(0xffffff));
      })
    }
  }
  
  die() {
    this.actor.spriteRenderer.setColor(new Sup.Color(0xFF0000));
    this.actor.arcadeBody2D.setVelocityX(0);
    this.actor.arcadeBody2D.setVelocityY(0);
    this.isMoving = false;
    // Game Over screen
    Sup.setTimeout(2000, () => {Sup.loadScene("Scenes/GameOver")});
  }
  
  
  drop(vegetable:string) {
    this.inventory[vegetable]++;
    this.updateHUD();
  }
  
  isDead() {
    return this.dead;
  }
  
  getMaxLife() {
    return this.maxLife;
  }
  
  getCurrentLife() {
    return this.life;
  }
}
Sup.registerBehavior(PlayerBehavior);
