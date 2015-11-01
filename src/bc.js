const core = require('./core');

let start = process.hrtime();

core.createLoader()
  .then((loader) => {
    return loader.loadJar(process.argv[2])
      .then((archive) => archive.unpack())
      .then((archive) => loader.loadClasses(archive))
      .then(() => {
        let [elapsedSeconds, elapsedNanos] = process.hrtime(start);
        let elapsed = (elapsedSeconds + (elapsedNanos / 1000000000));
        console.log('parsed after', elapsed, 'seconds');
      })
      .catch(console.error.bind(console));
  })
  .catch(console.error.bind(console));
