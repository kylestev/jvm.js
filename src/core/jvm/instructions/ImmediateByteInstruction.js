/** @ignore */
const AbstractInstruction = require('./AbstractInstruction');

export default class ImmediateByteInstruction extends AbstractInstruction {

  constructor(methodInfo, idx, opcode, wide) {
    super(methodInfo, idx, opcode);
    this.wide = wide;
    this.val = 0;
  }

  get size() {
    return super.size + (this.wide ? 2 : 1);
  }

  read(buffer) {
    super.read(buffer);
    this.val = (this.wide ? buffer.short() : buffer.byte());
  }

  write(buffer) {
    super.write(buffer);
    if (this.wide) {
      buffer.writeShort(this.val);
    } else {
      buffer.writeByte(this.val);
    }
  }

  toObject() {
    return super.toObject({
      val: this.val,
      size: this.size
    });
  }
}
