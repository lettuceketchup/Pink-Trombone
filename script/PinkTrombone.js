/*
    TODO
        *
*/

import {} from "./audio/nodes/noise/AudioNode.js";
import {} from "./audio/nodes/pinkTrombone/AudioNode.js";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

class PinkTrombone {
    addModules(audioContext) {
        if(audioContext.audioWorklet !== undefined) {
            return Promise.all([
                audioContext.audioWorklet.addModule("/script/audio/nodes/noise/processors/workletProcessors/WorkletProcessor.js"),
                audioContext.audioWorklet.addModule("/script/audio/nodes/pinkTrombone/processors/workletProcessors/WorkletProcessor.js"),
            ]);
        }
        else {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    }

    constructor(audioContext) {
        this.loadPromise = 
            this.addModules(audioContext)
                .then(() => {
                    this.audioContext = audioContext;
                    this.setupAudioGraph();
                    return this.audioContext;
                });
    }

    setupAudioGraph() {
        this._noise = this.audioContext.createNoise();

        this._aspirateFilter = this.audioContext.createBiquadFilter();
                this._aspirateFilter.type = "bandpass";
                this._aspirateFilter.frequency.value = 500;
                this._aspirateFilter.Q.value = 0.5;
            
        this._fricativeFilter = this.audioContext.createBiquadFilter();
            this._fricativeFilter.type = "bandpass";
            this._fricativeFilter.frequency.value = 1000;
            this._fricativeFilter.Q.value = 0.5;

        this._pinkTromboneNode = this.audioContext.createPinkTromboneNode();

        this._noise.connect(this._aspirateFilter);
            this._aspirateFilter.connect(this._pinkTromboneNode.noise);

        this._noise.connect(this._fricativeFilter);
            this._fricativeFilter.connect(this._pinkTromboneNode.noise);
    }

    get parameters() {
        return this._pinkTromboneNode._parameters;
    }

    connect() {
        return this._pinkTromboneNode.connect(...arguments);
    }
    disconnect() {
        return this._pinkTromboneNode.disconnect(...arguments);
    }

    start() {
        this._noise.start();
    }
    stop() {
        this._noise.stop();
    }

    get constrictions() {
        return this._pinkTromboneNode.constrictions;
    }
    newConstriction() {
        return this._pinkTromboneNode.newConstriction(...arguments);
    }
    removeConstriction(constriction) {
        this._pinkTromboneNode.removeConstriction(constriction);
    }

    getProcessor() {
        return this._pinkTromboneNode.getProcessor();
    }
}

window.AudioContext.prototype.createPinkTrombone = function() {
    return new PinkTrombone(this);
}

export default PinkTrombone;