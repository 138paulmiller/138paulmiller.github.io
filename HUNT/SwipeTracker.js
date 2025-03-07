
function SwipeTracker(onGrab, onMove, onClick) {
    this.focused = false;
    this.anchorX = 0;
    this.anchorY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.touchId = -1;
    this.onClick = onClick;
    this.onMove = onMove;
    this.onGrab = onGrab;

    this.bindEvents = () => {
        canvas.addEventListener("touchstart", this.handleStart);
        canvas.addEventListener("touchmove", this.handleMove);
        canvas.addEventListener("touchend", this.handleStop);       
        canvas.addEventListener("mousedown", this.handleStart);
        canvas.addEventListener("mousemove", this.handleMove);
        canvas.addEventListener("mouseup", this.handleStop);       
    };

    this.anchor = () => {
        this.anchorX = this.currentX;
        this.anchorY = this.currentY;
    }

    this.handleStart = (event) => {
        if(this.focused){
            this.onClick();
            return;
        }
        
        if(event instanceof MouseEvent){
            this.anchorX = event.clientX;
            this.anchorY = event.clientY;
        } else if(event instanceof TouchEvent){
            const touch = event.touches[0];
            this.touchId = touch.identifier;
            this.anchorX = touch.clientX;
            this.anchorY = touch.clientY;
        }

        this.focused = true;
        this.onGrab();
        this.onClick();
    }
  
    this.handleMove = (event) => {
        if(!this.focused){
            return;
        }

        if(event instanceof MouseEvent){
            this.currentX = event.clientX;
            this.currentY = event.clientY;
        } else if(event instanceof TouchEvent){
            const touch = event.touches[0];
            if(this.touchId == touch.identifier){
                this.currentX = touch.clientX;
                this.currentY = touch.clientY;
            } 
        }    
        
        const dx = this.currentX - this.anchorX;
        const dy = this.currentY - this.anchorY;
        this.onMove(dx, dy);
    }

    this.handleStop = (event) => {
        if(event instanceof MouseEvent){
            this.focused = false; 
        } else if(event instanceof TouchEvent){
            const touch = event.touches[0];
            if(Input.touchId == touch.identifier){
                this.focused = false; 
                this.touchId = -1;
            }
        }
    };

    this.bindEvents();
};