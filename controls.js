


class Controls {

    constructor(simulator){
        this.sim = simulator;

        document.getElementById('run_button')
            .addEventListener('click', () => this.toggleRun());

    }

    toggleRun(){
        this.sim.is_running ? this.sim.stop() : this.sim.start();
    }


}

