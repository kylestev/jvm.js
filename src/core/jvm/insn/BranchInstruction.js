const AbstractBranchInstruction = require('./AbstractBranchInstruction');

export default class BranchInstruction extends AbstractBranchInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}