const AbstractInstruction = require('./AbstractInstruction');

export default class PushInstruction extends AbstractInstruction {

  constructor(instruction) {
    super(instruction.idx, instruction.opcode);
    this.instruction = instruction;
  }

  get size() {
    return this.instruction.size;
  }

  read(buffer) {
    this.instruction.read(buffer);
  }
}
