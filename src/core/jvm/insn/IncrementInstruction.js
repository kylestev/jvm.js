const ImmediateByteInstruction = require('./ImmediateByteInstruction');

export default class IncrementInstruction extends ImmediateByteInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}