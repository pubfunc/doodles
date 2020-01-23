



let canvas = new Simulator(document.getElementById('particle_canvas'));

document.onload = function(){
    canvas.alignCanvas();
};

window.onresize = function(){
    canvas.alignCanvas();
};

console.log('init');