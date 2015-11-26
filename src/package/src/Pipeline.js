import { Timer } from './util';
import { EventEmitter } from 'events';

class Pipeline extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.steps = [];
    this.results = {};
  }

  after(fn) {
    let name = 'execution';
    if (typeof fn === 'string') {
      name = fn;
      fn = arguments[1];
    }
    this.on(name + '-ended', fn);
  }

  afterStep(name, fn) {
    this.on('step-ended', (evName) => {
      if (name === evName) {
        fn(this.results[name].result, this.results[name].elapsed);
      }
    });
  }

  before(fn) {
    let name = 'execution';
    if (typeof fn === 'string') {
      name = fn;
      fn = arguments[1];
    }
    this.on(name + '-started', fn);
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

  log() {
    let args = [...arguments];
    args[0] = '[' + this.name + '] ' + args[0];
    console.log.apply(console, args);
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
