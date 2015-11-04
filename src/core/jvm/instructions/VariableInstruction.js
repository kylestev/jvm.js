import * as _ from 'lodash';

const InstructionWrapper = require('./InstructionWrapper');
const ImmediateByteInstruction = require('./ImmediateByteInstruction');

export default class VariableInstruction extends InstructionWrapper {

  constructor(instruction) {
    super(instruction);
  }

  get val() {
    if (this.instruction.constructor.name === 'ImmediateByteInstruction') {
      return this.instruction.val;
    } else if (this.instruction.opname.includes('M1')) {
        return -1;
    } else if (this.instruction.opname.includes('_')) {
        return parseInt(_.last(this.instruction.opname.split('_')));
    }
    return 0;
  }

  toObject() {
    return super.toObject({
      val: this.var
    });
  }
}