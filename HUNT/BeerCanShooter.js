
function BeerCanShooter(){
    
    const scale = 0.5;
    const force = { 
        x : 800,
        y : -705,
    }
    
    this.setup = (assets) => {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.guns = assets.guns;
        this.cans = assets.cans;
        this.backgrounds = assets.backgrounds;
       
        const w = this.canvas.width;
        const h = this.canvas.height;
   
        this.gun = new Gun(this.guns[0]);
        this.gun.aimAt(w / 2, h / 2); 
        this.grab = { x : 0, y : 0};
        
        this.swipe = new SwipeTracker(this.onGrab, this.onAim, this.onFire);

        BeerCans.init(this.cans, scale);
        BeerCans.difficulty = 0.5;
        BeerCans.instances[0].x = w / 2;
        BeerCans.instances[0].y = h / 2;
    };

    this.draw = () => {
        this.ctx.drawImage(this.backgrounds[0], 0, 0, this.canvas.width, this.canvas.height);
        BeerCans.draw();
        this.gun.draw();	
    };

    this.update = (deltaTime) => {
        BeerCans.update(deltaTime);
    };

    this.onFire = () => {
            for(var i = 0; i < BeerCans.instances.length; ++i){
            var can = BeerCans.instances[i]; 
            this.tryHitCan(can);
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

    this.tryHitCan = (can) => { 
        var px = this.gun.aim.x;
        var py = this.gun.aim.y;

        var x = can.x;
        var y = can.y;
        var w = can.width;
        var h = can.height;
        var rot = can.rotation;

        if(this.calcPointInRectSpace(px, py, x, y, w, h, rot)){
            const offx = (px - x) / w;
            const offy = (py - y) / h;
            // The close the player hits to the center. The less it will rotate and strafe. 
            // Reward by increasing upwards force
            const noise = Math.random() * 0.1; //add some randomness to account for drag, friction etc..
            const dist = (offx * offx + offy * offy); 
            const accuracy = 1 - dist; 
            const xforce = force.x * -1*offx + noise;
            const yforce = force.y * accuracy + noise;
            const spin  = dist + noise;

            Effects.explosion(px, py, 10);
            BeerCans.hit(can, xforce, yforce, spin);
        }
    }

    this.calcPointInRectSpace = (px, py, x, y, w, h, rot) => {
        // Compute the cosine and sine of the rotation angle
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
      
        // Translate the point relative to the box center
        const dx = px - x;
        const dy = py - y;
      
        // Project the translated point onto the box's local axes
        const locX = dx * cos + dy * sin;
        const locY = -dx * sin + dy * cos;
      
        // Check if the point lies within the box's half-extents
        if (Math.abs(locX) <= w / 2 && Math.abs(locY) <= h / 2) {
            return true;
        }
        return false;
      }
      
}