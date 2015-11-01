const AbstractBranchInstruction = require('./AbstractBranchInstruction');

export default class WideBranchInstruction extends AbstractBranchInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }

  get size() {
    return super.size + 4;
  }
}