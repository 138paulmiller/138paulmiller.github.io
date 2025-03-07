function Gun(image) {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.rotation = 0;
    
    this.aim =  { x : 0, y : 0};
    this.crosshairSize = 20;
    this.crosshairWidth = 4;
    this.deadzone = 0.1;
    this.aimSpeed = 2000;

    this.clampToCanvas = (x, y) => {
        var clamped = false;
        if(this.aim.x < 0) {
            this.aim.x = 0;
            clamped = true;
        }
        if(this.aim.y < 0) { 
            this.aim.y = 0;  
            clamped = true;
        }
        if(this.aim.x > this.canvas.width) {
            this.aim.x = this.canvas.width;
            clamped = true;
        }
        if(this.aim.y > this.canvas.height){
             this.aim.y = this.canvas.height;
             clamped = true;
        }
        return clamped;
    }

    this.aimAt = (x, y) => {
        this.aim.x = x;
        this.aim.y = y;
        return !this.clampToCanvas(this.aim.x, this.aim.y);
    };

    this.aimBy = (dx, dy) => {
        this.aim.x += dx;
        this.aim.y += dy;
        return !this.clampToCanvas(this.aim.x, this.aim.y);
    };

    this.draw = () => {
        // TODO rotate towards
   
        const x = this.canvas.width / 2;
        const y = this.canvas.height;

        const dx = this.aim.x - x;
        const dy = this.aim.y - y;
        const angle = 3.14158 / 2 - Math.atan2(-dy, dx);
        this.rotation = angle;

        this.ctx.translate(x, y);
        this.ctx.rotate(this.rotation);
        this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        this.ctx.rotate(-this.rotation);
        this.ctx.translate(-x, -y);	

        var length = this.crosshairSize/2;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.crosshairWidth;
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.moveTo(this.aim.x - length, this.aim.y - length);
        this.ctx.lineTo(this.aim.x + length, this.aim.y + length);      
        this.ctx.moveTo(this.aim.x - length, this.aim.y + length);
        this.ctx.lineTo(this.aim.x + length, this.aim.y - length);
        this.ctx.stroke();
    };
}