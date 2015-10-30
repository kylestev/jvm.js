const AbstractInstruction = require('./AbstractInstruction');

export default class BranchInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}