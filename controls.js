


class Controls {

    isDragging = false;

    constructor(simulator, $canvas){
        this.sim = simulator;
        this.canvas$ = canvas$;

        document.getElementById('run_button')
            .addEventListener('click', () => this.toggleRun());

        canvas$.addEventListener('mousedown', (event) => {
            console.log('event');
            this.isDragging = true;
        });

        window.addEventListener('mouseup', (event) => {
            console.log('event');
            this.isDragging = false;
        });

        window.addEventListener('mousemove', (event) => {
            if(this.isDragging){
                this._onDrag(event);
                console.log('event');
            }
        });

    }

    toggleRun(){
        this.sim.is_running ? this.sim.stop() : this.sim.start();
    }


    _onDrag(event){

    }

}

