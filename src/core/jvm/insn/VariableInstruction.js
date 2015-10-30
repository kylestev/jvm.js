import * as _ from 'lodash';

const AbstractInstruction = require('./AbstractInstruction');
const ImmediateByteInstruction = require('./ImmediateByteInstruction');

export default class VariableInstruction extends AbstractInstruction {

  constructor(instruction) {
    super(instruction.idx, instruction.opcode);
    this.instruction = instruction;
  }

  get var() {
    if (this.instruction.constructor.name === 'ImmediateByteInstruction') {
      return this.instruction.val;
    } else {
      if (this.instruction.opname.includes('M1')) {
          return -1;
      } else if (this.instruction.opname.includes('_')) {
          return parseInt(_.last(this.instruction.opname.split('_')));
      }
      return 0;
    }
  }
}