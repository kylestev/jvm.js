/** @ignore */
import ImmediateShortInstruction from './ImmediateShortInstruction';

export default class InvokeDynamicInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }

  get size() {
    return super.size + 2;
  }

  read(buffer) {
    super.read(buffer);
    // next two bytes are always zero and thus discarded.
    buffer.short();
  }

  write(buffer) {
    super.write(buffer);
    buffer.writeShort(0);
  }

  toObject() {
    return super.toObject({
      size: this.size
    });
  }
}

module.exports = InvokeDynamicInstruction;