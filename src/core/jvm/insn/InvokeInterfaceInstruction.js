const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class InvokeInterfaceInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
    this.count = 0;
  }

  get size() {
    return super.size + 2;
  }

  read(buffer) {
    super.read(buffer);
    this.count = buffer.byte();
    // the next byte is always zero and thus discarded.
    buffer.byte();
  }
}