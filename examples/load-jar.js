import { Jar } from '../src/core/Jar';
let ConstantInstruction = require('../src/core/jvm/instructions/ConstantInstruction');

let start = process.hrtime();

let seen = {};
Jar.unpack(process.argv[2])
  .then((jar) => {
    let [elapsedSeconds, elapsedNanos] = process.hrtime(start);
    let elapsed = (elapsedSeconds + (elapsedNanos / 1000000000));
    console.log('parsed jar contents after', elapsed, 'seconds');

    for (let [name, cls] of jar) {
      if (cls.name === 'client') {
        console.log('found client class!');
        console.log(JSON.stringify({
          name: cls.name,
          superName: cls.superName,
          methodCount: cls.methods.length,
          fieldCount: cls.fields.length
        }, null, 2));
      }
    }
  })
  .catch(console.error.bind(console));
