const AbstractInstruction = require('./AbstractInstruction');

export default class ImmediateByteInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}