function BeerCans(images, scale, onCanDestroy) {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.images = images;
    this.scale = scale;
    this.onCanDestroy = onCanDestroy;
    this.instances = [];
 
    this.new = (x , y) => {
        const image = this.images[0];    
        const can = {
            enabled : true,
            width: image.width,
            height: image.height,
            x: x,
            y: y,
            velocityX: 0,
            velocityY: 0,
            rotation : 0,
            spinTorque : 20,
            angularMomentum : 0.9889,
            velocityRotation : 0,
            index : 0,
            scale : this.scale
        };
        
        return can;
    };

    this.spawn = (x, y) => {
        console.log('Spawn Can', x, ' ', y)
        for( var i = this.instances.length - 1; i >= 0; --i){
            if(!this.instances[i].enabled){		
                this.instances[i] = this.new(x, y);
                return;
            }
        }
        this.instances.push(this.new(x, y));
    };

    this.destroy = (can) => {
        can.enabled = false;
    };
    
    this.intersects = (can, px, py) => { 
        var x = can.x;
        var y = can.y;
        var w = can.width * can.scale;
        var h = can.height * can.scale;
        var rot = can.rotation;

        //Calculate Point In Can rect space
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
            const offx = dx / w;
            const offy = dy / h;
            return {x : offx, y : offy}
        }
        return false;
    }

    this.hit = (can, shotForceX, shotForceY, spin) =>{
        can.velocityX = shotForceX;
        can.velocityY = shotForceY;
        can.velocityRotation += can.spinTorque * spin;
        can.index += 1;

        if(can.index >= this.images.length){    
            this.destroy(can);
        }else{
            const image = this.images[can.index];
            can.width = image.width;
            can.height = image.height;
        }        
    }

    this.drawRect = (can) => {
        const cos = Math.cos(-can.rotation);
        const sin = Math.sin(-can.rotation);

        var halfWidth = (can.width * can.scale) * 0.5;
        var halfHeight = (can.height * can.scale) * 0.5;

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
    };

    this.update = (delta, processor) => {				
        for( var i = 0; i < this.instances.length; ++i){
            var can = this.instances[i];
            if(!can.enabled) continue;
            processor(can, delta);
        }
    };

    this.draw = () => {
        for( var i = 0; i < this.instances.length; ++i){
            var can = this.instances[i];
            if(!can.enabled) 
                continue;
            
            //this.drawRect(can);
            var width = can.width * can.scale;
            var height = can.height * can.scale;
            var halfWidth = width * 0.5;
            var halfHeight = height  * 0.5;

            const image = this.images[can.index];
            this.ctx.translate(can.x, can.y);
			this.ctx.rotate(can.rotation);
			this.ctx.drawImage(image, -halfWidth, -halfHeight, width, height);
			this.ctx.rotate(-can.rotation);
			this.ctx.translate(-can.x, -can.y);	
        }
    };
};