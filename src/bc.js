const _ = require('lodash');
const bytecode = require('./bytecode');
let s = Date.now();

bytecode.createLoader()
  .then((loader) => {
    // return loader.loadJar('/Users/kylestevenson/Downloads/jars/37.jar')
    return loader.loadJar('/Users/kylestevenson/hexbotee-updater/Test Jar.jar')
      .then((archive) => archive.unpack())
      .then((archive) => loader.loadClasses(archive))
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  })
  .catch(console.error.bind(console));
