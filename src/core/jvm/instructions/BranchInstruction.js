/** @ignore */
const AbstractBranchInstruction = require('./AbstractBranchInstruction');

export default class BranchInstruction extends AbstractBranchInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }

  get size() {
    return super.size + 2;
  }

  read(buffer) {
    super.read(buffer);
    super.branchOffset = buffer.short();
  }

  write(buffer) {
    super.write(buffer);
    buffer.writeShort(super.branchOffset);
  }

  toObject() {
    return super.toObject({
      size: this.size
    });
  }
}