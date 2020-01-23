
console.log('Init source');

var $canvas = document.getElementById('particle_canvas');

var context = $canvas.getContext('2d');



var PARTICLE_COUNT = 3000;

//var GAMMA = 66.73 * Math.pow(10,-12);
var GAMMA = 0.05;

var TERMINAL_VELOCITY = 0.001;

var WIDTH = 1024;
var HEIGHT = 1024;

var start = null;
var lastPulseTime = null;

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


var dx, dy, r, nx, ny, a, v, G_m;
function pulse(timestamp){


  // update particles
  if(!lastPulseTime) lastPulseTime = timestamp;

  // delta t in seconds
  //var t = ((new Date).getTime() - lastPulseTime);
  var t = Math.round(timestamp - lastPulseTime);

  //console.log(t);

  var ml = massives.length;
  var pl = particles.length;
  // each massive
  for(var j = 0; j < ml; j++){

    G_m = GAMMA * massives[j].weight;

    for(var i = 0; i < pl; i++){

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

  lastPulseTime = timestamp;

}

function setup(){

  $canvas.width = WIDTH;
  $canvas.height = HEIGHT;

  // $canvas.addEventListener('mousemove', function(e){
  //   massives[0].pos_x = e.offsetX;
  //   massives[0].pos_y = e.offsetY;
  // });

  $canvas.addEventListener('click', function(e){
    massives.push({
      pos_x: e.offsetX,
      pos_y: e.offsetY,
      weight: 1
    });
  });
 
  var logoImg = context.createImageData(100,100);

  var rgba = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  };

  var iw= 300;
  var ih= 232;
  var image = new Image('img');

  image.onload = function(){


    console.log('image loaded');

    context.drawImage(image, 0, 0, iw, ih);

    var pixels = 0;
    var imageData = context.getImageData(0,0,iw,ih);
    var data = imageData.data;

    var h = (WIDTH / iw) * ih;

    for (var i=0;i<data.length;i+=4)
    {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      if(Math.random() < 0.2 && avg < 200 && data[i + 3] > 0.1){
        var px = (i / 4) % iw;
        var py = ((i / 4) / iw) + 20;

        particles.push(new Particle(Math.round(px / iw * WIDTH),Math.round(py / ih * h), 'rgb(' + [Math.round(Math.random() * 250), Math.round(Math.random() * 250), Math.round(Math.random() * 250)].join(',') + ')'));

        pixels++;
      }
    }

    console.log('pixels', pixels, px, py);

    image.style.display = 'none';

    requestAnimationFrame(draw);
  };

  // image.src = 'cc.png'; //300,232
  image.src = 'path6250.png'; //300,232
}

function draw(timestamp){

  if (!start) start = timestamp;
  var progress = timestamp - start;

  window.requestAnimationFrame(draw);

  context.fillStyle = '#000';
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = '#555';

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

  context.fillStyle = '#ffffff';

  //draw particles
  var size = 2;//Math.round(1 / ((particles[i].vel + 0.01) * 50));
  for(var i = 0; i < particles.length; i++){
      //draw a circle
      if(particles[i].pos_x > 0 && particles[i].pos_y > 0 && particles[i].pos_x < WIDTH && particles[i].pos_y < HEIGHT){

        context.fillStyle = particles[i].color;

        context.fillRect(particles[i].pos_x, particles[i].pos_y, size, size);
        // context.beginPath();
        // context.arc(Math.round(particles[i].pos_x), Math.round(particles[i].pos_y), 1, 0, Math.PI*2, true);
        // context.closePath();
        // context.fill();
      }
  }
  pulse(timestamp);

}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    return "rgb(" + [r, g, b].join(",") + ")";
}

setup();


