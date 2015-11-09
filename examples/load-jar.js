import { Jar } from './core/Jar';
let ConstantInstruction = require('./core/jvm/instructions/ConstantInstruction');

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
        cls.methods.forEach(method => {//method.instructions.forEach(insn => {
          console.log(method.name + method.desc, method.parameters, method.returnType)
          // if (insn instanceof ConstantInstruction) {
          //   // if ( ! (insn.tag in seen)) {
          //   //   console.log(insn.tag, insn.poolInfo, insn.pool.valueAt(insn.instruction.val));
          //   //   seen[insn.tag] = true;
          //   // }
          //   let val = insn.val;
          //   if (val === undefined) {
          //     console.log('undefined', insn.tag);
          //   } else {
          //     console.log(val)
          //   }
          // }
        })
    }
  })
  .catch(console.error.bind(console));
