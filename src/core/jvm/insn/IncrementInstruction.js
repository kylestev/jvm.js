const ImmediateByteInstruction = require('./ImmediateByteInstruction');

export default class IncrementInstruction extends ImmediateByteInstruction {

  constructor(idx, opcode, wide) {
    super(idx, opcode);
    this.wide = wide;
    this.increment = 0;
  }

  get size() {
    return super.size + (this.wide ? 2 : 1);
  }

  read(buffer) {
    this.increment = (this.wide ? buffer.short() : buffer.byte());
  }
}