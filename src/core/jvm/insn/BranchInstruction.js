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
}