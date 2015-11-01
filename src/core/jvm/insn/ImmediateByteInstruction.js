const AbstractInstruction = require('./AbstractInstruction');

export default class ImmediateByteInstruction extends AbstractInstruction {

  constructor(idx, opcode, wide) {
    super(idx, opcode);
    this.wide = wide;
    this.val = 0;
  }

  get size() {
    return super.size + (this.wide ? 2 : 1);
  }

  read(buffer) {
    console.log('IMMEDIATE_BYTE_INSTRUCTION');
    super.read(buffer);
    this.val = (this.wide ? buffer.short() : buffer.byte());
  }
}