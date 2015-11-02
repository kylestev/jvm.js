const AbstractBranchInstruction = require('./AbstractBranchInstruction');

export default class WideBranchInstruction extends AbstractBranchInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
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
}