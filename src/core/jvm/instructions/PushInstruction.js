/** @ignore */
const InstructionWrapper = require('./InstructionWrapper');

export default class PushInstruction extends InstructionWrapper {

  constructor(instruction) {
    super(instruction);
  }

  get val() {
    return this.instruction.val;
  }
}
