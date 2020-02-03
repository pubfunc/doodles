

const SCENE_1 = [
    { label: 'A', x: 0, y: -200, mass: 0.001, vx: 2.3, vy: 0 },
    { label: 'B', x: 0, y: -150, mass: 0.001, vx: 2.5, vy: 0 },
    { label: 'C', x: 0, y: -100, mass: 0.001, vx: 3, vy: 0 },
    { label: 'D', x: 0, y: -50, mass: 0.001, vx: 4, vy: 0 },
    { label: 'E', x: 0, y: 50, mass: 0.001, vx: 4, vy: 0 },
    { label: 'F', x: 50, y: 150, mass: 10, vx: -7, vy: 0, size: 10 },
    { label: 'M', x: 0, y: 0, mass: 10000, vx: 0, vy: 0, size: 20 },
];

const SCENE_2 = [
    { label: 'A', x: 0, y: -250, mass: 200, vx: 45, vy: 0, size: 6 },
    { label: 'A1', x: 0, y: -260, mass: 1, vx: 56, vy: 0, size: 2 },
    { label: 'B', x: 0, y: 250, mass: 200, vx: -45, vy: 0, size: 6 },
    { label: 'B1', x: 0, y: 260, mass: 1, vx: -56, vy: 0, size: 2 },
    { label: 'M', x: 0, y: 0, mass: 100000, vx: 0, vy: 0, size: 15 },
];

const SCENE_RANDOM = [];

for(let i = 0; i < 1000; i++){
    SCENE_RANDOM.push({
        label: 'R' + i,
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        mass: 0.01,
        vx: (Math.random() * 10) - 5,
        vy: (Math.random() * 10) - 5,
        size: Math.random() * 3,
        color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    });
}

SCENE_RANDOM.push({ label: 'A', x: -200, y: 0, mass: 500, vx: 0, vy: 12, size: 10, color: '#333' });
SCENE_RANDOM.push({ label: 'B', x: 200, y: 0, mass: 500, vx: 0, vy: -12, size: 10, color: '#333' });

SCENE_RANDOM.push({ label: 'B', x: 0, y: 0, mass: 5000, vx: 0, vy: 0, size: 20, color: '#333' });


let canvas$ = document.getElementById('particle_canvas');
let sim = new Simulator(canvas$, SCENE_RANDOM);

let controls = new Controls(sim, canvas$);

document.onload = function(){
    sim.alignCanvas();
    sim.start();
};

window.onresize = function(){
    sim.alignCanvas();
};




sim.alignCanvas();
sim.reset();

