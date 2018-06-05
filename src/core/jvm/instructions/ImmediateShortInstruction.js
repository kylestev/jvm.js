/** @ignore */
import AbstractInstruction from './AbstractInstruction';

export default class ImmediateShortInstruction extends AbstractInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
    this.val = 0;
  }

  get size() {
    return super.size + 2;
  }

  read(buffer) {
    super.read(buffer);
    this.val = buffer.short();
  }

  write(buffer) {
    super.write(buffer);
    buffer.writeShort(this.val);
  }

  toObject() {
    return super.toObject({
      val: this.val,
      size: this.size
    });
  }
}
