
console.log('Init source');

var $canvas = document.getElementById('particle_canvas');

var context = $canvas.getContext('2d');



var PARTICLE_MASS = 0.001; // kg
var PARTICLE_COUNT = 15000;

var MASSIVE_MASS = 1.0; // kg
var GAMMA = 0.00000001;

var TERMINAL_VELOCITY = 200;

var WIDTH = 1920;
var HEIGHT = 1080;

var lastPulseTime = (new Date).getTime();

//
// particle
// [position_x, position_y, velocity_x, velocity_x]
//
// massive
// [position_x, position_y]
//
//  - Particles are low mass objects moving within a frictionless world
//  - Massives are extremely high mass and is not affected by gravity
//  - Particles experience a gravitational pull towards Massives
//      - F = ( G * M * m ) / r^2
//      - F = m * a
//
//      - a = (G * M) / r^2
//
//

var particles = [];
var massives = [];

function Particle(pos_x, pos_y){
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.vel_x = 0;
  this.vel_y = 0;
}

function Massive(pos_x, pos_y, weight){
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.weight = weight;
}


function pulse(){


  // update particles

  // delta t in milliseconds
  var sinceLastPulse = (new Date).getTime() - lastPulseTime;

  lastPulseTime = (new Date).getTime();

  for(var i = 0; i < particles.length; i++){

    // each massive
    for(var j = 0; j < massives.length; j++){

      var dx = massives[j].pos_x - particles[i].pos_x;
      var dy = massives[j].pos_y - particles[i].pos_y;

      var r = Math.sqrt(dx * dx + dy * dy);

      //if(r < 1000) r = 1000;
      //if(r > 1000) r = 1000;

      var ax = Math.min(dx / Math.pow(r, 3), 20);
      var ay = Math.min(dy / Math.pow(r, 3), 20);

      particles[i].vel_x += (ax * sinceLastPulse);
      particles[i].vel_y += (ay * sinceLastPulse);

      // // delta distance between particles
      // var d_x = particles[i].pos_x - massives[j].pos_x;
      // var d_y = particles[i].pos_y - massives[j].pos_y;
      //
      // // culculate once
      // var G_M = 1000000; //GAMMA * massives[j].weight;
      //
      // // acceleration x and y for current particle
      // var a_x = G_M / Math.pow(d_x, 2);
      // var a_y = G_M / Math.pow(d_y, 2);
      //
      // particles[i].vel_x += a_x * sinceLastPulse;
      // particles[i].vel_y += a_y * sinceLastPulse;
      //
      // if(particles[i].vel_x > TERMINAL_VELOCITY) particles[i].vel_x = TERMINAL_VELOCITY;
      // if(particles[i].vel_y > TERMINAL_VELOCITY) particles[i].vel_y = TERMINAL_VELOCITY;
      //
      // particles[i].pos_x += (particles[i].pos_x < massives[j].pos_x) ? (particles[i].vel_x * sinceLastPulse) : (-1 * particles[i].vel_x * sinceLastPulse);
      // particles[i].pos_y += (particles[i].pos_y < massives[j].pos_y) ? (particles[i].vel_y * sinceLastPulse) : (-1 * particles[i].vel_y * sinceLastPulse);
    }
    particles[i].pos_x += (particles[i].vel_x * sinceLastPulse);
    particles[i].pos_y += (particles[i].vel_y * sinceLastPulse);

  }

  //console.log(sinceLastPulse);
  // console.log('dis', d_x, d_y);
  // console.log('vel', particles[0].vel_x, particles[0].vel_x);
  // console.log('pos', particles[0].pos_x, particles[0].pos_y);

}

function setup(){

  $canvas.width = WIDTH;
  $canvas.height = HEIGHT;

  for(var i = 0; i < PARTICLE_COUNT; i++){
    particles.push(new Particle(Math.random()*WIDTH,Math.random()*HEIGHT));
  }

  massives.push(new Massive(Math.random()*WIDTH,Math.random()*HEIGHT,10));
  massives.push(new Massive(Math.random()*WIDTH,Math.random()*HEIGHT,10));


}

function draw(){
  requestAnimationFrame(draw);
  //console.debug('draw');
  context.clearRect(0, 0, WIDTH, HEIGHT);

  pulse();

  console.log(Math.round(Math.sqrt(particles[0].vel_x * particles[0].vel_x + particles[0].vel_y * particles[0].vel_y)));

  //draw points
  for(var i = 0; i < particles.length; i++){
      //draw a circle
      if(particles[i].pos_x > 0 && particles[i].pos_y > 0 && particles[i].pos_x < WIDTH && particles[i].pos_y < HEIGHT){
        context.fillStyle = '#ffffff';//toColor(Math.round(Math.sqrt(particles[i].vel_x * particles[i].vel_x + particles[i].vel_y * particles[i].vel_y) * 5000000));
        context.fillRect(particles[i].pos_x, particles[i].pos_y, 2, 2);
        // context.beginPath();
        // context.arc(Math.round(particles[i].pos_x), Math.round(particles[i].pos_y), 1, 0, Math.PI*2, true);
        // context.closePath();
        // context.fill();
      }
  }

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

}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    return "rgb(" + [r, g, b].join(",") + ")";
}

setup();

draw();
