/** @ignore */
const AbstractBranchInstruction = require('./AbstractBranchInstruction');

export default class WideBranchInstruction extends AbstractBranchInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }

  get size() {
    return super.size + 4;
  }

  read(buffer) {
    super.read(buffer);
    super.branchOffset = buffer.int();
  }

  write(buffer) {
    super.write(buffer);
    buffer.writeInt(super.branchOffset);
  }

  toObject() {
    return super.toObject({
      size: this.size
    });
  }
}