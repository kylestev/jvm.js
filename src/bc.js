const _ = require('lodash');
const core = require('./core');
let s = Date.now();

core.createLoader()
  .then((loader) => {
    // return loader.loadJar('/Users/kylestevenson/Downloads/jars/37.jar')
    return loader.loadJar('/Users/tyler/Programming/test.jar')
      .then((archive) => archive.unpack())
      .then((archive) => loader.loadClasses(archive))
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  })
  .catch(console.error.bind(console));
