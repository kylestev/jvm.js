const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class InvokeDynamicInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
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
}