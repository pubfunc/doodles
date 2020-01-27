

class Simulator {

    softening = 2;
    terminal_velocity = 2;
    gamma = 0.9;
    scale = 1;

    particles = [];
    last_pulse = 0;
    is_running = false;

    animation_frame_ref = null;

    origin_x = 0;
    origin_y = 0;

    bound_left = -300;
    bound_right = 300;
    bound_top = -300;
    bound_bottom = 300;

    constructor(canvas$){
        this.canvas$ = canvas$;
        this.context = canvas$.getContext('2d');
    }

    addParticle(particle){
        this.particles.push(particle);
    }


    start(){
        this.is_running = true;
        this.pulse();
    }

    stop(){

        if(this.animation_frame_ref !== null){
            cancelAnimationFrame(this.animation_frame_ref);
        }

        this.is_running = false;
    }

    pulse(ts){

        if(!this.last_pulse) this.last_pulse = ts;

        this.updateVectors(ts);
        this.draw();

        this.animation_frame_ref = requestAnimationFrame((ts) => this.pulse(ts));
    }


    updateVectors(ts){

        let l = this.particles.length;

        const t = 1; //ts - this.last_pulse;

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
                const ds = (dx * dx) + (dy * dy);

                // calc force exterted by pj on pi
                const fi = (this.gamma * pj.m) / (ds * Math.sqrt(ds + this.softening));

                ax += dx * fi;
                ay += dy * fi;

            }

            pi.ax = Math.round(ax * 1000) / 1000;
            pi.ay = Math.round(ay * 1000) / 1000;

        }


        // update velocity and position vectors
        for(let i = 0; i < l; i++){
            const pi = this.particles[i];

            if(!pi.trail[pi.trail_i] || pi.trail[pi.trail_i].x !== pi.x || pi.trail[pi.trail_i].y !== pi.y){
                pi.trail_i++;

                if(pi.trail_i >= (pi.trail_length - 1)){
                    pi.trail_i = 0;
                }

                pi.trail[pi.trail_i] = {x: pi.x, y: pi.y};
            }

            pi.vx += pi.ax * t;
            pi.vy += pi.ay * t;

            pi.x += pi.vx * t;
            pi.y += pi.vy * t;


            if(pi.x <= this.bound_left && pi.vx < 0){
                pi.vx *= -1;
            }

            if(pi.x >= this.bound_right && pi.vx > 0){
                pi.vx *= -1;
            }

            if(pi.y <= this.bound_top && pi.vy < 0){
                pi.vy *= -1;
            }

            if(pi.y >= this.bound_bottom && pi.vy > 0){
                pi.vy *= -1;
            }


        }


    }

    draw(){

        let w = this.canvas$.width,
            h = this.canvas$.height;

        this.origin_x = w / 2;
        this.origin_y = h / 2;

        this.context.fillStyle = '#000';
        this.context.clearRect(0, 0, w, h);

        // draw origin
        this.context.strokeStyle = 'grey';
        this.context.beginPath();
        this.context.moveTo(this.origin_x, this.origin_y - 10);
        this.context.lineTo(this.origin_x, this.origin_y + 10);
        this.context.moveTo(this.origin_x - 10, this.origin_y);
        this.context.lineTo(this.origin_x + 10, this.origin_y);
        this.context.stroke();

        // draw boundary
        this.context.strokeStyle = 'grey';
        this.context.beginPath();
        this.context.moveTo(this.origin_x + this.bound_left,  this.origin_y + this.bound_top);
        this.context.lineTo(this.origin_x + this.bound_right, this.origin_y + this.bound_top);
        this.context.lineTo(this.origin_x + this.bound_right, this.origin_y + this.bound_bottom);
        this.context.lineTo(this.origin_x + this.bound_left,  this.origin_y + this.bound_bottom);
        this.context.lineTo(this.origin_x + this.bound_left,  this.origin_y + this.bound_top);
        this.context.stroke();

        for(let i = 0; i < this.particles.length; i++){
            const pi = this.particles[i];
            const x = this.origin_x + pi.x;
            const y = this.origin_y + pi.y;

            // draw tail
            let trail_size = pi.size,
                trail_op = 0.7,
                j = pi.trail_i;

            do{
                if(pi.trail[j]){
                    this.context.fillStyle = `rgba(255,255,255,${trail_op})`;
                    this.context.beginPath();
                    this.context.arc(
                        this.origin_x + pi.trail[j].x,
                        this.origin_y + pi.trail[j].y,
                        trail_size,
                        0, 2*Math.PI
                    );
                    this.context.fill();
                    trail_size -= 0.1;
                    trail_op -= 0.05;
                }

                if(j <= 0){
                    j = pi.trail_length - 1;
                }else{
                    j--;
                }

            }while(j !== pi.trail_i);

            // draw particle
            this.context.fillStyle = 'blue';
            this.context.beginPath();
            this.context.arc(x, y, pi.size, 0, 2*Math.PI);
            this.context.fill();

            // draw velocity
            this.context.strokeStyle = 'green';
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x + (pi.vx * 5), y + (pi.vy * 5));
            this.context.stroke();

            // draw tooltips
            this.context.fillStyle = 'green';
            this.context.fillText(`${pi.label} ${Math.round(pi.x)},${Math.round(pi.y)}`, x + 15, y + 15);
        }




    }

    alignCanvas(){
        this.canvas$.width = document.body.clientWidth;
        this.canvas$.height = document.body.clientHeight;
        this.draw();
    }

}

class Particle {

    trail_i = 0;
    trail_length = 30;
    trail = new Array(this.trail_length);

    constructor(params){
        this.color = params.color || '#fff';
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.m = params.m || 0;
        this.vx = params.vx || 0;
        this.vy = params.vy || 0;
        this.ax = params.ax || 0;
        this.ay = params.ay || 0;
        this.size = params.size || 4;
        this.label = params.label || 'X';
    }
}