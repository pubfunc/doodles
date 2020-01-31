


class UniverseCanvas {

    origin_x = 0;
    origin_y = 0;

    constructor(){
        this.canvas$ = canvas$;
        this.context = canvas$.getContext('2d');
    }

    draw(particles){

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

        for(let i = 0; i < particles.length; i++){
            const pi = this.particles[i];
            this.drawParticle(pi);
        }

    }

    drawParticle(pi){

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

    align(){
        this.canvas$.width = document.body.clientWidth;
        this.canvas$.height = document.body.clientHeight;
        this.draw();
    }

}