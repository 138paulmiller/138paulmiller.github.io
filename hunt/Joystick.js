
function Joystick(onFire) {

    this.onFire = onFire;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    this.color = 'rgba(255, 255, 255, 0.5)';
    this.radius = 100; // virtual joystick radius    
    this.handleRatio = 0.75; // virtual joystick tip radius percent
    this.sensitivity = 200; 
    
    this.focused = false;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.touchId = -1;
    this.onFire;

    this.bindEvents = () => {
        this.canvas.addEventListener("touchstart", this.onStart);
        this.canvas.addEventListener("touchmove", this.onMove);
        this.canvas.addEventListener("touchend", this.onStop);       
        this.canvas.addEventListener("mousedown", this.onStart);
        this.canvas.addEventListener("mousemove", this.onMove);
        this.canvas.addEventListener("mouseup", this.onStop);   
    };

    this.onStart = (event)=> {
        if(this.focused)return;
        
        if(event instanceof MouseEvent){
            this.move(event.clientX, event.clientY, true);
        } else if(event instanceof TouchEvent){
            const touch = event.touches[0];
            this.touchId = touch.identifier;
            this.move(touch.clientX, touch.clientY, true);
        }

        onFire();
    };
  
    this.onMove = (event)=> {
        if(event instanceof MouseEvent){
            this.move(event.clientX, event.clientY, false);
        } else if(event instanceof TouchEvent){
            const touch = event.touches[0];
            if(this.touchId == touch.identifier){
                this.move(touch.clientX, touch.clientY, false);
            } 
        }       
    };

    this.onStop = (event)=> {
        if(event instanceof MouseEvent){
            this.focused = false; 
        } else if(event instanceof TouchEvent){
            const touch = event.touches[0];
            if(this.touchId == touch.identifier){
                this.focused = false; 
                this.touchId = -1;
            }
        }
    };

    this.move = (x, y, initial) => {
        if(initial){    
            this.x = x;
            this.y = y;
            this.focused = true;
        }

        if(!this.focused) {
            this.dx = 0;
            this.dy = 0;
            return;        
        }

        var tx = x - this.x;
        var ty = y - this.y;
        const length = Math.sqrt(tx * tx + ty * ty);

        if(length > this.radius) { //clamp to radius
            tx = (tx / length) * this.radius;
            ty = (ty / length) * this.radius;	
        }

        this.dx = tx / this.radius;
        this.dy = ty / this.radius;
    };

    this.draw = () => {
        if(!this.focused) return;
        
        const x = this.x;
        const y = this.y;
        const tx = this.dx * this.radius;
        const ty = this.dy * this.radius;
        
        const radius = this.radius;
        
        // Draw virtual joystick
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(x + tx, y + ty, radius * this.handleRatio, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    };

    this.bindEvents();
};