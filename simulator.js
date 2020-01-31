
const GAMMA = 5; // 6.673e-11; // gravitational constant
const SOLAR_MASS = 1.98892e30;
const EPS = 20; //1.98892e30; // softening parameter (to avoid infinities)

class Simulator {

    terminal_force = 0.01;
    scale = 1;
    time_scale = 0.1;

    particles = [];
    init_particles = [];
    last_pulse = 0;
    is_running = false;

    animation_frame_ref = null;

    origin_x = 0;
    origin_y = 0;

    bound_left = -2000;
    bound_right = 2000;
    bound_top = -2000;
    bound_bottom = 2000;


    constructor(canvas$, particleData){

        this.init_particles = particleData;

        this.canvas$ = canvas$;
        this.context = canvas$.getContext('2d');
    }

    reset(){
        this.stop();
        let data = JSON.parse(JSON.stringify(this.init_particles));
        this.particles = data.map(data => new Particle(data));
        this.draw();
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

        const t = this.time_scale; //ts - this.last_pulse;

        // update acceleration vectors
        for(let i = 0; i < l; i++){

            const pi = this.particles[i];
            pi.resetForce();

            for(let j = 0; j < l; j++){
                if(i === j) continue;
                const pj = this.particles[j];
                pi.addForce(pj);
            }

        }


        // update velocity and position vectors
        for(let i = 0; i < l; i++){
            const pi = this.particles[i];

            // if(!pi.trail[pi.trail_i] || pi.trail[pi.trail_i].x !== pi.x || pi.trail[pi.trail_i].y !== pi.y){
            //     pi.trail_i++;

            //     if(pi.trail_i >= (pi.trail_length - 1)){
            //         pi.trail_i = 0;
            //     }

            //     pi.trail[pi.trail_i] = {x: pi.x, y: pi.y};
            // }

            pi.updateVectors(t);


            if(pi.x <= this.bound_left && pi.vx < 0){
                pi.vx *= -1;
                pi.x = this.bound_left;
            }

            if(pi.x >= this.bound_right && pi.vx > 0){
                pi.vx *= -1;
                pi.x = this.bound_right;
            }

            if(pi.y <= this.bound_top && pi.vy < 0){
                pi.vy *= -1;
                pi.y = this.bound_top;
            }

            if(pi.y >= this.bound_bottom && pi.vy > 0){
                pi.vy *= -1;
                pi.y = this.bound_bottom;
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
        // this.context.strokeStyle = 'grey';
        // this.context.beginPath();
        // this.context.moveTo(this.origin_x, this.origin_y - 10);
        // this.context.lineTo(this.origin_x, this.origin_y + 10);
        // this.context.moveTo(this.origin_x - 10, this.origin_y);
        // this.context.lineTo(this.origin_x + 10, this.origin_y);
        // this.context.stroke();

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

            // this.drawTrail(pi);

            // draw particle
            this.context.fillStyle = pi.color;
            this.context.beginPath();
            this.context.arc(x, y, pi.size, 0, 2*Math.PI);
            this.context.fill();

            // draw velocity
            // this.context.strokeStyle = 'green';
            // this.context.beginPath();
            // this.context.moveTo(x, y);
            // this.context.lineTo(x + (pi.vx), y + (pi.vy));
            // this.context.stroke();

            // draw acc
            // this.context.strokeStyle = 'red';
            // this.context.beginPath();
            // this.context.moveTo(x, y);
            // this.context.lineTo(x + (pi.ax), y + (pi.ay));
            // this.context.stroke();

            // draw force
            // this.context.strokeStyle = 'blue';
            // this.context.beginPath();
            // this.context.moveTo(x, y);
            // this.context.lineTo(x + (pi.fx / 100), y + (pi.fy / 100));
            // this.context.stroke();

            // draw tooltips
            // this.context.fillStyle = 'green';
            // this.context.fillText(`${pi.label} ${Math.round(pi.x)},${Math.round(pi.y)}`, x + 15, y + 15);
        }




    }

    drawTrail(pi){

        if(pi.trail_length === 0) return;

        // draw trail
        let trail_size = pi.size,
            trail_size_mod = pi.size / pi.trail_length,
            trail_opacity = 0.5,
            trail_opacity_mod = pi.vel() / 100,
            j = pi.trail_i;

        do{
            if(pi.trail[j]){
                this.context.fillStyle = `rgba(255,255,255,${trail_opacity})`;
                this.context.beginPath();
                this.context.arc(
                    this.origin_x + pi.trail[j].x,
                    this.origin_y + pi.trail[j].y,
                    trail_size,
                    0, 2*Math.PI
                );
                this.context.fill();
                trail_size = Math.max(trail_size - trail_size_mod, 0);
                trail_opacity = Math.max(trail_opacity - trail_opacity_mod, 0);
            }

            if(j <= 0){
                j = pi.trail_length - 1;
            }else{
                j--;
            }

        }while(j !== pi.trail_i);

    }

    alignCanvas(){
        this.canvas$.width = document.body.clientWidth;
        this.canvas$.height = document.body.clientHeight;
        this.draw();
    }

}

// See http://physics.princeton.edu/~fpretori/Nbody/code.htm
class Particle {

    trail_i = 0;


    constructor(params){

        this.x = params.x || 0;
        this.y = params.y || 0;
        this.vx = params.vx || 0;
        this.vy = params.vy || 0;
        this.ax = params.ax || 0;
        this.ay = params.ay || 0;
        this.fx = params.fx || 0;
        this.fy = params.fy || 0;

        this.mass = params.mass || 0;
        this.size = params.size || 4;

        this.label = params.label || 'X';
        this.color = params.color || '#fff';
        this.trail_length = 0;
        this.trail = new Array(this.trail_length);
    }

    /**
     * Update velocity and position for timestep dt
     */
    updateVectors(dt){

        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;
        this.vx += dt * this.ax;
        this.vy += dt * this.ay;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

    }

    resetForce(){
        this.fx = 0;
        this.fy = 0;
    }

    /**
     * Add to the net force b is acting on a
     */
    addForce(b){
        let a = this;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        const f = (GAMMA * a.mass * b.mass) / (d*d + EPS);
        a.fx += f * dx / d;
        a.fy += f * dy / d;
    }

    acc(){
        return Math.sqrt(this.ax*this.ax + this.ay * this.ay);
    }

    vel(){
        return Math.sqrt(this.vx*this.vx + this.vy * this.vy);
    }

    for(){
        return Math.sqrt(this.fx*this.fx + this.fy * this.fy);
    }

}

class ParticleCanon {

    x1 = 0;
    x2 = 0;
    y1 = 0;
    y0 = 0;

}