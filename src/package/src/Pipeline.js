import { Timer } from './util';
import { EventEmitter } from 'events';

class Pipeline extends EventEmitter {
  constructor() {
    super();
    this.steps = [];
    this.results = {};
  }

  after(fn) {
    this.on('execution-ended', fn);
  }

  before(fn) {
    this.on('execution-started', fn);
  }

  addStep(name, lambda) {
    this.steps.push([name, lambda]);
  }

  execute(jar) {
    this.emit('execution-started', jar);
    let elapsed = Timer.time(() => {
      this._runSteps(jar);
    });
    this.emit('execution-ended', elapsed);
  }

  stepResult(name) {
    return this.results[name].result;
  }

  _runSteps(jar) {
    for (let [name, lambda] of this.steps) {
      this.emit('step-started', name);
      let elapsed = this._runStep(jar, name, lambda);
      this.emit('step-ended', name, elapsed);
    }
  }

  _runStep(jar, name, lambda) {
    let result = null;
    let elapsed = Timer.time(() => {
      result = lambda(jar);
    });
    this.results[name] = {elapsed, result };
    return elapsed;
  }
}

export {
  Pipeline
};
