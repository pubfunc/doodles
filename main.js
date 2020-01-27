



let sim = new Simulator(document.getElementById('particle_canvas'));

sim.addParticle(new Particle({
    label: 'A',
    x: 0,
    y: -200,
    m: 0.001,
    vx: 2.3,
    vy: 0
}));
sim.addParticle(new Particle({
    label: 'B',
    x: 0,
    y: -150,
    m: 0.001,
    vx: 2.5,
    vy: 0
}));
sim.addParticle(new Particle({
    label: 'C',
    x: 0,
    y: -100,
    m: 0.001,
    vx: 3,
    vy: 0
}));
sim.addParticle(new Particle({
    label: 'D',
    x: 0,
    y: -50,
    m: 0.001,
    vx: 4,
    vy: 0
}));
sim.addParticle(new Particle({
    label: 'M',
    x: 0,
    y: 0,
    m: 1000,
    vx: 0,
    vy: 0,
    size: 20
}));


let controls = new Controls(sim);



document.onload = function(){
    sim.alignCanvas();
};

window.onresize = function(){
    sim.alignCanvas();
};

sim.alignCanvas();