

const GAMMA = 5; // 6.673e-11; // gravitational constant
const SOLAR_MASS = 1.98892e30;
const EPS = 20; //1.98892e30; // softening parameter (to avoid infinities)

export class Universe {

    constructor(params){
        this.particles = params
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
