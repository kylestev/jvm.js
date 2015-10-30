const AbstractInstruction = require('./AbstractInstruction');

export default class PaddedInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}