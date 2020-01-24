



let sim = new Simulator(document.getElementById('particle_canvas'));

sim.addParticle(new Particle(1000, 100, 100, null));
sim.addParticle(new Particle(1000, 100, 200, null));


document.onload = function(){
    sim.alignCanvas();
};

window.onresize = function(){
    sim.alignCanvas();
};

sim.alignCanvas();
sim.pulse();