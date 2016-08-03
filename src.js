
console.log('Init source');

var $canvas = document.getElementById('particle_canvas');

var context = $canvas.getContext('2d');



var PARTICLE_COUNT = 5000;

//var GAMMA = 66.73 * Math.pow(10,-12);
var GAMMA = 0.05;

var TERMINAL_VELOCITY = 0.001;

var WIDTH = 800;
var HEIGHT = 800;

var lastPulseTime = (new Date).getTime();

//
// particle
// [position_x, position_y, velocity_x, velocity_x]
//
// massive
// [position_x, position_y]
//
//
//

var particles = [];
var massives = [];

function Particle(pos_x, pos_y, color){
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.vel_x = 0;
  this.vel_y = 0;
  this.weight = 1000;
  // absolute velocity
  this.vel = 0;
  this.color = color;
}

function Massive(pos_x, pos_y, weight){
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.weight = weight;
}


function pulse(){


  // update particles

  // delta t in seconds
  var t = ((new Date).getTime() - lastPulseTime);

  lastPulseTime = (new Date).getTime();

  var dx, dy, r, nx, ny, a, v, G_m;


  // each massive
  for(var j = 0; j < massives.length; j++){

    G_m = GAMMA * massives[j].weight;

    for(var i = 0; i < particles.length; i++){

      //  - Particles are low mass objects moving within frictionless space
      //  - Massives are extremely high mass and is not affected by gravity
      //  - Particles experience a gravitational pull towards Massives
      //      - F = ( G * M * m ) / r^2
      //      - F = m * a
      //
      //      - a = (G * M) / r^2

      dx = massives[j].pos_x - particles[i].pos_x;
      dy = massives[j].pos_y - particles[i].pos_y;

      // absolute length between massive and particle
      r = Math.sqrt(dx * dx + dy * dy);

      //r = Math.max(1, r);

      // normalized vector
      nx = dx / r;
      ny = dy / r;

      a = G_m / (r * r);

      particles[i].vel = Math.min(a * t, TERMINAL_VELOCITY);

      // var ax = nx * a;
      // var ay = ny * a;

      //particles[i].vel = v;
      particles[i].vel_x += nx * particles[i].vel;
      particles[i].vel_y += ny * particles[i].vel;
      particles[i].pos_x += (particles[i].vel_x * t);
      particles[i].pos_y += (particles[i].vel_y * t);
    }

    //console.log(particles[i].vel);
  }

}

function setup(){

  $canvas.width = WIDTH;
  $canvas.height = HEIGHT;

  for(var i = 0; i < PARTICLE_COUNT; i++){
    particles.push(new Particle(Math.random()*WIDTH,Math.random()*HEIGHT, 'rgb(' + [Math.round(Math.random() * 250), Math.round(Math.random() * 250), Math.round(Math.random() * 250)].join(',') + ')'));
  }

  // massives.push(new Massive(Math.random()*WIDTH,Math.random()*HEIGHT,Math.random() * 1000000));
  // massives.push(new Massive(Math.random()*WIDTH,Math.random()*HEIGHT,Math.random() * 1000000));
  // massives.push(new Massive(Math.random()*WIDTH,Math.random()*HEIGHT,Math.random() * 1000000));
  //massives.push(new Massive(Math.random()*WIDTH,Math.random()*HEIGHT,Math.random() * 1000000));

  massives.push(new Massive(400,400,10000000.00));

  //window.setInterval(draw, 20);

}

function draw(){
  //;
  //console.debug('draw');
  pulse();

  context.clearRect(0, 0, WIDTH, HEIGHT);


  //console.log(Math.round(Math.sqrt(particles[0].vel_x * particles[0].vel_x + particles[0].vel_y * particles[0].vel_y)));

  context.fillStyle = '#222222';

  // draw massives
  for(i = 0; i < massives.length; i++){
    //draw a circle
    if(massives[i].pos_x > 0 && massives[i].pos_y > 0 && massives[i].pos_x < WIDTH && massives[i].pos_y < HEIGHT){
      context.beginPath();
      context.arc(massives[i].pos_x, massives[i].pos_y, 10, 0, Math.PI*2, true);
      context.closePath();
      context.fill();
    }
  }

  context.fillStyle = '#ffffff'; //toColor(Math.round(Math.sqrt(particles[i].vel_x * particles[i].vel_x + particles[i].vel_y * particles[i].vel_y) * 5000000));

  //draw particles
  for(var i = 0; i < particles.length; i++){
      //draw a circle
      if(particles[i].pos_x > 0 && particles[i].pos_y > 0 && particles[i].pos_x < WIDTH && particles[i].pos_y < HEIGHT){

        context.fillStyle = particles[i].color;
        var size = 1 / ((particles[i].vel + 0.01) * 60)  ;

        context.fillRect(particles[i].pos_x, particles[i].pos_y, size, size);
        // context.beginPath();
        // context.arc(Math.round(particles[i].pos_x), Math.round(particles[i].pos_y), 1, 0, Math.PI*2, true);
        // context.closePath();
        // context.fill();
      }
  }
  requestAnimationFrame(draw);

}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    return "rgb(" + [r, g, b].join(",") + ")";
}

setup();
requestAnimationFrame(draw);
//draw();
