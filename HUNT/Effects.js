
class Effects {
    static explosionInitialized = false;
    static explosionSpeed = 4;
    static explosionFade = 0.05;

    static explosion(x, y, count){
        if(!Effects.explosionInitialized){

            Effects.explosionInitialized = true;
            // Add CSS animation dynamically
            const style = document.createElement("style");
            style.textContent = `
                @keyframes explode {
                to {
                    transform: translate(calc((random() - 0.5) * 100px), calc((random() - 0.5) * 100px));
                    opacity: 0;
                }
                }
            `;
            document.head.appendChild(style);
        }
        
        const explosion = document.createElement("div");
        explosion.style.position = "absolute";
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        explosion.style.pointerEvents = "none"; // Avoids interaction
        document.body.appendChild(explosion);
    
        const particles = [];
    
        for (let i = 0; i < 10; i++) {
        const particle = document.createElement("span");
        Object.assign(particle.style, {
            position: "absolute",
            width: "10px",
            height: "10px",
            background: `orange`, // Random colors
            opacity: "1"
        });
    
        explosion.appendChild(particle);
    
        // Set random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * Effects.explosionSpeed + 1; // Speed variation
    
        particles.push({ element: particle, angle, speed, x: 0, y: 0 });
        }
    
        function animateParticles() {
        let allParticlesFaded = true;
    
        particles.forEach((p) => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
    
            // Fade out over time
            let opacity = parseFloat(p.element.style.opacity);
            if (opacity > 0.1) {
                p.element.style.opacity = opacity - Effects.explosionFade;
                allParticlesFaded = false;
            }
        });
    
        if (!allParticlesFaded) {
            requestAnimationFrame(animateParticles);
        } else {
            explosion.remove(); // Remove once all particles fade out
        }
        }
    
        animateParticles();
    }
}
