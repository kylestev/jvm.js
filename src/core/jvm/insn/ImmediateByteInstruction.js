const AbstractInstruction = require('./AbstractInstruction');

export default class ImmediateByteInstruction extends AbstractInstruction {

  constructor(idx, opcode, wide) {
    super(idx, opcode);
    this.wide = wide;
  }

  get size() {
    return super.size + (this.wide ? 2 : 1);
  }

  get val() {
    return -1;
  }
}