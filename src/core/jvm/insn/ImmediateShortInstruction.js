const AbstractInstruction = require('./AbstractInstruction');

export default class ImmediateShortInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
    this.val = 0;
  }

  get size() {
    return super.size + 2;
  }

  read(buffer) {
    super.read(buffer);
    this.val = buffer.short();
  }
}