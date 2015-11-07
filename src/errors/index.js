import { OPCODE_TO_NAME } from '../core/jvm/instructions/Opcodes';

let Parsing = {
  InvalidClassFileFormat: new Error('Invalid class file format!')
};

let Writing = {
  UnsupportedOpcode: (opcode, classInfo, method) => {
    return new Error(OPCODE_TO_NAME[opcode] + ' is not supported on major ' + classInfo.major + 
      ' in ' + classInfo.name + '#' + method.name + method.desc);
  }
}

let NotImplementedError = new Error('This has not yet been implemented.');

export {
  Parsing,
  Writing,
  NotImplementedError
}
