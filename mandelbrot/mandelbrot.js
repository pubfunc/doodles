(function () {
    // Create Canvas
    const WIDTH = 1300;
    const HEIGHT = 1000;
    const N = 200;
    const magnificationFactor = 500;
    // const panX = 0.6;
    // const panY = 0.65;
    const panX = -(WIDTH / 2) - 150;
    const panY = -(HEIGHT / 2);
    const myCanvas = document.createElement("canvas");
    myCanvas.width = WIDTH;
    myCanvas.height = HEIGHT;
    document.body.appendChild(myCanvas);
    var ctx = myCanvas.getContext("2d");
    let image = ctx.createImageData(WIDTH, HEIGHT);

    function checkIfBelongsToMandelbrotSet(real, imaginary) {
        let re = real;
        let im = imaginary;
        for (let i = 0; i < N; i++) {
            let temp_re = re * re - im * im + real;
            let temp_im = 2 * re * im + imaginary;
            re = temp_re;
            im = temp_im;

            // Return a number as a percentage
            if (re * im > 5)
                return i / N;
        }
        return 0;   // Return zero if in set        
    }

    // Start drawing

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#fff';

    let im, re;

    for (var x = 0; x < WIDTH; x++) {
        for (var y = 0; y < HEIGHT; y++) {

            im = (x + panX) / magnificationFactor;
            re = (y + panY) / magnificationFactor;
    
            var belongsToSet = checkIfBelongsToMandelbrotSet(im,re);
            if (belongsToSet == 0) {
                image.data[(x * 4) + (y * WIDTH * 4)] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 1] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 2] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 3] = 255;
            } else {
                image.data[(x * 4) + (y * WIDTH * 4)] = belongsToSet * 255 + 20;
                image.data[(x * 4) + (y * WIDTH * 4) + 1] = belongsToSet * 255 + 20;
                image.data[(x * 4) + (y * WIDTH * 4) + 2] = belongsToSet * 255 + 20;
                image.data[(x * 4) + (y * WIDTH * 4) + 3] = 255;
            }
        }

    }


    ctx.putImageData(image, 0, 0);

})();