
function Gallery(){
    
    const SCALE = 0.35;
    const FORCE = { 
        x : 200,
        y : -605,
        r : 1,
        s : 0.012
    }
    
    const BORDER_PERCENT = 0.15;

    this.setup = (assets) => {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.gunImages = assets.guns;
        this.canImages = assets.cans;
        this.backgroundImages = assets.backgrounds;
        this.hittingWall = false;
        const w = this.canvas.width;
        const h = this.canvas.height;
   
        this.gun = new Gun(this.gunImages[0]);
        this.gun.aimAt(w / 2, h / 2); 
        this.grab = { x : 0, y : 0};
        
        this.swipe = new SwipeTracker(this.onGrab, this.onAim, this.onFire);
        this.beercans = new BeerCans(this.canImages, SCALE, this.onCanDestroyed);
        this.spawnCan();
    };

    this.draw = () => {
        this.ctx.drawImage(this.backgroundImages[0], 0, 0, this.canvas.width, this.canvas.height);
        this.beercans.draw();
        this.gun.draw();	
    };

    this.update = (deltaTime) => {
        this.beercans.update(deltaTime, this.updateCan);
    };

    this.updateCan = (can, delta) => {
        can.x += can.velocityX * delta;
        can.y += can.velocityY * delta;
        
        can.velocityRotation *= can.angularMomentum;	
        can.rotation += can.velocityRotation * delta;
        if(Math.abs(can.velocityY) > 0)
        {
            can.scale -= FORCE.s;
            console.log(can.scale);
            if(can.scale <= 0.1){
                this.beercans.destroy(can);
                this.spawnCan();
            }
        }
    }

    this.spawnCan = ()=>{
        const image = this.canImages[0];
        const borderWidth = this.canvas.width * BORDER_PERCENT;
        const borderHeight = this.canvas.width * BORDER_PERCENT;
        const x = Math.random() * (this.canvas.width - borderWidth * 2) + borderWidth;
        const y = Math.random() * (this.canvas.height - borderHeight * 2) + borderHeight;
        this.beercans.spawn(x,y);
    }

    this.onFire = () => {
        for(var i = 0; i < this.beercans.instances.length; ++i){
            var can = this.beercans.instances[i]; 
            var px = this.gun.aim.x;
            var py = this.gun.aim.y;
    
            const offset = this.beercans.intersects(can, px, py);
            if(offset){
                // The close the player hits to the center. The less it will rotate and strafe. 
                // Reward by increasing upwards force
                const spin = FORCE.r; 
                const xforce = FORCE.x * -1*offset.x;
                const yforce = FORCE.y * Math.abs(offset.y);

                Effects.explosion(px, py, 10);
                this.beercans.hit(can, xforce, yforce, spin);
                if(!can.enabled){
                    this.spawnCan();
                }
            }
        }
    };
    
    this.onGrab = () =>{
        this.grab.x = this.gun.aim.x;
        this.grab.y = this.gun.aim.y;
    };

    this.onAim = (dx, dy) =>{
        if(!this.gun.aimAt(this.grab.x + dx, this.grab.y + dy)){
            // failed to move, reanchor to current aim 
            this.onGrab();
            this.swipe.anchor();
        }
    };
}