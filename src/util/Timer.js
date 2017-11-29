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
