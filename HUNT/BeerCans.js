class BeerCans {
    static canvas;
    static ctx;
    static instances = [];
    static images  = [];
    static pixels  = []; //temp rasters to store pixel data to sample for hit detection

    static width = 0;
    static height = 0;

    static scale = 0.25;
    static gravity = 605;
    static bounce = 0.87;
    static difficulty = 1;

    static init = (images, scale) => {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.images = images;
        this.scale = scale;
        this.spawn();
    };

    static new = () => {
        const image = this.images[0];
        var x = Math.random() * this.canvas.width
        var y = Math.random() * -2 * image.height

        if(x < image.width / 2) x = image.width / 2.0;  
        if(x > this.canvas.width - image.width / 2) x = image.width / 2.0;  
        
        const can = {
            enabled : true,
            width: 0,
            height: 0,
            haflWidth: 0,
            halfHeight: 0,
            x: x,
            y: y,
            velocityX: 0,
            velocityY: 0,
            rotation : 0,
            spinTorque : 20,
            angularMomentum : 0.9889,

            velocityRotation : 0,
            index : 0, 
        };
                
        can.width = this.scale * image.width;
        can.height = this.scale * image.height;
        can.halfWidth = can.width / 2;
        can.halfHeight = can.height / 2;

        return can;
    };

    static spawn = () => {
        for( var i = this.instances.length - 1; i >= 0; --i){
            if(!this.instances[i].enabled){		
                this.instances[i] = this.new();
                return;
            }
        }
        this.instances.push(this.new());
    };

    static destroy = (can) => {
        can.enabled = false;
    };
    
    static pixelAt = (can, u, v) => {
        var imageData = this.pixels[can.index];
        const index = (v * imageData.width + u) * 4; // Compute the starting index for pixel (x, y)
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const a = imageData.data[index + 3];
        return [ r, g, b, a ];
    };
    
    static hit = (can, shotForceX, shotForceY, spin) =>{
        can.velocityX = shotForceX;
        can.velocityY = shotForceY;
        can.velocityRotation += can.spinTorque * spin;
        can.index += 1;

        if(can.index >= this.images.length){    
            this.destroy(can);
            this.spawn();
        }else{
            const image = this.images[can.index];
            can.width = this.scale * image.width;
            can.height = this.scale * image.height;
            can.halfWidth = can.width / 2;
            can.halfHeight = can.height / 2;
        }        
    }

    static checkWalls = (can) => {

        if(this.hittingWall) return;

        const cos = Math.cos(-can.rotation);
        const sin = Math.sin(-can.rotation);

        const x0 = -can.halfWidth;
        const y0 = -can.halfHeight;
        const x1 = -can.halfWidth;
        const y1 = +can.halfHeight;
        const x2 = +can.halfWidth;
        const y2 = -can.halfHeight;
        const x3 = +can.halfWidth;
        const y3 = +can.halfHeight;

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
            can.velocityX = -1 * can.velocityX * this.bounce;
            can.velocityRotation *= -1 * can.angularMomentum * this.bounce;

            this.hittingWall = true;
            setInterval(()=>{
                this.hittingWall = false;
            }, 300);
        }
    };

    static drawRect = (can) => {
        const cos = Math.cos(-can.rotation);
        const sin = Math.sin(-can.rotation);

        const x0 = -can.halfWidth;
        const y0 = -can.halfHeight;
        const x1 = -can.halfWidth;
        const y1 = +can.halfHeight;
        const x2 = +can.halfWidth;
        const y2 = -can.halfHeight;
        const x3 = +can.halfWidth;
        const y3 = +can.halfHeight;

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
    };

    static update = (deltaTime) => {				
        for( var i = 0; i < this.instances.length; ++i){
            var can = this.instances[i];
            if(!can.enabled) continue;

            const scalar = this.difficulty * deltaTime;
            can.velocityY += this.gravity * scalar;
            can.x += can.velocityX * scalar;
            can.y += can.velocityY * scalar;
            
            can.velocityRotation *= can.angularMomentum;	
            can.rotation += can.velocityRotation * scalar;

            this.checkWalls(can);

            const ground = this.canvas.height + can.height * 0.5;
            if (can.y > ground) {
                this.destroy(can);
                this.spawn();
            }
        }
    };

    static draw = () => {
        for( var i = 0; i < this.instances.length; ++i){
            var can = this.instances[i];
            if(!can.enabled) 
                continue;
            
            const image = this.images[can.index];
            this.ctx.translate(can.x, can.y);
			this.ctx.rotate(can.rotation);
			this.ctx.drawImage(image, -can.halfWidth, -can.halfHeight, can.width, can.height);
			this.ctx.rotate(-can.rotation);
			this.ctx.translate(-can.x, -can.y);	
        }
    };
};