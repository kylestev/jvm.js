const ImmediateByteInstruction = require('./ImmediateByteInstruction');

export default class IncrementInstruction extends ImmediateByteInstruction {

  constructor(idx, opcode, wide) {
    super(idx, opcode);
    this.wide = wide;
  }

  get size() {
    return super.size + (this.wide ? 2 : 1);
  }
}