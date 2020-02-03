(function() {
    // Create Canvas
    const WIDTH = 2000;
    const HEIGHT = 2000;
    var myCanvas = document.createElement("canvas");
    myCanvas.width=WIDTH;
    myCanvas.height=HEIGHT;
    document.body.appendChild(myCanvas);
    var ctx = myCanvas.getContext("2d");
    let image = ctx.createImageData(WIDTH,HEIGHT);

    function checkIfBelongsToMandelbrotSet(x,y) {
        var realComponentOfResult = x;
        var imaginaryComponentOfResult = y;
        var maxIterations = 300;
        for(var i = 0; i < maxIterations; i++) {
             var tempRealComponent = realComponentOfResult * realComponentOfResult
                                     - imaginaryComponentOfResult * imaginaryComponentOfResult
                                     + x;
             var tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult
                                     + y;
             realComponentOfResult = tempRealComponent;
             imaginaryComponentOfResult = tempImaginaryComponent;
    
             // Return a number as a percentage
             if(realComponentOfResult * imaginaryComponentOfResult > 5) 
                return (i/maxIterations * 100);
        }
        return 0;   // Return zero if in set        
    }        

    // Start drawing
    var magnificationFactor = 8000;
    var panX = 0.6;
    var panY = 0.65;
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,WIDTH, HEIGHT);
    ctx.fillStyle = '#fff';
    for(var x=0; x < WIDTH; x++) {
       for(var y=0; y < HEIGHT; y++) {
           var belongsToSet = 
                checkIfBelongsToMandelbrotSet(x/magnificationFactor - panX, 
                                              y/magnificationFactor - panY);

            if(belongsToSet == 0) {
                image.data[(x * 4) + (y * WIDTH * 4)] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 1] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 2] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 3] = 2555;
            } else {
                image.data[(x * 4) + (y * WIDTH * 4)] = belongsToSet / 100 * 255;
                image.data[(x * 4) + (y * WIDTH * 4) + 1] = belongsToSet;
                image.data[(x * 4) + (y * WIDTH * 4) + 2] = 0;
                image.data[(x * 4) + (y * WIDTH * 4) + 3] = 255;
            }           
       } 

       ctx.fillRect(0,0,x/WIDTH, HEIGHT);
    }

    ctx.putImageData(image, 0, 0);

})();