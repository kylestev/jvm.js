/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class InvokeInterfaceInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
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

  write(buffer) {
    super.write(buffer);
    buffer.writeByte(this.count);
    buffer.writeByte(0);
  }

  toObject() {
    return super.toObject({
      count: this.count,
      size: this.size
    });
  }
}