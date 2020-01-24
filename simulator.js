

class Simulator {

    softening = 0.001;
    terminal_velocity = 0.001;
    max_partcle_count = 3000;
    gamma = 0.05;

    particles = [];
    last_pulse = 0;

    constructor(canvas$){
        this.canvas$ = canvas$;
        this.context = canvas$.getContext('2d');
    }

    addParticle(particle){
        this.particles.push(particle);
    }


    pulse(ts){

        if(!this.last_pulse) this.last_pulse = ts;

        this.updateVectors(ts);
        this.draw();

        requestAnimationFrame((ts) => this.pulse(ts));

    }


    updateVectors(ts){

        let l = this.particles.length;

        // time passed since last pulse
        const t = ts - this.last_pulse;

        console.log(t, ts - this.last_pulse);
    
        // update acceleration vectors
        for(let i = 0; i < l; i++){

            // total acc
            let ax = 0, ay = 0;
            const pi = this.particles[i];

            for(let j = 0; j < l; j++){
                if(i === j) continue;
                
                const pj = this.particles[j];

                // calc distance between particles
                const dx = pj.x - pi.x;
                const dy = pj.y - pi.y;
                const d = Math.sqrt((dx * dx) + (dy * dy));

                // calc force exterted by pj on pi
                const fi = (this.gamma * pj.m) / (d + this.softening);

                ax += dx * fi;
                ay += dy * fi;

            }

            pi.ax = ax;
            pi.ay = ay;

        }


        // update velocity vectors
        for(let i = 0; i < l; i++){
            const pi = this.particles[i];

            pi.vx += pi.ax * t;
            pi.vy += pi.ay * t;

            pi.dx += pi.vx * t;
            pi.dy += pi.vy * t;

        }


    }

    draw(){

        let w = this.canvas$.width,
            h = this.canvas$.height,
            size = 2;

        this.context.fillStyle = '#000';
        this.context.clearRect(0, 0, w, h);


        this.context.fillStyle = '#555';
        for(let i = 0; i < this.particles.length; i++){
            const pi = this.particles[i];
            this.context.fillRect(pi.x, pi.y, size, size);
        }

    }

    alignCanvas(){
        this.canvas$.width = document.body.clientWidth;
        this.canvas$.height = document.body.clientHeight;
        console.log('align', this.canvas$.width, this.canvas$.height, document.body);
    }

}

class Particle {
    constructor(m, x, y, color){
        this.color = color;
        this.x = x;
        this.y = y;
        this.m = m;
        this.vx = 1;
        this.vy = 1;
        this.ax = 0;
        this.ay = 0;
    }
}