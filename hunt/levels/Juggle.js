
function Juggle(){
    
    const GRAVITY = 505;
    const BOUNCE = 0.87;
    const SCALE = 0.35;
    const FORCE = { 
        x : 1000,
        y : -505,
    }
    
    this.setup = (assets) => {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.gunImages = assets.guns;
        this.canImages = assets.cans;
        this.backgroundImages = assets.backgrounds;
        this.hittingWall = false;
        this.difficulty  = 0.5;

        this.gun = new Gun(this.gunImages[0]);
        this.gun.aimAt(this.canvas.width / 2, this.canvas.height / 2); 
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
        this.beercans.update(deltaTime * this.difficulty, this.updateCan);
    };

    this.updateCan = (can, delta) => {
        this.checkWalls(can);

        can.velocityY += GRAVITY * delta;
        can.x += can.velocityX * delta;
        can.y += can.velocityY * delta;
        
        can.velocityRotation *= can.angularMomentum;	
        can.rotation += can.velocityRotation * delta;

        const ground = this.canvas.height + can.height * can.scale * 0.5;
        if (can.y > ground) {
            this.beercans.destroy(can);
            this.spawnCan();
        }
    }

    this.spawnCan = ()=>{
        var image = this.canImages[0];
        var x = Math.random() * this.canvas.width;
        var y = Math.random() * -2 * image.height;
    
        if(x < image.width / 2) x = image.width / 2.0;  
        if(x > this.canvas.width - image.width / 2) x = image.width / 2.0;  

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
                const noise = Math.random() * 0.1; //add some randomness to account for drag, friction etc..
                const dist = (offset.x * offset.x + offset.y * offset.y); 
                const accuracy = 1 - dist; 
                const xforce = FORCE.x * -1*offset.x + noise;
                const yforce = FORCE.y * accuracy + noise;
                const spin  = dist + noise;

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

    this.checkWalls = (can) => {
        if(this.hittingWall) return;

        const cos = Math.cos(-can.rotation);
        const sin = Math.sin(-can.rotation);

        var halfWidth = 0.5 * can.width * can.scale;
        var halfHeight = 0.5 * can.height * can.scale;

        const x0 = -halfWidth;
        const y0 = -halfHeight;
        const x1 = -halfWidth;
        const y1 = +halfHeight;
        const x2 = +halfWidth;
        const y2 = -halfHeight;
        const x3 = +halfWidth;
        const y3 = +halfHeight;

        const rx0 = (x0 * cos + y0 * sin) + can.x;
        const rx1 = (x1 * cos + y1 * sin) + can.x;
        const rx2 = (x2 * cos + y2 * sin) + can.x;
        const rx3 = (x3 * cos + y3 * sin) + can.x;

        const ry0 = (-x0 * sin + y0 * cos) + can.y;
        const ry1 = (-x1 * sin + y1 * cos) + can.y;
        const ry2 = (-x2 * sin + y2 * cos) + can.y;
        const ry3 = (-x3 * sin + y3 * cos) + can.y;

        this.ctx.moveTo(rx0, ry0);
        this.ctx.lineTo(rx1, ry1);
        this.ctx.moveTo(rx0, ry0);
        this.ctx.lineTo(rx2, ry2);      
        this.ctx.stroke();
        this.ctx.moveTo(rx3, ry3);
        this.ctx.lineTo(rx1, ry1);
        this.ctx.moveTo(rx3, ry3);
        this.ctx.lineTo(rx2, ry2);    
        this.ctx.stroke();

        const left = Math.min(rx0, rx1, rx2, rx3);
        const right = Math.max(rx0, rx1, rx2, rx3); 
        if(left < 0 || right > this.canvas.width){
            can.velocityX = -1 * can.velocityX * BOUNCE;
            can.velocityRotation *= -1 * can.angularMomentum * BOUNCE;

            this.hittingWall = true;
            setInterval(()=>{
                this.hittingWall = false;
            }, 300);
        }
    };
}