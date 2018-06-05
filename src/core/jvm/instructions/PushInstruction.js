/** @ignore */
import InstructionWrapper from './InstructionWrapper';

export default class PushInstruction extends InstructionWrapper {

  constructor(instruction) {
    super(instruction);
  }

  get val() {
    return this.instruction.val;
  }

  toString() {
    return super.toString({ val: this.val });
  }
}
