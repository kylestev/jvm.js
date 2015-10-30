const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class BranchInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}