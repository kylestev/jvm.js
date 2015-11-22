export function cloneSet(aSet) {
  let clone = new Set;
  for (let key of aSet.keys()) {
    clone.add(key);
  }
  return clone;
}

export function objectFromMap(iter) {
  let obj = {};
  for (let [key, val] of iter) {
    obj[key] = val;
  }
  return obj;
}

export class Timer {
  constructor() {
    this.started = 0;
    this.stopped = 0;
  }

  start() {
    this.started = process.hrtime();
    return this;
  }

  stop() {
    this.stopped = process.hrtime(this.started);
    return this;
  }

  get elapsed() {
    let [elapsedSeconds, elapsedNanos] = this.stopped;
    return (elapsedSeconds + (elapsedNanos / 1000000000));
  }

  static begin() {
    return (new Timer).start();
  }

  static time(fn) {
    let timer = Timer.begin();
    fn();
    return timer.stop().elapsed;
  }
}
