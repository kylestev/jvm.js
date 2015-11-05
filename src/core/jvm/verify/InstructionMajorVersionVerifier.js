const WritingErrors = require('../../../errors').Writing;

import * as _ from 'lodash';
import { OPCODE_VERSIONS } from '../instructions/Opcodes';

class InstructionMajorVersionVerifier {

  constructor(classInfo) {
    this.classInfo = classInfo;
    this.unusableOpcodes = this.findUnusableOpcodes();
  }
  
  findUnusableOpcodes() {
    return _.flatten(_.filter(OPCODE_VERSIONS, (opcodes, version) => (version > this.classInfo.major)));
  }
  
  findInvalidMethodOpcodes(method) {
    let opcodes = _.pluck(method.instructions, 'opcode');
    return _.intersection(opcodes, this.unusableOpcodes);
  }
  
  verify() {
    return _.every(this.classInfo.methods, (method) => {
      let invalid = this.findInvalidMethodOpcodes(method);

      if (invalid.length > 0) {
        throw WritingErrors.UnsupportedOpcode(unusable[0], this.classInfo, method);
      }

      return true;
    });
  }
}

export {
  InstructionMajorVersionVerifier
};

