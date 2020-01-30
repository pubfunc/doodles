



let canvas$ = document.getElementById('particle_canvas');
let sim = new Simulator(canvas$);

let controls = new Controls(sim, canvas$);

document.onload = function(){
    sim.alignCanvas();
    sim.start();
};

window.onresize = function(){
    sim.alignCanvas();
};

SCENE_1.forEach(p => sim.addParticle(new Particle(p)));

sim.alignCanvas();
sim.start();




